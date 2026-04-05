import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientDetail from './pages/PatientDetail';
import AddPatient from './pages/AddPatient';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import DoctorSchedule from './pages/DoctorSchedule';
import Analytics from './pages/Analytics';
import Payments from './pages/Payments';
import './App.css';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setIsAuthChecking(false);
    
    // Apply dark mode class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const NavBar = ({ showLogout = false }) => {
    const { toggleDarkMode } = useContext(ThemeContext);
    return (
      <nav className="navbar">
        <div className="navbar-brand">🏥 HMS</div>
        <div className="navbar-menu">
          {showLogout && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/patients" className="nav-link">Patients</Link>
              <Link to="/appointments" className="nav-link">Appointments</Link>
              <Link to="/payments" className="nav-link">💳 Payments</Link>
              <span>{user?.firstName} {user?.lastName}</span>
              <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme">
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          )}
          {!showLogout && (
            <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          )}
        </div>
      </nav>
    );
  };

  if (isAuthChecking) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: 'var(--text)' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<><NavBar /><Login onLogin={handleLogin} /></>} />
        <Route path="/register" element={<><NavBar /><Register onRegister={handleLogin} /></>} />
        <Route path="/dashboard" element={isAuthenticated ? <><NavBar showLogout={true} /><Dashboard user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/patients" element={isAuthenticated ? <><NavBar showLogout={true} /><PatientList user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/patient/:id" element={isAuthenticated ? <><NavBar showLogout={true} /><PatientDetail user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/add-patient" element={isAuthenticated ? <><NavBar showLogout={true} /><AddPatient user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/appointments" element={isAuthenticated ? <><NavBar showLogout={true} /><Appointments user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/prescriptions" element={isAuthenticated ? <><NavBar showLogout={true} /><Prescriptions user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/doctor-schedule" element={isAuthenticated ? <><NavBar showLogout={true} /><DoctorSchedule user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/analytics" element={isAuthenticated ? <><NavBar showLogout={true} /><Analytics user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/payments" element={isAuthenticated ? <><NavBar showLogout={true} /><Payments user={user} onLogout={handleLogout} /></> : <Navigate to="/login" />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
