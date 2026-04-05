import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Analytics({ user, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
    totalDoctors: 0
  });

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem('patients') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const schedules = JSON.parse(localStorage.getItem('doctorSchedules') || '[]');

    // Extract unique doctors from schedules
    const uniqueDoctors = new Set(schedules.map(s => s.doctorName));

    setStats({
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalPrescriptions: prescriptions.length,
      totalDoctors: uniqueDoctors.size
    });
  }, []);

  return (
    <div className="app-container">
      <div className="container">
        <h1 className="section-title">📊 Analytics & Reports</h1>

        <div className="grid grid-2 mb-2">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #0066cc, #0052a3)' }}>
            <p>Total Patients</p>
            <h3>{stats.totalPatients}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #27ae60, #229954)' }}>
            <p>Total Appointments</p>
            <h3>{stats.totalAppointments}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f39c12, #d68910)' }}>
            <p>Total Prescriptions</p>
            <h3>{stats.totalPrescriptions}</h3>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
            <p>Active Doctors</p>
            <h3>{stats.totalDoctors}</h3>
          </div>
        </div>

        <div className="card mt-2">
          <h2>System Overview</h2>
          <p>Hospital Management System - Analytics Dashboard</p>
          
          <div style={{ marginTop: '2rem' }}>
            <h3>Quick Statistics</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <strong>Patients Registered:</strong> {stats.totalPatients}
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <strong>Scheduled Appointments:</strong> {stats.totalAppointments}
              </li>
              <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <strong>Prescriptions Issued:</strong> {stats.totalPrescriptions}
              </li>
              <li style={{ padding: '0.5rem 0' }}>
                <strong>Doctors in System:</strong> {stats.totalDoctors}
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>System Features</h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>👥 Patient Management</li>
              <li>📅 Appointment Scheduling</li>
              <li>💊 Prescription Management</li>
              <li>👨‍⚕️ Doctor Schedule Management</li>
              <li>📊 Real-time Analytics</li>
              <li>🌙 Dark/Light Mode</li>
              <li>🔒 Secure Authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
