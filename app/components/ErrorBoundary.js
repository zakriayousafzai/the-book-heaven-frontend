'use client';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 *
 * Key features:
 * - Prevents the entire app from crashing when errors occur
 * - Provides a user-friendly error message
 * - Includes a retry mechanism
 * - Logs errors for debugging
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state when an error occurs
   * This is called during the "render" phase, so side-effects are not allowed
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error
    };
  }

  /**
   * Called when an error occurs in the child component tree
   * Use this method for error logging or reporting
   *
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace information
   */
  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    console.error('Error details:', {
      error: error,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background" role="alert">
          <div className="bg-surface p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-textPrimary mb-4">
              Something went wrong
            </h2>
            <p className="text-textSecondary mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                // Reset error state and refresh the page
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              aria-label="Retry loading the application"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;