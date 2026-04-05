import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function DoctorSchedule({ user, onLogout }) {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    specialty: 'General Practice'
  });

  useEffect(() => {
    const savedSchedules = localStorage.getItem('doctorSchedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
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
    const newSchedule = {
      id: Date.now(),
      ...formData
    };
    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    localStorage.setItem('doctorSchedules', JSON.stringify(updated));
    setFormData({
      doctorName: '',
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      specialty: 'General Practice'
    });
    setShowForm(false);
    alert('Schedule added successfully');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this schedule?')) {
      const updated = schedules.filter(s => s.id !== id);
      setSchedules(updated);
      localStorage.setItem('doctorSchedules', JSON.stringify(updated));
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const specialties = ['General Practice', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Surgery'];

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="section-title">👨‍⚕️ Doctor Schedule</h1>

        <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-2">
          {showForm ? 'Cancel' : '+ Add Schedule'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="card">
            <h3>Add Doctor Schedule</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Doctor Name *</label>
                <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Specialty</label>
                <select name="specialty" value={formData.specialty} onChange={handleChange}>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Day *</label>
                <select name="day" value={formData.day} onChange={handleChange}>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                  </div>
                  <div>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Schedule</button>
          </form>
        )}

        {schedules.length === 0 ? (
          <p className="text-muted">No schedules added yet.</p>
        ) : (
          <div className="grid grid-2">
            {schedules.map(sched => (
              <div key={sched.id} className="card">
                <h3>{sched.doctorName}</h3>
                <p><strong>Specialty:</strong> {sched.specialty}</p>
                <p><strong>Day:</strong> {sched.day}</p>
                <p><strong>Time:</strong> {sched.startTime} - {sched.endTime}</p>
                <button onClick={() => handleDelete(sched.id)} className="btn btn-danger mt-2">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorSchedule;
