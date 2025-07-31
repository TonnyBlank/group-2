import React, { useState } from 'react';
import api from './api';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('api/users/', { username, email, password, role })
      .then(() => setMessage('Registration successful!'))
      .catch(() => setMessage('Registration failed.'));
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mx-auto" style={{maxWidth: 400}}>
      <h2 className="mb-3">Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="form-control mb-2" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="form-control mb-2" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="form-control mb-2" required />
      <select value={role} onChange={e => setRole(e.target.value)} className="form-select mb-3" required>
        <option value="user">User</option>
        <option value="technician">Technician</option>
      </select>
      <button type="submit" className="btn btn-success w-100 mb-2">Register</button>
      {message && <div className="alert alert-info mt-2">{message}</div>}
    </form>
  );
}

export default Register; 