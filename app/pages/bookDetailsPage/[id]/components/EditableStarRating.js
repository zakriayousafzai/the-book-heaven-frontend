import React, { useState } from 'react';

const EditableStarRating = ({ rating, onRatingChange }) => {
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
        <div className="flex text-2xl cursor-pointer">
            {[...Array(totalStars)].map((_, index) => {
                const starNumber = index + 1;
                const isFilled = starNumber <= (hoverRating || rating);

                return (
                    <span
                        key={index}
                        onMouseEnter={() => handleMouseEnter(starNumber)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleClick(starNumber)}
                        className={`transition-colors duration-200 ${
                            isFilled ? 'text-accent' : 'text-gray-300'
                        }`}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
};

export default EditableStarRating;