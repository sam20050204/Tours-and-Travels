import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentManagement.css';

const PaymentManagement = () => {
  const [tours, setTours] = useState([]);
  const [selectedTourId, setSelectedTourId] = useState('');
  const [passengers, setPassengers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    passengerId: '',
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (selectedTourId) {
      fetchPassengersAndPayments(selectedTourId);
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

  const fetchPassengersAndPayments = async (tourId) => {
    try {
      const passengerResponse = await axios.get(`/api/passengers/tour/${tourId}`);
      setPassengers(passengerResponse.data);

      const paymentResponse = await axios.get(`/api/payments/tour/${tourId}`);
      setPayments(paymentResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!selectedTourId || !formData.passengerId) {
        alert('Please select a tour and passenger');
        return;
      }

      const dataToSubmit = {
        ...formData,
        tourId: selectedTourId
      };

      await axios.post('/api/payments', dataToSubmit);
      resetForm();
      fetchPassengersAndPayments(selectedTourId);
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment');
    }
  };

  const resetForm = () => {
    setFormData({
      passengerId: '',
      amount: '',
      paymentMethod: 'cash',
      transactionId: '',
      notes: ''
    });
    setShowForm(false);
  };

  const getPassengerPaymentInfo = (passengerId) => {
    const passenger = passengers.find(p => p._id === passengerId);
    return passenger;
  };

  const getTourPrice = () => {
    const tour = tours.find(t => t._id === selectedTourId);
    return tour?.pricePerSeat || 0;
  };

  const getPassengerTotalPaid = (passengerId) => {
    return payments
      .filter(p => p.passengerId._id === passengerId)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const generatePaymentReport = () => {
    const pricePerSeat = getTourPrice();
    const report = passengers.map(passenger => {
      const totalPaid = getPassengerTotalPaid(passenger._id);
      const remaining = Math.max(0, pricePerSeat - totalPaid);
      return {
        ...passenger,
        totalPaid,
        remaining,
        duePercentage: (totalPaid / pricePerSeat * 100).toFixed(2)
      };
    });
    return report;
  };

  const downloadReport = () => {
    const report = generatePaymentReport();
    const tour = tours.find(t => t._id === selectedTourId);
    
    let csv = 'Tours & Travels Payment Report\n';
    csv += `Tour: ${tour?.tourName}\n`;
    csv += `Date: ${new Date().toLocaleDateString()}\n\n`;
    csv += 'Passenger Name,Email,Total Paid (₹),Price Per Seat (₹),Remaining (₹),Payment %,Status\n';

    report.forEach(p => {
      csv += `"${p.firstName} ${p.lastName}","${p.email}",${p.totalPaid},${getTourPrice()},${p.remaining},${p.duePercentage}%,"${p.paymentStatus}"\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `payment-report-${tour?.tourName}-${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="payment-management">
      <h2>Payment Management</h2>

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
              {showForm ? 'Cancel' : 'Record Payment'}
            </button>
            <button onClick={downloadReport} className="btn-primary btn-report">
              Download Payment Report
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Passenger</label>
                  <select
                    name="passengerId"
                    value={formData.passengerId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a passenger...</option>
                    {passengers.map(passenger => (
                      <option key={passenger._id} value={passenger._id}>
                        {passenger.firstName} {passenger.lastName} - {passenger.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    step="50"
                    placeholder="e.g., 2500"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction ID (Optional)</label>
                  <input
                    type="text"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleInputChange}
                    placeholder="e.g., TXN123456"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="e.g., Advance payment, Balance due on travel date"
                />
              </div>

              <button type="submit" className="btn-success">
                Record Payment
              </button>
            </form>
          )}

          <div className="payment-summary">
            <h3>Payment Summary & Report</h3>
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Passenger Name</th>
                  <th>Email</th>
                  <th>Total Paid (₹)</th>
                  <th>Price Per Seat (₹)</th>
                  <th>Remaining (₹)</th>
                  <th>Payment %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {generatePaymentReport().map(passenger => (
                  <tr key={passenger._id}>
                    <td>{passenger.firstName} {passenger.lastName}</td>
                    <td>{passenger.email}</td>
                    <td className="amount">₹{passenger.totalPaid.toFixed(2)}</td>
                    <td className="amount">₹{getTourPrice()}</td>
                    <td className="amount">₹{passenger.remaining.toFixed(2)}</td>
                    <td>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${passenger.duePercentage}%` }}>
                          {passenger.duePercentage}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status ${passenger.paymentStatus}`}>
                        {passenger.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals">
              <p>
                <strong>Total Collected: </strong>
                ₹{payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
              </p>
              <p>
                <strong>Total Due: </strong>
                ₹{generatePaymentReport().reduce((sum, p) => sum + p.remaining, 0).toFixed(2)}
              </p>
              <p>
                <strong>Collection Rate: </strong>
                {((generatePaymentReport().reduce((sum, p) => sum + p.totalPaid, 0) / (generatePaymentReport().length * getTourPrice()) * 100) || 0).toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="payment-history">
            <h3>Payment History</h3>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Passenger</th>
                  <th>Amount (₹)</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan="6">No payments recorded yet</td></tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id}>
                      <td>{payment.passengerId.firstName} {payment.passengerId.lastName}</td>
                      <td className="amount">₹{payment.amount.toFixed(2)}</td>
                      <td>{payment.paymentMethod.replace('_', ' ').toUpperCase()}</td>
                      <td>{payment.transactionId || '-'}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>{payment.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentManagement;
