'use client';

import { useState, useEffect, useContext } from 'react';
import { BooksContext } from '../ContextAPI/booksAPI';
import BookGrid from './BookGrid';
import BookForm from './BookForm';
import { AuthContext } from '../ContextAPI/AuthContextApi';
import BookLoading from './BookLoading';

/**
 * BookList Component
 * Main container component for the book listing page
 * Handles authentication state, loading states, and book data display
 *
 * Features:
 * - Displays a welcome message and authentication prompt
 * - Shows book form for authenticated users
 * - Displays grid of recommended books
 * - Handles loading states with a loading indicator
 */
const BookList = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { booksData, setBooksData } = useContext(BooksContext);
  const [loading, setLoading] = useState(true);

  // Update loading state when book data is available
  useEffect(() => {
    // Only set loading to false when we have actual book data
    if (booksData && Array.isArray(booksData)) {
      setLoading(false);
    }
  }, [booksData]);

  // Only show loading state when data is being fetched
  return (
    <div className="flex flex-col p-5 items-center">
      {/* Header section with responsive width */}
      <span className='md:w-[60vw] lg:w-[50vw] w-[80vw]'>
        <h1 className="text-4xl text-center m-5">
          Discover Your Next Great Read at The Book Heaven!
        </h1>

        {/* Authentication prompt for non-authenticated users */}
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

      {/* Book form for authenticated users */}
      {isAuthenticated && (
        <BookForm setLoading={setLoading} />
      )}

      <h1 className="text-xl text-textSecondary mt-10 mb-3">
        List of Recommended Books
      </h1>

      {/* Conditional rendering based on loading state */}
      {!loading ? (
        <BookGrid bookData={booksData} />
      ) : (
        <div className="mt-10" aria-live="polite" role="status">
          <BookLoading size="md" />
        </div>
      )}
    </div>
  );
};

export default BookList;
