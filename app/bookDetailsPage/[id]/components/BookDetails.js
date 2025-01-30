'use client';
import { useState, useContext } from 'react';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { BooksContext } from '@/app/ContextAPI/booksAPI';
import axios from 'axios';
import Link from 'next/link';
import BookCard from '@/app/components/BookCard';

export const BookDetails = ({ book }) => {
  const { booksData, setBooksData } = useContext(BooksContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedBook, setUpdatedBook] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre,
    description: book.description,
  });

  if (!book) return null;

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${book._id}`);
      // Update the context after deleting the book
      setBooksData(booksData.filter((b) => b._id !== book._id));
      console.log('Book deleted successfully');
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${book._id}`, updatedBook);
      // Update the context with the updated book
      setBooksData(booksData.map((b) => (b._id === book._id ? response.data : b)));
      setIsEditing(false); // Exit edit mode
      console.log('Book updated successfully');
    } catch (err) {
      console.error('Error updating book:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook({ ...updatedBook, [name]: value });
  };

  return (
    <div className="w-full px-5 sm:px-10 break-words sm:flex">
      <div>
        <h1 className="text-4xl mb-5 sm:font-semibold text-textPrimary font-medium">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={updatedBook.title}
              onChange={handleInputChange}
              className="text-4xl mb-5 font-normal text-textPrimary w-full border border-border p-2 rounded-md focus:outline-none focus:ring focus:ring-accent bg-surface"
            />
          ) : (
            book.title
          )}
        </h1>


        <div className="mt-6">
          <h2 className="mb-2 text-textSecondary">
            Author:{' '}
            {isEditing ? (
              <input
                type="text"
                name="author"
                value={updatedBook.author}
                onChange={handleInputChange}
                className="p-2 rounded-md w-full border-b border-border focus:outline-none bg-surface"
              />
            ) : (
              book.author
            )}
          </h2>
          <h2 className="mb-2 text-textSecondary">
            Genre:{' '}
            {isEditing ? (
              <input
                type="text"
                name="genre"
                value={updatedBook.genre}
                onChange={handleInputChange}
                className="p-2 rounded-md w-full border-b border-border bg-surface focus:outline-none"
              />
            ) : (
              book.genre
            )}
          </h2>
        </div>

        <p className="text-textSecondary">
          Description:
          <br />
          {isEditing ? (
            <textarea
              name="description"
              value={updatedBook.description}
              onChange={handleInputChange}
              className="p-2 rounded-md w-full border-b border-border bg-surface focus:outline-none"
            />
          ) : (
            book.description
          )}
        </p>

        {/* Edit & Save Buttons */}
        <div className="flex gap-4 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="p-2 bg-primary text-textPrimary rounded-full hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-primary text-textPrimary rounded-full hover:bg-blue-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-secondary hover:bg-accent"
            >
              <PencilSquareIcon className="w-6 h-6 hover:stroke-black" />
            </button>
          )}

          {/* Delete Button */}
          <Link href="/">
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-secondary hover:bg-accent"
            >
              <TrashIcon className="w-6 h-6 hover:stroke-black" />
            </button>
          </Link>
        </div>
      </div>
      <div className='sm:block hidden'>
        <BookCard id={updatedBook._id} title={updatedBook.title} genre={updatedBook.genre} />
      </div>
    </div>
  );
};
