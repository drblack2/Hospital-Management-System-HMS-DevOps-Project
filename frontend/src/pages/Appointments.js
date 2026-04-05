import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Appointments({ user, onLogout }) {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'Consultation',
    status: 'Scheduled'
  });

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
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
    const newAppointment = {
      id: Date.now(),
      ...formData
    };
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    localStorage.setItem('appointments', JSON.stringify(updated));
    setFormData({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: 'Consultation',
      status: 'Scheduled'
    });
    setShowForm(false);
    alert('Appointment scheduled successfully');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this appointment?')) {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      localStorage.setItem('appointments', JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="section-title">📅 Appointments</h1>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-2">
          {showForm ? 'Cancel' : '+ Schedule Appointment'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="card">
            <h3>Schedule New Appointment</h3>
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
                <label>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Appointment Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Check-up">Check-up</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Schedule</button>
          </form>
        )}

        {appointments.length === 0 ? (
          <p className="text-muted">No appointments scheduled yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patientName}</td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td><span className="badge badge-info">{apt.type}</span></td>
                  <td>
                    <span className={`badge badge-${apt.status === 'Completed' ? 'success' : apt.status === 'Cancelled' ? 'danger' : 'info'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(apt.id)} className="btn btn-danger">Delete</button>
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

export default Appointments;
