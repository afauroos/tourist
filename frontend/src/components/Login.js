import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure your firebaseConfig is correct
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setError(''); // Clear error state before a new login attempt

    // Basic validation for email and password
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Authenticate with Firebase using email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, user:", userCredential.user);

      // Fetch the Firebase ID token
      const token = await userCredential.user.getIdToken(); // Get Firebase ID token
      console.log('Firebase ID token:', token);

      // Send the Firebase ID token to your backend for verification
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the Firebase ID token in the body
      });

      // Check if the backend response was successful
      if (!response.ok) {
        throw new Error('Failed to login with the backend');
      }

      // Extract the backend's JWT token or any response you need
      const data = await response.json();
      console.log('Backend login response:', data);

      // Save the backend JWT token or other data in localStorage
      localStorage.setItem('token', data.token); // Assuming your backend responds with its own JWT

      // Stop loading and redirect to the dashboard
      setLoading(false);
	  // Check if navigate is working as expected
      console.log('Redirecting to /dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error: ", err);
      setError(`Failed to login: ${err.message}`);
      setLoading(false); // Stop loading if there's an error
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
