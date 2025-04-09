'use client';
import { useState, useContext, useEffect } from 'react';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { BooksContext } from '@/app/ContextAPI/booksAPI';
import axios from 'axios';
import Link from 'next/link';
import { AuthContext } from '@/app/ContextAPI/AuthContextApi';
import BookLoading from '@/app/components/BookLoading';
import BookForm from '@/app/components/BookForm';
import { FavoriteContext } from '@/app/ContextAPI/FavoriteContext';

export const BookDetails = ({ book }) => {

  const { favoritesData, setFavoritesData } = useContext(FavoriteContext);
  const { isAuthenticated, token, userId, userRole } = useContext(AuthContext);
  const { booksData, setBooksData } = useContext(BooksContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState();

  useEffect(() => {
    const isFavorite = favoritesData.some(fav => fav.bookId === book._id);
    setIsFavorite(isFavorite);
  }, [favoritesData, book._id]);

  const addedToFavorites = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/favorite`, {
        userId: userId,
        bookId: book._id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setIsFavorite(response.data);
      setFavoritesData([...favoritesData, response.data]);
      console.log('Favorite added successfully', response.data);
    } catch (err) {
      console.error('Error fetching favorite:', err);
    } finally {
      setLoading(false);
    }
  }

  const deleteFavorite = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/favorite/${book._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setFavoritesData(favoritesData.filter((fav) => fav.bookId !== book._id));
      console.log('Favorite deleted successfully');
    } catch (err) {
      console.error('Error deleting favorite:', err);
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
      addedToFavorites();
    }
  }

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

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
        <a href={`/user/${book.userName}`}
          className="text-textPrimary font-semibold hover:underline">
          {book.userName}
        </a>
      </h2>

      <div className="flex gap-4 mt-4">
        
        {isAuthenticated && (
        <button
          onClick={() => handleToggleFavorite()}
          className={`${isFavorite ? 'bg-red-500' : 'bg-secondary'} p-2 rounded-full hover:bg-red-500 ${loading ? 'cursor-wait' : ''}`}
        >
          <HeartIcon className="w-6 h-6" />
        </button>)}

        {(isAuthenticated && book.userId === userId || userRole === 'admin') && (
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