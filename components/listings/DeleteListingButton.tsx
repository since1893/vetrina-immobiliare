'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteListingButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo annuncio? Questa azione è irreversibile.')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      console.error('Errore eliminazione:', error)
      alert('Errore durante l\'eliminazione dell\'annuncio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '⏳' : '🗑️'} Elimina
    </button>
  )
}
