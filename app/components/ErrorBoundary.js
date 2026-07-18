"use client";

import React from "react";
import PropTypes from "prop-types";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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
            error: error,
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
        console.error("Error details:", {
            error: error,
            componentStack: errorInfo.componentStack,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="min-h-screen flex items-center justify-center bg-background px-4 py-12"
                    role="alert">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 sm:p-10 rounded-2xl shadow-2xl max-w-md w-full text-center flex flex-col items-center">
                        {/* Elegant Error Icon */}
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-5">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                        </div>

                        <h2 className="text-xl font-bold text-textPrimary tracking-tight mb-2">
                            Something went wrong
                        </h2>
                        
                        <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-4">
                            System Error
                        </p>

                        <div className="w-full text-left bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl text-xs text-textSecondary font-mono leading-relaxed mb-6 max-h-[120px] overflow-y-auto break-all">
                            {this.state.error?.message || "An unexpected error occurred"}
                        </div>

                        <button
                            onClick={() => {
                                // Reset error state and refresh the page
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="w-full py-2.5 rounded-full bg-primary hover:bg-amber-700 active:scale-[0.98] text-white font-semibold text-sm transition-all"
                            aria-label="Retry loading the application">
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
