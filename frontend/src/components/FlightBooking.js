// src/components/FlightBooking.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FlightBooking = () => {
  const [traveler, setTraveler] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    passportNumber: ''
  });

  const [flightData, setFlightData] = useState(null); // Hold the selected flight data
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the selected flight from localStorage
    const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));
    if (selectedFlight) {
      setFlightData(selectedFlight); // Set flight data to display
    } else {
      alert('No flight selected! Please go back to search.');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTraveler({ ...traveler, [name]: value });
  };

  const confirmFlight = async () => {
    if (!flightData) {
      alert('No flight data available for confirmation.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated.');
      return;
    }

    setLoading(true);

    const confirmationPayload = {
      data: {
        type: 'flight-offers-pricing',
        flightOffers: [flightData]
      }
    };

    try {
      const response = await axios.post('http://localhost:4000/api/flight-confirmation', confirmationPayload, {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      console.log('Flight confirmed:', response.data);
      alert('Flight confirmed! Redirecting to payment.');

      // Navigate to payment screen after confirmation
      navigate('/payment', { state: { flightId: flightData.id } });
    } catch (error) {
      console.error('Flight confirmation failed:', error.response ? error.response.data : error.message);
      alert('Failed to confirm flight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!flightData) {
    return <p>Loading selected flight details...</p>;
  }

  return (
    <div>
      <h2>Flight Booking</h2>
      <p><strong>Flight Number:</strong> {flightData.itineraries[0].segments[0].carrierCode}-{flightData.itineraries[0].segments[0].number}</p>
      <p><strong>Departure:</strong> {new Date(flightData.itineraries[0].segments[0].departure.at).toLocaleString()} from {flightData.itineraries[0].segments[0].departure.iataCode}</p>
      <p><strong>Arrival:</strong> {new Date(flightData.itineraries[0].segments[0].arrival.at).toLocaleString()} at {flightData.itineraries[0].segments[0].arrival.iataCode}</p>
      <p><strong>Price:</strong> {flightData.price.total} {flightData.price.currency}</p>

      <div>
        <label>First Name: </label>
        <input type="text" name="firstName" value={traveler.firstName} onChange={handleInputChange} />
      </div>
      <div>
        <label>Last Name: </label>
        <input type="text" name="lastName" value={traveler.lastName} onChange={handleInputChange} />
      </div>
      <div>
        <label>Birth Date: </label>
        <input type="date" name="birthDate" value={traveler.birthDate} onChange={handleInputChange} />
      </div>
      <div>
        <label>Email: </label>
        <input type="email" name="email" value={traveler.email} onChange={handleInputChange} />
      </div>
      <div>
        <label>Passport Number: </label>
        <input type="text" name="passportNumber" value={traveler.passportNumber} onChange={handleInputChange} />
      </div>

      <button onClick={confirmFlight} disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Flight and Pay'}
      </button>
    </div>
  );
};

export default FlightBooking;
