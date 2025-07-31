import React, { useEffect, useState } from 'react';
import api from './api';

function Analytics() {
  const [patterns, setPatterns] = useState([]);
  const [schoolIssues, setSchoolIssues] = useState([]);
  const [maintenanceSchedule, setMaintenanceSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Analytics component mounted, fetching data...');
    Promise.all([
      api.get('api/analytics/equipment-failure-patterns/'),
      api.get('api/analytics/school-issues/'),
      api.get('api/analytics/maintenance-schedule/')
    ])
      .then(([patternsRes, schoolRes, scheduleRes]) => {
        console.log('Equipment patterns response:', patternsRes.data);
        console.log('School issues response:', schoolRes.data);
        console.log('Maintenance schedule response:', scheduleRes.data);
        setPatterns(patternsRes.data);
        setSchoolIssues(schoolRes.data);
        setMaintenanceSchedule(scheduleRes.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching analytics data:', error);
        setLoading(false);
      });
  }, []);

  console.log('Current state - patterns:', patterns, 'schoolIssues:', schoolIssues, 'maintenanceSchedule:', maintenanceSchedule);

  return (
    <div className="card p-4 my-4">
      <h2 className="mb-3">Analytics Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3 className="mt-3">Equipment Failure Patterns</h3>
          <ul className="list-group mb-4">
            {patterns.length === 0 ? (
              <li className="list-group-item">No data available.</li>
            ) : (
              patterns.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  {item.equipment__type}: {item.failure_count} failure(s)
                </li>
              ))
            )}
          </ul>

          <h3 className="mt-3">Schools with Frequent ICT Issues</h3>
          <ul className="list-group mb-4">
            {schoolIssues.length === 0 ? (
              <li className="list-group-item">No data available.</li>
            ) : (
              schoolIssues.map((item, idx) => (
                <li key={idx} className="list-group-item">
                  {item.equipment__school}: {item.issue_count} issue(s)
                </li>
              ))
            )}
          </ul>

          <h3 className="mt-3">Recommended Preventive Maintenance Schedules</h3>
          
          {/* Weekly Maintenance */}
          {maintenanceSchedule.weekly && maintenanceSchedule.weekly.length > 0 && (
            <div className="mb-4">
              <h5 className="text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Weekly Maintenance (Critical Equipment)
              </h5>
              <ul className="list-group">
                {maintenanceSchedule.weekly.map((item, idx) => (
                  <li key={idx} className="list-group-item list-group-item-danger">
                    <strong>Equipment ID {item.equipment_id}</strong> ({item.equipment_type}) at {item.location}
                    <ul className="list-unstyled ms-3 mt-2">
                      {item.tasks.slice(0, 3).map((task, taskIdx) => (
                        <li key={taskIdx} className="small">
                          <i className="bi bi-check-circle text-white me-1"></i>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monthly Maintenance */}
          {maintenanceSchedule.monthly && maintenanceSchedule.monthly.length > 0 && (
            <div className="mb-4">
              <h5 className="text-warning">
                <i className="bi bi-calendar-check me-2"></i>
                Monthly Maintenance (Standard Equipment)
              </h5>
              <ul className="list-group">
                {maintenanceSchedule.monthly.map((item, idx) => (
                  <li key={idx} className="list-group-item list-group-item-warning">
                    <strong>Equipment ID {item.equipment_id}</strong> ({item.equipment_type}) at {item.location}
                    <ul className="list-unstyled ms-3 mt-2">
                      {item.tasks.slice(0, 3).map((task, taskIdx) => (
                        <li key={taskIdx} className="small">
                          <i className="bi bi-check-circle text-dark me-1"></i>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quarterly Maintenance */}
          {maintenanceSchedule.quarterly && maintenanceSchedule.quarterly.length > 0 && (
            <div className="mb-4">
              <h5 className="text-info">
                <i className="bi bi-calendar-event me-2"></i>
                Quarterly Maintenance (Routine Equipment)
              </h5>
              <ul className="list-group">
                {maintenanceSchedule.quarterly.map((item, idx) => (
                  <li key={idx} className="list-group-item list-group-item-info">
                    <strong>Equipment ID {item.equipment_id}</strong> ({item.equipment_type}) at {item.location}
                    <ul className="list-unstyled ms-3 mt-2">
                      {item.tasks.slice(0, 3).map((task, taskIdx) => (
                        <li key={taskIdx} className="small">
                          <i className="bi bi-check-circle text-dark me-1"></i>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Maintenance Needed */}
          {(!maintenanceSchedule.weekly || maintenanceSchedule.weekly.length === 0) &&
           (!maintenanceSchedule.monthly || maintenanceSchedule.monthly.length === 0) &&
           (!maintenanceSchedule.quarterly || maintenanceSchedule.quarterly.length === 0) && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-2"></i>
              <strong>Great news!</strong> No equipment currently requires scheduled maintenance. All equipment is in good condition.
            </div>
          )}

        </>
      )}
    </div>
  );
}

export default Analytics; 