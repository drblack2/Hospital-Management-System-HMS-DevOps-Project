import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, updatePatient } from '../api';
import '../App.css';

function PatientDetail({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await getPatientById(id);
      setPatient(response.data);
      setFormData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patient');
    } finally {
      setLoading(false);
    }
  };

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
    try {
      await updatePatient(id, formData);
      setPatient(formData);
      setEditing(false);
      alert('Patient updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update patient');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">Hospital Management System</div>
        <div className="navbar-menu">
          <button onClick={() => navigate('/patients')} className="nav-link">Back to Patients</button>
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </nav>

      <div className="container">
        {!editing ? (
          <>
            <div className="card">
              <h1>{patient.firstName} {patient.lastName}</h1>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Status:</strong> {patient.status}</p>
              <p><strong>Address:</strong> {patient.address?.street}, {patient.address?.city}, {patient.address?.state}</p>
              <p><strong>Medical History:</strong> {patient.medicalHistory}</p>
              <p><strong>Allergies:</strong> {patient.allergies}</p>
              <p><strong>Current Medications:</strong> {patient.currentMedications}</p>
              <p><strong>Emergency Contact:</strong> {patient.emergencyContact?.name} ({patient.emergencyContact?.relationship}) - {patient.emergencyContact?.phone}</p>
              <button onClick={() => setEditing(true)} className="btn btn-primary">Edit</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            <h1>Edit Patient</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Discharged">Discharged</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

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

            <div className="gap mt-2">
              <button type="submit" className="btn btn-success">Save Changes</button>
              <button type="button" onClick={() => setEditing(false)} className="btn btn-primary">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PatientDetail;
