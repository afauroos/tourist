// src/components/FlightSearch.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import apiService from '../services/apiService'; 

const FlightSearch = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1); 
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); 

  const handleSearch = async () => {
    try {
      const result = await apiService.searchFlights(origin, destination, departureDate, adults);
      console.log('Flights data:', result);
      if (result.length === 0) {
        setError('No flights found for the selected criteria.');
      } else {
        setFlights(result);
        setError('');
      }
    } catch (error) {
      console.error('Error searching for flights:', error);
      setError('Failed to search flights. Please try again.');
    }
  };

  const selectFlight = (flight) => {
    // Store the selected flight and redirect to booking
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    navigate('/book-flight');
  };

  return (
    <div>
      <h1>Search Flights</h1>
      <form>
        <label>Origin:</label>
        <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <label>Destination:</label>
        <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <label>Departure Date:</label>
        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
        <label>Adults:</label>
        <input 
          type="number" 
          value={adults} 
          onChange={(e) => setAdults(parseInt(e.target.value))} 
          min="1" 
          max="10" 
        />
        <button type="button" onClick={handleSearch}>Search Flights</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {flights.length > 0 && (
        <div>
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight, index) => (
              <li key={index}>
                <p><strong>Flight Number:</strong> {flight.itineraries[0].segments[0].carrierCode}-{flight.itineraries[0].segments[0].number}</p>
                <p><strong>Departure:</strong> {flight.itineraries[0].segments[0].departure.at} (from {flight.itineraries[0].segments[0].departure.iataCode}, Terminal {flight.itineraries[0].segments[0].departure.terminal || 'N/A'})</p>
                <p><strong>Arrival:</strong> {flight.itineraries[0].segments[0].arrival.at} (at {flight.itineraries[0].segments[0].arrival.iataCode}, Terminal {flight.itineraries[0].segments[0].arrival.terminal || 'N/A'})</p>
                <p><strong>Duration:</strong> {flight.itineraries[0].duration}</p>
                <p><strong>Price:</strong> {flight.price.total} {flight.price.currency}</p>
                <button onClick={() => selectFlight(flight)}>Select Flight</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
