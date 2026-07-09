import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useBooksStore = create((set) => ({
  booksData: [],
  loading: true,
  error: null,

  setBooksData: (data) => set((state) => ({
    booksData: typeof data === 'function' ? data(state.booksData) : data,
    loading: false,
    error: null,
  })),

  setError: (error) => set({ error, loading: false }),

  fetchBooks: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/api/books`)
      set({ booksData: response.data, loading: false, error: null })
    } catch (err) {
      set({ error: 'Failed to fetch books. Please try again later.', loading: false })
      console.error('Error fetching books:', err)
    }
  },
}))