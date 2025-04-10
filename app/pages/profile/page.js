'use client'

import React, { useState, useContext, useEffect, useCallback } from 'react'
import { BooksContext } from '@/app/ContextAPI/booksAPI'
import { AuthContext } from '@/app/ContextAPI/AuthContextApi'
import BookGrid from '@/app/components/BookGrid'
import { FavoriteContext } from '@/app/ContextAPI/FavoriteContext'
import BookLoading from '@/app/components/BookLoading'

/**
 * ProfilePage Component
 * Displays user profile information, favorite books, and recommended books
 */
const ProfilePage = () => {
    // Context values
    const { favoritesData } = useContext(FavoriteContext);
    const { userId, userName, email, logout } = useContext(AuthContext);
    const { booksData } = useContext(BooksContext);

    // Component state
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches and filters user's favorite books
     */
    const fetchFavoriteBooks = useCallback(async () => {
        try {
            const filtered = booksData.filter(book =>
                favoritesData.some(fav => fav.bookId === book._id)
            );
            setFavoriteBooks(filtered);
            setError(null);
        } catch (err) {
            console.error('Error fetching favorite books:', err);
            setError('Failed to load favorite books');
        }
    }, [booksData, favoritesData]);

    /**
     * Fetches and filters books recommended by the user
     */
    const fetchRecommendedBooks = useCallback(async () => {
        try {
            const filtered = booksData.filter(book => book.userId === userId);
            setRecommendedBooks(filtered);
            setError(null);
        } catch (err) {
            console.error('Error fetching recommended books:', err);
            setError('Failed to load recommended books');
        }
    }, [booksData, userId]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchRecommendedBooks(),
                fetchFavoriteBooks()
            ]);
            setLoading(false);
        };

        fetchData();
    }, [fetchRecommendedBooks, fetchFavoriteBooks]);

    /**
     * Renders user profile information section
     */
    const renderUserDetails = () => (
        <div
            className="bg-surface rounded-lg border border-border p-6 mb-6"
            role="region"
            aria-label="User profile information"
        >
            <div className="flex justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{userName}</h2>
                    <p className="text-text-secondary">{email}</p>
                </div>

                <button
                    className="bg-red-500 text-white px-4 rounded transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={logout}
                    aria-label="Logout from your account"
                >
                    Logout
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BookLoading size="lg" />
            </div>
        );
    }

    return (
        <div
            className="container mx-auto px-4 py-8"
            role="main"
            aria-label="User profile page"
        >
            {renderUserDetails()}

            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                    role="alert"
                    aria-live="polite"
                >
                    {error}
                </div>
            )}

            <div className="mb-6">
                <div
                    className="bg-surface rounded-lg border border-border p-6"
                    role="region"
                    aria-label="Your favorite books"
                >
                    <h2 className="text-2xl mb-3">Your Favorites ({favoriteBooks.length})</h2>
                    {favoriteBooks.length > 0 ? (
                        <BookGrid bookData={favoriteBooks} />
                    ) : (
                        <p className="text-textSecondary">No favorite books yet.</p>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <div
                    className="bg-surface rounded-lg border border-border p-6"
                    role="region"
                    aria-label="Books you recommended"
                >
                    <h2 className="text-2xl mb-3">Books you Recommended ({recommendedBooks.length})</h2>
                    {recommendedBooks.length > 0 ? (
                        <BookGrid bookData={recommendedBooks} />
                    ) : (
                        <p className="text-textSecondary">You haven&apos;t recommended any books yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;