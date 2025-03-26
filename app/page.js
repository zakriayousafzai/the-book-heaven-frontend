import Navbar from "./components/Navbar";
import BookList from "./components/BookList";

export default function Home() {
  return (
    <div className="h-screen w-full bg-cover bg-center bg-BGImage">
      <Navbar />
      <BookList />
    </div>
  );
}
