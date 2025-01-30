'use client';
import React from 'react'
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { BooksContext } from '../ContextAPI/booksAPI';

const BookForm = () => {
    const { setBooksData } = useContext(BooksContext);
    const [showForm, setShowForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value }); // No need for the 'rating' check anymore
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/books`, newBook);
            setBooksData((prevBooks) => [...prevBooks, response.data]); // Update the books list
            setShowForm(false); // Hide the form after submission
            setNewBook({ title: '', author: '', genre: '', description: '' }); // Reset the form
            console.log('Book added successfully');
        } catch (err) {
            console.error('Error adding book:', err.message);
        }
    };

    return (
        <div className='flex justify-center flex-col items-center'>
            <button
                className="w-full sm:w-[50vw] p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Cancel' : 'Add New Book to Recommend'}
            </button>

            {showForm && (
                <form
                    onSubmit={handleFormSubmit}
                    className="flex flex-col mt-5 p-5 bg-surface rounded-md shadow-md sm:w-[50vw]"
                >
                    <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
                    {/* Title */}
                    <label className="mb-2 font-medium">
                        Title
                        <input
                            type="text"
                            name="title"
                            value={newBook.title}
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
                            value={newBook.author}
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
                            value={newBook.genre}
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
                            value={newBook.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        className="mt-4 p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                    >
                        Save Book
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="mt-4 p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    )
}

export default BookForm
