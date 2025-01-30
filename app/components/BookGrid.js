import React from 'react'
import BookCard from './BookCard'


const BookGrid = ({ bookData }) => {

    return (
        <div className="relative bg-background w-full h-auto p-2 flex justify-center items-center">

            <div className="absolute top-0 w-full h-1 bg-border"></div>

            <div className='mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 w-full'>

                {/* Map through the bookData array and render a bookCard for each book in Reverse */}
                {bookData.slice().reverse().map((book) => {
                    return (
                        <BookCard
                            key={book._id}
                            id={book._id}
                            artwork={book.title}
                            title={book.title}
                            genre={book.genre}
                        />
                    )
                }
                )}
            </div>

        </div>
    )
}

export default BookGrid
