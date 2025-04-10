'use client'

import { createContext, useState, useEffect, useContext, useCallback } from "react"
import axios from "axios"

/**
 * Books Context
 * Manages the state and operations for books data throughout the application
 *
 * @typedef {Object} Book
 * @property {string} _id - Book's unique identifier
 * @property {string} title - Book title
 * @property {string} author - Book author
 * @property {string} genre - Book genre
 * @property {string} description - Book description
 *
 * @typedef {Object} BooksContextType
 * @property {Book[]} booksData - Array of book objects
 * @property {Function} setBooksData - Function to update books data
 */
export const BooksContext = createContext()

/**
 * Books Provider Component
 * Provides books data and management functions to the application
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const BooksProvider = ({ children }) => {
    // State management for books data, loading state, and errors
    const [booksData, setBooksData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    /**
     * Fetches books data from the API
     * Updates the books state and handles loading/error states
     */
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
            setBooksData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch books. Please try again later.');
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Provide books data and management functions to children
    return (
        <BooksContext.Provider value={{
            booksData,
            setBooksData,
            loading,
            error,
            refetch: fetchBooks
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
        </BooksContext.Provider>
    )
}