"use client";

import { useState, useEffect, use, useMemo } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@clerk/nextjs";
import { useBooksStore } from "@/app/store/useBooksStore";
import { useFavoriteStore } from "@/app/store/useFavoriteStore";
import axios from "axios";
import Link from "next/link";
import BookForm from "@/app/components/BookForm";

const COVER_PALETTES = [
    { from: "from-zinc-900", to: "to-zinc-950", border: "border-zinc-800/80", accent: "text-[#c4a484]" }, // Charcoal
    { from: "from-rose-950", to: "to-stone-950", border: "border-rose-900/40", accent: "text-[#e8c4b4]" },  // Burgundy
    { from: "from-teal-950", to: "to-slate-950", border: "border-teal-900/40", accent: "text-[#a4e8d5]" },   // Teal
    { from: "from-amber-950", to: "to-zinc-950", border: "border-amber-900/40", accent: "text-[#e8d5c4]" },  // Bronze
    { from: "from-blue-950", to: "to-zinc-950", border: "border-blue-900/40", accent: "text-[#b4d5e8]" },    // Indigo
];

export const BookDetails = ({ params }) => {
    const param = use(params);
    const id = param.id;
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

    // Find current book
    const book = useMemo(
        () => booksData?.find((book) => book._id === id),
        [booksData, id],
    );

    useEffect(() => {
        if (!book) return;
        const isFavorite = favoritesData.some((fav) => fav._id === book._id);
        setIsFavorite(isFavorite);
    }, [favoritesData, book]);

    /**
     * Adds the current book to user's favorites
     */
    const addToFavorites = async () => {
        try {
            const token = await getToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/favorite`,
                {
                    userId: userId,
                    bookId: book._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            setIsFavorite(true);
            setFavoritesData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error adding favorite:", err);
            setError("Failed to add to favorites. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Removes the current book from user's favorites
     */
    const deleteFavorite = async () => {
        try {
            const token = await getToken();
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/favorite/${book._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            setFavoritesData(
                favoritesData.filter((fav) => fav._id !== book._id),
            );
            setIsFavorite(false);
            setError(null);
        } catch (err) {
            console.error("Error deleting favorite:", err);
            setError("Failed to remove from favorites. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (isFavorite) {
            setIsFavorite(false);
            setLoading(true);
            deleteFavorite();
            console.log("deleting favorite");
        } else {
            console.log("adding favorite");
            setIsFavorite(true);
            setLoading(true);
            addToFavorites();
        }
    };

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
            const token = await getToken();
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/books/${book._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            setBooksData(booksData.filter((b) => b._id !== book._id));
            setError(null);
            window.location.href = "/"; // Redirect to home after successful deletion
        } catch (err) {
            console.error("Error deleting book:", err);
            setError("Failed to delete book. Please try again.");
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    // Dynamic palette calculation
    const paletteIndex = book._id 
        ? book._id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % COVER_PALETTES.length
        : book.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % COVER_PALETTES.length;
    const palette = COVER_PALETTES[paletteIndex];

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 text-textPrimary">
            {/* Left Column: Physical Mock Cover */}
            <div className="w-full md:w-64 flex shrink-0 justify-center md:justify-start">
                <div className={`relative aspect-[3/4.2] w-52 sm:w-64 rounded-xl border ${palette.border} bg-gradient-to-br ${palette.from} ${palette.to} shadow-2xl p-6 overflow-hidden flex flex-col justify-between`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.02\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
                    <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-r from-black/60 via-black/20 to-transparent rounded-l-xl" />
                    <div className="absolute inset-[12px] border border-white/5 opacity-55 rounded pointer-events-none" />
                    <div className="w-full mt-6 text-center">
                        <h3 className="text-[#e8d5c4] text-sm sm:text-base font-semibold leading-relaxed line-clamp-5 px-2 select-none">
                            {book.title}
                        </h3>
                    </div>
                    <div className={`w-full text-center text-[10px] sm:text-xs uppercase tracking-widest pt-2 border-t border-white/5 ${palette.accent}`}>
                        {book.genre}
                    </div>
                </div>
            </div>

            {/* Right Column: Book Details Info */}
            <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-zinc-900 border border-zinc-800 text-primary rounded-full">
                        {book.genre}
                    </span>
                    {book.status && book.status !== "allowed" && (
                        <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full ${
                            book.status === "pending" ? "bg-amber-500/25 border border-amber-500/40 text-amber-400" : "bg-red-500/25 border border-red-500/40 text-red-400"
                        }`}>
                            {book.status}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-textPrimary leading-tight mb-4">
                    {book.title}
                </h1>

                <div className="flex flex-col gap-1 mb-6 text-sm text-textSecondary border-b border-border/40 pb-6">
                    <p>
                        Written by <span className="text-textPrimary font-semibold">{book.author}</span>
                    </p>
                    <p className="text-xs">
                        Recommended by{" "}
                        <Link
                            href={`/user/${book.userName}`}
                            className="text-primary font-medium hover:underline transition-all">
                            {book.userName}
                        </Link>
                    </p>
                </div>

                <div className="mb-8 max-w-[65ch]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Description</h3>
                    <p className="text-textSecondary text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {book.description}
                    </p>
                </div>

                {error && (
                    <div
                        className="mb-6 p-3.5 bg-red-500/10 border border-red-500/35 text-red-400 rounded-xl text-sm"
                        role="alert"
                        aria-live="polite">
                        {error}
                    </div>
                )}

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-3 mt-auto">
                    {isAuthenticated && (
                        <button
                            onClick={handleToggleFavorite}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-150 active:scale-[0.98] text-sm cursor-pointer ${
                                isFavorite 
                                    ? "bg-red-700 hover:bg-red-800 text-white shadow-md shadow-red-950/20" 
                                    : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-750 hover:text-white"
                            } ${loading ? "cursor-wait opacity-50" : ""}`}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            aria-pressed={isFavorite}>
                            <HeartIcon className={`w-4 h-4 ${isFavorite ? "fill-white" : "fill-zinc-400"}`} />
                            <span>{isFavorite ? "Favorited" : "Favorite"}</span>
                        </button>
                    )}

                    {isAuthenticated && book.userId === userId && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-zinc-850 hover:bg-zinc-800 text-zinc-350 hover:text-textPrimary border border-zinc-800/80 transition-all duration-150 active:scale-[0.98] text-sm cursor-pointer">
                                <PencilSquareIcon className="w-4 h-4 text-zinc-400" />
                                <span>Edit</span>
                            </button>

                            <button
                                onClick={handleDeleteConfirm}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/40 hover:text-red-300 transition-all duration-150 active:scale-[0.98] text-sm cursor-pointer">
                                <TrashIcon className="w-4 h-4 text-red-400" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <BookForm
                setLoading={setLoading}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                existingBook={book}
            />

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-textPrimary tracking-tight mb-2">
                            Delete Book
                        </h3>
                        <p className="text-sm text-textSecondary leading-relaxed mb-6">
                            Are you sure you want to delete this recommendation? This action is permanent and cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="flex-1 py-2 rounded-full bg-zinc-800 hover:bg-zinc-750 active:scale-[0.98] text-zinc-300 font-semibold text-sm transition-all"
                                onClick={handleDeleteCancel}>
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2 rounded-full bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white font-semibold text-sm transition-all"
                                onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
