import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatting'

export default async function InserzionistaDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifica ruolo
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'inserzionista' && userData?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Recupera statistiche annunci
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const stats = {
    total: listings?.length || 0,
    pubblicati: listings?.filter(l => l.status === 'pubblicato').length || 0,
    in_attesa: listings?.filter(l => l.status === 'in_attesa').length || 0,
    bozze: listings?.filter(l => l.status === 'bozza').length || 0,
    rifiutati: listings?.filter(l => l.status === 'rifiutato').length || 0,
    totalViews: listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0,
  }

  // Ultimi 5 annunci
  const recentListings = listings?.slice(0, 5) || []

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Inserzionista 🏠
        </h1>
        <p className="text-gray-600">
          Gestisci i tuoi annunci immobiliari
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium mb-1">Totale Annunci</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium mb-1">Pubblicati</p>
              <p className="text-3xl font-bold text-green-900">{stats.pubblicati}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium mb-1">In Attesa</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.in_attesa}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1">Visualizzazioni</p>
              <p className="text-3xl font-bold text-purple-900">{stats.totalViews}</p>
            </div>
            <div className="text-4xl">👁️</div>
          </div>
        </div>
      </div>

      {/* Azioni Rapide */}
      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Azioni Rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/inserzionista/annunci/nuovo"
            className="p-6 border-2 border-primary-500 rounded-lg bg-primary-50 hover:bg-primary-100 transition-all text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">➕</div>
            <h3 className="font-semibold text-primary-900 mb-1">Nuovo Annuncio</h3>
            <p className="text-sm text-primary-700">Pubblica un nuovo immobile</p>
          </Link>

          <Link
            href="/dashboard/inserzionista/annunci"
            className="p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="font-semibold text-gray-900 mb-1">I Miei Annunci</h3>
            <p className="text-sm text-gray-600">Gestisci tutti gli annunci</p>
          </Link>

          <Link
            href="/annunci"
            className="p-6 border-2 border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-1">Cerca Annunci</h3>
            <p className="text-sm text-gray-600">Esplora il marketplace</p>
          </Link>
        </div>
      </div>

      {/* Ultimi Annunci */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ultimi Annunci</h2>
          <Link
            href="/dashboard/inserzionista/annunci"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Vedi tutti →
          </Link>
        </div>

        {recentListings.length > 0 ? (
          <div className="space-y-3">
            {recentListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/dashboard/inserzionista/annunci/${listing.id}`}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-gray-50 transition-all"
              >
                {/* Immagine */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-2xl">
                      🏠
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {listing.city} • {formatPrice(listing.price)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge ${
                        listing.status === 'pubblicato' ? 'badge-success' :
                        listing.status === 'in_attesa' ? 'badge-warning' :
                        listing.status === 'bozza' ? 'badge-info' :
                        'badge-danger'
                      }`}
                    >
                      {listing.status}
                    </span>
                    {listing.views > 0 && (
                      <span className="text-xs text-gray-500">
                        👁️ {listing.views}
                      </span>
                    )}
                  </div>
                </div>

                {/* Freccia */}
                <div className="text-gray-400">→</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg mb-4">Nessun annuncio ancora</p>
            <Link href="/dashboard/inserzionista/annunci/nuovo" className="btn-primary">
              Crea il tuo primo annuncio
            </Link>
          </div>
        )}
      </div>

      {/* Info e Suggerimenti */}
      {stats.bozze > 0 && (
        <div className="card bg-blue-50 border-blue-200 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Hai {stats.bozze} bozze salvate</p>
              <p>Completa e pubblica le tue bozze per renderle visibili agli utenti.</p>
            </div>
          </div>
        </div>
      )}

      {stats.rifiutati > 0 && (
        <div className="card bg-red-50 border-red-200 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Hai {stats.rifiutati} annunci rifiutati</p>
              <p>Controlla le motivazioni dell'admin e modifica gli annunci per ripubblicarli.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
