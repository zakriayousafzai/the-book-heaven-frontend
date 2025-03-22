import React, { useState, useContext } from 'react';
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import StarRating from './StarRating';
import axios from 'axios';
import { AuthContext } from '@/app/ContextAPI/AuthContextApi';

const ReviewCard = ({ review, setReviews }) => {
    const { isAuthenticated, token, userId, userRole } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState(review.comment);
    const [updatedRating, setUpdatedRating] = useState(review.rating);

    const handleDeleteReview = async (id) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });
            setReviews((prevReviews) => prevReviews.filter((review) => review._id !== id));
            console.log('Review Deleted Successfully');
        } catch (err) {
            console.error("Error deleting review:", err.message);
        }
    };

    const handleUpdateReview = async () => {
        try {
            const updatedReview = {
                comment: updatedComment,
                rating: updatedRating,
            };

            // Send updated review to the backend
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review._id}`, updatedReview, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });

            // Update the local state with the updated review
            setReviews((prevReviews) =>
                prevReviews.map((r) =>
                    r._id === review._id ? response.data.updatedReview : r
                )
            );

            setIsEditing(false); // Close the editing form
            console.log('Review Updated Successfully');
        } catch (err) {
            console.error("Error updating review:", err.message);
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

                    {(isAuthenticated && review.userId === userId || userRole === 'admin') && (
                        <div className="flex flex-col gap-4">
                            {/* Delete Icon */}
                            <button
                                className="p-2 rounded-full bg-background hover:bg-accent"
                                aria-label="Delete"
                                onClick={() => handleDeleteReview(review._id)}
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
                <div className="w-full bg-surface">

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-secondary">Comment</label>
                        <textarea
                            value={updatedComment}
                            onChange={(e) => setUpdatedComment(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-accent focus:border-border sm:text-sm bg-background"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-secondary">Rating</label>
                        <select
                            value={updatedRating}
                            onChange={(e) => setUpdatedRating(parseInt(e.target.value))}
                            className="w-[70%] p-3 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        >
                            <option value="" disabled>
                                Select a rating
                            </option>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'Star' : 'Stars'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className="p-2 bg-primary text-textPrimary rounded-md hover:bg-blue-600"
                            onClick={handleUpdateReview}
                        >
                            Save
                        </button>
                        <button
                            className="p-2 bg-secondary text-textPrimary rounded-md hover:bg-gray-600"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;
