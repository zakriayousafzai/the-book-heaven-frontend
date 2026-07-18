import BookList from "./components/BookList";

export default function Home() {
    return (
        <main className="w-full py-8 md:py-12">
            <section aria-label="Book Collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <BookList />
            </section>
        </main>
    );
}
