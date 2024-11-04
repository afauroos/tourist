// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FlightSearch from './components/FlightSearch';
import HotelSearch from './components/HotelSearch';
import TransferSearch from './components/TransferSearch';
import FlightBooking from './components/FlightBooking';
import ManageBookings from './components/ManageBookings';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import PaymentScreen from './screens/PaymentScreen';

// Load Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  const [user, setUser] = useState(null);

  // Monitor Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('token', currentUser.accessToken); // Store token in localStorage
      } else {
        setUser(null);
        localStorage.removeItem('token'); // Clear token if logged out
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Private routes */}
          <Route path="/dashboard" element={<PrivateRoute user={user}><Dashboard /></PrivateRoute>} />
          <Route path="/flights" element={<PrivateRoute user={user}><FlightSearch /></PrivateRoute>} />
          <Route path="/hotels" element={<PrivateRoute user={user}><HotelSearch /></PrivateRoute>} />
          <Route path="/transfers" element={<PrivateRoute user={user}><TransferSearch /></PrivateRoute>} />
          <Route path="/book-flight" element={<PrivateRoute user={user}><FlightBooking /></PrivateRoute>} />
          <Route path="/manage-bookings" element={<PrivateRoute user={user}><ManageBookings /></PrivateRoute>} />
          
          {/* Stripe payment route */}
          <Route path="/payment" element={<PrivateRoute user={user}><PaymentScreen /></PrivateRoute>} />
        </Routes>
      </Elements>
    </Router>
  );
};

export default App;
