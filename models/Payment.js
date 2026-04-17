const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'upi'], required: true },
  transactionId: { type: String },
  notes: { type: String },
  paymentDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
