import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useFavoriteStore = create((set) => ({
  favoritesData: [],
  loading: true,
  error: null,

  setFavoritesData: (data) => set({ favoritesData: data, loading: false, error: null }),

  setError: (error) => set({ error, loading: false }),

  fetchFavorites: async ({ token, userId }) => {
    if (!token || !userId) {
      set({ favoritesData: [], loading: false, error: null })
      return
    }

    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/api/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      set({ favoritesData: response.data, loading: false, error: null })
    } catch (err) {
      set({ error: 'Failed to fetch favorites. Please try again later.', loading: false })
      console.error('Error fetching favorites:', err)
    }
  },
}))