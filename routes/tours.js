const express = require('express');
const Tour = require('../models/Tour');
const Bus = require('../models/Bus');
const router = express.Router();

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find().populate('busId');
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new tour
router.post('/', async (req, res) => {
  try {
    const { tourName, startDate, endDate, busId, departureLocation, destinationLocation, pricePerSeat } = req.body;
    
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    // Initialize seating layout based on bus type
    const seatingLayout = initializeSeats(bus.busType, bus.totalSeats);

    const newTour = new Tour({
      tourName,
      startDate,
      endDate,
      busId,
      departureLocation,
      destinationLocation,
      pricePerSeat,
      seatingLayout: JSON.stringify(seatingLayout)
    });

    const savedTour = await newTour.save();
    res.status(201).json(await savedTour.populate('busId'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('busId');
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tour
router.put('/:id', async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('busId');
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete tour
router.delete('/:id', async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to initialize seat layout
function initializeSeats(busType, totalSeats) {
  const layout = {
    busType,
    totalSeats,
    rows: [],
    occupiedSeats: 0
  };

  let seatCounter = 1;

  // Handle sleeper bus types
  if (busType === 'Sleeper 2x2' || busType === 'Sleeper 2 Floors') {
    // Create 8 rows with seats organized by position
    const numRows = 8;
    for (let row = 1; row <= numRows; row++) {
      layout.rows[row - 1] = {
        rowNumber: row,
        seats: []
      };

      // Left side Upper berth
      layout.rows[row - 1].seats.push({
        seatNumber: `${row}U1`,
        occupied: false,
        passengerName: null,
        berth: 'Upper',
        position: 'left'
      });
      
      // Right side Upper berth
      layout.rows[row - 1].seats.push({
        seatNumber: `${row}U2`,
        occupied: false,
        passengerName: null,
        berth: 'Upper',
        position: 'right'
      });

      // Left side Lower berth
      layout.rows[row - 1].seats.push({
        seatNumber: `${row}L1`,
        occupied: false,
        passengerName: null,
        berth: 'Lower',
        position: 'left'
      });
      
      // Right side Lower berth
      layout.rows[row - 1].seats.push({
        seatNumber: `${row}L2`,
        occupied: false,
        passengerName: null,
        berth: 'Lower',
        position: 'right'
      });
    }
  } else {
    // Fallback for other bus types (if any)
    let columnsPerRow;
    switch(busType) {
      case '2x1':
        columnsPerRow = 3;
        break;
      case '2x2':
        columnsPerRow = 4;
        break;
      case '3x2':
        columnsPerRow = 5;
        break;
      case '2x3':
        columnsPerRow = 5;
        break;
      default:
        columnsPerRow = 4;
    }

    const numRows = Math.ceil(totalSeats / (columnsPerRow - 1));

    for (let row = 1; row <= numRows && seatCounter <= totalSeats; row++) {
      layout.rows[row - 1] = {
        rowNumber: row,
        seats: []
      };

      const leftSeats = busType.split('x')[0];
      for (let i = 0; i < parseInt(leftSeats); i++) {
        if (seatCounter <= totalSeats) {
          layout.rows[row - 1].seats.push({
            seatNumber: `${row}A${i + 1}`,
            occupied: false,
            passengerName: null
          });
          seatCounter++;
        }
      }

      layout.rows[row - 1].seats.push({ aisle: true });

      const rightSeats = busType.split('x')[1];
      for (let i = 0; i < parseInt(rightSeats); i++) {
        if (seatCounter <= totalSeats) {
          layout.rows[row - 1].seats.push({
            seatNumber: `${row}B${i + 1}`,
            occupied: false,
            passengerName: null
          });
          seatCounter++;
        }
      }
    }
  }

  return layout;
}

// Fix duplicate seat assignments for a tour
router.post('/:id/fix-seats', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ error: 'Tour not found' });

    // Get all passengers for this tour
    const Passenger = require('../models/Passenger');
    const passengers = await Passenger.find({ tourId: req.params.id });

    // Rebuild the entire layout from scratch
    let layout = JSON.parse(tour.seatingLayout);
    
    // Clear all seats
    for (let row of layout.rows) {
      for (let seat of row.seats) {
        seat.occupied = false;
        seat.passengerName = null;
      }
    }
    layout.occupiedSeats = 0;

    // Re-assign based on actual passenger data
    for (let passenger of passengers) {
      if (passenger.seatNumber) {
        let found = false;
        for (let row of layout.rows) {
          for (let seat of row.seats) {
            if (seat.seatNumber === passenger.seatNumber) {
              seat.occupied = true;
              seat.passengerName = `${passenger.firstName} ${passenger.lastName}`;
              layout.occupiedSeats++;
              found = true;
            }
          }
        }
        // If passenger has invalid seat, remove it
        if (!found) {
          await Passenger.findByIdAndUpdate(passenger._id, { seatNumber: null });
        }
      }
    }

    tour.seatingLayout = JSON.stringify(layout);
    await tour.save();

    res.json({ message: 'Seats fixed successfully', occupiedSeats: layout.occupiedSeats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
