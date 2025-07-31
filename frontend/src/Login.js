import React, { useState } from 'react';
import api from './api';
import { jwtDecode } from 'jwt-decode';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post('api/token/', {
      username,
      password
    })
    .then(response => {
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      // Decode the access token to get the user ID
      const decoded = jwtDecode(response.data.access);
      const userId = decoded.user_id || decoded.id || decoded.sub;

      // Fetch user profile to get the role and school
      api.get(`api/users/${userId}/`)
        .then(res => {
          const userRole = res.data.role;
          const userSchool = res.data.school || '';
          localStorage.setItem('role', userRole);
          localStorage.setItem('school', userSchool);
          // Update app state with user role
          if (onLogin) onLogin(userRole);
          setMessage('Login successful!');
          setUsername('');
          setPassword('');
        })
        .catch(err => {
          console.error('Error fetching user profile:', err);
          // Still proceed with login even if role fetch fails
          if (onLogin) onLogin();
          setMessage('Login successful!');
          setUsername('');
          setPassword('');
        });
    })
    .catch(error => {
      setMessage('Login failed. Please check your credentials.');
      console.error(error);
    });
  };

  return (
    <div className="card p-4 mx-auto" style={{maxWidth: 400}}>
      <h2 className="mb-3">Login</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;