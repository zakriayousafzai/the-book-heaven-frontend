import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";

/**
 * StarRating Component
 * Displays a non-interactive star rating using consistent Heroicons
 *
 * @param {Object} props
 * @param {number} props.rating - The rating value (1-5)
 */
const StarRating = ({ rating }) => {
    const totalStars = 5;

    return (
        <div
            className="flex items-center gap-0.5"
            role="img"
            aria-label={`${rating} out of ${totalStars} stars`}>
            {[...Array(totalStars)].map((_, index) => {
                const starNumber = index + 1;
                return starNumber <= rating ? (
                    <SolidStar key={index} className="w-3.5 h-3.5 fill-amber-500" />
                ) : (
                    <OutlineStar key={index} className="w-3.5 h-3.5 text-zinc-600" />
                );
            })}
        </div>
    );
};

export default StarRating;
