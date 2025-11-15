'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type DeleteRequestButtonProps = {
  requestId: string
}

export default function DeleteRequestButton({ requestId }: DeleteRequestButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questa richiesta? Questa azione è irreversibile.')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('role_requests')
        .delete()
        .eq('id', requestId)

      if (error) throw error

      alert('✅ Richiesta eliminata con successo!')
      router.refresh()
    } catch (error: any) {
      console.error('Errore eliminazione:', error)
      alert('Errore durante l\'eliminazione: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '⏳' : '🗑️'} Elimina
    </button>
  )
}
