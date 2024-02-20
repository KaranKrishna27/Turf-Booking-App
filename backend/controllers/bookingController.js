const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');

const getBookingsByDate = asyncHandler(async (req, res) => {
  try {
    const { date, turfId } = req.query;


    if (!date || !turfId) {
        return res.status(400).json({ message: 'Date and turfId parameters are required' });
    }

    const selectedDate = new Date(date);

    selectedDate.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({ bookingDate: date, turfId: turfId });

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const createBooking = asyncHandler(async (req, res) => {
  try {
    const { startTime, endTime, type, userId, userEmail, bookingDate, turfId } = req.body;
    
    const existingBooking = await Booking.findOne({
      $and: [
        { turfId: turfId },
        { bookingDate: bookingDate },
        {
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { startTime: { $eq: startTime }, endTime: { $eq: endTime } }, 
          ],
        },
      ],
    });

    if (existingBooking) {

      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    const newBooking = await Booking.create({ startTime, endTime, type, userId, userEmail, bookingDate, turfId });

    res.status(201).json({ message: 'Booking successful',bookingId: newBooking._id, booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
});

const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;


    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
};

const getAllBookings = async (req, res) => {
  try {

    const { userId } = req.query;

    let userBookings;
    if (userId) {

      userBookings = await Booking.find({ userId });
    } else {

      userBookings = await Booking.find();
    }


    res.json({ bookings: userBookings });
  } catch (error) {

    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  getBookingsByDate,
  getAllBookings
};
