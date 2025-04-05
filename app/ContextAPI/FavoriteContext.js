'use client'
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContextApi"

export const FavoriteContext = createContext()

export const FavoriteProvider = ({ children }) => {

    const { token, userId, isAuthenticated } = useContext(AuthContext);
    const [favoritesData, setFavoritesData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
  
    const fetchFavorites = useCallback( async () => {
        setLoading(true);
        if(!isAuthenticated) return;
        try {
            const favorites = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/favorite`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setFavoritesData(favorites.data);
            console.log('Favorite', favorites.data);
        } catch (err) {
            console.error('Error fetching favorite:', err);
        }
      }, [token, userId, isAuthenticated])

    useEffect(() => {
        fetchFavorites();
      }, [fetchFavorites]);

    return (
      <FavoriteContext.Provider value={{favoritesData, setFavoritesData}}>
        {children}
      </FavoriteContext.Provider>
    )
  }