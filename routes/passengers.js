const express = require('express');
const Passenger = require('../models/Passenger');
const Tour = require('../models/Tour');
const router = express.Router();

// Fix: Import Tour model for seating layout update

// Get all passengers for a tour
router.get('/tour/:tourId', async (req, res) => {
  try {
    const passengers = await Passenger.find({ tourId: req.params.tourId });
    // Convert to JSON and clean up null values
    const cleanPassengers = passengers.map(p => {
      const obj = p.toObject ? p.toObject() : p;
      // If seatNumber is string "null", convert to actual null
      if (obj.seatNumber === 'null' || obj.seatNumber === null) {
        obj.seatNumber = null;
      }
      return obj;
    });
    res.json(cleanPassengers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new passenger
router.post('/', async (req, res) => {
  try {
    const { tourId, firstName, lastName, email, phoneNumber, address, city, idType, idNumber, age, specialRequirements } = req.body;

    const newPassenger = new Passenger({
      tourId,
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      idType,
      idNumber,
      age,
      specialRequirements
    });

    const savedPassenger = await newPassenger.save();
    
    // Update tour passenger count
    await Tour.findByIdAndUpdate(tourId, { $inc: { totalPassengers: 1 } });

    res.status(201).json(savedPassenger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign seat to passenger
router.put('/:id/assign-seat', async (req, res) => {
  try {
    const { seatNumber } = req.body;
    
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ error: 'Passenger not found' });

    const tour = await Tour.findById(passenger.tourId);
    if (!tour) return res.status(404).json({ error: 'Tour not found' });

    // Update seating layout
    let layout = JSON.parse(tour.seatingLayout);
    
    // If passenger already has a seat, remove them from old seat first
    if (passenger.seatNumber) {
      for (let row of layout.rows) {
        for (let seat of row.seats) {
          if (seat.seatNumber === passenger.seatNumber) {
            seat.occupied = false;
            seat.passengerName = null;
            if (layout.occupiedSeats > 0) {
              layout.occupiedSeats--;
            }
          }
        }
      }
    }
    
    // Check if seat is available
    let seatFound = false;
    for (let row of layout.rows) {
      for (let seat of row.seats) {
        if (seat.seatNumber === seatNumber) {
          seatFound = true;
          if (seat.occupied) {
            return res.status(400).json({ error: 'Seat already occupied' });
          }
          seat.occupied = true;
          seat.passengerName = `${passenger.firstName} ${passenger.lastName}`;
          layout.occupiedSeats++;
        }
      }
    }
    
    if (!seatFound) {
      return res.status(400).json({ error: 'Seat not found' });
    }

    tour.seatingLayout = JSON.stringify(layout);
    await tour.save();

    passenger.seatNumber = seatNumber;
    const updatedPassenger = await passenger.save();
    const passengerJSON = updatedPassenger.toObject ? updatedPassenger.toObject() : updatedPassenger;
    res.json(passengerJSON);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single passenger
router.get('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ error: 'Passenger not found' });
    res.json(passenger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update passenger
router.put('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ error: 'Passenger not found' });

    const oldSeatNumber = passenger.seatNumber;
    const newSeatNumber = req.body.seatNumber;

    // If removing seat (setting to null), update tour layout
    if (oldSeatNumber && !newSeatNumber) {
      const tour = await Tour.findById(passenger.tourId);
      if (tour) {
        let layout = JSON.parse(tour.seatingLayout);
        for (let row of layout.rows) {
          for (let seat of row.seats) {
            if (seat.seatNumber === oldSeatNumber) {
              seat.occupied = false;
              seat.passengerName = null;
              if (layout.occupiedSeats > 0) {
                layout.occupiedSeats--;
              }
            }
          }
        }
        tour.seatingLayout = JSON.stringify(layout);
        await tour.save();
      }
    }

    const updatedPassenger = await Passenger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    const passengerJSON = updatedPassenger.toObject ? updatedPassenger.toObject() : updatedPassenger;
    res.json(passengerJSON);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete passenger
router.delete('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) return res.status(404).json({ error: 'Passenger not found' });

    const tour = await Tour.findById(passenger.tourId);
    if (tour) {
      await Tour.findByIdAndUpdate(passenger.tourId, { $inc: { totalPassengers: -1 } });
    }

    await Passenger.findByIdAndDelete(req.params.id);
    res.json({ message: 'Passenger deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
