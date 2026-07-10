'use client';

import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useBooksStore } from '@/app/store/useBooksStore';
import Modal from './Modal';
import { useUser } from '@clerk/nextjs';

const BookForm = ({ setLoading, isOpen: externalIsOpen, onClose, existingBook = null }) => {
    const { user } = useUser();
    const userName = user?.username;
    const { getToken } = useAuth();
    const { setBooksData } = useBooksStore();
    const [isOpen, setIsOpen] = useState(externalIsOpen || false);
    // Initialize form state with empty values or existing book data
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
    });

    // Track modal visibility state

    useEffect(() => {
        setIsOpen(externalIsOpen);
    }, [externalIsOpen]);

    useEffect(() => {
        if (existingBook) {
            setBookData({
                title: existingBook.title,
                author: existingBook.author,
                genre: existingBook.genre,
                description: existingBook.description,
            });
        }
    }, [existingBook]);
    /**
     * Handle form input changes
     * Updates the bookData state with the new value while preserving other fields
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    /**
     * Handles modal closure and resets form if needed
     */

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    /**
     * Handles form submission for both creating and updating books
     * Performs API request and updates global books context
     *
     * @param {Event} e - Form submission event
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = await getToken()
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            let response;
            if (existingBook) {
                // Update existing book
                response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${existingBook._id}`,
                    bookData,
                    { headers }
                );

                // Update books list while preserving order
                setBooksData(prev => prev.map(book =>
                    book._id === existingBook._id ? response.data : book
                ));
            } else {
                // Create new book
                response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books`,
                    {...bookData, userName},
                    { headers }
                );

                // Add new book to list
                setBooksData(prev => [...prev, response.data]);
            }

            // Reset form and close modal on success
            setBookData({ title: '', author: '', genre: '', description: '' });
            handleClose();

            const action = existingBook ? 'updated' : 'added';
            console.log(`Book ${action} successfully`);
        } catch (err) {
            const action = existingBook ? 'updating' : 'adding';
            console.error(`Error ${action} book:`, err.message);
            // TODO: Add user-facing error handling
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!existingBook && (
                <div className='flex justify-center flex-col items-center'>
                    <button
                        className="w-full sm:w-[50vw] p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                        onClick={() => setIsOpen(true)}
                    >
                        Add New Book to Recommend
                    </button>
                </div>
            )}

            <Modal isOpen={isOpen} onClose={handleClose}>
                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col p-6"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        {existingBook ? 'Edit Book' : 'Add a New Book'}
                    </h2>
                    {/* Title */}
                    <label className="mb-2 font-medium">
                        Title
                        <input
                            type="text"
                            name="title"
                            value={bookData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        />
                    </label>
                    {/* Author */}
                    <label className="mb-2 font-medium">
                        Author
                        <input
                            type="text"
                            name="author"
                            value={bookData.author}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        />
                    </label>
                    {/* Genre */}
                    <label className="mb-2 font-medium">
                        Genre
                        <input
                            type="text"
                            name="genre"
                            value={bookData.genre}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        />
                    </label>
                    {/* Description */}
                    <label className="mb-2 font-medium">
                        Description
                        <textarea
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        />
                    </label>

                    <div className="flex gap-2 mt-4">
                        <button
                            type="submit"
                            className={`flex-1 p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600`}
                        >
                            {existingBook ? 'Save Changes' : 'Save Book'}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default BookForm
