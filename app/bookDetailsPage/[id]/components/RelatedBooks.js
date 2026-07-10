"use client";

import BookGrid from "@/app/components/BookGrid";

/**
 * RelatedBooks Component
 * Displays a grid of books that share the same genre as the current book
 *
 * @param {Object} props
 * @param {Array} props.books - Array of related books to display
 */
export const RelatedBooks = ({ books }) => {
    // Don't render if there are no related books
    if (!books || !books.length) return null;

    return (
        <section
            className="w-full h-auto py-5 px-7 flex flex-col justify-center sm:px-14"
            aria-labelledby="related-books-heading">
            <h2
                id="related-books-heading"
                className="text-2xl text-textSecondary mb-4">
                Related Books ({books.length})
            </h2>
            <div className="relative">
                <BookGrid bookData={books} />
            </div>
        </section>
    );
};
