import React, { useState } from "react";

/**
 * EditableStarRating Component
 * Interactive star rating component with hover effects
 *
 * @param {Object} props
 * @param {number} props.rating - Current rating value (1-5)
 * @param {Function} props.onRatingChange - Handler for rating changes
 * @param {string} [props.id] - Optional ID for accessibility
 */
const EditableStarRating = ({ rating, onRatingChange, id }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const totalStars = 5;

    const handleMouseEnter = (starIndex) => {
        setHoverRating(starIndex);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (starIndex) => {
        onRatingChange(starIndex);
    };

    return (
        <div
            className="flex text-2xl cursor-pointer"
            role="radiogroup"
            aria-label="Rating selector"
            id={id}>
            {[...Array(totalStars)].map((_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= (hoverRating || rating);

                return (
                    <span
                        key={index}
                        role="radio"
                        aria-checked={starNumber === rating}
                        aria-label={`${starNumber} star${starNumber === 1 ? "" : "s"}`}
                        tabIndex={0}
                        onMouseEnter={() => handleMouseEnter(starNumber)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starNumber)}
                        onKeyPress={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                handleClick(starNumber);
                            }
                        }}
                        className={`transition-colors duration-200 ${
                            isFilled ? "text-accent" : "text-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-accent rounded`}>
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default EditableStarRating;
