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

// Scholarly editorial cover palettes for physical book mockups
const COVER_PALETTES = [
    { from: "from-[#1a2a3a]", to: "to-[#0e1720]", border: "border-[#2c4258]/60", accent: "text-[#d3e4fa]", titleColor: "text-[#fbf9f5]" }, // Library Navy
    { from: "from-[#8f330e]", to: "to-[#591e06]", border: "border-[#b8481b]/60", accent: "text-[#ffdbcf]", titleColor: "text-[#fbf9f5]" }, // Terracotta
    { from: "from-[#1d3c34]", to: "to-[#0f231e]", border: "border-[#2d5c50]/60", accent: "text-[#c2ebd9]", titleColor: "text-[#fbf9f5]" }, // Scholar Pine
    { from: "from-[#5a1827]", to: "to-[#380e18]", border: "border-[#7d293b]/60", accent: "text-[#fcd2db]", titleColor: "text-[#fbf9f5]" }, // Vintage Burgundy
    { from: "from-[#253f56]", to: "to-[#142433]", border: "border-[#3e5f7e]/60", accent: "text-[#cce5ff]", titleColor: "text-[#fbf9f5]" }, // Ink Blue
    { from: "from-[#54412c]", to: "to-[#332617]", border: "border-[#7a6245]/60", accent: "text-[#ffe8ba]", titleColor: "text-[#fbf9f5]" }, // Warm Ochre
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
        <div className="w-full flex flex-col md:flex-row gap-8 md:gap-12 text-on-surface">
            {/* Left Column: Physical Mock Cover Container */}
            <div className="w-full md:w-72 flex shrink-0 justify-center md:justify-start">
                <div className="rounded-2xl border border-outline-variant/70 shadow-[0_8px_24px_-6px_rgba(27,28,26,0.08)] w-full max-w-[280px]">
                    <div className={`relative aspect-[3/4.4] w-full rounded-[4px] border ${palette.border} bg-gradient-to-br ${palette.from} ${palette.to} shadow-md p-6 overflow-hidden flex flex-col justify-between`}>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
                        <div className="absolute left-0 top-0 w-3.5 h-full bg-gradient-to-r from-black/40 via-black/15 to-transparent rounded-l-[4px]" />
                        <div className="absolute left-[3px] top-[4%] bottom-[4%] w-[1px] bg-white/15" />
                        <div className="absolute inset-[10px] border border-white/10 opacity-70 rounded-[2px] pointer-events-none" />

                        <div className="w-full mt-4 text-center">
                            <h3 className={`font-serif ${palette.titleColor} text-base sm:text-lg font-bold leading-relaxed line-clamp-5 px-1 select-none`}>
                                {book.title}
                            </h3>
                        </div>
                        <div className={`w-full text-center text-[10px] sm:text-xs uppercase tracking-widest font-mono pt-2 border-t border-white/10 ${palette.accent}`}>
                            {book.genre}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Book Details Info */}
            <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 text-[11px] font-mono font-semibold tracking-wider uppercase bg-surface-container border border-outline-variant text-primary rounded-full shadow-2xs">
                        {book.genre}
                    </span>
                    {book.status && book.status !== "allowed" && (
                        <span className={`px-3 py-1 text-[11px] font-mono font-semibold tracking-wider uppercase rounded-full ${book.status === "pending" ? "bg-amber-100 border border-amber-300 text-amber-900" : "bg-red-100 border border-red-300 text-red-900"
                            }`}>
                            {book.status}
                        </span>
                    )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-secondary leading-tight mb-4">
                    {book.title}
                </h1>

                <div className="flex flex-col gap-1 mb-6 text-sm text-on-surface-variant border-b border-outline-variant/60 pb-6">
                    <p className="text-sm sm:text-base">
                        Written by <span className="text-on-surface font-semibold">{book.author}</span>
                    </p>
                    <p className="text-xs sm:text-sm">
                        Recommended by{" "}
                        <Link
                            href={`/user/${book.userName}`}
                            className="text-primary font-medium hover:underline transition-all">
                            {book.userName}
                        </Link>
                    </p>
                </div>

                {/* Content Focus: Reading constrained to 720px max */}
                <div className="mb-8 max-w-[720px]">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary/70 mb-2">Description</h3>
                    <p className="text-on-surface-variant text-base sm:text-lg leading-[1.65] whitespace-pre-line">
                        {book.description}
                    </p>
                </div>

                {error && (
                    <div
                        className="mb-6 p-3.5 bg-error-container/40 border border-error/30 text-error rounded-xl text-sm"
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
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-150 active:scale-[0.98] text-sm cursor-pointer shadow-xs ${isFavorite
                                    ? "bg-primary hover:bg-[#8e330e] text-white"
                                    : "bg-surface-container-lowest text-secondary border border-outline hover:bg-surface-container"
                                } ${loading ? "cursor-wait opacity-50" : ""}`}
                            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            aria-pressed={isFavorite}>
                            <HeartIcon className={`w-4 h-4 ${isFavorite ? "fill-white" : "fill-secondary/60"}`} />
                            <span>{isFavorite ? "In Favorites" : "Add to Favorites"}</span>
                        </button>
                    )}

                    {isAuthenticated && book.userId === userId && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-surface-container-lowest hover:bg-surface-container text-secondary border border-outline transition-all duration-150 active:scale-[0.98] text-sm cursor-pointer shadow-xs">
                                <PencilSquareIcon className="w-4 h-4 text-tertiary" />
                                <span>Edit</span>
                            </button>

                            <button
                                onClick={handleDeleteConfirm}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-error-container/25 text-error border border-error/30 hover:bg-error-container/50 transition-all duration-150 active:scale-[0.98] text-sm cursor-pointer">
                                <TrashIcon className="w-4 h-4 text-error" />
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
                <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-container-lowest border border-outline-variant/80 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                        <h3 className="font-serif text-lg font-bold text-on-surface tracking-tight mb-2">
                            Delete Book
                        </h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                            Are you sure you want to delete this recommendation? This action is permanent and cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="flex-1 py-2.5 rounded-lg border border-outline-variant text-secondary hover:bg-surface-container active:scale-[0.98] font-semibold text-sm transition-all"
                                onClick={handleDeleteCancel}>
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-lg bg-error hover:bg-[#9a1414] active:scale-[0.98] text-white font-semibold text-sm shadow-xs transition-all"
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
