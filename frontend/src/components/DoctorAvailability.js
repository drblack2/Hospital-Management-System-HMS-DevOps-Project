import React, { useState } from 'react';
import { Clock, User } from 'lucide-react';
import './DoctorAvailability.css';

function DoctorAvailability() {
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Cardiology',
      status: 'Available',
      availability: [
        { time: '9:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '12:00 PM', available: false },
        { time: '2:00 PM', available: true },
        { time: '3:00 PM', available: true },
        { time: '4:00 PM', available: false },
        { time: '5:00 PM', available: true },
      ],
    },
    {
      id: 2,
      name: 'Dr. Priya Singh',
      specialty: 'Orthopedics',
      status: 'Busy',
      availability: [
        { time: '9:00 AM', available: false },
        { time: '10:00 AM', available: false },
        { time: '11:00 AM', available: true },
        { time: '12:00 PM', available: true },
        { time: '2:00 PM', available: false },
        { time: '3:00 PM', available: true },
        { time: '4:00 PM', available: true },
        { time: '5:00 PM', available: false },
      ],
    },
    {
      id: 3,
      name: 'Dr. Amit Verma',
      specialty: 'Neurology',
      status: 'Available',
      availability: [
        { time: '9:00 AM', available: true },
        { time: '10:00 AM', available: true },
        { time: '11:00 AM', available: true },
        { time: '12:00 PM', available: false },
        { time: '2:00 PM', available: true },
        { time: '3:00 PM', available: true },
        { time: '4:00 PM', available: true },
        { time: '5:00 PM', available: true },
      ],
    },
  ]);

  const getStatusColor = (status) => {
    return status === 'Available' ? 'success' : 'warning';
  };

  return (
    <div className="doctor-availability-container">
      <h3 className="availability-title">Doctor Availability</h3>

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-header">
              <div className="doctor-avatar">
                <User size={24} />
              </div>
              <div className="doctor-info">
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-specialty">{doctor.specialty}</div>
              </div>
              <span className={`status-badge status-${getStatusColor(doctor.status)}`}>
                {doctor.status}
              </span>
            </div>

            <div className="time-slots">
              {doctor.availability.map((slot, idx) => (
                <button
                  key={idx}
                  className={`time-slot ${slot.available ? 'available' : 'unavailable'}`}
                  disabled={!slot.available}
                  title={slot.available ? `Book ${doctor.name} at ${slot.time}` : 'Slot unavailable'}
                >
                  <span className="slot-time">{slot.time}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="availability-legend">
        <div className="legend-item">
          <div className="legend-dot available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot unavailable"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}

export default DoctorAvailability;
