import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    appointments: 0,
    prescriptions: 0,
    doctors: 0
  });

  useEffect(() => {
    // Get stats from localStorage
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const schedules = JSON.parse(localStorage.getItem('doctorSchedules') || '[]');
    const uniqueDoctors = new Set(schedules.map(s => s.doctorName));

    setStats({
      patients: patients.length,
      appointments: appointments.length,
      prescriptions: prescriptions.length,
      doctors: uniqueDoctors.size
    });
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className="container">
        <div className="card mb-2">
          <h1>Welcome, {user?.firstName} {user?.lastName}! 👋</h1>
          <p className="text-muted">Manage your hospital operations efficiently</p>
        </div>

        <h2 className="section-title">Quick Statistics</h2>
        <div className="grid grid-2 mb-3">
          <div className="stat-card">
            <p>Total Patients</p>
            <h3>{stats.patients}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #27ae60, #229954)' }}>
            <p>Appointments</p>
            <h3>{stats.appointments}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f39c12, #d68910)' }}>
            <p>Prescriptions</p>
            <h3>{stats.prescriptions}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
            <p>Active Doctors</p>
            <h3>{stats.doctors}</h3>
          </div>
        </div>

        <h2 className="section-title">Quick Access</h2>
        <div className="grid grid-3 mb-3">
          <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
               onClick={() => navigate('/patients')}>
            <h2>👥</h2>
            <h3>Patients</h3>
            <p>View and manage patient records</p>
            <Link to="/patients" className="btn btn-primary">View All</Link>
          </div>

          <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
               onClick={() => navigate('/add-patient')}>
            <h2>➕</h2>
            <h3>Register Patient</h3>
            <p>Add a new patient to the system</p>
            <Link to="/add-patient" className="btn btn-success">Register</Link>
          </div>

          <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
               onClick={() => navigate('/appointments')}>
            <h2>📅</h2>
            <h3>Appointments</h3>
            <p>Schedule and manage appointments</p>
            <Link to="/appointments" className="btn btn-primary">Manage</Link>
          </div>

          <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
               onClick={() => navigate('/prescriptions')}>
            <h2>💊</h2>
            <h3>Prescriptions</h3>
            <p>Create and manage prescriptions</p>
            <Link to="/prescriptions" className="btn btn-primary">Manage</Link>
          </div>

          <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
               onClick={() => navigate('/doctor-schedule')}>
            <h2>👨‍⚕️</h2>
            <h3>Doctor Schedule</h3>
            <p>Manage doctor schedules</p>
            <Link to="/doctor-schedule" className="btn btn-primary">View</Link>
          </div>

          <div className="card" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.3s' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
               onClick={() => navigate('/analytics')}>
            <h2>📊</h2>
            <h3>Analytics</h3>
            <p>View system statistics and reports</p>
            <Link to="/analytics" className="btn btn-primary">View</Link>
          </div>
        </div>

        <div className="card">
          <h2>👤 User Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Role:</strong> <span className="badge badge-info">{user?.role?.toUpperCase()}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--textSecondary)', fontSize: '0.9rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
