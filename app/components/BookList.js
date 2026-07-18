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
        <div className="flex flex-col p-5 items-center">
            <span className="md:w-[60vw] lg:w-[50vw] w-[80vw]">
                <h1 className="text-4xl text-center m-5">
                    Discover Your Next Great Read at The Book Heaven!
                </h1>

                {!isAuthenticated && (
                    <div className="mb-4 text-center text-sm">
                        <p className="text-textSecondary">
                            Please login to recommend a book.
                        </p>
                        <p className="text-textSecondary">
                            If you don&apos;t have an account, please register.
                        </p>
                    </div>
                )}
            </span>

            {isAuthenticated && <BookForm />}

            <h1 className="text-xl text-textSecondary mt-10 mb-3">
                List of Recommended Books
            </h1>

            {loading ? (
                <div className="mt-10" aria-live="polite" role="status">
                    <BookLoading size="md" />
                </div>
            ) : booksData && booksData.length > 0 ? (
                <>
                    <BookGrid bookData={booksData} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <p className="text-textSecondary mt-10">
                    No books yet. Be the first to recommend one!
                </p>
            )}
        </div>
    );
};

export default BookList;
