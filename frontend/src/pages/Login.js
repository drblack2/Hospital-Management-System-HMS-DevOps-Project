import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import '../App.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [currentQuote, setCurrentQuote] = useState(0);

  const quotes = [
    {
      text: "The art of medicine consists of amusing the patient while nature cures the disease.",
      author: "Voltaire"
    },
    {
      text: "Healing is a matter of time, but it is sometimes also a matter of opportunity.",
      author: "Hippocrates"
    },
    {
      text: "The greatest wealth is health.",
      author: "Virgil"
    },
    {
      text: "Medicine is a science of uncertainty and an art of probability.",
      author: "William Osler"
    },
    {
      text: "To heal sometimes, to relieve often, to comfort always.",
      author: "Hippocrates"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      const response = await login(formData.email, formData.password);
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Side - Info Section */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
        color: 'white',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏥</h1>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>
            HMS Platform
          </h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '3rem', opacity: 0.9, fontWeight: '300' }}>
            Hospital Management System
          </p>

          {/* Features List */}
          <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>👥</span>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Patient Management</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Efficiently manage patient records and medical history</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>📅</span>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Appointment Scheduling</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Schedule and manage appointments seamlessly</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>💊</span>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Prescription Management</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Create and track patient prescriptions</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍⚕️</span>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>Doctor Coordination</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Manage doctor schedules and availability</p>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '1.5rem',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            borderLeft: '4px solid rgba(255, 255, 255, 0.3)',
            marginTop: '2rem'
          }}>
            <p style={{ fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: '1.6' }}>
              "{quotes[currentQuote].text}"
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, textAlign: 'right' }}>
              — {quotes[currentQuote].author}
            </p>
          </div>

          {/* Quote Indicators */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'center' }}>
            {quotes.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentQuote ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg)'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #0066cc, #0052a3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                margin: '0 auto 1rem'
              }}>
                🏥
              </div>
              <h2 style={{ marginBottom: '0.5rem', color: 'var(--text)' }}>Welcome Back</h2>
              <p className="text-muted" style={{ fontSize: '0.95rem' }}>Sign in to continue to HMS</p>
            </div>
            
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📧</span> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  style={{ fontSize: '0.95rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🔒</span> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={{ fontSize: '0.95rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                disabled={loading}
              >
                {loading ? (
                  <span>⏳ Logging in...</span>
                ) : (
                  <span>🔓 Login</span>
                )}
              </button>
            </form>

            <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />

            <div style={{
              background: 'var(--bgSecondary)',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <strong>Demo Credentials:</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                Email: <code style={{ background: 'var(--bg)', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>test@example.com</code>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                Password: <code style={{ background: 'var(--bg)', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>password123</code>
              </p>
            </div>

            <p className="text-center">
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--textSecondary)', fontSize: '0.85rem' }}>
            <p>© 2024 Hospital Management System. All rights reserved.</p>
            <p style={{ marginTop: '0.5rem' }}>Secure • Reliable • Efficient</p>
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
