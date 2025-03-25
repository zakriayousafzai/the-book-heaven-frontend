'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../ContextAPI/AuthContextApi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        
        const token = data.token;
        const role = data.role;
        const userId = data.userId;
        const userName = data.userName;
        const userEmail = data.email;

        login(token, role, userId, userName, userEmail);

        console.log('Login successful:', data);
        window.location.href = "/"; // Redirect to dashboard
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid email or password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="bg-surface shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 className="block text-textPrimary text-center text-xl font-bold mb-6">Sign In</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-textSecondary text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-textPrimary leading-tight focus:outline-none focus:shadow-outline bg-background"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-textSecondary text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-textPrimary mb-3 leading-tight focus:outline-none focus:shadow-outline bg-background"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-primary hover:bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:text-background"
            type="submit"
          >
            Sign In
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-primary hover:text-accent" href="/signup">
            Create an Account
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;