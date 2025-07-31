import React, { useEffect, useState } from 'react';
import api from './api';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = () => {
    api.get('api/equipment/')
      .then(response => {
        setEquipment(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching equipment:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Refresh equipment list every 5 seconds to catch updates
  useEffect(() => {
    const interval = setInterval(fetchEquipment, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card p-4 my-4">
      <h2 className="mb-3">Equipment List</h2>
      <ul className="list-group">
        {equipment.map(item => {
          const typeLabels = {
            'pc': 'PC',
            'printer': 'Printer', 
            'projector': 'Projector',
            'router': 'Router',
            'ups': 'UPS'
          };
          return (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{typeLabels[item.type] || item.type}</strong> - {item.serial_number}
                <br />
                <small className="text-muted">
                  Location: {item.location} | School: {item.school}
                </small>
              </div>
              <span className={`badge ${item.is_working ? 'bg-success' : 'bg-danger'}`}>
                {item.is_working ? 'Working' : 'Not Working'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default EquipmentList;