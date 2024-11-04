// src/screens/PaymentScreen.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentScreen = () => {
  const { state } = useLocation();
  const { flightId, amount } = state; // Ensure 'amount' is passed correctly
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/payment/create-payment-intent', {
          amount: parseFloat(amount), // Make sure to pass the correct amount
          currency: 'eur', // Ensure the currency matches your setup
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error fetching payment intent:', error);
        alert('Failed to initiate payment. Please try again.');
      }
    };
    if (amount) fetchPaymentIntent();
  }, [amount]);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: 'customer@example.com',
        },
      },
    });

    if (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please check your card details and try again.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment successful:', paymentIntent);
      
      // Trigger flight booking upon successful payment
      try {
        const bookingResponse = await axios.post('http://localhost:4000/api/bookings/flight', { flightId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

        console.log('Flight booked successfully:', bookingResponse.data);
        alert('Flight booked successfully!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error booking flight:', error);
        alert('Payment was successful, but failed to book the flight. Please contact support.');
      }
    }
  };

  return (
    <div>
      <h3>Enter your payment details</h3>
      <form onSubmit={handlePayment}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;
