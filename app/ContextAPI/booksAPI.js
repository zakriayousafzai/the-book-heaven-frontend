'use client'
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import axios from "axios"

export const BooksContext = createContext()

export const BooksProvider = ({ children }) => {


    const [booksData, setBooksData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    const fetchBooks = useCallback( async () => {
        setLoading(true); // Set loading state
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
          setBooksData(response.data);
          console.log(response.data)
          setError(null);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }, [])

    useEffect(() => {
        fetchBooks();
      }, [fetchBooks]);

      console.log('api', booksData)

  
    return (
      <BooksContext.Provider value={{booksData, setBooksData}}>
        {children}
      </BooksContext.Provider>
    )
  }