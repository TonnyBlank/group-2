import React, { useState, useEffect } from 'react';
import api from './api';

function EquipmentManagement() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    serial_number: '',
    location: '',
    school: '',
    is_working: true
  });

  useEffect(() => {
    fetchEquipment();
    // Get user role from localStorage
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await api.get('api/equipment/');
      setEquipment(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`api/equipment/${editingId}/`, formData);
        setEditingId(null);
      } else {
        await api.post('api/equipment/', formData);
      }
      setFormData({
        type: '',
        serial_number: '',
        location: '',
        school: '',
        is_working: true
      });
      setShowForm(false);
      fetchEquipment();
    } catch (error) {
      console.error('Error saving equipment:', error);
      alert('Error saving equipment. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      type: item.type,
      serial_number: item.serial_number,
      location: item.location,
      school: item.school,
      is_working: item.is_working
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await api.delete(`api/equipment/${id}/`);
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Error deleting equipment. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      type: '',
      serial_number: '',
      location: '',
      school: '',
      is_working: true,
      description: ''
    });
  };

  const toggleWorkingStatus = async (id, currentStatus) => {
    try {
      await api.patch(`api/equipment/${id}/`, { is_working: !currentStatus });
      fetchEquipment();
    } catch (error) {
      console.error('Error updating equipment status:', error);
      alert('Error updating equipment status. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading equipment...</div>;
  }

  return (
    <div className="card p-4 my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Equipment Management</h2>
        {userRole === 'user' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add New Equipment
          </button>
        )}
      </div>
      
      {userRole === 'technician' && (
        <div className="alert alert-info mb-4">
          <strong>Technician View:</strong> You can view equipment details, but only regular users can add, edit, or delete equipment.
        </div>
      )}

      {/* Equipment Form */}
      {showForm && userRole === 'user' && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              {editingId ? 'Edit Equipment' : 'Add New Equipment'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Equipment Type *</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Equipment Type</option>
                    <option value="pc">PC</option>
                    <option value="printer">Printer</option>
                    <option value="projector">Projector</option>
                    <option value="router">Router</option>
                    <option value="ups">UPS</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Serial Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., SN123456789"
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Room 101, Lab A"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">School *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Primary School, High School"
                  />
                </div>
              </div>



              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="is_working"
                    checked={formData.is_working}
                    onChange={handleInputChange}
                    id="isWorking"
                  />
                  <label className="form-check-label" htmlFor="isWorking">
                    Equipment is working properly
                  </label>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Equipment' : 'Add Equipment'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment List */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Serial Number</th>
              <th>Location</th>
              <th>School</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No equipment found. Add some equipment to get started!
                </td>
              </tr>
            ) : (
              equipment.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <strong>{item.type}</strong>
                  </td>
                  <td>
                    <code className="bg-light px-2 py-1 rounded">
                      {item.serial_number}
                    </code>
                  </td>
                  <td>{item.location}</td>
                  <td>{item.school}</td>
                  <td>
                    <span 
                      className={`badge ${item.is_working ? 'bg-success' : 'bg-danger'}`}
                      style={{ cursor: userRole === 'user' ? 'pointer' : 'default' }}
                      onClick={userRole === 'user' ? () => toggleWorkingStatus(item.id, item.is_working) : undefined}
                      title={userRole === 'user' ? "Click to toggle status" : "Status (View Only)"}
                    >
                      {item.is_working ? 'Working' : 'Not Working'}
                    </span>
                  </td>

                  <td>
                    {userRole === 'user' ? (
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">View Only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{equipment.length}</h4>
              <p className="mb-0">Total Equipment</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{equipment.filter(e => e.is_working).length}</h4>
              <p className="mb-0">Working</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h4>{equipment.filter(e => !e.is_working).length}</h4>
              <p className="mb-0">Not Working</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{new Set(equipment.map(e => e.school)).size}</h4>
              <p className="mb-0">Schools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentManagement; 