'use client'
import React, { useState, useContext, useEffect, useCallback, use } from 'react'
import { BooksContext } from '@/app/ContextAPI/booksAPI'
import BookGrid from '@/app/components/BookGrid'

const PublicProfile = ({params}) => {
    const param = use(params);
    const { booksData } = useContext(BooksContext);
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const fetchRecommendedBooks = useCallback(() => {
        const filtered = booksData.filter(book => book.userName === param.username);
        setRecommendedBooks(filtered);
    }, [booksData, param.username]);

    useEffect(() => {
        fetchRecommendedBooks();
    }, [fetchRecommendedBooks])

    const renderUserDetails = () => (
        <div className="bg-surface rounded-lg border border-border p-6 mb-6">
            <div className="flex justify-between gap-6">

                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Username: {param.username}</h2>
                </div>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {renderUserDetails()}

            <div className="mb-6">
                <div className="bg-surface rounded-lg border border-border p-6">
                <h1 className="text-2xl mb-3">Recommended books!</h1>
                    <BookGrid bookData={recommendedBooks}/>

                </div>
            </div>
        </div>
    )
}

export default PublicProfile