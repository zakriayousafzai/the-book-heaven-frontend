import { BookDetails } from "./components/BookDetails";
import { RelatedBooks } from "./components/RelatedBooks";
import ReviewSection from "./components/ReviewSection";

const BookDetailsPage = ({ params }) => {
    return (
        <main className="min-h-screen w-full py-8 md:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Book Details Section */}
                <section aria-label="Book Information">
                    <BookDetails params={params}/>
                </section>

                {/* Review Section */}
                <section aria-label="Book Reviews" className="border-t border-border/40 pt-16">
                    <ReviewSection params={params}/>
                </section>

                {/* Related Books */}
                <section aria-label="Related Recommendations" className="border-t border-border/40 pt-16">
                    <RelatedBooks params={params}/>
                </section>
            </div>
        </main>
    );
};

export default BookDetailsPage;
