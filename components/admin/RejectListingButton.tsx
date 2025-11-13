'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type RejectListingButtonProps = {
  listingId: string
  adminId: string
}

export default function RejectListingButton({ listingId, adminId }: RejectListingButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Inserisci una motivazione per il rifiuto')
      return
    }

    setLoading(true)

    try {
      // Nota: salviamo la motivazione in un campo "admin_notes" 
      // (dovresti aggiungerlo alla tabella listings se vuoi salvarlo)
      const { error } = await supabase
        .from('listings')
        .update({
          status: 'rifiutato',
        })
        .eq('id', listingId)

      if (error) throw error

      // TODO: Se vuoi salvare la motivazione, aggiungi campo "rejection_reason" alla tabella listings
      // e includi: rejection_reason: reason.trim()

      setShowModal(false)
      router.refresh()
    } catch (error: any) {
      console.error('Errore rifiuto:', error)
      alert('Errore durante il rifiuto dell\'annuncio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center gap-1"
      >
        ❌ Rifiuta
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rifiuta Annuncio
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Inserisci una motivazione per il rifiuto (opzionale ma consigliato).
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4"
              placeholder="Es: L'annuncio contiene informazioni non veritiere..."
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
                disabled={loading}
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
