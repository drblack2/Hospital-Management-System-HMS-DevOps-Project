import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle } from 'lucide-react';
import './QueueStatus.css';

function QueueStatus() {
  const [queueData, setQueueData] = useState({
    current: {
      name: 'John Doe',
      department: 'Cardiology',
      doctor: 'Dr. Smith',
      status: 'In Progress',
    },
    waiting: [
      { id: 1, name: 'Jane Smith', department: 'Cardiology', waitTime: '~15 min' },
      { id: 2, name: 'Michael Brown', department: 'Cardiology', waitTime: '~30 min' },
      { id: 3, name: 'Emma Wilson', department: 'Cardiology', waitTime: '~45 min' },
      { id: 4, name: 'David Lee', department: 'Cardiology', waitTime: '~60 min' },
    ],
    completed: [
      { name: 'Robert Taylor', checkOutTime: '2:15 PM' },
      { name: 'Sarah Martinez', checkOutTime: '1:45 PM' },
    ],
  });

  return (
    <div className="queue-status-container">
      <h3 className="queue-title">Queue Status</h3>

      {/* Current Patient */}
      <div className="queue-section">
        <div className="section-header">
          <Clock size={18} />
          <span>Currently Serving</span>
        </div>
        <div className="current-patient">
          <div className="patient-info">
            <div className="patient-name">{queueData.current.name}</div>
            <div className="patient-details">
              <span className="badge badge-primary">{queueData.current.department}</span>
              <span className="patient-doctor">with {queueData.current.doctor}</span>
            </div>
          </div>
          <div className="patient-status">
            <div className="status-badge in-progress">
              <CheckCircle size={16} />
              {queueData.current.status}
            </div>
          </div>
        </div>
      </div>

      {/* Waiting Queue */}
      <div className="queue-section">
        <div className="section-header">
          <Users size={18} />
          <span>Waiting ({queueData.waiting.length})</span>
        </div>
        <div className="queue-list">
          {queueData.waiting.map((patient, index) => (
            <div key={patient.id} className="queue-item">
              <div className="queue-position">{index + 1}</div>
              <div className="queue-info">
                <div className="queue-name">{patient.name}</div>
                <div className="queue-meta">
                  <span className="badge-small">{patient.department}</span>
                  <span className="queue-time">{patient.waitTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div className="queue-section">
        <div className="section-header">
          <CheckCircle size={18} />
          <span>Recently Completed</span>
        </div>
        <div className="completed-list">
          {queueData.completed.map((patient, index) => (
            <div key={index} className="completed-item">
              <div className="completed-name">{patient.name}</div>
              <div className="completed-time">{patient.checkOutTime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="queue-stats">
        <div className="stat">
          <span className="stat-label">Avg Wait Time</span>
          <span className="stat-value">32 min</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Served</span>
          <span className="stat-value">12</span>
        </div>
      </div>
    </div>
  );
}

export default QueueStatus;
