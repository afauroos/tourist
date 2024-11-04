// src/components/ManageBookings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bookings when the component loads
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/bookings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is passed
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:4000/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is passed
        },
      });
      alert('Booking canceled successfully');
      setBookings(bookings.filter((booking) => booking._id !== bookingId)); // Remove canceled booking
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking.');
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div>
      <h2>Manage Your Bookings</h2>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <p>
                <strong>Flight ID:</strong> {booking.flightId} <br />
                <strong>Booking Details:</strong> {JSON.stringify(booking.bookingDetails)} <br />
                <strong>Traveler:</strong> {booking.travelers[0].name.firstName} {booking.travelers[0].name.lastName}
              </p>
              <button onClick={() => handleCancel(booking._id)}>Cancel Booking</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default ManageBookings;
