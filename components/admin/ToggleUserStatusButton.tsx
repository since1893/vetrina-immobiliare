'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type ToggleUserStatusButtonProps = {
  userId: string
  currentStatus: string
}

export default function ToggleUserStatusButton({ userId, currentStatus }: ToggleUserStatusButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleToggle = async () => {
    const newStatus = currentStatus === 'attivo' ? 'sospeso' : 'attivo'
    
    if (!confirm(`Sei sicuro di voler ${newStatus === 'sospeso' ? 'sospendere' : 'riattivare'} questo utente?`)) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      console.error('Errore cambio stato:', error)
      alert('Errore durante il cambio stato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
        currentStatus === 'attivo'
          ? 'bg-red-100 hover:bg-red-200 text-red-700'
          : 'bg-green-100 hover:bg-green-200 text-green-700'
      } disabled:opacity-50`}
    >
      {loading ? '⏳' : currentStatus === 'attivo' ? '🚫 Sospendi' : '✅ Attiva'}
    </button>
  )
}
