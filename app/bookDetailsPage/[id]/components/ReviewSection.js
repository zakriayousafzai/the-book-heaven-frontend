"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useBooksStore } from "@/app/store/useBooksStore";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import EditableStarRating from "./EditableStarRating";
import ReviewCard from "./ReviewCard";
import BookLoading from "@/app/components/BookLoading";
import Pagination from "@/app/components/Pagination";

const ReviewSection = ({ params }) => {
    const { isSignedIn, userName, getToken } = useAuth();
    const isAuthenticated = isSignedIn;
    const { booksData } = useBooksStore();
    const param = use(params);
    const id = param.id;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const fetchReviews = useCallback(
        async (page = 1) => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reviews?page=${page}&limit=5`,
                );
                setReviews(response.data.data);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
                setError(null);
            } catch (err) {
                setError("Failed to load reviews. Please try again later.");
                console.error("Error fetching reviews:", err);
            } finally {
                setLoading(false);
            }
        },
        [id],
    );

    useEffect(() => {
        if (booksData) {
            setLoading(false);
        }

        if (id) {
            fetchReviews(1);
        }
    }, [booksData, id, userName, fetchReviews]);

    const handlePageChange = useCallback(
        (page) => {
            setLoading(true);
            fetchReviews(page).then(() => setLoading(false));
        },
        [fetchReviews],
    );

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!comment || rating < 1 || rating > 5) {
            setError("Please fill out all fields correctly.");
            setLoading(false);
            return;
        }

        const newReview = { rating, comment };

        try {
            const token = await getToken();
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reviews`,
                newReview,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            await fetchReviews(currentPage);
            console.log("Review submitted successfully");
        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
            setRating(1);
            setComment("");
        }
    };

    return (
        <section className="px-5 py-10 sm:px-14">
            <h2 className="text-2xl font-semibold mb-5">Reviews</h2>

            <div className="space-y-4 mb-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            setReviews={setReviews}
                        />
                    ))
                ) : (
                    <p className="text-textSecondary">
                        No reviews yet. Be the first to leave one!
                    </p>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {loading && (
                <div className="absolute text-center right-0 left-0">
                    <BookLoading size="lg" />
                </div>
            )}

            {!isAuthenticated && (
                <div className="mb-4">
                    <p className="text-textSecondary">
                        Please log in to leave a review.
                    </p>
                </div>
            )}

            {isAuthenticated && (
                <form
                    onSubmit={handleReviewSubmit}
                    className="flex flex-col gap-4 border border-border p-3 rounded-md bg-surface"
                    aria-label="Review submission form">
                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                            aria-live="polite">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="">
                        <label
                            htmlFor="rating"
                            className="block text-sm font-medium text-secondary mb-2">
                            Rating (required)
                        </label>
                        <EditableStarRating
                            rating={rating}
                            onRatingChange={setRating}
                            id="rating"
                            aria-label="Select rating from 1 to 5 stars"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-secondary mb-2">
                            Your Review (required)
                        </label>
                        <textarea
                            id="comment"
                            placeholder="Write your review..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            rows="4"
                            required
                            aria-label="Review comment"
                            aria-required="true"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`self-start bg-primary text-white px-5 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-accent hover:text-black"}`}
                        aria-busy={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}
        </section>
    );
};

export default ReviewSection;
