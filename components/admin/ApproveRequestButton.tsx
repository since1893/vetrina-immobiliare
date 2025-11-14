'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type ApproveRequestButtonProps = {
  requestId: string
  userId: string
  adminId: string
}

export default function ApproveRequestButton({ requestId, userId, adminId }: ApproveRequestButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async () => {
    if (!confirm('Sei sicuro di voler approvare questa richiesta? L\'utente diventerà inserzionista.')) {
      return
    }

    setLoading(true)

    try {
      // 1. Aggiorna la richiesta
      const { error: requestError } = await supabase
        .from('role_requests')
        .update({
          status: 'approvato',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId)

      if (requestError) {
        console.error('Errore aggiornamento richiesta:', requestError)
        throw requestError
      }

      // 2. Aggiorna il ruolo dell'utente a "inserzionista"
      const { error: userError } = await supabase
        .from('users')
        .update({ role: 'inserzionista' })
        .eq('id', userId)

      if (userError) {
        console.error('Errore aggiornamento ruolo:', userError)
        throw userError
      }

      alert('✅ Richiesta approvata! L\'utente è ora inserzionista.')
      router.refresh()
    } catch (error: any) {
      console.error('Errore approvazione:', error)
      alert('Errore durante l\'approvazione della richiesta: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <span>⏳</span>
          <span>Approvazione...</span>
        </>
      ) : (
        <>
          <span>✅</span>
          <span>Approva</span>
        </>
      )}
    </button>
  )
}
