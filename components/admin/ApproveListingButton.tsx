'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type ApproveListingButtonProps = {
  listingId: string
  adminId: string
}

export default function ApproveListingButton({ listingId, adminId }: ApproveListingButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async () => {
    if (!confirm('Sei sicuro di voler approvare e pubblicare questo annuncio?')) {
      return
    }

    setLoading(true)

    try {
      const now = new Date().toISOString()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 90) // Scadenza 90 giorni

      const { error } = await supabase
        .from('listings')
        .update({
          status: 'pubblicato',
          published_at: now,
          expires_at: expiresAt.toISOString(),
        })
        .eq('id', listingId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      console.error('Errore approvazione:', error)
      alert('Errore durante l\'approvazione dell\'annuncio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="px-3 py-1.5 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
    >
      {loading ? '⏳' : '✅'} Approva
    </button>
  )
}
