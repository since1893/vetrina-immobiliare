'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type RejectRequestButtonProps = {
  requestId: string
  adminId: string
}

export default function RejectRequestButton({ requestId, adminId }: RejectRequestButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleReject = async () => {
    if (!adminNotes.trim()) {
      alert('Inserisci una motivazione per il rifiuto')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('role_requests')
        .update({
          status: 'rifiutato',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes.trim(),
        })
        .eq('id', requestId)

      if (error) throw error

      setShowModal(false)
      router.refresh()
    } catch (error: any) {
      console.error('Errore rifiuto:', error)
      alert('Errore durante il rifiuto della richiesta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <span>❌</span>
        <span>Rifiuta</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rifiuta Richiesta
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Inserisci una motivazione per il rifiuto. Sarà visibile all'utente.
            </p>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
              placeholder="Es: La richiesta non contiene informazioni sufficienti..."
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 btn-secondary"
              >
                Annulla
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !adminNotes.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Rifiuto...' : 'Conferma Rifiuto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
