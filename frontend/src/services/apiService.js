// src/services/apiService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const setAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Search flights
export const searchFlights = async (origin, destination, departureDate, adults) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/flights`, {
      params: { 
        origin, 
        destination, 
        departureDate, 
        adults // Send the number of adults to the API
      },
      ...setAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error searching for flights', error.response?.data || error.message);
    throw new Error('Failed to search flights');
  }
};

// Search hotels
export const searchHotels = async (cityCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings/hotels`, {
      params: { cityCode },
      ...setAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error searching for hotels', error.response?.data || error.message);
    throw new Error('Failed to search hotels');
  }
};

// Book a flight
export const bookFlight = async (flightOffer, travelers) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/bookings/flight`, {
      data: {
        flightOffers: [flightOffer],
        travelers: travelers,
      },
    }, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error booking flight:', error.response?.data || error.message);
    throw new Error('Failed to book flight');
  }
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error.response?.data || error.message);
    throw new Error('Failed to cancel booking');
  }
};

// Get all bookings
export const getBookings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bookings`, setAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings', error.response?.data || error.message);
    throw new Error('Failed to fetch bookings');
  }
};

export default {
  searchFlights,
  searchHotels,
  bookFlight,
  cancelBooking,
  getBookings
};
