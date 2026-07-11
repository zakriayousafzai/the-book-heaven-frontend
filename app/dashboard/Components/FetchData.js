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
            setRecommendedBooks(response.data.recommendedBooks);
            setFavoriteBooks(response.data.favoriteBooks);

        } catch (err) {
            console.error("Error fetching recommended books:", err);
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
        <>
            <div className="mb-6">
                <div
                    className="bg-surface rounded-lg border border-border p-6"
                    role="region"
                    aria-label="Recommended books">
                    <h2 className="text-2xl mb-3">
                        Favorite Books ({favoriteBooks?.length})
                    </h2>
                    {favoriteBooks.length > 0 ? (
                        <BookGrid bookData={favoriteBooks} />
                    ) : (
                        <p className="text-textSecondary">
                            no favorite books yet
                        </p>
                    )}
                </div>
            </div>
            <div className="mb-6">
                <div
                    className="bg-surface rounded-lg border border-border p-6"
                    role="region"
                    aria-label="Recommended books">
                    <h2 className="text-2xl mb-3">
                        Recommended Books ({recommendedBooks?.length})
                    </h2>
                    {recommendedBooks.length > 0 ? (
                        <BookGrid bookData={recommendedBooks} />
                    ) : (
                        <p className="text-textSecondary">
                            This user hasn&apos;t recommended any books yet.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default FetchData;
