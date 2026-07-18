"use client";

import { useCallback } from "react";
import { useBooksStore } from "@/app/store/useBooksStore";
import BookGrid from "./BookGrid";
import BookForm from "./BookForm";
import BookLoading from "./BookLoading";
import Pagination from "./Pagination";
import { useAuth } from "@clerk/nextjs";

const BookList = () => {
    const { isSignedIn } = useAuth();
    const isAuthenticated = isSignedIn;
    const {
        booksData,
        loading,
        currentPage,
        totalPages,
        fetchBooks,
    } = useBooksStore();

    const handlePageChange = useCallback(
        (page) => {
            fetchBooks({ page });
        },
        [fetchBooks],
    );

    return (
        <div className="flex flex-col items-center w-full px-4 py-8 md:py-16">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mb-12 md:mb-20">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-textPrimary leading-[1.1] mb-6">
                    Discover Your Next Great Read
                </h1>
                
                <p className="text-sm sm:text-base text-textSecondary max-w-md mx-auto leading-relaxed mb-8">
                    A curated sanctuary for readers. Share your recommendations and explore handpicked books from the community.
                </p>

                {isAuthenticated ? (
                    <BookForm />
                ) : (
                    <div className="inline-flex flex-col items-center gap-1.5 px-6 py-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl backdrop-blur-sm">
                        <p className="text-xs sm:text-sm text-textSecondary">
                            Please login to recommend a book to the heaven.
                        </p>
                    </div>
                )}
            </div>

            {/* Catalog Section */}
            <div className="w-full flex flex-col mt-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-8">
                    <h2 className="text-lg md:text-xl font-semibold tracking-tight text-textPrimary">
                        Community Library
                    </h2>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                        {booksData ? `${booksData.length} active` : ""}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20" aria-live="polite" role="status">
                        <BookLoading size="lg" />
                    </div>
                ) : booksData && booksData.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                        <BookGrid bookData={booksData} />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
                        <p className="text-textSecondary text-sm">
                            No books yet. Be the first to recommend one!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;
