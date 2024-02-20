const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const Booking = require('../models/Booking');

router.post('/', bookingController.createBooking);
router.get('/',bookingController.getBookingsByDate);
router.delete('/:id', bookingController.deleteBooking);
router.get('/all',bookingController.getAllBookings);
router.get('/', async (req, res) => {
    try {
      const { date, turfId } = req.query;
      const bookings = await Booking.find({ bookingDate: date, turfId: turfId });
      res.json({ bookings });
    } catch (error) {
      console.error('Error fetching booked time slots:', error);
      res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
    }
  });

module.exports = router;
