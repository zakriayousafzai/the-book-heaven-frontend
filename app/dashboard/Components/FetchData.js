"use client";

import React, { useState, useEffect, useCallback } from "react";
import BookGrid from "@/app/components/BookGrid";
import axios from "axios";
import { getToken } from "@clerk/nextjs";
import BookLoading from "@/app/components/BookLoading";

const FetchData = ({userName}) => {
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const token = await getToken();

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userName}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            console.log(response.data);
            setRecommendedBooks(response.data.recommendedBooks || []);
            setFavoriteBooks(response.data.favoriteBooks || []);

        } catch (err) {
            console.error("Error fetching recommended books:", err);
            setRecommendedBooks([]);
            setFavoriteBooks([]);
        } finally {
            setLoading(false);
        }
    }, [userName]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <BookLoading size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Favorites Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-xl font-bold tracking-tight text-textPrimary">
                        Favorite Books
                    </h2>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        {favoriteBooks.length} titles
                    </span>
                </div>
                {favoriteBooks.length > 0 ? (
                    <BookGrid bookData={favoriteBooks} />
                ) : (
                    <p className="text-textSecondary text-sm italic py-4">
                        No favorite books added yet.
                    </p>
                )}
            </div>

            {/* Recommendations Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h2 className="text-xl font-bold tracking-tight text-textPrimary">
                        Recommended Books
                    </h2>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        {recommendedBooks.length} titles
                    </span>
                </div>
                {recommendedBooks.length > 0 ? (
                    <BookGrid bookData={recommendedBooks} />
                ) : (
                    <p className="text-textSecondary text-sm italic py-4">
                        No books recommended yet.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FetchData;
