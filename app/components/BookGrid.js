import React from "react";
import BookCard from "./BookCard";

/**
 * BookGrid Component
 * Displays a responsive grid of book cards with a reversed chronological order
 *
 * @param {Object[]} bookData - Array of book objects to display
 * @param {string} bookData[].title - Book title
 * @param {string} bookData[].genre - Book genre
 * @param {string} bookData[].artwork - Book artwork
 * @param {string} bookData[]._id - Book unique identifier
 */
const BookGrid = ({ bookData }) => {
    return (
        <div className="relative bg-background w-full h-auto p-2 flex justify-center items-center">
            <div className="absolute top-0 w-full h-1 bg-border"></div>

            {/* Responsive grid layout for book cards */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full">
                {bookData.map((book) => (
                    <BookCard
                        key={book._id}
                        id={book._id}
                        artwork={book.title}
                        title={book.title}
                        genre={book.genre}
                        status={book.status}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookGrid;
