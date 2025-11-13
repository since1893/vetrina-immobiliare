'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RequestInserzionista({ userId }: { userId: string }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (reason.trim().length < 20) {
      setError('La motivazione deve contenere almeno 20 caratteri')
      setLoading(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('role_requests')
        .insert({
          user_id: userId,
          requested_role: 'inserzionista',
          status: 'in_attesa',
          reason: reason.trim(),
        })

      if (insertError) throw insertError

      setSuccess(true)
      
      // Refresh dopo 2 secondi
      setTimeout(() => {
        router.refresh()
      }, 2000)

    } catch (error: any) {
      setError(error.message || 'Errore durante l\'invio della richiesta')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
        <p className="font-semibold text-green-900 mb-1">✅ Richiesta Inviata!</p>
        <p className="text-sm text-green-800">
          Un admin esaminerà la tua richiesta a breve.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-primary-900 mb-2">
          Perché vuoi diventare inserzionista?
        </label>
        <textarea
          id="reason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
          placeholder="Descrivi brevemente il motivo della tua richiesta... (minimo 20 caratteri)"
          required
        />
        <p className="text-xs text-primary-700 mt-1">
          {reason.length}/20 caratteri minimi
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || reason.trim().length < 20}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Invio in corso...' : '📤 Invia Richiesta'}
      </button>
    </form>
  )
}
