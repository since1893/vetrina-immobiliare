import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RequestInserzionista from '@/components/dashboard/RequestInserzionista'

export default async function ProfiloPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Verifica se ha una richiesta pendente
  const { data: pendingRequest } = await supabase
    .from('role_requests')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'in_attesa')
    .single()

  // Verifica se ha richieste rifiutate
  const { data: rejectedRequests } = await supabase
    .from('role_requests')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'rifiutato')
    .order('created_at', { ascending: false })
    .limit(1)

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Il Mio Profilo</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informazioni Personali */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informazioni Personali</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <p className="text-gray-900">{userData?.full_name || 'Non impostato'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{userData?.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefono
                </label>
                <p className="text-gray-900">{userData?.phone || 'Non impostato'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ruolo
                </label>
                <span className="badge badge-info capitalize">
                  {userData?.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stato Account
                </label>
                <span className={`badge ${
                  userData?.status === 'attivo' ? 'badge-success' :
                  userData?.status === 'sospeso' ? 'badge-danger' :
                  'badge-warning'
                }`}>
                  {userData?.status}
                </span>
              </div>
            </div>

            {/* Pulsante Modifica (da implementare) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="btn-secondary" disabled>
                ✏️ Modifica Profilo (Prossimamente)
              </button>
            </div>
          </div>

          {/* Richieste Precedenti Rifiutate */}
          {rejectedRequests && rejectedRequests.length > 0 && (
            <div className="card bg-red-50 border-red-200">
              <h3 className="font-semibold text-red-900 mb-2">❌ Ultima Richiesta Rifiutata</h3>
              <p className="text-sm text-red-700 mb-2">
                Data: {new Date(rejectedRequests[0].created_at).toLocaleDateString('it-IT')}
              </p>
              {rejectedRequests[0].admin_notes && (
                <div className="bg-white rounded p-3 text-sm text-gray-700">
                  <strong>Motivazione admin:</strong>
                  <p className="mt-1">{rejectedRequests[0].admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Upgrade Account */}
        <div className="space-y-6">
          {userData?.role === 'utente' && (
            <div className="card bg-primary-50 border-primary-200">
              <h2 className="text-xl font-bold text-primary-900 mb-4">
                🚀 Diventa Inserzionista
              </h2>
              
              <p className="text-sm text-primary-800 mb-4">
                Richiedi di diventare inserzionista per:
              </p>

              <ul className="space-y-2 text-sm text-primary-700 mb-6">
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Pubblicare annunci illimitati</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Gestire i tuoi immobili</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Ricevere contatti diretti</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Dashboard dedicata</span>
                </li>
              </ul>

              {pendingRequest ? (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-center">
                  <p className="font-semibold text-yellow-900 mb-1">⏳ Richiesta Inviata</p>
                  <p className="text-sm text-yellow-800">
                    In attesa di approvazione da parte dell'admin
                  </p>
                  <p className="text-xs text-yellow-700 mt-2">
                    Inviata il {new Date(pendingRequest.created_at).toLocaleDateString('it-IT')}
                  </p>
                </div>
              ) : (
                <RequestInserzionista userId={user.id} />
              )}
            </div>
          )}

          {(userData?.role === 'inserzionista' || userData?.role === 'admin') && (
            <div className="card bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">✅ Account Attivo</h3>
              <p className="text-sm text-green-700 mb-4">
                Il tuo account è abilitato alla pubblicazione di annunci.
              </p>
              <a href="/dashboard/inserzionista/annunci/nuovo" className="btn-primary w-full text-center block">
                ➕ Crea Nuovo Annuncio
              </a>
            </div>
          )}

          {/* Info Account */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Statistiche Account</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Membro dal:</span>
                <span className="font-medium text-gray-900">
                  {new Date(userData?.created_at || '').toLocaleDateString('it-IT')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ultimo aggiornamento:</span>
                <span className="font-medium text-gray-900">
                  {new Date(userData?.updated_at || '').toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
