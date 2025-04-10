'use client';

import React, { useState, useContext } from 'react';
import { AuthContext } from '../ContextAPI/AuthContextApi';

/**
 * SignUp Component
 * Handles new user registration with validation
 *
 * Features:
 * - Username validation (letters only)
 * - Email validation
 * - Password confirmation
 * - Error handling and display
 * - Auto-login after successful registration
 */
const SignUp = () => {

  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  /**
   * Validates username format
   * Only allows letters (no spaces, numbers, or special characters)
   *
   * @param {string} name - Username to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);

    if (!validateName(newName)) {
      setNameError('Username should only contain letters without spaces or special characters');
    } else {
      setNameError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNameError('');

    if (!validateName(name)) {
      setNameError('Username should only contain letters without spaces or special characters');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
      <form
        onSubmit={handleSubmit}
        className="bg-surface shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm"
        aria-labelledby="signup-heading"
      >
        <h2 id="signup-heading" className="block text-textPrimary text-center text-xl font-bold mb-6">Sign Up</h2>

        {/* Username field with validation */}
        <div className="mb-4">
          <label
            className="block text-textSecondary text-sm font-bold mb-2"
            htmlFor="name"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-textPrimary leading-tight focus:outline-none focus:shadow-outline bg-background"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            aria-required="true"
          />
          {nameError && (
            <p
              className="text-red-500 text-xs italic mt-1"
              role="alert"
              aria-live="polite"
            >
              {nameError}
            </p>
          )}
        </div>
        {/* Email field */}
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
            aria-required="true"
            aria-label="Email address"
          />
        </div>
        {/* Password field */}
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
            aria-required="true"
            aria-label="Password"
          />
        </div>
        {/* Confirm Password field */}
        <div className="mb-6">
          <label className="block text-textSecondary text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-textPrimary mb-3 leading-tight focus:outline-none focus:shadow-outline bg-background"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-required="true"
            aria-label="Confirm password"
          />
        </div>

        {/* Submit and login link */}
        <div className="flex items-center justify-between">
          <button
            className="bg-primary hover:bg-accent hover:text-background text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            aria-label="Create new account"
          >
            Sign Up
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-primary hover:text-accent"
            href="/login"
            aria-label="Sign in to existing account"
          >
            Login to existing account
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignUp;