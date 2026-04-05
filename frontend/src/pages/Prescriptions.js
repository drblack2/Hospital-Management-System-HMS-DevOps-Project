import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Prescriptions({ user, onLogout }) {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    duration: '',
    doctorName: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    const savedPrescriptions = localStorage.getItem('prescriptions');
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrescription = {
      id: Date.now(),
      ...formData
    };
    const updated = [...prescriptions, newPrescription];
    setPrescriptions(updated);
    localStorage.setItem('prescriptions', JSON.stringify(updated));
    setFormData({
      patientName: '',
      medicationName: '',
      dosage: '',
      frequency: 'Once daily',
      duration: '',
      doctorName: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowForm(false);
    alert('Prescription created successfully');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this prescription?')) {
      const updated = prescriptions.filter(p => p.id !== id);
      setPrescriptions(updated);
      localStorage.setItem('prescriptions', JSON.stringify(updated));
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="section-title">💊 Prescriptions</h1>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-2">
          {showForm ? 'Cancel' : '+ New Prescription'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="card">
            <h3>Create New Prescription</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Patient Name *</label>
                <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Doctor Name *</label>
                <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Medication Name *</label>
                <input type="text" name="medicationName" value={formData.medicationName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input type="text" placeholder="e.g., 500mg" name="dosage" value={formData.dosage} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange}>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration *</label>
                <input type="text" placeholder="e.g., 7 days" name="duration" value={formData.duration} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional notes for patient"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Prescription</button>
          </form>
        )}

        {prescriptions.length === 0 ? (
          <p className="text-muted">No prescriptions created yet.</p>
        ) : (
          <div className="grid grid-2">
            {prescriptions.map(presc => (
              <div key={presc.id} className="card">
                <h3>{presc.medicationName}</h3>
                <p><strong>Patient:</strong> {presc.patientName}</p>
                <p><strong>Doctor:</strong> {presc.doctorName}</p>
                <p><strong>Dosage:</strong> {presc.dosage}</p>
                <p><strong>Frequency:</strong> {presc.frequency}</p>
                <p><strong>Duration:</strong> {presc.duration}</p>
                <p><strong>Date:</strong> {presc.date}</p>
                {presc.notes && <p><strong>Notes:</strong> {presc.notes}</p>}
                <button onClick={() => handleDelete(presc.id)} className="btn btn-danger mt-2">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Prescriptions;
