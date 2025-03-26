'use client';
import { useState, useContext } from 'react';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { BooksContext } from '@/app/ContextAPI/booksAPI';
import axios from 'axios';
import Link from 'next/link';
import { AuthContext } from '@/app/ContextAPI/AuthContextApi';
import BookLoading from '@/app/components/BookLoading';
import BookForm from '@/app/components/BookForm';

export const BookDetails = ({ book }) => {
  const { isAuthenticated, token, userId, userRole } = useContext(AuthContext);
  const { booksData, setBooksData } = useContext(BooksContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${book._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setBooksData(booksData.filter((b) => b._id !== book._id));
      console.log('Book deleted successfully');
    } catch (err) {
      console.error('Error deleting book:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-1 sm:px-10'>
      {!loading && (
        <>
          <h1 className="text-4xl mb-5 sm:font-semibold text-textPrimary font-medium">
            {book.title}
          </h1>

          <div className="mt-6">
            <h2 className="mb-2 text-textSecondary">
              Author: {book.author}
            </h2>
            <h2 className="mb-2 text-textSecondary">
              Genre: {book.genre}
            </h2>
          </div>

          <p className="text-textSecondary">
            Description:
            <br />
            {book.description}
          </p>

          <h2 className="mb-2 text-textSecondary">
            Recommended by {' '}
            <a href={`/user/${book.userName}`}
              className="text-textPrimary font-semibold hover:underline">
              {book.userName}
            </a>
          </h2>

          {(isAuthenticated && book.userId === userId || userRole === 'admin') && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full bg-secondary hover:bg-accent"
              >
                <PencilSquareIcon className="w-6 h-6 hover:stroke-black" />
              </button>

              <Link href="/">
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full bg-secondary hover:bg-accent"
                >
                  <TrashIcon className="w-6 h-6 hover:stroke-black" />
                </button>
              </Link>
            </div>
          )}

          <BookForm
            setLoading={setLoading}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            existingBook={book}
          />
        </>
      )}

      {loading && (
        <BookLoading />
      )}
    </div>
  );
};