const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['5s', '6s'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  userEmail: {
    type: String,
    required: true, 
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf', 
    required: true,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
