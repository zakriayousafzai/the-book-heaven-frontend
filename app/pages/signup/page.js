import React from 'react'
import SignUp from '@/app/components/SignUp'

/**
 * SignUp Page
 *
 * Renders the signup page component with proper layout
 * Uses the SignUp component for user registration functionality
 */
const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <SignUp />
      </div>
    </div>
  )
}

export default SignUpPage
