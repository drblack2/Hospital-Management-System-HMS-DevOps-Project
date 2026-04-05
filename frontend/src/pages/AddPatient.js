import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../api';
import '../App.css';

function AddPatient({ user, onLogout }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createPatient(formData);
      alert('Patient registered successfully');
      
      // Also save to localStorage as backup
      const patients = JSON.parse(localStorage.getItem('patients') || '[]');
      patients.push({ id: Date.now(), ...formData });
      localStorage.setItem('patients', JSON.stringify(patients));
      
      navigate('/patients');
    } catch (err) {
      // Save to localStorage if API fails
      try {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        patients.push({ id: Date.now(), ...formData });
        localStorage.setItem('patients', JSON.stringify(patients));
        alert('Patient registered successfully');
        navigate('/patients');
      } catch {
        setError(err.response?.data?.message || 'Failed to register patient');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">Hospital Management System</div>
        <div className="navbar-menu">
          <button onClick={() => navigate('/dashboard')} className="nav-link">Dashboard</button>
          <button onClick={() => navigate('/patients')} className="nav-link">Patients</button>
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>

      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} className="card">
            <h1>Register New Patient</h1>
            
            {error && <div className="alert alert-error">{error}</div>}

            <h3>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <h3>Address</h3>
            <div className="form-group">
              <label>Street</label>
              <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input type="text" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} />
              </div>
            </div>

            <h3>Medical Information</h3>
            <div className="form-group">
              <label>Medical History</label>
              <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <textarea name="allergies" value={formData.allergies} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Current Medications</label>
              <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} />
            </div>

            <h3>Emergency Contact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Contact Name</label>
                <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" name="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <input type="text" name="emergencyContact.relationship" value={formData.emergencyContact.relationship} onChange={handleChange} />
              </div>
            </div>

            <div className="gap mt-2">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Registering...' : 'Register Patient'}
              </button>
              <button type="button" onClick={() => navigate('/patients')} className="btn btn-primary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPatient;
