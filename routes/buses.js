const express = require('express');
const Bus = require('../models/Bus');
const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new bus
router.post('/', async (req, res) => {
  try {
    const { busNumber, busName, busType, totalSeats, contactNumber, busOwner } = req.body;
    
    const newBus = new Bus({
      busNumber,
      busName,
      busType,
      totalSeats,
      contactNumber,
      busOwner
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single bus
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update bus
router.put('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete bus
router.delete('/:id', async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
