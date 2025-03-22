'use client'
import { useContext, useMemo, useState, useEffect, use } from 'react'
import { BooksContext } from '@/app/ContextAPI/booksAPI'
import axios from "axios"
import { AuthContext } from '@/app/ContextAPI/AuthContextApi'
import { BookDetails } from './components/BookDetails'
import { RelatedBooks } from './components/RelatedBooks'
import ReviewCard from './components/ReviewCard'
import Navbar from '@/app/components/Navbar'

const BookDetailsPage = ({ params }) => {

    const { isAuthenticated } = useContext(AuthContext);
    const param = use(params);
    const id = param.id;

    const { booksData } = useContext(BooksContext)

    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]); // State for reviews
    const [reviewerName, setReviewerName] = useState(''); // State for reviewer name
    const [rating, setRating] = useState(1); // State for rating
    const [comment, setComment] = useState(''); // State for comment

    useEffect(() => {
        if (booksData) {
            setLoading(false);
        }

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reviews`);
                setReviews(response.data);
                console.log(response.data)

            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();

    }, [booksData, id]);

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

        if (!reviewerName || !comment || rating < 1 || rating > 5) {
            alert('Please fill out all fields correctly.');
            return;
        }

        const newReview = { reviewerName, rating, comment };

        try {
            setLoading(true);

            // Send the new review to the backend
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}/reviews`, newReview);

            setReviews((prevReviews) => [...prevReviews, response.data.newReview]);

            console.log('Review submitted successfully');

        } catch (err) {

            console.error("Error submitting review:", err.message);
            alert("Failed to submit review. Please try again.");

        } finally {

            setLoading(false);

            // Clear the form fields
            setReviewerName('');
            setRating(1);
            setComment('');
        }
    };




    if (!currentBook) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-textSecondary">Book not found</p>
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

                {/* Review submission form */}
                {isAuthenticated && (
                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                        {/* Reviewer's Name */}
                        <input
                            type="text"
                            placeholder="Your name"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            required
                        />

                        {/* Rating */}
                        <select
                            value={rating}
                            onChange={(e) => setRating(parseInt(e.target.value))}
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

                        {/* Comment */}
                        <textarea
                            placeholder="Write your review..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-border rounded-md focus:outline-none focus:ring focus:ring-accent bg-background"
                            rows="4"
                            required
                        ></textarea>

                        <button
                            type="submit"
                            className="self-start bg-primary text-white px-5 py-2 rounded-md hover:bg-accent hover:text-black"
                        >
                            Submit Review
                        </button>
                    </form>
                )}
            </section>

            <RelatedBooks books={relatedBooks} />
        </main>
    );
};

export default BookDetailsPage;
