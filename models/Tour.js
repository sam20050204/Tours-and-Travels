const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  tourName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  departureLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  pricePerSeat: { type: Number, required: true },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  totalPassengers: { type: Number, default: 0 },
  seatingLayout: { type: String }, // 'JSON representation of seat layout'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tour', tourSchema);
