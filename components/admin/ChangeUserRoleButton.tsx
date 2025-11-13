'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type ChangeUserRoleButtonProps = {
  userId: string
  currentRole: string
}

export default function ChangeUserRoleButton({ userId, currentRole }: ChangeUserRoleButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const roles = [
    { value: 'utente', label: 'Utente', color: 'bg-blue-100 text-blue-800' },
    { value: 'inserzionista', label: 'Inserzionista', color: 'bg-green-100 text-green-800' },
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
  ]

  const handleChangeRole = async (newRole: string) => {
    if (newRole === currentRole) {
      setIsOpen(false)
      return
    }

    if (!confirm(`Sei sicuro di voler cambiare il ruolo in "${newRole}"?`)) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      router.refresh()
      setIsOpen(false)
    } catch (error: any) {
      console.error('Errore cambio ruolo:', error)
      alert('Errore durante il cambio ruolo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        disabled={loading}
      >
        {loading ? '⏳' : '🔄'} Ruolo
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {roles.map((role) => (
              <button
                key={role.value}
                onClick={() => handleChangeRole(role.value)}
                disabled={loading}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  currentRole === role.value ? 'bg-gray-100 font-medium' : ''
                }`}
              >
                <span className={`badge ${role.color} text-xs mr-2`}>
                  {role.label}
                </span>
                {currentRole === role.value && '✓'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
