"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useFavoriteStore } from "@/app/store/useFavoriteStore";
import BookGrid from "@/app/components/BookGrid";
import { useBooksStore } from "@/app/store/useBooksStore";
import BookLoading from "@/app/components/BookLoading";

function FavoriteBooks() {
  const { favoritesData } = useFavoriteStore();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const { booksData } = useBooksStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoriteBooks = useCallback(async () => {
    try {
      const filtered = booksData.filter((book) =>
        favoritesData.some((fav) => fav.bookId === book._id),
      );
      setFavoriteBooks(filtered);
      setError(null);
    } catch (err) {
      console.error("Error fetching favorite books:", err);
      setError("Failed to load favorite books");
    }
  }, [booksData, favoritesData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchFavoriteBooks()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchFavoriteBooks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BookLoading size="lg" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div
        className="bg-surface rounded-lg border border-border p-6"
        role="region"
        aria-label="Your favorite books"
      >
        <h2 className="text-2xl mb-3">
          Your Favorites ({favoriteBooks.length})
        </h2>
        {favoriteBooks.length > 0 ? (
          <BookGrid bookData={favoriteBooks} />
        ) : (
          <p className="text-textSecondary">No favorite books yet.</p>
        )}
      </div>
    </div>
  );
}

export default FavoriteBooks;
