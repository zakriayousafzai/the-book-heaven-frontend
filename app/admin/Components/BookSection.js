"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import Pagination from "@/app/components/Pagination";
import BookLoading from "@/app/components/BookLoading";

const BookSection = ({ title, status, actions = [] }) => {
    const { getToken } = useAuth();
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const fetchBooks = useCallback(
        async (page) => {
            try {
                setLoading(true);
                const token = await getToken();

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/books`,
                    {
                        params: { status, page, limit: 10 },
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    },
                );

                setBooks(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
                setCurrentPage(response.data.pagination.currentPage);
            } catch (err) {
                console.error(`Error fetching ${status} books:`, err);
            } finally {
                setLoading(false);
            }
        },
        [getToken, status],
    );

    useEffect(() => {
        fetchBooks(1);
    }, [fetchBooks]);

    const handleAction = async (bookId, action) => {
        try {
            setProcessing(`${bookId}-${action.action}`);
            const token = await getToken();

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/books/${bookId}/${action.action}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            await fetchBooks(currentPage);
        } catch (err) {
            console.error(`Error running ${action.action} on book:`, err);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="mb-6">
            <div
                className="bg-surface rounded-lg border border-border p-6"
                role="region"
                aria-label={title}>
                <h2 className="text-2xl mb-3">
                    {title} ({totalItems})
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <BookLoading size="md" />
                    </div>
                ) : books.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-3">
                            {books.map((book) => (
                                <div
                                    key={book._id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-border rounded-md p-4">
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-textPrimary break-words">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm text-textSecondary">
                                            by {book.author} &middot; {book.genre}
                                        </p>
                                        <p className="text-xs text-textSecondary mt-1">
                                            Recommended by {book.userName}
                                        </p>
                                    </div>

                                    {actions.length > 0 && (
                                        <div className="flex shrink-0 gap-2">
                                            {actions.map((action) => {
                                                const isBusy =
                                                    processing ===
                                                    `${book._id}-${action.action}`;
                                                return (
                                                    <button
                                                        key={action.action}
                                                        onClick={() =>
                                                            handleAction(
                                                                book._id,
                                                                action,
                                                            )
                                                        }
                                                        disabled={
                                                            processing !== null
                                                        }
                                                        className={`px-4 py-1.5 rounded-md text-sm font-medium text-white
                                                                   hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity ${action.className}`}>
                                                        {isBusy
                                                            ? action.busyLabel
                                                            : action.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => fetchBooks(page)}
                        />
                    </>
                ) : (
                    <p className="text-textSecondary">No books to show.</p>
                )}
            </div>
        </div>
    );
};

export default BookSection;
