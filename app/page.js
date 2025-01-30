import Image from "next/image";
import BookList from "./components/BookList";


export default function Home() {
  return (
    <div className="h-screen w-full bg-cover bg-center">
        <BookList/>
    </div>
  );
}
