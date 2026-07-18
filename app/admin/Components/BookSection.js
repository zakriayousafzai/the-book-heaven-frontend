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
        <div className="mb-8">
            <div
                className="bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 rounded-2xl shadow-sm backdrop-blur-sm"
                role="region"
                aria-label={title}>
                
                {/* Section Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/40">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-textPrimary">
                        {title}
                    </h2>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        {totalItems} books
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <BookLoading size="md" />
                    </div>
                ) : books.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3.5">
                            {books.map((book) => (
                                <div
                                    key={book._id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-zinc-800/60 rounded-xl p-5 bg-zinc-950/40 hover:border-zinc-700/65 transition-all duration-150">
                                    <div className="min-w-0">
                                        <h3 className="text-base sm:text-lg font-bold text-textPrimary tracking-tight break-words mb-1">
                                            {book.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-textSecondary">
                                            <span>by <span className="text-textPrimary font-medium">{book.author}</span></span>
                                            <span>&middot;</span>
                                            <span className="italic text-primary">{book.genre}</span>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-zinc-500 mt-2 font-mono uppercase tracking-wider">
                                            Rec: {book.userName}
                                        </p>
                                    </div>

                                    {actions.length > 0 && (
                                        <div className="flex shrink-0 gap-2.5 sm:self-center">
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
                                                        className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-150 active:scale-[0.97]
                                                                   disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${action.className}`}>
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

                        {totalPages > 1 && (
                            <div className="mt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => fetchBooks(page)}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-textSecondary text-sm italic py-4">No books to show in this drawer.</p>
                )}
            </div>
        </div>
    );
};

export default BookSection;
