import React from 'react'
import Login from '@/app/components/Login'

/**
 * Login Page
 *
 * Renders the login page component with proper layout
 * Uses the Login component for authentication functionality
 */
const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Login />
      </div>
    </div>
  )
}

export default LoginPage
