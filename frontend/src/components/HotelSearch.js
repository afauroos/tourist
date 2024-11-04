// src/components/HotelSearch.js

import React, { useState } from 'react';
import { searchHotels } from '../services/apiService';

const HotelSearch = () => {
  const [cityCode, setCityCode] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await searchHotels(cityCode);
      setResults(data);
      setError('');
    } catch (error) {
      setError('Failed to search hotels. Please try again.');
      console.error('Error searching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Hotels</h2>
      <input
        type="text"
        placeholder="City Code (e.g., PAR for Paris)"
        value={cityCode}
        onChange={(e) => setCityCode(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {results.map((hotel, index) => (
              <li key={index}>
                <strong>{hotel.hotel.name}</strong> - {hotel.hotel.address.lines.join(', ')}, {hotel.hotel.address.cityName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
