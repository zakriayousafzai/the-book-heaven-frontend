'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useBooksStore } from '@/app/store/useBooksStore'
import { useFavoriteStore } from '@/app/store/useFavoriteStore'

export const StoreInitializer = () => {
  const { userId, getToken, isSignedIn } = useAuth()
  const fetchBooks = useBooksStore((state) => state.fetchBooks)
  const fetchFavorites = useFavoriteStore((state) => state.fetchFavorites)

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    if (!isSignedIn || !userId) return

    const loadFavorites = async () => {
      const token = await getToken()
      fetchFavorites({ token, userId })
    }

    loadFavorites()
  }, [isSignedIn, userId, getToken, fetchFavorites])

  return null
}