import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const useBooksStore = create((set) => ({
    booksData: [],
    loading: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,

    setBooksData: (data) =>
        set((state) => ({
            booksData:
                typeof data === "function" ? data(state.booksData) : data,
            loading: false,
            error: null,
        })),

    setError: (error) => set({ error, loading: false }),

    setPage: (page) => set({ currentPage: page }),

    fetchBooks: async ({ page = 1, limit = 10 } = {}) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(
                `${API_URL}/api/books?page=${page}&limit=${limit}`,
            );
            const { data, pagination } = response.data;
            set({
                booksData: data,
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalItems: pagination.totalItems,
                limit: pagination.limit,
                loading: false,
                error: null,
            });
        } catch (err) {
            set({
                error: "Failed to fetch books. Please try again later.",
                loading: false,
            });
            console.error("Error fetching books:", err);
        }
    },
}));
