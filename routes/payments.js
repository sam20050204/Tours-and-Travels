const express = require('express');
const Payment = require('../models/Payment');
const Passenger = require('../models/Passenger');
const Tour = require('../models/Tour');
const router = express.Router();

// Get all payments for a tour
router.get('/tour/:tourId', async (req, res) => {
  try {
    const payments = await Payment.find({ tourId: req.params.tourId }).populate('passengerId');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record payment
router.post('/', async (req, res) => {
  try {
    const { passengerId, tourId, amount, paymentMethod, transactionId, notes } = req.body;

    const newPayment = new Payment({
      passengerId,
      tourId,
      amount,
      paymentMethod,
      transactionId,
      notes
    });

    const savedPayment = await newPayment.save();

    // Update passenger payment status and amount
    const passenger = await Passenger.findById(passengerId);
    passenger.amountPaid = (passenger.amountPaid || 0) + amount;

    // Determine payment status
    const tour = await Tour.findById(tourId);
    if (passenger.amountPaid >= tour.pricePerSeat) {
      passenger.paymentStatus = 'completed';
    } else if (passenger.amountPaid > 0) {
      passenger.paymentStatus = 'partial';
    }

    await passenger.save();

    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payment details
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('passengerId tourId');
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get passenger payment summary
router.get('/passenger/:passengerId', async (req, res) => {
  try {
    const payments = await Payment.find({ passengerId: req.params.passengerId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({
      passengerId: req.params.passengerId,
      totalPaid,
      transactionCount: payments.length,
      payments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
