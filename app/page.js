import BookList from "./components/BookList";

export default function Home() {
    return (
        <main className="h-screen w-full bg-cover bg-center bg-BGImage">
            <section aria-label="Book Collection">
                <BookList />
            </section>
        </main>
    );
}
