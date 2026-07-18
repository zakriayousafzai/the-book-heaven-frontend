import React, { useState } from "react";
import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

/**
 * EditableStarRating Component
 * Interactive star rating component with hover effects using consistent Heroicons
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
            className="flex items-center gap-1.5 cursor-pointer"
            role="radiogroup"
            aria-label="Rating selector"
            id={id}>
            {[...Array(totalStars)].map((_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= (hoverRating || rating);

                return (
                    <button
                        key={index}
                        type="button"
                        role="radio"
                        aria-checked={starNumber === rating}
                        aria-label={`${starNumber} star${starNumber === 1 ? "" : "s"}`}
                        onMouseEnter={() => handleMouseEnter(starNumber)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starNumber)}
                        className="transition-all duration-150 transform hover:scale-115 focus:outline-none focus:ring-4 focus:ring-primary/20 rounded-md p-0.5">
                        {isFilled ? (
                            <SolidStar className="w-6 h-6 fill-amber-500" />
                        ) : (
                            <OutlineStar className="w-6 h-6 text-zinc-600" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default EditableStarRating;
