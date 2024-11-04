// src/components/TransferSearch.js

import React, { useState } from 'react';

const TransferSearch = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // Replace this part with actual logic or leave it blank for now
    setError('Search function not implemented');
  };

  return (
    <div>
      <h2>Search Transfers</h2>
      <input
        type="text"
        placeholder="Start Location Code (e.g., CDG for Charles de Gaulle)"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination Address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default TransferSearch;
