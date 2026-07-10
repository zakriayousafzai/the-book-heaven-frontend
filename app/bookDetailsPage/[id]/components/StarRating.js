import React from "react";

/**
 * StarRating Component
 * Displays a non-interactive star rating
 *
 * @param {Object} props
 * @param {number} props.rating - The rating value (1-5)
 */
const StarRating = ({ rating }) => {
    const totalStars = 5;
    const filledStars = "★".repeat(rating); // Filled stars based on the rating
    const emptyStars = "☆".repeat(totalStars - rating); // Remaining empty stars

    return (
        <div
            className="text-accent"
            role="img"
            aria-label={`${rating} out of ${totalStars} stars`}>
            {filledStars}
            {emptyStars}
        </div>
    );
};

export default StarRating;
