import React from 'react'

const StarRating = ({ rating }) => {
    const totalStars = 5; // Total stars available
    const filledStars = "★".repeat(rating); // Filled stars based on the rating
    const emptyStars = "☆".repeat(totalStars - rating); // Remaining empty stars
  
    return (
      <div className="text-accent">
        {filledStars}
        {emptyStars}
      </div>
    );
}

export default StarRating
