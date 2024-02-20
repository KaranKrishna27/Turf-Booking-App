import React from 'react';

const UserBookings = ({ bookings }) => (
  <div>
    <h2>Your Bookings</h2>
    {bookings.map((booking) => (
      <div key={booking._id} className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Booking Details</h5>
          <p className="card-text">Booking ID: {booking._id}</p>
          <p className="card-text">User Email: {booking.userEmail}</p>
          <p className="card-text">Start Time: {booking.startTime}</p>
          <p className="card-text">End Time: {booking.endTime}</p>
          <p className="card-text">Type: {booking.type}</p>
          <p className="card-text">TurfID: {booking.turfId}</p>
          <p className="card-text">Date: {booking.bookingDate}</p>
        </div>
      </div>
    ))}
  </div>
);

export default UserBookings;
