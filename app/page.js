import Navbar from "./components/Navbar";
import BookList from "./components/BookList";

export default function Home() {
    return (
        <main className="h-screen w-full bg-cover bg-center bg-BGImage">
            <header>
                <Navbar />
            </header>
            <section aria-label="Book Collection">
                <BookList />
            </section>
        </main>
    );
}
