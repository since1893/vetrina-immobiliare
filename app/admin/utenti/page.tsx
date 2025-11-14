import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils/formatting'
import ChangeUserRoleButton from '@/components/admin/ChangeUserRoleButton'
import ToggleUserStatusButton from '@/components/admin/ToggleUserStatusButton'
import DegradeToUserButton from '@/components/admin/DegradeToUserButton'

export default async function AdminUtentiPage({
  searchParams,
}: {
  searchParams: { role?: string; status?: string; search?: string }
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

  // Query utenti con filtri
  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (searchParams.role) {
    query = query.eq('role', searchParams.role)
  }

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  if (searchParams.search) {
    query = query.or(`email.ilike.%${searchParams.search}%,full_name.ilike.%${searchParams.search}%`)
  }

  const { data: users } = await query

  // Conta per ruolo
  const { data: allUsers } = await supabase
    .from('users')
    .select('role, status')

  const counts = {
    tutti: allUsers?.length || 0,
    utente: allUsers?.filter(u => u.role === 'utente').length || 0,
    inserzionista: allUsers?.filter(u => u.role === 'inserzionista').length || 0,
    admin: allUsers?.filter(u => u.role === 'admin').length || 0,
    sospesi: allUsers?.filter(u => u.status === 'sospeso').length || 0,
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestione Utenti
        </h1>
        <p className="text-gray-600">
          Visualizza e gestisci tutti gli utenti della piattaforma
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{counts.tutti}</div>
          <div className="text-sm text-gray-600">Totali</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{counts.utente}</div>
          <div className="text-sm text-gray-600">Utenti</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{counts.inserzionista}</div>
          <div className="text-sm text-gray-600">Inserzionisti</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{counts.admin}</div>
          <div className="text-sm text-gray-600">Admin</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{counts.sospesi}</div>
          <div className="text-sm text-gray-600">Sospesi</div>
        </div>
      </div>

      {/* Filtri e Ricerca */}
      <div className="card mb-6">
        <form method="get" className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="🔍 Cerca per email o nome..."
            className="input-field flex-1"
          />
          
          <select name="role" defaultValue={searchParams.role} className="input-field">
            <option value="">Tutti i ruoli</option>
            <option value="utente">Utente</option>
            <option value="inserzionista">Inserzionista</option>
            <option value="admin">Admin</option>
          </select>

          <select name="status" defaultValue={searchParams.status} className="input-field">
            <option value="">Tutti gli stati</option>
            <option value="attivo">Attivo</option>
            <option value="sospeso">Sospeso</option>
          </select>

          <button type="submit" className="btn-primary whitespace-nowrap">
            Filtra
          </button>
        </form>
      </div>

      {/* Tabella Utenti */}
      <div className="card overflow-hidden">
        {users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Utente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Ruolo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Stato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Registrato
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                          {u.full_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {u.full_name || 'N/D'}
                          </div>
                          {u.phone && (
                            <div className="text-xs text-gray-500">{u.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'inserzionista' ? 'badge-success' :
                        'badge-info'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${
                        u.status === 'attivo' ? 'badge-success' :
                        u.status === 'sospeso' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.id !== user.id && (
                          <>
                            <ChangeUserRoleButton userId={u.id} currentRole={u.role} />
                            <ToggleUserStatusButton userId={u.id} currentStatus={u.status} />
                            <DegradeToUserButton userId={u.id} currentRole={u.role} />
                          </>
                        )}
                        {u.id === user.id && (
                          <span className="text-xs text-gray-500 italic">Tu</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-lg">Nessun utente trovato</p>
          </div>
        )}
      </div>
    </div>
  )
}
