'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RemoveFavoriteButton({ favoriteId }: { favoriteId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRemove = async () => {
    if (!confirm('Sei sicuro di voler rimuovere questo annuncio dai preferiti?')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Errore durante la rimozione:', error)
      alert('Errore durante la rimozione del preferito')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="bg-white hover:bg-red-50 text-red-600 border border-red-300 rounded-lg p-2 shadow-sm transition-colors disabled:opacity-50"
      title="Rimuovi dai preferiti"
    >
      {loading ? '⏳' : '❌'}
    </button>
  )
}
