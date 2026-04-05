const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ,
  key_secret: process.env.RAZORPAY_KEY_SECRET ,
});

// Create an order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, service, patientName, description, notes } = req.body;

    if (!amount || !service) {
      return res.status(400).json({ message: 'Amount and service are required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paisa
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      description: description || `Payment for ${service}`,
      notes: {
        service,
        patientName,
        notes: notes || ''
      }
    };

    const order = await razorpay.orders.create(options);

    // Save payment record with pending status
    const payment = new Payment({
      orderId: order.id,
      patientName,
      amount,
      currency: 'INR',
      service,
      description,
      notes,
      razorpayOrderId: order.id,
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_n8GUwDJgYBqFi1'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// Verify and complete payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Order ID, Payment ID, and Signature are required' });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'bdDOGNT8OY3CyZNKL0R9YPXY')
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generated_signature !== signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        status: 'completed',
        completedAt: new Date(),
        paymentMethod: 'Razorpay'
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment history', error: error.message });
  }
});

// Get payment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment', error: error.message });
  }
});

// Get Razorpay key
router.get('/config/key', (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_n8GUwDJgYBqFi1'
  });
});

// Refund payment
router.post('/refund/:id', auth, async (req, res) => {
  try {
    const { refundAmount } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.razorpayPaymentId) {
      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round((refundAmount || payment.amount) * 100)
      });

      payment.status = 'refunded';
      payment.refundedAt = new Date();
      payment.refundAmount = refundAmount || payment.amount;
      await payment.save();

      res.json({
        success: true,
        message: 'Refund processed successfully',
        refund
      });
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ message: 'Failed to process refund', error: error.message });
  }
});

module.exports = router;
