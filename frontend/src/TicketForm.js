import React, { useState, useEffect } from 'react';
import api from './api';
import { jwtDecode } from 'jwt-decode';

function TicketForm({ onTicketCreated }) {
  const [equipment, setEquipment] = useState('');
  const [filteredEquipmentList, setFilteredEquipmentList] = useState([]);
  const [issueCategory, setIssueCategory] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('open');
  const [message, setMessage] = useState('');
  const [userSchool, setUserSchool] = useState('');

  // Fetch equipment list and user info on mount
  useEffect(() => {
    // Get user info from localStorage
    const access = localStorage.getItem('access');
    if (access) {
      const decoded = jwtDecode(access);
      const userId = decoded.user_id || decoded.id || decoded.sub;
      
      // Fetch user details to get their school
      api.get(`api/users/${userId}/`)
        .then(userResponse => {
          const school = userResponse.data.school || '';
          setUserSchool(school);
          
          // Fetch equipment and filter by user's school
          api.get('api/equipment/')
            .then(equipmentResponse => {
              console.log('All equipment:', equipmentResponse.data);
              console.log('User school:', school);
              // Filter equipment by user's school, or show all if school is empty or null
              const filtered = school && school !== 'None' && school !== '' ? 
                equipmentResponse.data.filter(eq => eq.school === school) : 
                equipmentResponse.data;
              console.log('Filtered equipment:', filtered);
              setFilteredEquipmentList(filtered);
            })
            .catch(error => console.error('Error fetching equipment:', error));
        })
        .catch(error => console.error('Error fetching user details:', error));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!equipment) {
      setMessage('Please select equipment.');
      return;
    }
    if (!issueCategory.trim()) {
      setMessage('Please enter an issue category.');
      return;
    }
    if (!description.trim()) {
      setMessage('Please enter a description.');
      return;
    }

    const ticketData = {
      equipment: parseInt(equipment),
      issue_category: issueCategory.trim(),
      description: description.trim(),
      status,
    };

    console.log('Submitting ticket data:', ticketData);

    api.post('api/tickets/', ticketData)
      .then(response => {
        console.log('Ticket created successfully:', response.data);
        setMessage('Ticket created successfully!');
        setEquipment('');
        setIssueCategory('');
        setDescription('');
        setStatus('open');
        if (onTicketCreated) onTicketCreated();
      })
      .catch(error => {
        console.error('Error creating ticket:', error);
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.detail) {
            setMessage(`Error: ${errorData.detail}`);
          } else if (errorData.error) {
            setMessage(`Error: ${errorData.error}`);
          } else {
            setMessage('Error creating ticket. Please check your input and try again.');
          }
        } else {
          setMessage('Error creating ticket. Make sure you are logged in and all fields are filled.');
        }
      });
  };

  return (
    <div className="card p-4 my-4">
      <h2 className="mb-3">Create Ticket</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Equipment:</label>
          <select
            className="form-select"
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
            required
          >
            <option value="">Select Equipment</option>
            {filteredEquipmentList.length === 0 ? (
              <option value="" disabled>
                {userSchool ? `No equipment available for your school (${userSchool})` : 'No equipment available. Please add equipment first.'}
              </option>
            ) : (
              filteredEquipmentList.map(eq => {
                const typeLabels = {
                  'pc': 'PC',
                  'printer': 'Printer', 
                  'projector': 'Projector',
                  'router': 'Router',
                  'ups': 'UPS'
                };
                return (
                  <option key={eq.id} value={eq.id}>
                    {typeLabels[eq.type] || eq.type} - {eq.serial_number} ({eq.is_working ? 'Working' : 'Not Working'})
                  </option>
                );
              })
            )}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Issue Category:</label>
          <input
            type="text"
            className="form-control"
            value={issueCategory}
            onChange={e => setIssueCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Create Ticket</button>
      </form>
    </div>
  );
}

export default TicketForm;