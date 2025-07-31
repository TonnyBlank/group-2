import React from 'react';

function Logout({ setIsLoggedIn }) {
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    if (typeof setIsLoggedIn === 'function') setIsLoggedIn(false);
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;