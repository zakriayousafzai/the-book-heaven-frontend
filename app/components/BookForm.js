"use client";

import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useBooksStore } from "@/app/store/useBooksStore";
import Modal from "./Modal";
import { PlusIcon } from "@heroicons/react/24/outline";

const BookForm = ({
    setLoading = () => {},
    isOpen: externalIsOpen,
    onClose,
    existingBook = null,
}) => {
    const { getToken } = useAuth();
    const { setBooksData } = useBooksStore();
    const [isOpen, setIsOpen] = useState(externalIsOpen || false);
    // Initialize form state with empty values or existing book data
    const [bookData, setBookData] = useState({
        title: "",
        author: "",
        genre: "",
        description: "",
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
        setBookData((prevData) => ({
            ...prevData,
            [name]: value,
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

        const token = await getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            let response;
            if (existingBook) {
                // Update existing book
                response = await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${existingBook._id}`,
                    bookData,
                    { headers },
                );

                // Update books list while preserving order
                setBooksData((prev) =>
                    prev.map((book) =>
                        book._id === existingBook._id ? response.data : book,
                    ),
                );
            } else {
                // Create new book
                response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books`,
                    bookData,
                    { headers },
                );

                // Add new book to list
                setBooksData((prev) => [...prev, response.data]);
            }

            // Reset form and close modal on success
            setBookData({ title: "", author: "", genre: "", description: "" });
            handleClose();

            const action = existingBook ? "updated" : "added";
            console.log(`Book ${action} successfully`);
        } catch (err) {
            const action = existingBook ? "updating" : "adding";
            console.error(`Error ${action} book:`, err.message);
            // TODO: Add user-facing error handling
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!existingBook && (
                <div className="flex justify-center items-center">
                    <button
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-amber-700 active:scale-[0.98] text-white px-8 py-3.5 rounded-full font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer text-sm sm:text-base"
                        onClick={() => setIsOpen(true)}>
                        <PlusIcon className="w-4 h-4 sm:w-5 h-5 text-white" />
                        Recommend a Book
                    </button>
                </div>
            )}

            <Modal isOpen={isOpen} onClose={handleClose}>
                <form onSubmit={handleFormSubmit} className="flex flex-col p-6 sm:p-8">
                    <h2 className="text-xl font-bold text-textPrimary tracking-tight mb-6">
                        {existingBook ? "Edit Recommendation" : "Recommend a Book"}
                    </h2>
                    
                    {/* Title */}
                    <div className="flex flex-col mb-4">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                            Book Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={bookData.title}
                            onChange={handleInputChange}
                            placeholder="e.g. The Great Gatsby"
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-textPrimary placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Author */}
                    <div className="flex flex-col mb-4">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                            Author
                        </label>
                        <input
                            type="text"
                            name="author"
                            value={bookData.author}
                            onChange={handleInputChange}
                            placeholder="e.g. F. Scott Fitzgerald"
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-textPrimary placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Genre */}
                    <div className="flex flex-col mb-4">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                            Genre
                        </label>
                        <input
                            type="text"
                            name="genre"
                            value={bookData.genre}
                            onChange={handleInputChange}
                            placeholder="e.g. Fiction, Classics"
                            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-textPrimary placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col mb-6">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                            Why do you recommend it?
                        </label>
                        <textarea
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                            placeholder="Share your thoughts about this masterpiece..."
                            rows="4"
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-textPrimary placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-750 active:scale-[0.98] text-zinc-300 hover:text-textPrimary font-semibold text-sm transition-all duration-150">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-full bg-primary hover:bg-amber-700 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-primary/10 transition-all duration-150">
                            {existingBook ? "Save Changes" : "Submit"}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default BookForm;
