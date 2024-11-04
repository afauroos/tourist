import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PaymentScreen from '../screens/PaymentScreen'; // Import the PaymentScreen

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingError, setBookingError] = useState(null);
  const [flightDetails, setFlightDetails] = useState(null); // To store flight details to pass to payment screen
  const [isPaying, setIsPaying] = useState(false); // Toggle between dashboard and payment screen

  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if no token
    } else {
      axios
        .get('http://localhost:4000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data); // Set the user data
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          navigate('/login'); // Redirect to login if token is invalid
        });
    }
  }, [navigate]);

  // Fetch user's bookings
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:4000/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBookings(response.data);
        })
        .catch((error) => {
          console.error('Error fetching bookings:', error);
          setBookingError('Failed to fetch bookings.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Function to handle flight confirmation and initiate payment
  const handleFlightConfirmation = (flightDetails) => {
    setFlightDetails(flightDetails);
    setIsPaying(true); // Toggle to the payment screen
  };

  // Function to handle successful payment
  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      // Make the final flight booking after successful payment
      const { data } = await axios.post('http://localhost:4000/api/bookings/complete-booking', {
        paymentIntentId,
        flightDetails,
        customerDetails: { email: user.email }, // Pass user details
      });
      console.log('Booking successful:', data);
      setIsPaying(false); // Go back to dashboard
    } catch (error) {
      console.error('Error completing booking:', error);
      setBookingError('Booking failed after payment.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  // Toggle between payment screen and dashboard
  if (isPaying) {
    return (
      <PaymentScreen flightDetails={flightDetails} onSuccess={handlePaymentSuccess} />
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.name || user.email}</p>

      <div>
        <h3>Search Options</h3>
        <ul>
          <li><Link to="/flights">Search Flights</Link></li>
          <li><Link to="/hotels">Search Hotels</Link></li>
          <li><Link to="/transfers">Search Transfers</Link></li>
        </ul>
      </div>

      <div>
        <h3>Your Bookings</h3>
        {bookingError ? (
          <p style={{ color: 'red' }}>{bookingError}</p>
        ) : bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking._id}>
                {booking.details || booking.flightId || 'No details available'}
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no bookings.</p>
        )}
      </div>

      <button onClick={() => handleFlightConfirmation({ flightId: '123', price: 318.88, email: user.email })}>
        Confirm Flight and Pay
      </button>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
