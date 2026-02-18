import React, { useState, useEffect } from 'react';
import EquipmentList from './EquipmentList';
import EquipmentManagement from './EquipmentManagement';
import TicketList from './TicketList';
import TicketForm from './TicketForm';
import Login from './Login';
import Logout from './Logout';
import Register from './Register';
import Reports from './Reports';
import Analytics from './Analytics';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [refreshTickets, setRefreshTickets] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEquipmentManagement, setShowEquipmentManagement] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check for access token in localStorage on mount
    const access = localStorage.getItem('access');
    if (access) {
      setIsLoggedIn(true);
      // Get user role from localStorage
      const role = localStorage.getItem('role');
      setUserRole(role);
    }
  }, []);

  const handleLogin = (userRole = null) => {
    setIsLoggedIn(true);
    if (userRole) {
      setUserRole(userRole);
    }
  };

  const handleTicketCreated = () => {
    setRefreshTickets(!refreshTickets);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-shell">
        <div className="auth-media">
          <img src="/home.png" alt="Campus view" className="auth-media-image" />
          <div className="auth-media-overlay">
            <h1>School ICT Lab Support Platform</h1>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-inner">
            {showRegister ? (
              <>
                <Register />
                <p className="mt-3 text-center auth-switch-text">
                  Already have an account?{' '}
                  <button className="btn btn-link p-0 auth-link-button" onClick={() => setShowRegister(false)}>Login</button>
                </p>
              </>
            ) : (
              <>
                <Login onLogin={handleLogin} />
                <p className="mt-3 text-center auth-switch-text">
                  Don't have an account?{' '}
                  <button className="btn btn-link p-0 auth-link-button" onClick={() => setShowRegister(true)}>Register</button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">School ICT Lab Support Platform</h1>
      <div className="action-bar mb-3">
          <button className="btn btn-info" onClick={() => setShowReports(r => !r)}>
            {showReports ? 'Hide Reports' : 'Show Reports'}
          </button>
          <button className="btn btn-info" onClick={() => setShowAnalytics(!showAnalytics)}>
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <button className="btn btn-success" onClick={() => setShowEquipmentManagement(!showEquipmentManagement)}>
            {showEquipmentManagement ? 'Hide Equipment Management' : 'Manage Equipment'}
          </button>
          <Logout setIsLoggedIn={setIsLoggedIn} className="btn btn-danger" />
      </div>
      {showReports && <Reports />}
      {showAnalytics && <Analytics />}
      {showEquipmentManagement && <EquipmentManagement />}
      <EquipmentList />
      {/* Only show TicketForm to regular users, not technicians */}
      {userRole === 'user' && (
      <TicketForm onTicketCreated={handleTicketCreated} />
      )}
      {userRole === 'technician' && (
        <div className="alert alert-info">
          <strong>Technician View:</strong> You can view and manage tickets, but only regular users can create new tickets.
        </div>
      )}
      <TicketList key={refreshTickets} />
    </div>
  );
}

export default App;
