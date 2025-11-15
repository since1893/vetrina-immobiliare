import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils/formatting'
import ApproveRequestButton from '@/components/admin/ApproveRequestButton'
import RejectRequestButton from '@/components/admin/RejectRequestButton'
import DeleteRequestButton from '@/components/admin/DeleteRequestButton'
import EditRequestNotesButton from '@/components/admin/EditRequestNotesButton'

export default async function AdminRichiesePage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifica ruolo admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Query richieste con filtro
  let query = supabase
    .from('role_requests')
    .select(`
      *,
      user:user_id (
        id,
        email,
        full_name,
        phone,
        role
      )
    `)
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: requests } = await query

  // Conta per status
  const { data: allRequests } = await supabase
    .from('role_requests')
    .select('status')

  const counts = {
    tutte: allRequests?.length || 0,
    in_attesa: allRequests?.filter(r => r.status === 'in_attesa').length || 0,
    approvato: allRequests?.filter(r => r.status === 'approvato').length || 0,
    rifiutato: allRequests?.filter(r => r.status === 'rifiutato').length || 0,
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Richieste Inserzionista
        </h1>
        <p className="text-gray-600">
          Approva, rifiuta o gestisci le richieste di upgrade a inserzionista
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{counts.tutte}</div>
          <div className="text-sm text-gray-600">Totali</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{counts.in_attesa}</div>
          <div className="text-sm text-gray-600">In Attesa</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{counts.approvato}</div>
          <div className="text-sm text-gray-600">Approvate</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{counts.rifiutato}</div>
          <div className="text-sm text-gray-600">Rifiutate</div>
        </div>
      </div>

      {/* Filtri */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/richieste"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !searchParams.status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutte ({counts.tutte})
          </a>
          <a
            href="/admin/richieste?status=in_attesa"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchParams.status === 'in_attesa'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⏳ In Attesa ({counts.in_attesa})
          </a>
          <a
            href="/admin/richieste?status=approvato"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchParams.status === 'approvato'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Approvate ({counts.approvato})
          </a>
          <a
            href="/admin/richieste?status=rifiutato"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchParams.status === 'rifiutato'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ❌ Rifiutate ({counts.rifiutato})
          </a>
        </div>
      </div>

      {/* Lista Richieste */}
      {requests && requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => {
            const requestUser = Array.isArray(request.user) ? request.user[0] : request.user

            return (
              <div key={request.id} className="card">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Info Utente */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                            {requestUser?.full_name?.[0]?.toUpperCase() || requestUser?.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {requestUser?.full_name || 'N/D'}
                            </h3>
                            <p className="text-sm text-gray-600">{requestUser?.email || 'Email non disponibile'}</p>
                            {requestUser?.phone && (
                              <p className="text-sm text-gray-500">📞 {requestUser.phone}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="badge badge-info text-xs capitalize">
                            Ruolo attuale: {requestUser?.role || 'N/D'}
                          </span>
                          <span
                            className={`badge text-xs ${
                              request.status === 'in_attesa' ? 'badge-warning' :
                              request.status === 'approvato' ? 'badge-success' :
                              'badge-danger'
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Motivazione */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Motivazione:</h4>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {request.reason || 'Nessuna motivazione fornita'}
                      </p>
                    </div>

                    {/* Note Admin */}
                    {request.admin_notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Note Admin:</h4>
                        <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          {request.admin_notes}
                        </p>
                      </div>
                    )}

                    {/* Info Revisione */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📅 Richiesta inviata: {formatDate(request.created_at)}</p>
                      {request.reviewed_at && (
                        <p>🕐 Revisionata il: {formatDate(request.reviewed_at)}</p>
                      )}
                    </div>
                  </div>

                  {/* Azioni */}
                  <div className="flex flex-col gap-3 md:w-48">
                    {/* Azioni per richieste in attesa */}
                    {request.status === 'in_attesa' && requestUser?.id && (
                      <>
                        <ApproveRequestButton 
                          requestId={request.id} 
                          userId={requestUser.id}
                          adminId={user.id}
                        />
                        <RejectRequestButton 
                          requestId={request.id}
                          adminId={user.id}
                        />
                      </>
                    )}

                    {/* Azioni disponibili per tutte le richieste */}
                    <EditRequestNotesButton 
                      requestId={request.id}
                      currentNotes={request.admin_notes}
                    />
                    <DeleteRequestButton requestId={request.id} />

                    {/* Badge stato per richieste già processate */}
                    {request.status !== 'in_attesa' && (
                      <div className="text-center text-gray-500 text-sm mt-2">
                        {request.status === 'approvato' ? '✅ Già approvata' : '❌ Rifiutata'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nessuna richiesta
          </h2>
          <p className="text-gray-600">
            {searchParams.status
              ? `Nessuna richiesta con stato "${searchParams.status}"`
              : 'Non ci sono richieste da gestire al momento'}
          </p>
        </div>
      )}
    </div>
  )
}
