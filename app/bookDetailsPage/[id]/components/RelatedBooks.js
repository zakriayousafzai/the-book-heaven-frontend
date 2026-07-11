"use client";

import { use, useMemo } from "react";
import BookGrid from "@/app/components/BookGrid";
import { useBooksStore } from "@/app/store/useBooksStore";

export const RelatedBooks = ({ params }) => {
    const { booksData } = useBooksStore();
    const param = use(params);
    const id = param.id;

    // Find current book
    const currentBook = useMemo(
        () => booksData?.find((book) => book._id === id),
        [booksData, id],
    );

    // Filter related books
    const relatedBooks = useMemo(() => {
        if (!currentBook) return [];
        return booksData?.filter((book) => book.genre === currentBook.genre);
    }, [currentBook, booksData]);

    // Don't render if there are no related books
    if (!relatedBooks || !relatedBooks.length) return null;
    return (
        <section
            className="w-full h-auto py-5 px-7 flex flex-col justify-center sm:px-14"
            aria-labelledby="related-books-heading">
            <h2
                id="related-books-heading"
                className="text-2xl text-textSecondary mb-4">
                Related Books ({relatedBooks.length})
            </h2>
            <div className="relative">
                <BookGrid bookData={relatedBooks} />
            </div>
        </section>
    );
};
