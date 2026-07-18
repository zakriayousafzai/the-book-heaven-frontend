"use client";

import React, { useState } from "react";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import StarRating from "./StarRating";
import EditableStarRating from "./EditableStarRating";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import BookLoading from "@/app/components/BookLoading";

/**
 * ReviewCard Component
 * Displays a single review with edit and delete functionality
 *
 * @param {Object} props
 * @param {Object} props.review - Review data
 * @param {Function} props.setReviews - Function to update reviews list
 */
const ReviewCard = ({ review, setReviews }) => {
    const { isSignedIn, getToken, userId } = useAuth();
    const isAuthenticated = isSignedIn;
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(review.comment);
    const [updatedRating, setUpdatedRating] = useState(review.rating);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState(null);

    const handleDeleteConfirm = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const handleDeleteReview = async (id) => {
        setLoading(true);
        try {
            const token = await getToken();
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review._id !== id),
            );
            setError(null);
        } catch (err) {
            console.error("Error deleting review:", err);
            setError("Failed to delete review. Please try again.");
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    /**
     * Handles review update submission
     */
    const handleUpdateReview = async () => {
        if (!updatedComment.trim()) {
            setError("Review comment cannot be empty");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const updatedReview = {
                comment: updatedComment.trim(),
                rating: updatedRating,
            };

            const token = await getToken();
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review._id}`,
                updatedReview,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            setReviews((prevReviews) =>
                prevReviews.map((r) =>
                    r._id === review._id ? response.data.updatedReview : r,
                ),
            );

            setIsEditing(false);
            setError(null);
            setLoading(false);
        } catch (err) {
            console.error("Error updating review:", err);
            setError("Failed to update review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            key={review._id}
            className="w-full flex justify-between bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl relative shadow-sm transition-all duration-200 hover:border-zinc-700/60">
            {!isEditing ? (
                <>
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-accent flex items-center">
                                <StarRating rating={review.rating} />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                                &bull; Verified Reader
                            </span>
                        </div>
                        <h4 className="text-sm font-semibold text-textPrimary truncate">
                            {review.reviewerName}
                        </h4>
                        <p className="mt-2 text-textSecondary text-xs sm:text-sm leading-relaxed break-words whitespace-pre-line max-w-[65ch]">
                            {review.comment}
                        </p>
                    </div>

                    {isAuthenticated && review.userId === userId && (
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0 self-start">
                            {/* Edit Button */}
                            <button
                                className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-textPrimary hover:bg-zinc-700 transition-all active:scale-[0.93]"
                                aria-label="Edit"
                                onClick={() => setIsEditing(true)}>
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                                className="p-2 rounded-full bg-red-950/20 text-red-400 hover:text-red-300 hover:bg-red-900/40 transition-all active:scale-[0.93]"
                                aria-label="Delete"
                                onClick={handleDeleteConfirm}>
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div
                    className="w-full"
                    role="form"
                    aria-label="Edit review">
                    <h4 className="text-sm font-bold text-textPrimary mb-4">Edit Review</h4>

                    {error && (
                        <div
                            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"
                            role="alert"
                            aria-live="polite">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor={`rating-${review._id}`}
                            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                            Rating
                        </label>
                        <EditableStarRating
                            id={`rating-${review._id}`}
                            rating={updatedRating}
                            onRatingChange={setUpdatedRating}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor={`comment-${review._id}`}
                            className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                            Comment
                        </label>
                        <textarea
                            id={`comment-${review._id}`}
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-textPrimary placeholder:text-zinc-500 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 resize-none"
                            rows="4"
                            required
                            aria-required="true"
                            aria-label="Review comment"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-750 active:scale-[0.98] text-zinc-350 hover:text-textPrimary font-semibold text-xs transition-all"
                            onClick={() => {
                                setIsEditing(false);
                                setError(null);
                            }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-full bg-primary hover:bg-amber-700 active:scale-[0.98] text-white font-semibold text-xs shadow-md shadow-primary/10 transition-all"
                            onClick={handleUpdateReview}
                            disabled={loading}
                            aria-busy={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-bold text-textPrimary tracking-tight mb-2">
                            Delete Review
                        </h3>
                        <p className="text-sm text-textSecondary leading-relaxed mb-6">
                            Are you sure you want to delete this review? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="flex-1 py-2 rounded-full bg-zinc-800 hover:bg-zinc-750 active:scale-[0.98] text-zinc-300 font-semibold text-sm transition-all"
                                onClick={handleDeleteCancel}>
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2 rounded-full bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white font-semibold text-sm transition-all"
                                onClick={() => handleDeleteReview(review._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
