const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  idType: { type: String, enum: ['Aadhar', 'PAN', 'Passport', 'License'], required: true },
  idNumber: { type: String, required: true },
  age: { type: Number, required: true },
  seatNumber: { type: String }, // Seat assignment
  amountPaid: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'completed'], default: 'pending' },
  specialRequirements: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Passenger', passengerSchema);
