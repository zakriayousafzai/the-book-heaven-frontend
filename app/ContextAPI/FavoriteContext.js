'use client'

import { createContext, useState, useEffect, useContext, useCallback } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContextApi"

/**
 * Favorite Context
 * Manages user's favorite books state and operations
 *
 * @typedef {Object} FavoriteContextType
 * @property {Array} favoritesData - Array of user's favorite books
 * @property {Function} setFavoritesData - Function to update favorites
 */
export const FavoriteContext = createContext()

/**
 * Favorite Provider Component
 * Provides favorite books data and management functions
 * Requires authentication context for user data
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const FavoriteProvider = ({ children }) => {
    const { token, userId, isAuthenticated } = useContext(AuthContext);
    const [favoritesData, setFavoritesData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /**
     * Fetches user's favorite books from the API
     * Requires authentication and handles loading/error states
     */
    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        try {
            const favorites = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/favorite`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setFavoritesData(favorites.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch favorites. Please try again later.');
            console.error('Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    }, [token, userId, isAuthenticated])

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return (
        <FavoriteContext.Provider value={{
            favoritesData,
            setFavoritesData,
            loading,
            error,
            refetch: fetchFavorites
        }}>
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
        </FavoriteContext.Provider>
    )
}