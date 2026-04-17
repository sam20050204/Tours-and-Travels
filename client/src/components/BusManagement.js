import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BusManagement.css';

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    busType: '2x2',
    totalSeats: 0,
    contactNumber: '',
    busOwner: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await axios.get('/api/buses');
      setBuses(response.data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSeats' ? parseInt(value) : value
    }));
  };

  const calculateTotalSeats = (busType) => {
    // Handle sleeper bus types
    if (busType.includes('Sleeper')) {
      return 32; // 16 upper + 16 lower berths
    }
    // Handle regular bus types
    const [left, right] = busType.split('x').map(Number);
    return (left + right) * 10; // Approximate 10 rows
  };

  const handleBusTypeChange = (e) => {
    const busType = e.target.value;
    const totalSeats = calculateTotalSeats(busType);
    setFormData(prev => ({
      ...prev,
      busType,
      totalSeats
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/buses/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/buses', formData);
      }
      resetForm();
      fetchBuses();
    } catch (error) {
      console.error('Error saving bus:', error);
      alert('Error saving bus details');
    }
  };

  const handleEdit = (bus) => {
    setEditingId(bus._id);
    setFormData(bus);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await axios.delete(`/api/buses/${id}`);
        fetchBuses();
      } catch (error) {
        console.error('Error deleting bus:', error);
        alert('Error deleting bus');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      busNumber: '',
      busName: '',
      busType: '2x2',
      totalSeats: 0,
      contactNumber: '',
      busOwner: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="bus-management">
      <h2>Bus Management</h2>
      
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : 'Add New Bus'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bus-form">
          <div className="form-group">
            <label>Bus Number</label>
            <input
              type="text"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g., BUS-001"
            />
          </div>

          <div className="form-group">
            <label>Bus Name</label>
            <input
              type="text"
              name="busName"
              value={formData.busName}
              onChange={handleInputChange}
              required
              placeholder="e.g., Paradise Express"
            />
          </div>

          <div className="form-group">
            <label>Bus Type</label>
            <select name="busType" value={formData.busType} onChange={handleBusTypeChange}>
              <option value="Sleeper 2x2">Sleeper 2x2 (2 Upper, 2 Lower)</option>
              <option value="Sleeper 2 Floors">Sleeper 2 Floors (Upper & Lower Berths)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Seats</label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleInputChange}
              required
              placeholder="e.g., 40"
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g., +91-9999999999"
            />
          </div>

          <div className="form-group">
            <label>Bus Owner Name</label>
            <input
              type="text"
              name="busOwner"
              value={formData.busOwner}
              onChange={handleInputChange}
              required
              placeholder="e.g., John Doe"
            />
          </div>

          <button type="submit" className="btn-success">
            {editingId ? 'Update Bus' : 'Save Bus'}
          </button>
        </form>
      )}

      <div className="buses-list">
        {buses.length === 0 ? (
          <p>No buses added yet</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Bus Number</th>
                <th>Bus Name</th>
                <th>Type</th>
                <th>Seats</th>
                <th>Owner</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map(bus => (
                <tr key={bus._id}>
                  <td>{bus.busNumber}</td>
                  <td>{bus.busName}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.totalSeats}</td>
                  <td>{bus.busOwner}</td>
                  <td>{bus.contactNumber}</td>
                  <td>
                    <button onClick={() => handleEdit(bus)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(bus._id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BusManagement;
