import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllPatients, deletePatient } from '../api';
import '../App.css';

function PatientList({ user, onLogout }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      try {
        const response = await getAllPatients();
        setPatients(response.data);
      } catch {
        // If API fails, load from localStorage
        const saved = localStorage.getItem('patients');
        if (saved) {
          setPatients(JSON.parse(saved));
        }
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        setPatients(patients.filter(p => p._id !== id));
        alert('Patient deleted successfully');
      } catch (err) {
        // Delete from localStorage if API fails
        const updated = patients.filter(p => p.id !== id);
        setPatients(updated);
        localStorage.setItem('patients', JSON.stringify(updated));
        alert('Patient deleted successfully');
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="section-title">👥 Patient Management</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <div className="gap mb-2">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '0.875rem', border: '2px solid var(--border)', borderRadius: '6px', fontSize: '0.95rem' }}
          />
          <Link to="/add-patient" className="btn btn-success">+ Add Patient</Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading patients...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted" style={{ fontSize: '1.1rem', padding: '2rem' }}>
              No patients found. <Link to="/add-patient" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Add a new patient</Link>
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date of Birth</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient._id || patient.id}>
                  <td><strong>{patient.firstName} {patient.lastName}</strong></td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <span className={`badge badge-${patient.status === 'Active' ? 'success' : patient.status === 'Discharged' ? 'danger' : 'warning'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>{new Date(patient.dateOfBirth).toLocaleDateString()}</td>
                  <td>
                    <div className="gap">
                      <Link to={`/patient/${patient._id || patient.id}`} className="btn btn-primary">View</Link>
                      <button onClick={() => handleDelete(patient._id || patient.id)} className="btn btn-danger">Delete</button>
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

export default PatientList;
