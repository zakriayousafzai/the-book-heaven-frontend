'use client';

import React, { useState } from 'react';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import StarRating from './StarRating';
import EditableStarRating from './EditableStarRating';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import BookLoading from '@/app/components/BookLoading';

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
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
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
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setReviews((prevReviews) =>
                prevReviews.map((r) =>
                    r._id === review._id ? response.data.updatedReview : r
                )
            );

            setIsEditing(false);
            setError(null);
        } catch (err) {
            console.error("Error updating review:", err);
            setError("Failed to update review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div key={review._id} className="w-full flex justify-between bg-surface shadow-md p-4 rounded-md">
            {!isEditing ? (
                <>
                    <div>
                        <div className="text-accent flex items-center">
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-lg font-semibold text-textPrimary w-[60vw] break-words">
                            {review.reviewerName}
                        </p>
                        <p className="mt-2 text-textSecondary w-[60vw] break-words">{review.comment}</p>
                    </div>

                    {(isAuthenticated && review.userId === userId) && (
                        <div className="flex flex-col gap-4">
                            {/* Delete Icon */}
                            <button
                                className="p-2 rounded-full bg-background hover:bg-accent"
                                aria-label="Delete"
                                onClick={handleDeleteConfirm}
                            >
                                <TrashIcon className="w-6 h-6 hover:stroke-black" />
                            </button>

                            {/* Edit Icon */}
                            <button
                                className="p-2 rounded-full bg-background hover:bg-accent"
                                aria-label="Edit"
                                onClick={() => setIsEditing(true)}
                            >
                                <PencilSquareIcon className="w-6 h-6 hover:stroke-black" />
                            </button>
                        </div>
                    )}

                </>
            ) : (
                <div className="w-full bg-surface" role="form" aria-label="Edit review">
                    {error && (
                        <div
                            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
                            role="alert"
                            aria-live="polite"
                        >
                            {error}
                        </div>
                    )}

                    <div className="mb-2">
                        <label
                            htmlFor={`rating-${review._id}`}
                            className="block text-sm font-medium text-secondary mb-2"
                        >
                            Rating
                        </label>
                        <EditableStarRating
                            id={`rating-${review._id}`}
                            rating={updatedRating}
                            onRatingChange={setUpdatedRating}
                        />
                    </div>

                    <div className="mb-2">
                        <label
                            htmlFor={`comment-${review._id}`}
                            className="block text-sm font-medium text-secondary"
                        >
                            Comment
                        </label>
                        <textarea
                            id={`comment-${review._id}`}
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-accent focus:border-border sm:text-sm bg-background"
                            required
                            aria-required="true"
                            aria-label="Review comment"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                            onClick={handleUpdateReview}
                            disabled={loading}
                            aria-busy={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            className="p-2 bg-secondary text-textPrimary rounded-md hover:bg-gray-600"
                            onClick={() => {
                                setIsEditing(false);
                                setError(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {loading && (
                <div className='absolute text-center right-0 left-0'>
                    <BookLoading size="lg" />
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-surface p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-textPrimary mb-4">Delete Review</h3>
                        <p className="text-textSecondary mb-6">Are you sure you want to delete this review?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-secondary text-textPrimary rounded hover:bg-gray-600"
                                onClick={handleDeleteCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => handleDeleteReview(review._id)}
                            >
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
