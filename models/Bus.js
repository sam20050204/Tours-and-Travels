const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  busName: { type: String, required: true },
  busType: { type: String, enum: ['Sleeper 2x2', 'Sleeper 2 Floors'], required: true },
  totalSeats: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  busOwner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bus', busSchema);
