// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the user is authenticated by checking for a token in localStorage
  const isAuthenticated = localStorage.getItem('token');

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, allow access to protected routes
  return children;
};

export default PrivateRoute;
