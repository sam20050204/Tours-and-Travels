import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SeatChart.css';

const SeatChart = ({ tourId }) => {
  const [tour, setTour] = useState(null);
  const [seatingLayout, setSeatingLayout] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengers, setPassengers] = useState([]);

  const fetchTourDetails = async () => {
    try {
      // First, sync the layout with actual passenger data
      try {
        console.log('Syncing seats layout...');
        await axios.post(`/api/tours/${tourId}/fix-seats`);
        console.log('Seats synced');
      } catch (err) {
        console.log('Sync error (non-critical):', err.message);
      }

      // Get passengers first (they may have updated seat numbers)
      const passengerResponse = await axios.get(`/api/passengers/tour/${tourId}`);
      console.log('Raw passenger response:', passengerResponse.data);
      console.log('Checking each passenger:');
      passengerResponse.data.forEach((p, i) => {
        console.log(`Passenger ${i}: ${p.firstName} ${p.lastName} - seatNumber: "${p.seatNumber}"`);
      });
      setPassengers(passengerResponse.data);

      // Then get tour with updated layout
      const tourResponse = await axios.get(`/api/tours/${tourId}`);
      setTour(tourResponse.data);
      if (tourResponse.data.seatingLayout) {
        const layout = JSON.parse(tourResponse.data.seatingLayout);
        updateLayoutWithPassengers(layout);
      }
    } catch (error) {
      console.error('Error fetching tour details:', error);
    }
  };

  useEffect(() => {
    fetchTourDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  const updateLayoutWithPassengers = (layout) => {
    // Clean up duplicates - a passenger should only appear once per tour
    const seenSeats = new Set();
    
    for (let row of layout.rows) {
      for (let seat of row.seats) {
        if (seat.occupied && seat.passengerName) {
          if (seenSeats.has(seat.passengerName)) {
            // Duplicate found, mark as unoccupied
            seat.occupied = false;
            seat.passengerName = null;
          } else {
            seenSeats.add(seat.passengerName);
          }
        }
      }
    }

    // Recalculate occupancy
    let occupiedCount = 0;
    for (let row of layout.rows) {
      for (let seat of row.seats) {
        if (seat.occupied) {
          occupiedCount++;
        }
      }
    }
    layout.occupiedSeats = occupiedCount;
    setSeatingLayout(layout);
  };

  const handleSeatClick = (seat) => {
    if (!seat.seatNumber) return; // Aisle - don't select

    // If clicking same seat, deselect
    if (selectedSeat && selectedSeat.seatNumber === seat.seatNumber) {
      setSelectedSeat(null);
      return;
    }

    setSelectedSeat(seat);
  };

  const assignSeatToPassenger = async (passengerId) => {
    if (!selectedSeat) {
      alert('Please select a seat first');
      return;
    }

    if (selectedSeat.occupied) {
      alert('This seat is already occupied');
      return;
    }

    try {
      const passenger = passengers.find(p => p._id === passengerId);
      if (!passenger) {
        alert('Passenger not found');
        return;
      }

      // Sync layout with database first
      console.log('Syncing layout with database...');
      try {
        await axios.post(`/api/tours/${tourId}/fix-seats`);
        console.log('Layout synced');
      } catch (err) {
        console.log('Sync error (non-critical):', err.message);
      }

      // If passenger already has a seat, ask to move them
      if (passenger.seatNumber) {
        const confirmChange = window.confirm(
          `This passenger is already assigned to seat ${passenger.seatNumber}. Do you want to move them to ${selectedSeat.seatNumber}?`
        );
        if (!confirmChange) return;

        // First, remove from old seat via API
        console.log('Removing passenger from old seat:', passenger.seatNumber);
        await axios.put(`/api/passengers/${passengerId}`, { seatNumber: null });
        console.log('Removed from old seat');
        // Wait before reassigning
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Now assign to new seat
      console.log('Assigning passenger to seat:', selectedSeat.seatNumber);
      const assignResponse = await axios.put(`/api/passengers/${passengerId}/assign-seat`, {
        seatNumber: selectedSeat.seatNumber
      });
      console.log('Assignment response:', assignResponse.data);
      console.log('Seat number in response:', assignResponse.data.seatNumber);

      setSelectedSeat(null);
      // Refresh data to get accurate counts
      await new Promise(resolve => setTimeout(resolve, 1000)); // Longer delay for DB sync
      console.log('Calling fetchTourDetails after assignment...');
      await fetchTourDetails();
    } catch (error) {
      console.error('Error assigning seat:', error);
      console.error('Error response:', error.response?.data);
      alert('Error assigning seat: ' + (error.response?.data?.error || error.message));
    }
  };

  const unassignSeat = async (passengerId) => {
    try {
      const passenger = passengers.find(p => p._id === passengerId);
      if (!passenger) return;
      
      // Ask for confirmation
      const confirm = window.confirm(
        `Are you sure you want to remove ${passenger.firstName} ${passenger.lastName} from seat ${passenger.seatNumber}?`
      );
      if (!confirm) return;
      
      console.log('Unassigning passenger:', passengerId);
      await axios.put(`/api/passengers/${passengerId}`, { seatNumber: null });
      console.log('Passenger unassigned, refreshing...');
      
      // Wait a bit before refreshing
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchTourDetails();
      setSelectedSeat(null);
      console.log('Refresh complete');
    } catch (error) {
      console.error('Error unassigning seat:', error);
      alert('Error unassigning seat: ' + error.message);
    }
  };

  if (!seatingLayout) {
    return <div className="loading">Loading seat chart...</div>;
  }

  const unassignedPassengers = passengers.filter(p => !p.seatNumber || p.seatNumber === 'null' || p.seatNumber === null);
  const assignedPassengers = passengers.filter(p => p.seatNumber && p.seatNumber !== 'null' && p.seatNumber !== null);
  
  console.log('Unassigned:', unassignedPassengers.length, 'Assigned:', assignedPassengers.length, 'Total passengers:', passengers.length);
  console.log('Assigned passengers:', assignedPassengers);

  // Separate upper and lower berths
  const upperBerths = seatingLayout.rows.map(row => ({
    ...row,
    seats: row.seats.filter(s => s.berth === 'Upper' || s.aisle)
  }));
  
  const lowerBerths = seatingLayout.rows.map(row => ({
    ...row,
    seats: row.seats.filter(s => s.berth === 'Lower' || s.aisle)
  }));

  // Count occupied berths
  let upperOccupied = 0;
  let lowerOccupied = 0;
  let upperTotal = 0;
  let lowerTotal = 0;

  seatingLayout.rows.forEach(row => {
    row.seats.forEach(seat => {
      if (seat.berth === 'Upper') {
        upperTotal++;
        if (seat.occupied) upperOccupied++;
      } else if (seat.berth === 'Lower') {
        lowerTotal++;
        if (seat.occupied) lowerOccupied++;
      }
    });
  });

  return (
    <div className="seat-chart-container">
      <div className="seat-chart">
        <h3>Bus Seating Chart - {tour?.busId ? tour.busId.busName : 'Bus Deleted'} ({seatingLayout.busType})</h3>
        
        <div className="legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="seat occupied"></div>
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>Selected</span>
          </div>
        </div>

        {/* Upper Berths Section */}
        <div className="berth-section">
          <div className="berth-header">
            <h4>Upper Deck</h4>
            <span className="berth-stats">({upperOccupied}/{upperTotal})</span>
          </div>
          <div className="sleeper-bus-layout">
            <div className="bus-side left-side">
              {seatingLayout.rows.map((row, rowIndex) => (
                <div key={`upper-left-${rowIndex}`} className="berth-row">
                  {row.seats
                    .filter(s => s.berth === 'Upper' && s.position === 'left')
                    .map((seat, seatIndex) => {
                      const isSelected = selectedSeat && selectedSeat.seatNumber === seat.seatNumber;
                      return (
                        <button
                          key={`${rowIndex}-${seatIndex}`}
                          className={`sleeper-seat ${seat.occupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSeatClick(seat)}
                          title={seat.passengerName ? `${seat.seatNumber} - ${seat.passengerName}` : seat.seatNumber}
                        >
                          {seat.passengerName && (
                            <div className="seat-passenger-name">{seat.passengerName.split(' ')[0]}</div>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
            <div className="steering-wheel">🚗</div>
            <div className="bus-side right-side">
              {seatingLayout.rows.map((row, rowIndex) => (
                <div key={`upper-right-${rowIndex}`} className="berth-row">
                  {row.seats
                    .filter(s => s.berth === 'Upper' && s.position === 'right')
                    .map((seat, seatIndex) => {
                      const isSelected = selectedSeat && selectedSeat.seatNumber === seat.seatNumber;
                      return (
                        <button
                          key={`${rowIndex}-${seatIndex}`}
                          className={`sleeper-seat ${seat.occupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSeatClick(seat)}
                          title={seat.passengerName ? `${seat.seatNumber} - ${seat.passengerName}` : seat.seatNumber}
                        >
                          {seat.passengerName && (
                            <div className="seat-passenger-name">{seat.passengerName.split(' ')[0]}</div>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Berths Section */}
        <div className="berth-section">
          <div className="berth-header">
            <h4>Lower Deck</h4>
            <span className="berth-stats">({lowerOccupied}/{lowerTotal})</span>
          </div>
          <div className="sleeper-bus-layout">
            <div className="bus-side left-side">
              {seatingLayout.rows.map((row, rowIndex) => (
                <div key={`lower-left-${rowIndex}`} className="berth-row">
                  {row.seats
                    .filter(s => s.berth === 'Lower' && s.position === 'left')
                    .map((seat, seatIndex) => {
                      const isSelected = selectedSeat && selectedSeat.seatNumber === seat.seatNumber;
                      return (
                        <button
                          key={`${rowIndex}-${seatIndex}`}
                          className={`sleeper-seat ${seat.occupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSeatClick(seat)}
                          title={seat.passengerName ? `${seat.seatNumber} - ${seat.passengerName}` : seat.seatNumber}
                        >
                          {seat.passengerName && (
                            <div className="seat-passenger-name">{seat.passengerName.split(' ')[0]}</div>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
            <div className="steering-wheel">🚗</div>
            <div className="bus-side right-side">
              {seatingLayout.rows.map((row, rowIndex) => (
                <div key={`lower-right-${rowIndex}`} className="berth-row">
                  {row.seats
                    .filter(s => s.berth === 'Lower' && s.position === 'right')
                    .map((seat, seatIndex) => {
                      const isSelected = selectedSeat && selectedSeat.seatNumber === seat.seatNumber;
                      return (
                        <button
                          key={`${rowIndex}-${seatIndex}`}
                          className={`sleeper-seat ${seat.occupied ? 'occupied' : 'available'} ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSeatClick(seat)}
                          title={seat.passengerName ? `${seat.seatNumber} - ${seat.passengerName}` : seat.seatNumber}
                        >
                          {seat.passengerName && (
                            <div className="seat-passenger-name">{seat.passengerName.split(' ')[0]}</div>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="seat-stats">
          <p>Total Seats: <strong>{seatingLayout.totalSeats}</strong> (Upper: {upperTotal} + Lower: {lowerTotal})</p>
          <p>Occupied: <strong>{seatingLayout.occupiedSeats}</strong> (Upper: {upperOccupied} + Lower: {lowerOccupied})</p>
          <p>Available: <strong>{seatingLayout.totalSeats - seatingLayout.occupiedSeats}</strong></p>
        </div>
      </div>

      <div className="seat-management">
        <div className="assigned-passengers">
          <h3>Assigned Passengers ({assignedPassengers.length})</h3>
          {assignedPassengers.length === 0 ? (
            <p style={{ color: '#999' }}>No passengers assigned yet</p>
          ) : (
            <div className="passengers-list">
              {assignedPassengers.map(passenger => (
                <div key={passenger._id} className="assigned-item">
                  <div className="passenger-info">
                    <p><strong>{passenger.firstName} {passenger.lastName}</strong></p>
                    <p className="seat-info">Seat: {passenger.seatNumber}</p>
                  </div>
                  <button
                    onClick={() => unassignSeat(passenger._id)}
                    className="btn-unassign"
                    type="button"
                  >
                    Unassign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="unassigned-passengers">
          <h3>Unassigned Passengers ({unassignedPassengers.length})</h3>
          {selectedSeat && (
            <div className="selected-seat-info">
              <p>Selected Seat: <strong>{selectedSeat.seatNumber}</strong></p>
            </div>
          )}
          <div className="passengers-to-assign">
            {unassignedPassengers.length === 0 ? (
              <p style={{ color: '#999' }}>All passengers assigned!</p>
            ) : (
              unassignedPassengers.map(passenger => (
                <div key={passenger._id} className="passenger-item">
                  <div className="passenger-info">
                    <p><strong>{passenger.firstName} {passenger.lastName}</strong></p>
                    <p>{passenger.email}</p>
                  </div>
                  <button
                    onClick={() => assignSeatToPassenger(passenger._id)}
                    disabled={!selectedSeat || selectedSeat.occupied || passenger.seatNumber}
                    className="btn-assign"
                  >
                    Assign to {selectedSeat?.seatNumber || 'Seat'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatChart;
