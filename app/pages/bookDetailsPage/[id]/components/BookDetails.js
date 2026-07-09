'use client';

import { useState, useEffect } from 'react';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useAuth } from '@clerk/nextjs';
import { useBooksStore } from '@/app/store/useBooksStore';
import { useFavoriteStore } from '@/app/store/useFavoriteStore';
import axios from 'axios';
import Link from 'next/link';
import BookForm from '@/app/components/BookForm';

/**
 * BookDetails Component
 * Displays detailed information about a book with editing and favorite functionality
 *
 * @param {Object} props
 * @param {Object} props.book - Book data to display
 */
export const BookDetails = ({ book }) => {

  const { isSignedIn, getToken, userId } = useAuth();
  const isAuthenticated = isSignedIn;
  const { favoritesData, setFavoritesData } = useFavoriteStore();
  const { booksData, setBooksData } = useBooksStore();
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isFavorite = favoritesData.some(fav => fav.bookId === book._id);
    setIsFavorite(isFavorite);
  }, [favoritesData, book._id]);

  /**
   * Adds the current book to user's favorites
   */
  const addToFavorites = async () => {
    try {
      const token = await getToken()
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorite`,
        {
          userId: userId,
          bookId: book._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setIsFavorite(true);
      setFavoritesData([...favoritesData, response.data]);
      setError(null);
    } catch (err) {
      console.error('Error adding favorite:', err);
      setError('Failed to add to favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Removes the current book from user's favorites
   */
  const deleteFavorite = async () => {
    try {
      const token = await getToken()
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorite/${book._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setFavoritesData(favoritesData.filter((fav) => fav.bookId !== book._id));
      setIsFavorite(false);
      setError(null);
    } catch (err) {
      console.error('Error deleting favorite:', err);
      setError('Failed to remove from favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      setIsFavorite(false);
      setLoading(true);
      deleteFavorite();
      console.log('deleting favorite');
    } else {
      console.log('adding favorite');
      setIsFavorite(true);
      setLoading(true);
      addToFavorites();
    }
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!book) return null;

  /**
   * Handles book deletion
   */
  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = await getToken()
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/books/${book._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setBooksData(booksData.filter((b) => b._id !== book._id));
      setError(null);
      window.location.href = "/"; // Redirect to home after successful deletion
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Failed to delete book. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className='px-1 sm:px-10'>

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
        <a href={`/pages/user/${book.userName}`}
          className="text-textPrimary font-semibold hover:underline">
          {book.userName}
        </a>
      </h2>
{error && (
  <div
    className="mt-4 p-3 bg-red-100 text-red-700 rounded-md"
    role="alert"
    aria-live="polite"
  >
    {error}
  </div>
)}

<div className="flex gap-4 mt-4">
  {isAuthenticated && (
    <button
      onClick={handleToggleFavorite}
      className={`${isFavorite ? 'bg-red-500' : 'bg-secondary'} p-2 rounded-full hover:bg-red-500
        ${loading ? 'cursor-wait opacity-50' : ''}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFavorite}
    >
      <HeartIcon className="w-6 h-6" />
    </button>
  )}


        {(isAuthenticated && book.userId === userId) && (
          <div className='flex gap-4'>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-secondary hover:bg-accent"
            >
              <PencilSquareIcon className="w-6 h-6 hover:stroke-black" />
            </button>

            <button
              onClick={handleDeleteConfirm}
              className="p-2 rounded-full bg-secondary hover:bg-accent"
            >
              <TrashIcon className="w-6 h-6 hover:stroke-black" />
            </button>
          </div>
        )}
      </div>

      <BookForm
        setLoading={setLoading}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        existingBook={book}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-textPrimary mb-4">Delete Book</h3>
            <p className="text-textSecondary mb-6">Are you sure you want to delete this book? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-secondary text-textPrimary rounded hover:bg-gray-600"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <Link href="/">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};