import React, { useEffect, useState } from 'react';
import api from './api';

function Reports() {
  const [frequentIssues, setFrequentIssues] = useState([]);
  const [turnaround, setTurnaround] = useState(null);
  const [equipmentStatus, setEquipmentStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('api/reports/frequent-issues/'),
      api.get('api/reports/turnaround-time/'),
      api.get('api/reports/equipment-status/'),
    ])
      .then(([issuesRes, turnaroundRes, equipmentRes]) => {
        setFrequentIssues(issuesRes.data);
        setTurnaround(turnaroundRes.data.average_turnaround_time);
        setEquipmentStatus(equipmentRes.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // Optionally, handle/report error
      });
  }, []);

  return (
    <div className="card p-4 my-4">
      <h2 className="mb-3">Reports</h2>
      {loading ? <p>Loading reports...</p> : (
        <>
          <h3 className="mt-3">Most Frequent Issues</h3>
          <ul className="list-group mb-3">
            {frequentIssues.map((item, idx) => (
              <li key={idx} className="list-group-item">{item.issue_category}: {item.count}</li>
            ))}
          </ul>

          <h3 className="mt-3">Average Turnaround Time</h3>
          <p>{turnaround ? turnaround : 'N/A'}</p>

          <h3 className="mt-3">Equipment Status Summary</h3>
          <ul className="list-group">
            {equipmentStatus.map((item, idx) => (
              <li key={idx} className="list-group-item">{item.status}: {item.count}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Reports; 