'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type AddToFavoritesButtonProps = {
  listingId: string
  userId: string
  isFavorite: boolean
}

export default function AddToFavoritesButton({
  listingId,
  userId,
  isFavorite: initialIsFavorite,
}: AddToFavoritesButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleFavorite = async () => {
    setLoading(true)

    try {
      if (isFavorite) {
        // Rimuovi dai preferiti
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('listing_id', listingId)

        if (error) throw error
        setIsFavorite(false)
      } else {
        // Aggiungi ai preferiti
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            listing_id: listingId,
          })

        if (error) throw error
        setIsFavorite(true)
      }

      router.refresh()
    } catch (error: any) {
      console.error('Errore toggle favorite:', error)
      alert('Errore durante l\'operazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 ${
        isFavorite
          ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
      title={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      <span className="text-xl">
        {loading ? '⏳' : isFavorite ? '❤️' : '🤍'}
      </span>
      <span className="font-medium text-sm">
        {isFavorite ? 'Salvato' : 'Salva'}
      </span>
    </button>
  )
}
