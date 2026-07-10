"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import BookGrid from "@/app/components/BookGrid";
import { useBooksStore } from "@/app/store/useBooksStore";
import BookLoading from "@/app/components/BookLoading";

const RecommendedBooks = () => {
  const { userId } = useAuth();
  const { booksData } = useBooksStore();

  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedBooks = useCallback(async () => {
    try {
      const filtered = booksData.filter((book) => book.userId === userId);
      setRecommendedBooks(filtered);
      setError(null);
    } catch (err) {
      console.error("Error fetching recommended books:", err);
      setError("Failed to load recommended books");
    }
  }, [booksData, userId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRecommendedBooks()]);
      setLoading(false);
    };

    fetchData();
  }, [fetchRecommendedBooks]);

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
        aria-label="Books you recommended"
      >
        <h2 className="text-2xl mb-3">
          Books you Recommended ({recommendedBooks.length})
        </h2>
        {recommendedBooks.length > 0 ? (
          <BookGrid bookData={recommendedBooks} />
        ) : (
          <p className="text-textSecondary">
            You haven&apos;t recommended any books yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecommendedBooks;
