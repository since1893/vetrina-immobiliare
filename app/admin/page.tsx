import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboardPage() {
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

  // Statistiche Utenti
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: inserzionisti } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'inserzionista')

  const { count: utentiBase } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'utente')

  // Statistiche Annunci
  const { count: totalListings } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })

  const { count: pubblicati } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pubblicato')

  const { count: inAttesa } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_attesa')

  const { count: bozze } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'bozza')

  // Richieste Pendenti
  const { count: richiesteInAttesa } = await supabase
    .from('role_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_attesa')

  const { data: recentRequests } = await supabase
    .from('role_requests')
    .select(`
      *,
      user:users (
        id,
        email,
        full_name
      )
    `)
    .eq('status', 'in_attesa')
    .order('created_at', { ascending: false })
    .limit(5)

  // Annunci Recenti in Attesa
  const { data: recentListings } = await supabase
    .from('listings')
    .select(`
      *,
      owner:users (
        id,
        email,
        full_name
      )
    `)
    .eq('status', 'in_attesa')
    .order('created_at', { ascending: false })
    .limit(5)

  // Ultimi utenti registrati
  const { data: recentUsers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Admin 👑
        </h1>
        <p className="text-gray-600">
          Panoramica completa della piattaforma
        </p>
      </div>

      {/* Statistiche Principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Utenti Totali */}
        <Link href="/admin/utenti" className="card bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Utenti Totali</p>
              <p className="text-3xl font-bold text-blue-900">{totalUsers || 0}</p>
              <p className="text-xs text-blue-700 mt-1">
                {inserzionisti || 0} inserzionisti • {utentiBase || 0} utenti base
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </Link>

        {/* Annunci Totali */}
        <Link href="/admin/annunci" className="card bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Annunci Totali</p>
              <p className="text-3xl font-bold text-green-900">{totalListings || 0}</p>
              <p className="text-xs text-green-700 mt-1">
                {pubblicati || 0} pubblicati
              </p>
            </div>
            <div className="text-4xl">🏠</div>
          </div>
        </Link>

        {/* Richieste Pendenti */}
        <Link href="/admin/richieste" className="card bg-yellow-50 border-yellow-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium mb-1">Richieste Pendenti</p>
              <p className="text-3xl font-bold text-yellow-900">{richiesteInAttesa || 0}</p>
              <p className="text-xs text-yellow-700 mt-1">
                Da approvare
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </Link>

        {/* Annunci in Attesa */}
        <Link href="/admin/annunci?status=in_attesa" className="card bg-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Annunci in Attesa</p>
              <p className="text-3xl font-bold text-purple-900">{inAttesa || 0}</p>
              <p className="text-xs text-purple-700 mt-1">
                Da approvare
              </p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Richieste Inserzionista Recenti */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Richieste Recenti
            </h2>
            <Link href="/admin/richieste" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Vedi tutte →
            </Link>
          </div>

          {recentRequests && recentRequests.length > 0 ? (
            <div className="space-y-3">
              {recentRequests.map((request) => {
                const requestUser = request.user as any
                return (
                  <div key={request.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {requestUser?.full_name || requestUser?.email}
                        </p>
                        <p className="text-sm text-gray-600">{requestUser?.email}</p>
                      </div>
                      <span className="badge badge-warning text-xs">In attesa</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {request.reason}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/admin/richieste`}
                        className="text-xs btn-primary px-3 py-1"
                      >
                        Gestisci
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nessuna richiesta pendente</p>
            </div>
          )}
        </div>

        {/* Annunci in Attesa Recenti */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Annunci da Approvare
            </h2>
            <Link href="/admin/annunci?status=in_attesa" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Vedi tutti →
            </Link>
          </div>

          {recentListings && recentListings.length > 0 ? (
            <div className="space-y-3">
              {recentListings.map((listing) => {
                const owner = listing.owner as any
                return (
                  <div key={listing.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {listing.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {listing.city} • {owner?.full_name || owner?.email}
                        </p>
                      </div>
                      <span className="badge badge-warning text-xs">In attesa</span>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/admin/annunci`}
                        className="text-xs btn-primary px-3 py-1"
                      >
                        Modera
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nessun annuncio in attesa</p>
            </div>
          )}
        </div>
      </div>

      {/* Ultimi Utenti Registrati */}
      <div className="card mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Ultimi Utenti Registrati
          </h2>
          <Link href="/admin/utenti" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Vedi tutti →
          </Link>
        </div>

        {recentUsers && recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Utente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Ruolo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Registrato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {user.full_name || 'N/D'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-info text-xs capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('it-IT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nessun utente registrato</p>
          </div>
        )}
      </div>
    </div>
  )
}
