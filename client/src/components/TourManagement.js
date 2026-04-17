import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TourManagement.css';

const TourManagement = () => {
  const [tours, setTours] = useState([]);
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tourName: '',
    startDate: '',
    endDate: '',
    busId: '',
    departureLocation: '',
    destinationLocation: '',
    pricePerSeat: 0
  });

  useEffect(() => {
    fetchTours();
    fetchBuses();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await axios.get('/api/tours');
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

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
      [name]: name === 'pricePerSeat' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/tours/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post('/api/tours', formData);
      }
      resetForm();
      fetchTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Error saving tour');
    }
  };

  const handleEdit = (tour) => {
    setEditingId(tour._id);
    setFormData({
      tourName: tour.tourName,
      startDate: tour.startDate.split('T')[0],
      endDate: tour.endDate.split('T')[0],
      busId: tour.busId ? tour.busId._id : '',
      departureLocation: tour.departureLocation,
      destinationLocation: tour.destinationLocation,
      pricePerSeat: tour.pricePerSeat
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await axios.delete(`/api/tours/${id}`);
        fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Error deleting tour');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tourName: '',
      startDate: '',
      endDate: '',
      busId: '',
      departureLocation: '',
      destinationLocation: '',
      pricePerSeat: 0
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="tour-management">
      <h2>Tour Management</h2>

      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? 'Cancel' : 'Create New Tour'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="tour-form">
          <div className="form-group">
            <label>Tour Name</label>
            <input
              type="text"
              name="tourName"
              value={formData.tourName}
              onChange={handleInputChange}
              required
              placeholder="e.g., Himalayan Adventure"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Select Bus</label>
            <select
              name="busId"
              value={formData.busId}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose a bus...</option>
              {buses.map(bus => (
                <option key={bus._id} value={bus._id}>
                  {bus.busNumber} - {bus.busName} ({bus.busType}, {bus.totalSeats} seats)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Departure Location</label>
              <input
                type="text"
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleInputChange}
                required
                placeholder="e.g., Mumbai"
              />
            </div>

            <div className="form-group">
              <label>Destination Location</label>
              <input
                type="text"
                name="destinationLocation"
                value={formData.destinationLocation}
                onChange={handleInputChange}
                required
                placeholder="e.g., Goa"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Price Per Seat (₹)</label>
            <input
              type="number"
              name="pricePerSeat"
              value={formData.pricePerSeat}
              onChange={handleInputChange}
              required
              step="100"
              placeholder="e.g., 2500"
            />
          </div>

          <button type="submit" className="btn-success">
            {editingId ? 'Update Tour' : 'Create Tour'}
          </button>
        </form>
      )}

      <div className="tours-list">
        {tours.length === 0 ? (
          <p>No tours scheduled yet</p>
        ) : (
          <div className="tours-grid">
            {tours.map(tour => (
              <div key={tour._id} className="tour-card">
                <h3>{tour.tourName}</h3>
                <p><strong>From:</strong> {tour.departureLocation} → {tour.destinationLocation}</p>
                <p><strong>Dates:</strong> {new Date(tour.startDate).toLocaleDateString()} to {new Date(tour.endDate).toLocaleDateString()}</p>
                <p><strong>Bus:</strong> {tour.busId ? `${tour.busId.busNumber} (${tour.busId.busType})` : 'Bus Deleted'}</p>
                <p><strong>Price/Seat:</strong> ₹{tour.pricePerSeat}</p>
                <p><strong>Passengers:</strong> {tour.totalPassengers}</p>
                <p><strong>Status:</strong> <span className={`status ${tour.status}`}>{tour.status}</span></p>
                <div className="tour-actions">
                  <button onClick={() => handleEdit(tour)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(tour._id)} className="btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourManagement;
