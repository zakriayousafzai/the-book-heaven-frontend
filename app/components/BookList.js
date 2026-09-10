"use client";

import { useCallback } from "react";
import Image from "next/image";
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
        <div className="flex flex-col items-center w-full">
            {/* Full-Width Hero Section matching reference image */}
            <section className="relative w-full flex items-center justify-center min-h-[440px] overflow-hidden border-b border-outline-variant/40">
                {/* Left Bookshelf - Hugs far left edge from top to bottom */}
                <div className="hidden sm:block left-[-50px] absolute top-0 bottom-0 w-48 lg:w-56 xl:w-72 2xl:w-84 pointer-events-none select-none z-0">
                    <Image
                        src="/book_shelf_left.jpg"
                        alt="Left bookshelf"
                        fill
                        sizes="(max-width: 1280px) 224px, (max-width: 1536px) 288px, 336px"
                        className="object-contain object-left mix-blend-multiply"
                        priority
                    />
                </div>

                {/* Center Hero Content */}
                <div className="relative z-10 md:max-w-2xl max-w-[27rem] px-6 mx-auto text-center flex flex-col items-center">

                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-secondary leading-[1.14] mb-6 max-w-xl">
                        Discover Your Next Great Read & Share with the World
                    </h1>

                    <p className="text-sm md:text-lg text-on-surface-variant max-w-lg mx-auto leading-relaxed mb-8">
                        A scholarly yet accessible sanctuary for readers. Explore handpicked recommendations, share your favorite books, and keep abreast of community reviews.
                    </p>

                    {isAuthenticated ? (
                        <BookForm />
                    ) : (
                        <div className="inline-flex flex-col items-center gap-1.5 px-6 py-4 bg-surface-container-lowest border border-outline-variant/70 rounded-xl shadow-xs">
                            <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                                Please log in to recommend a book to the heaven.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Bookshelf - Hugs far right edge from top to bottom */}
                <div className="hidden sm:block absolute right-[-50px] top-0 bottom-0 w-48 lg:w-56 xl:w-72 2xl:w-84 pointer-events-none select-none z-0">
                    <Image
                        src="/book_shelf_right.jpg"
                        alt="Right bookshelf"
                        fill
                        sizes="(max-width: 1280px) 224px, (max-width: 1536px) 288px, 336px"
                        className="object-contain object-right mix-blend-multiply"
                        priority
                    />
                </div>
            </section>

            {/* Catalog Section */}
            <section aria-label="Book Collection" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col">
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4 mb-8">
                    <h2 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-secondary">
                        Community Library
                    </h2>
                    <span className="text-xs font-mono text-tertiary uppercase tracking-widest">
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
                    <div className="text-center py-20 bg-surface-container-low/50 rounded-2xl border border-dashed border-outline-variant/80">
                        <p className="text-on-surface-variant text-sm font-medium">
                            No books yet. Be the first to recommend one!
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default BookList;
