'use client'
import React, { useState, useContext, useEffect, useCallback, use } from 'react'
import { BooksContext } from '@/app/ContextAPI/booksAPI'
import { AuthContext } from '@/app/ContextAPI/AuthContextApi'
import BookCard from '@/app/components/BookCard'
import BookGrid from '@/app/components/BookGrid'
import axios from 'axios'
import { FavoriteContext } from '@/app/ContextAPI/FavoriteContext'

const ProfilePage = () => {
    const { favoritesData } = useContext(FavoriteContext);
    const { userId, userName, email, logout } = useContext(AuthContext);
    const { booksData } = useContext(BooksContext);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);

    const fetchFavoriteBooks = useCallback(async () => {
        const filtered = booksData.filter(book => favoritesData.some(fav => fav.bookId === book._id));
        setFavoriteBooks(filtered);
    }, [booksData, favoritesData]);

    const fetchRecommendedBooks = useCallback(async () => {
        const filtered = booksData.filter(book => book.userId == userId);
        setRecommendedBooks(filtered);
    }, [booksData, userId]);

    useEffect(() => {
        fetchRecommendedBooks();
        fetchFavoriteBooks();
    }, [fetchRecommendedBooks, fetchFavoriteBooks]);

    console.log('recommendedBooks', recommendedBooks, booksData, userId)

    const renderUserDetails = () => (
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <div className="flex justify-between gap-6">

                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{userName}</h2>
                    <p className="text-text-secondary">{email}</p>
                </div>

                <button
                    className="bg-red-500 text-white px-4  rounded transition-colors hover:bg-red-600"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {renderUserDetails()}

            <div className="mb-6">
                <div className="bg-surface rounded-lg border border-border p-6">
                    <h1 className="text-2xl mb-3">Your Favorites!</h1>
                    <BookGrid bookData={favoriteBooks} />

                </div>
            </div>

            <div className="mb-6">
                <div className="bg-surface rounded-lg border border-border p-6">
                    <h1 className="text-2xl mb-3">Books you Recommended!</h1>
                    <BookGrid bookData={recommendedBooks} />

                </div>
            </div>


        </div>
    )
}

export default ProfilePage