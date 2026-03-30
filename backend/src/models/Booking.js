const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  location:    { type: String, required: true },
  checkin:     { type: Date, required: true },
  checkout:    { type: Date, required: true },
  guests:      { type: Number, required: true, min: 1 },
  roomType:    { type: String, enum: ['Standard', 'Deluxe', 'Suite', 'Villa'], required: true },
  totalPrice:  { type: String, required: true },
  status:      { type: String, default: 'Confirmed' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
