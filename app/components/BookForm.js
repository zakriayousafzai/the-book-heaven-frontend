'use client';
import React from 'react'
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { BooksContext } from '../ContextAPI/booksAPI';
import { AuthContext } from '../ContextAPI/AuthContextApi';
import BookLoading from './BookLoading';
import Modal from './Modal';

const BookForm = ({ setLoading, isOpen: externalIsOpen, onClose, existingBook = null }) => {
    const { token } = useContext(AuthContext);
    const { setBooksData } = useContext(BooksContext);
    const [isOpen, setIsOpen] = useState(externalIsOpen || false);
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleClose = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (existingBook) {
                // Update existing book
                const response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${existingBook._id}`,
                    bookData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setBooksData(prev => prev.map(book => 
                    book._id === existingBook._id ? response.data : book
                ));
            } else {
                // Add new book
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books`,
                    bookData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setBooksData(prev => [...prev, response.data]);
            }
            
            setBookData({ title: '', author: '', genre: '', description: '' });
            handleClose();
            console.log(`Book ${existingBook ? 'updated' : 'added'} successfully`);
        } catch (err) {
            console.error(`Error ${existingBook ? 'updating' : 'adding'} book:`, err.message);
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
                            className="flex-1 p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
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
