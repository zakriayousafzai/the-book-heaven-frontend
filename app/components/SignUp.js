'use client';

import React, { useState } from 'react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

    // TODO: Implement your sign-up logic here (e.g., API call)
    console.log('Signing up with:', { name, email, password });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="bg-surface shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 className="block text-textPrimary text-center text-xl font-bold mb-6">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-textSecondary text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-textPrimary leading-tight focus:outline-none focus:shadow-outline bg-background"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          />
        </div>
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
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-primary hover:bg-accent hover:text-background text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
          <a className="inline-block align-baseline font-bold text-sm text-primary hover:text-accent" href="/login">
            Login to existing account
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignUp;