import React from 'react';

function Logout({ setIsLoggedIn, className = 'btn btn-danger' }) {
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    localStorage.removeItem('school');
    if (typeof setIsLoggedIn === 'function') setIsLoggedIn(false);
  };

  return (
    <button className={className} onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
