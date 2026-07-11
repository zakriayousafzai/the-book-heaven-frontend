"use client";

import React, { useState, useEffect, useCallback } from "react";
import BookGrid from "@/app/components/BookGrid";
import BookLoading from "@/app/components/BookLoading";
import axios from "axios";
import { useUser, getToken } from "@clerk/nextjs";

const PublicProfile = () => {
    const { user } = useUser();
    const username = user?.username;
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches and filters books recommended by this user
     */
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const token = await getToken();

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
            );
            setRecommendedBooks(response.data.recommendedBooks);

            setError(null);
        } catch (err) {
            console.error("Error fetching recommended books:", err);
            setError("Failed to load recommended books");
        } finally {
            setLoading(false);
        }
    }, [username]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Renders user profile information section
     */
    const renderUserDetails = () => (
        <div
            className="bg-surface rounded-lg border border-border p-6 mb-6"
            role="region"
            aria-label="User profile information">
            <div className="flex justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        {username}
                    </h1>
                </div>
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
            aria-label={`${username}'s public profile`}>
            {renderUserDetails()}

            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                    role="alert"
                    aria-live="polite">
                    {error}
                </div>
            )}

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
        </div>
    );
};

export default PublicProfile;
