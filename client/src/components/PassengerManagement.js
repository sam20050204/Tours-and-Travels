import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PassengerManagement.css';
import SeatChart from './SeatChart';

const PassengerManagement = () => {
  const [tours, setTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showSeatChart, setShowSeatChart] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    idType: 'Aadhar',
    idNumber: '',
    age: '',
    specialRequirements: ''
  });

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (selectedTourId) {
      fetchPassengers(selectedTourId);
    }
  }, [selectedTourId]);

  const fetchTours = async () => {
    try {
      const response = await axios.get('/api/tours');
      setTours(response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const fetchPassengers = async (tourId) => {
    try {
      const response = await axios.get(`/api/passengers/tour/${tourId}`);
      setPassengers(response.data);
    } catch (error) {
      console.error('Error fetching passengers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedTourId) {
        alert('Please select a tour first');
        return;
      }

      const dataToSubmit = {
        ...formData,
        tourId: selectedTourId
      };

      if (editingId) {
        await axios.put(`/api/passengers/${editingId}`, dataToSubmit);
        setEditingId(null);
      } else {
        await axios.post('/api/passengers', dataToSubmit);
      }
      resetForm();
      fetchPassengers(selectedTourId);
    } catch (error) {
      console.error('Error saving passenger:', error);
      alert('Error saving passenger details');
    }
  };

  const handleEdit = (passenger) => {
    setEditingId(passenger._id);
    setFormData({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      email: passenger.email,
      phoneNumber: passenger.phoneNumber,
      address: passenger.address,
      city: passenger.city,
      idType: passenger.idType,
      idNumber: passenger.idNumber,
      age: passenger.age,
      specialRequirements: passenger.specialRequirements || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this passenger?')) {
      try {
        await axios.delete(`/api/passengers/${id}`);
        fetchPassengers(selectedTourId);
      } catch (error) {
        console.error('Error deleting passenger:', error);
        alert('Error deleting passenger');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      idType: 'Aadhar',
      idNumber: '',
      age: '',
      specialRequirements: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="passenger-management">
      <h2>Passenger Management</h2>

      <div className="tour-selector">
        <label>Select Tour:</label>
        <select
          value={selectedTourId}
          onChange={(e) => setSelectedTourId(e.target.value)}
        >
          <option value="">Choose a tour...</option>
          {tours.map(tour => (
            <option key={tour._id} value={tour._id}>
              {tour.tourName} - {tour.departureLocation} to {tour.destinationLocation}
            </option>
          ))}
        </select>
      </div>

      {selectedTourId && (
        <>
          <div className="action-buttons">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : 'Add Passenger'}
            </button>
            <button onClick={() => setShowSeatChart(!showSeatChart)} className="btn-primary btn-seat">
              {showSeatChart ? 'Hide Seat Chart' : 'View Seat Chart'}
            </button>
          </div>

          {showSeatChart && <SeatChart tourId={selectedTourId} />}

          {showForm && (
            <form onSubmit={handleSubmit} className="passenger-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ID Type</label>
                  <select name="idType" value={formData.idType} onChange={handleInputChange}>
                    <option value="Aadhar">Aadhar</option>
                    <option value="PAN">PAN</option>
                    <option value="Passport">Passport</option>
                    <option value="License">License</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Number</label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Special Requirements</label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="e.g., Wheelchair access needed, Vegetarian meal preference"
                />
              </div>

              <button type="submit" className="btn-success">
                {editingId ? 'Update Passenger' : 'Add Passenger'}
              </button>
            </form>
          )}

          <div className="passengers-list">
            {passengers.length === 0 ? (
              <p>No passengers added for this tour</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>ID Type</th>
                    <th>Seat</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {passengers.map(passenger => (
                    <tr key={passenger._id}>
                      <td>{passenger.firstName} {passenger.lastName}</td>
                      <td>{passenger.email}</td>
                      <td>{passenger.phoneNumber}</td>
                      <td>{passenger.idType}</td>
                      <td>{passenger.seatNumber || 'Not Assigned'}</td>
                      <td>
                        <span className={`payment-status ${passenger.paymentStatus}`}>
                          {passenger.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(passenger)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(passenger._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PassengerManagement;
