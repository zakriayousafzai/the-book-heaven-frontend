'use client'
import React, { useState, useContext, useEffect, useCallback, use } from 'react'
import { BooksContext } from '@/app/ContextAPI/booksAPI'
import { AuthContext } from '@/app/ContextAPI/AuthContextApi'
import BookCard from '../components/BookCard'
import BookGrid from '../components/BookGrid'

const ProfilePage = () => {
    const { userId, userName, email, logout } = useContext(AuthContext);
    const { booksData } = useContext(BooksContext);
    const [activeTab, setActiveTab] = useState('recommended');
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const fetchRecommendedBooks = useCallback(() => {
        const filtered = booksData.filter(book => book.userId == userId);
        setRecommendedBooks(filtered);
    }, [booksData, userId]);

    useEffect(() => {
        fetchRecommendedBooks();
    }, [fetchRecommendedBooks])

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

    const renderFavorites = () => (
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-text-primary">Favorite Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* {DummyData.favoriteBooks.map(book => renderBookCard(book))} */}
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {renderUserDetails()}

            <div className="mb-6">
                <div className="bg-surface rounded-lg border border-border p-6">
                <h1 className="text-2xl mb-3">Books you Recommended!</h1>
                    <BookGrid bookData={recommendedBooks}/>

                </div>
            </div>

            {renderFavorites()}
        </div>
    )
}

export default ProfilePage