import { BookDetails } from "./components/BookDetails";
import { RelatedBooks } from "./components/RelatedBooks";
import ReviewSection from "./components/ReviewSection";

const BookDetailsPage = ({ params }) => {

    return (
        <main className="flex flex-col min-h-screen">

            {/* Book Details Section */}
            <div className="relative flex px-5 py-10 h-full cursor-default text-textPrimary">
                <BookDetails params={params}/>
            </div>

            {/* Review Section */}
            <ReviewSection params={params}/>

            <RelatedBooks params={params}/>
        </main>
    );
};

export default BookDetailsPage;
