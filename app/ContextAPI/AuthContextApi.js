'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import BookLoading from '../components/BookLoading';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the application
 *
 * @typedef {Object} AuthContextType
 * @property {string|null} userName - User's display name
 * @property {string|null} email - User's email address
 * @property {string|null} token - Authentication token
 * @property {string|null} userRole - User's role (e.g., 'admin', 'user')
 * @property {string|null} userId - User's unique identifier
 * @property {boolean} isAuthenticated - Authentication status
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message if any
 * @property {Function} login - Login function
 * @property {Function} logout - Logout function
 * @property {Function} clearAuth - Clear authentication state
 */

export const AuthContext = createContext({
    userName: null,
    email: null,
    token: null,
    userRole: null,
    userId: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    login: () => { },
    logout: () => { },
    clearAuth: () => { },
});

// Create the Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);
    const [email, setEmail] = useState(null);
    const [token, setTokenState] = useState(null);
    const [userRole, setUserRoleState] = useState(null);
    const [userId, setUserIdState] = useState(null);
    const [isAuthenticated, setIsAuthenticatedState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to set auth state and store in localStorage
    const setAuthState = useCallback((authToken, role, id, userName, email) => {
        try {
            setUserName(userName);
            setEmail(email);
            setTokenState(authToken);
            setUserRoleState(role);
            setUserIdState(id);
            setIsAuthenticatedState(true);
            localStorage.setItem('userName', userName);
            localStorage.setItem('email', email);
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', id);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to save authentication state');
            console.error('Auth state error:', err);
        }
    }, []);

    // Login function to be exposed through the context
    const login = useCallback(async (authToken, role, id, userName, email) => {
        try {
            setLoading(true);
            await setAuthState(authToken, role, id, userName, email);
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }, [setAuthState]);

    // Logout function to be exposed through the context
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            setUserName(null);
            setEmail(null);
            setTokenState(null);
            setUserRoleState(null);
            setUserIdState(null);
            setIsAuthenticatedState(false);
            localStorage.removeItem('userName');
            localStorage.removeItem('email');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            setError(null);
            window.location.href = "/";
        } catch (err) {
            setError('Logout failed. Please try again.');
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to clear auth state and localStorage (useful for error handling/cleanup)
    const clearAuth = useCallback(() => {
        setUserName(null);
        setEmail(null);
        setTokenState(null);
        setUserRoleState(null);
        setUserIdState(null);
        setIsAuthenticatedState(false);
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    }, []);


    // useEffect to check for token on initial load (when app starts or refreshes)
    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('email');
        const storedToken = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');

        if (storedToken && storedRole && storedUserId && storedUserName && storedEmail) {
            setAuthState(storedToken, storedRole, storedUserId, storedUserName, storedEmail);
        }
        setLoading(false); // Set loading to false after initial check
    }, [setAuthState]);

    const authContextValue = useMemo(() => ({
        userName,
        email,
        token,
        userRole,
        userId,
        isAuthenticated,
        login,
        logout,
        loading,
        error,
        clearAuth,
    }), [token, userRole, userId, isAuthenticated, login, logout, loading, error, clearAuth, userName, email]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <BookLoading size="lg" />
                </div>
            ) : (
                <>
                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                            role="alert"
                            aria-live="polite"
                        >
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                            <button
                                className="absolute top-0 right-0 mt-2 mr-2 text-red-700"
                                onClick={() => setError(null)}
                                aria-label="Dismiss error"
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {children}
                </>
            )}
        </AuthContext.Provider>
    );
};