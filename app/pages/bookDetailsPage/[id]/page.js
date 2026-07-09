'use client'

import { useMemo, useState, useEffect } from 'react'
import { useBooksStore } from '@/app/store/useBooksStore';
import axios from "axios"
import { useAuth } from '@clerk/nextjs'
import EditableStarRating from './components/EditableStarRating'
import { BookDetails } from './components/BookDetails'
import { RelatedBooks } from './components/RelatedBooks'
import ReviewCard from './components/ReviewCard'
import Navbar from '@/app/components/Navbar'
import BookLoading from '@/app/components/BookLoading'

/**
 * BookDetailsPage Component
 * Displays detailed information about a specific book, including reviews and related books
 *
 * @param {Object} props
 * @param {Object} props.params - URL parameters
 * @param {string} props.params.id - Book ID from URL
 */
const BookDetailsPage = ({ params }) => {
    const { isSignedIn, userName, getToken } = useAuth();
    const isAuthenticated = isSignedIn;
    const { booksData } = useBooksStore();
    const param = use(params);
    const id = param.id;

    // State management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Form state
    const [reviewerName, setReviewerName] = useState('');
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (booksData) {
            setLoading(false);
        }

        /**
         * Fetches reviews for the current book
         */
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reviews`);
                setReviews(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load reviews. Please try again later.');
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchReviews();
            setReviewerName(userName);
        }

    }, [booksData, id, userName]);

    // Find current book
    const currentBook = useMemo(() =>
        booksData?.find((book) => book._id === id), [booksData, id]);

    // Filter related books
    const relatedBooks = useMemo(() => {
        if (!currentBook) return [];
        return booksData?.filter((book) => book.genre === currentBook.genre);
    }, [currentBook, booksData]);

    // Handle review submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!comment || rating < 1 || rating > 5) {
            setError('Please fill out all fields correctly.');
            setLoading(false);
            return;
        }

        const newReview = { reviewerName, rating, comment };

try {

                // Send the new review to the backend
                const token = await getToken()
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reviews`, newReview, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

            setReviews((prevReviews) => [...prevReviews, response.data.newReview]);
            console.log('Review submitted successfully');

        } catch (err) {
            console.error("Error submitting review:", err);
            setError("Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
            setRating(1);
            setComment('');
        }
    };

    if (!currentBook) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <BookLoading size="lg" />
            </div>
        );
    }

    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />

            {/* Book Details Section */}
            <div className="relative flex px-5 py-10 h-full cursor-default text-textPrimary">
                <BookDetails book={currentBook} />
            </div>


            {/* Review Section */}
            <section className="px-5 py-10 sm:px-14">
                <h2 className="text-2xl font-semibold mb-5">Reviews</h2>

                {/* Display existing reviews */}
                <div className="space-y-4 mb-6">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <ReviewCard
                                key={review._id}
                                review={review}
                                setReviews={setReviews} />
                        ))
                    ) : (
                        <p className="text-textSecondary">No reviews yet. Be the first to leave one!</p>
                    )}
                </div>

                {loading && (
                    <div className='absolute text-center right-0 left-0'>
                        <BookLoading size="lg" />
                    </div>
                )}

                {!isAuthenticated && (
                    <div className="mb-4">
                        <p className="text-textSecondary">Please log in to leave a review.</p>
                    </div>
                )}

                {/* Review submission form for authenticated users */}
                {isAuthenticated && (
                    <form
                        onSubmit={handleReviewSubmit}
                        className="flex flex-col gap-4 border border-border p-3 rounded-md bg-surface"
                        aria-label="Review submission form"
                    >
                        {error && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                role="alert"
                                aria-live="polite"
                            >
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Rating selection */}
                        <div className="">
                            <label
                                htmlFor="rating"
                                className="block text-sm font-medium text-secondary mb-2"
                            >
                                Rating (required)
                            </label>
                            <EditableStarRating
                                rating={rating}
                                onRatingChange={setRating}
                                id="rating"
                                aria-label="Select rating from 1 to 5 stars"
                            />
                        </div>

                        {/* Review comment */}
                        <div>
                            <label
                                htmlFor="comment"
                                className="block text-sm font-medium text-secondary mb-2"
                            >
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
                            className={`self-start bg-primary text-white px-5 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-black'}`}
                            aria-busy={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                )}
            </section>

            <RelatedBooks books={relatedBooks} />
        </main>
    );
};

export default BookDetailsPage;
