'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type EditRequestNotesButtonProps = {
  requestId: string
  currentNotes: string | null
}

export default function EditRequestNotesButton({ requestId, currentNotes }: EditRequestNotesButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [notes, setNotes] = useState(currentNotes || '')
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setLoading(true)

    try {
      const { error } = await supabase
        .from('role_requests')
        .update({ admin_notes: notes.trim() || null })
        .eq('id', requestId)

      if (error) throw error

      alert('✅ Note aggiornate con successo!')
      setShowModal(false)
      router.refresh()
    } catch (error: any) {
      console.error('Errore aggiornamento note:', error)
      alert('Errore durante l\'aggiornamento: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
      >
        ✏️ {currentNotes ? 'Modifica Note' : 'Aggiungi Note'}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Modifica Note Admin
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Aggiungi o modifica le note per questa richiesta (visibili all'utente se rifiutata).
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
              placeholder="Es: Fornire ulteriori informazioni..."
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
                onClick={handleSave}
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? '⏳ Salvataggio...' : '💾 Salva Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
