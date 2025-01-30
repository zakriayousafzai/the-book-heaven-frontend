'use client';
import { useState, useEffect, useContext } from 'react';
import { BooksContext } from '../ContextAPI/booksAPI';
import BookGrid from './BookGrid';
import BookForm from './BookForm';

const BookList = () => {
  const { booksData, setBooksData } = useContext(BooksContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (booksData) {
      setLoading(false);
    }
  }, [booksData]);

  return (
    <div className="flex flex-col p-5 items-center">

      <span className='md:w-[60vw] lg:w-[50vw] w-[80vw]'>
      <h1 className="text-4xl text-center m-5">Discover Your Next Great Read at The Book Heaven!</h1>
      </span>
      
      <BookForm/>

      <h1 className="text-xl text-textSecondary mt-10 mb-3">List of Recommended Books</h1>

      {!loading ? (
        <BookGrid bookData={booksData} />
      ) : (
        <p className="text-center mt-10">Loading...</p>
      )}
    </div>
  );
};

export default BookList;
