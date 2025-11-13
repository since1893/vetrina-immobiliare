import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Recupera i dati dell'utente
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Recupera i preferiti
  const { data: favorites, count: favoritesCount } = await supabase
    .from('favorites')
    .select('*, listing:listings(*)', { count: 'exact' })
    .eq('user_id', user.id)

  // Se è inserzionista, recupera i suoi annunci
  let myListings = null
  let listingsCount = 0
  if (userData?.role === 'inserzionista' || userData?.role === 'admin') {
    const { data, count } = await supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('owner_id', user.id)
    
    myListings = data
    listingsCount = count || 0
  }

  // Verifica se ha già una richiesta di upgrade pendente
  const { data: pendingRequest } = await supabase
    .from('role_requests')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'in_attesa')
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {userData?.full_name || user.email}
              </span>
              <span className="badge badge-info capitalize">
                {userData?.role}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Benvenuto, {userData?.full_name || 'Utente'}! 👋
          </h1>
          <p className="text-gray-600">
            Gestisci il tuo profilo e i tuoi annunci preferiti
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Preferiti */}
          <Link href="/dashboard/preferiti" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Preferiti</p>
                <p className="text-3xl font-bold text-gray-900">{favoritesCount || 0}</p>
              </div>
              <div className="text-4xl">❤️</div>
            </div>
          </Link>

          {/* I Miei Annunci (solo per inserzionisti) */}
          {(userData?.role === 'inserzionista' || userData?.role === 'admin') && (
            <Link href="/dashboard/inserzionista/annunci" className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">I Miei Annunci</p>
                  <p className="text-3xl font-bold text-gray-900">{listingsCount}</p>
                </div>
                <div className="text-4xl">🏠</div>
              </div>
            </Link>
          )}

          {/* Profilo */}
          <Link href="/dashboard/profilo" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Il Mio Profilo</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{userData?.role}</p>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </Link>
        </div>

        {/* Azioni Rapide */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <Link href="/annunci" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold mb-1">Cerca Annunci</h3>
              <p className="text-sm text-gray-600">Trova la casa dei tuoi sogni</p>
            </Link>

            {userData?.role === 'utente' && !pendingRequest && (
              <Link href="/dashboard/profilo" className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                <div className="text-2xl mb-2">⬆️</div>
                <h3 className="font-semibold mb-1">Diventa Inserzionista</h3>
                <p className="text-sm text-gray-600">Pubblica i tuoi annunci</p>
              </Link>
            )}

            {pendingRequest && (
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="text-2xl mb-2">⏳</div>
                <h3 className="font-semibold mb-1">Richiesta in Attesa</h3>
                <p className="text-sm text-yellow-700">In attesa di approvazione admin</p>
              </div>
            )}

            {(userData?.role === 'inserzionista' || userData?.role === 'admin') && (
              <Link href="/dashboard/inserzionista/annunci/nuovo" className="p-4 border border-primary-500 rounded-lg bg-primary-50 hover:bg-primary-100 transition-all">
                <div className="text-2xl mb-2">➕</div>
                <h3 className="font-semibold text-primary-900 mb-1">Nuovo Annuncio</h3>
                <p className="text-sm text-primary-700">Pubblica un nuovo immobile</p>
              </Link>
            )}

            {userData?.role === 'admin' && (
              <Link href="/admin" className="p-4 border border-purple-500 rounded-lg bg-purple-50 hover:bg-purple-100 transition-all">
                <div className="text-2xl mb-2">⚙️</div>
                <h3 className="font-semibold text-purple-900 mb-1">Pannello Admin</h3>
                <p className="text-sm text-purple-700">Gestisci utenti e annunci</p>
              </Link>
            )}
          </div>
        </div>

        {/* Annunci Recenti (se inserzionista) */}
        {myListings && myListings.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">I Miei Ultimi Annunci</h2>
              <Link href="/dashboard/inserzionista/annunci" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Vedi tutti →
              </Link>
            </div>
            
            <div className="space-y-3">
              {myListings.slice(0, 3).map((listing) => (
                <Link
                  key={listing.id}
                  href={`/dashboard/inserzionista/annunci/${listing.id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-gray-50 transition-all"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.city}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${
                      listing.status === 'pubblicato' ? 'badge-success' :
                      listing.status === 'in_attesa' ? 'badge-warning' :
                      listing.status === 'bozza' ? 'badge-info' :
                      'badge-danger'
                    }`}>
                      {listing.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
