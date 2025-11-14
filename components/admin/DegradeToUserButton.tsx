'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type DegradeToUserButtonProps = {
  userId: string
  currentRole: string
}

export default function DegradeToUserButton({ userId, currentRole }: DegradeToUserButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Mostra solo se è inserzionista
  if (currentRole !== 'inserzionista') {
    return null
  }

  const handleDegrade = async () => {
    if (!confirm('Sei sicuro di voler revocare il ruolo inserzionista? L\'utente tornerà ad essere utente base e non potrà più pubblicare annunci.')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: 'utente' })
        .eq('id', userId)

      if (error) throw error

      alert('✅ Ruolo revocato! L\'utente è ora utente base.')
      router.refresh()
    } catch (error: any) {
      console.error('Errore degradazione:', error)
      alert('Errore durante la revoca: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDegrade}
      disabled={loading}
      className="px-3 py-1.5 text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '⏳' : '⬇️'} Degrada
    </button>
  )
}
