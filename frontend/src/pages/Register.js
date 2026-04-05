import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api';
import '../App.css';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'staff'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await register(formData);
      onRegister(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleDescriptions = {
    staff: '👤 Support Staff - Administrative and support roles',
    doctor: '👨‍⚕️ Doctor - Medical professional consulter',
    nurse: '🏥 Nurse - Patient care specialist',
    admin: '👑 Admin - System administrator'
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #27ae60, #229954)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              margin: '0 auto 1rem'
            }}>
              👥
            </div>
            <h1 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Create Your Account</h1>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Join HMS Platform and manage your hospital</p>
          </div>
          
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{
              background: 'var(--bgSecondary)',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text)' }}>👤 Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div style={{
              background: 'var(--bgSecondary)',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              borderLeft: '4px solid #f39c12'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text)' }}>🔐 Account Information</h3>
              
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div style={{
              background: 'var(--bgSecondary)',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              borderLeft: '4px solid var(--success)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text)' }}>💼 Select Your Role</h3>
              <div className="form-group">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ 
                    padding: '0.875rem',
                    fontSize: '0.95rem',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    border: '2px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="staff">👤 Staff</option>
                  <option value="doctor">👨‍⚕️ Doctor</option>
                  <option value="nurse">🏥 Nurse</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.75rem' }}>
                {roleDescriptions[formData.role]}
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-success"
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.9rem',
                fontSize: '1rem',
                fontWeight: '600'
              }}
              disabled={loading}
            >
              {loading ? (
                <span>⏳ Creating Account...</span>
              ) : (
                <span>✅ Create Account</span>
              )}
            </button>
          </form>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />

          <div style={{
            background: 'var(--bgSecondary)',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            borderLeft: '4px solid #3498db'
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              <strong>ℹ️ Why Choose HMS?</strong>
            </p>
            <ul style={{ fontSize: '0.85rem', color: 'var(--textSecondary)', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li>✅ Secure and HIPAA-compliant</li>
              <li>✅ Easy patient management</li>
              <li>✅ Real-time appointment scheduling</li>
              <li>✅ Prescription tracking</li>
              <li>✅ Doctor coordination</li>
            </ul>
          </div>

          <p className="text-center">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--textSecondary)', fontSize: '0.85rem' }}>
          <p>© 2024 Hospital Management System. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>By registering, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}

export default Register;
