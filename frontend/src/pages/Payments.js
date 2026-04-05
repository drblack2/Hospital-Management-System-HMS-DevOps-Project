import React, { useState, useEffect } from 'react';
import { createOrder, verifyPayment, getPaymentHistory, refundPayment } from '../api';
import '../App.css';

function Payments({ user, onLogout }) {
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    patientName: '',
    amount: '',
    service: 'Consultation',
    description: '',
    notes: ''
  });

  const services = {
    'Consultation': 500,
    'Surgery': 15000,
    'Lab Test': 1000,
    'Imaging': 3000,
    'Pharmacy': 2000,
    'Room Charges': 5000,
    'Other': 0
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await getPaymentHistory();
      setPayments(response.data);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'service') {
      setFormData({
        ...formData,
        service: value,
        amount: services[value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate input
      if (!formData.patientName || !formData.amount || !formData.service) {
        setError('Please fill all required fields');
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await createOrder({
        amount: parseFloat(formData.amount),
        service: formData.service,
        patientName: formData.patientName,
        description: formData.description,
        notes: formData.notes
      });

      if (orderResponse.data.orderId) {
        // Initiate Razorpay payment
        const options = {
          key: orderResponse.data.keyId,
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency,
          order_id: orderResponse.data.orderId,
          name: 'HMS - Hospital Management System',
          description: formData.description || `Payment for ${formData.service}`,
          handler: async (response) => {
            try {
              // Verify payment on backend
              const verifyResponse = await verifyPayment({
                orderId: orderResponse.data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });

              if (verifyResponse.data.success) {
                setSuccess(`Payment of ₹${formData.amount} received successfully!`);
                setFormData({
                  patientName: '',
                  amount: '',
                  service: 'Consultation',
                  description: '',
                  notes: ''
                });
                setShowPaymentForm(false);
                fetchPaymentHistory();

                // Show success message
                setTimeout(() => {
                  setSuccess('');
                }, 5000);
              }
            } catch (err) {
              setError('Payment verification failed: ' + (err.response?.data?.message || err.message));
            }
          },
          prefill: {
            name: formData.patientName,
            email: user?.email || ''
          },
          theme: {
            color: '#0066cc'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment order');
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (paymentId) => {
    if (window.confirm('Are you sure you want to refund this payment?')) {
      try {
        const payment = payments.find(p => p._id === paymentId);
        await refundPayment(paymentId, payment.amount);
        setSuccess('Refund processed successfully');
        fetchPaymentHistory();
      } catch (err) {
        setError('Failed to process refund: ' + err.message);
      }
    }
  };

  const filteredPayments = payments.filter(payment =>
    filterStatus === 'all' ? true : payment.status === filterStatus
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-danger';
      case 'refunded':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="section-title">💳 Hospital Services Payment</h1>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
            ✅ {success}
          </div>
        )}

        {/* Payment Statistics */}
        <div className="grid grid-3 mb-3">
          <div className="stat-card">
            <p>Total Payments</p>
            <h3>{payments.length}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #27ae60, #229954)' }}>
            <p>Completed</p>
            <h3>{payments.filter(p => p.status === 'completed').length}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f39c12, #d68910)' }}>
            <p>Total Collected</p>
            <h3>
              ₹{payments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </h3>
          </div>
        </div>

        {/* New Payment Button */}
        <button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="btn btn-success mb-2"
          style={{ marginBottom: '2rem' }}
        >
          {showPaymentForm ? '❌ Cancel' : '💳 New Payment'}
        </button>

        {/* Payment Form */}
        {showPaymentForm && (
          <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.05), rgba(0, 102, 204, 0.02))', border: '2px solid var(--primary)' }}>
            <h2>💳 Add New Payment</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Service Type *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    {Object.keys(services).map(service => (
                      <option key={service} value={service}>
                        {service} - ₹{services[service]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Amount in rupees"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description (Optional)</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g., Consultation with Dr. Smith"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ background: 'var(--bgSecondary)', padding: '1rem', borderRadius: '6px', marginBottom: '1rem', borderLeft: '4px solid var(--success)' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  💰 Payment Summary:
                </p>
                <p>Service: <strong>{formData.service}</strong></p>
                <p>Amount: <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>₹{parseFloat(formData.amount || 0).toFixed(2)}</strong></p>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: '600' }}
              >
                {loading ? '⏳ Processing...' : '💳 Proceed to Payment'}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bgSecondary)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--textSecondary)' }}>
              <p><strong>ℹ️ Test Razorpay Credentials:</strong></p>
              <p>Card: 4111111111111111 | CVV: Any 3 digits | Exp: Any future date</p>
              <p>Email: any@email.com | Phone: 9999999999</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterStatus('all')}
            className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-primary'}`}
            style={{ opacity: filterStatus === 'all' ? 1 : 0.6 }}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`btn ${filterStatus === 'completed' ? 'btn-success' : 'btn-primary'}`}
            style={{ opacity: filterStatus === 'completed' ? 1 : 0.6 }}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`btn ${filterStatus === 'pending' ? 'btn-warning' : 'btn-primary'}`}
            style={{ opacity: filterStatus === 'pending' ? 1 : 0.6 }}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('refunded')}
            className={`btn ${filterStatus === 'refunded' ? 'btn-primary' : 'btn-primary'}`}
            style={{ opacity: filterStatus === 'refunded' ? 1 : 0.6 }}
          >
            Refunded
          </button>
        </div>

        {/* Payment History */}
        {filteredPayments.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted" style={{ fontSize: '1.1rem', padding: '2rem' }}>
              No payments found. <button onClick={() => setShowPaymentForm(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem' }}>Create a new payment</button>
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment._id}>
                  <td><strong>{payment.patientName}</strong></td>
                  <td>{payment.service}</td>
                  <td style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>₹{payment.amount.toLocaleString()}</td>
                  <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--textSecondary)' }}>
                    {payment.razorpayPaymentId ? payment.razorpayPaymentId.slice(-8) : 'N/A'}
                  </td>
                  <td>
                    <div className="gap">
                      {payment.status === 'completed' && (
                        <button
                          onClick={() => handleRefund(payment._id)}
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

export default Payments;
