import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils/formatting'
import { LISTING_TYPES, LISTING_STATUS } from '@/lib/utils/constants'
import ApproveListingButton from '@/components/admin/ApproveListingButton'
import RejectListingButton from '@/components/admin/RejectListingButton'
import DeleteListingButton from '@/components/listings/DeleteListingButton'

export default async function AdminAnnunciPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string }
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

  // Query annunci con filtri
  let query = supabase
    .from('listings')
    .select(`
      *,
      owner:users (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,city.ilike.%${searchParams.search}%`)
  }

  const { data: listings } = await query

  // Conta per status
  const { data: allListings } = await supabase
    .from('listings')
    .select('status')

  const counts = {
    tutti: allListings?.length || 0,
    pubblicato: allListings?.filter(l => l.status === 'pubblicato').length || 0,
    in_attesa: allListings?.filter(l => l.status === 'in_attesa').length || 0,
    bozza: allListings?.filter(l => l.status === 'bozza').length || 0,
    rifiutato: allListings?.filter(l => l.status === 'rifiutato').length || 0,
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestione Annunci
        </h1>
        <p className="text-gray-600">
          Modera e gestisci tutti gli annunci della piattaforma
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{counts.tutti}</div>
          <div className="text-sm text-gray-600">Totali</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{counts.pubblicato}</div>
          <div className="text-sm text-gray-600">Pubblicati</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{counts.in_attesa}</div>
          <div className="text-sm text-gray-600">In Attesa</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{counts.bozza}</div>
          <div className="text-sm text-gray-600">Bozze</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{counts.rifiutato}</div>
          <div className="text-sm text-gray-600">Rifiutati</div>
        </div>
      </div>

      {/* Filtri e Ricerca */}
      <div className="card mb-6">
        <form method="get" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="🔍 Cerca per titolo o città..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Cerca
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/annunci"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !searchParams.status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tutti ({counts.tutti})
            </a>
            <a
              href="/admin/annunci?status=in_attesa"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchParams.status === 'in_attesa'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⏳ In Attesa ({counts.in_attesa})
            </a>
            <a
              href="/admin/annunci?status=pubblicato"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchParams.status === 'pubblicato'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✅ Pubblicati ({counts.pubblicato})
            </a>
            <a
              href="/admin/annunci?status=bozza"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchParams.status === 'bozza'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 Bozze ({counts.bozza})
            </a>
            <a
              href="/admin/annunci?status=rifiutato"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                searchParams.status === 'rifiutato'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ❌ Rifiutati ({counts.rifiutato})
            </a>
          </div>
        </form>
      </div>

      {/* Lista Annunci */}
      {listings && listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => {
            const owner = listing.owner as any

            return (
              <div key={listing.id} className="card">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Immagine */}
                  <div className="w-full lg:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
                        🏠
                      </div>
                    )}
                  </div>

                  {/* Contenuto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="badge badge-info text-xs">
                            {LISTING_TYPES[listing.type as keyof typeof LISTING_TYPES]}
                          </span>
                          <span
                            className={`badge text-xs ${
                              listing.status === 'pubblicato' ? 'badge-success' :
                              listing.status === 'in_attesa' ? 'badge-warning' :
                              listing.status === 'bozza' ? 'badge-info' :
                              'badge-danger'
                            }`}
                          >
                            {listing.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {listing.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          📍 {listing.city}, {listing.province}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                          👤 Inserzionista: {owner?.full_name || owner?.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {formatPrice(listing.price)}
                        </div>
                        {listing.type.includes('affitto') && (
                          <div className="text-sm text-gray-500">/mese</div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>

                    {/* Info aggiuntive */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      {listing.rooms && <span>🛏️ {listing.rooms}</span>}
                      {listing.bathrooms && <span>🚿 {listing.bathrooms}</span>}
                      {listing.surface && <span>📐 {listing.surface} m²</span>}
                      <span>👁️ {listing.views || 0} views</span>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Creato il {formatDate(listing.created_at)}
                      {listing.published_at && (
                        <> • Pubblicato il {formatDate(listing.published_at)}</>
                      )}
                    </div>

                    {/* Azioni */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
                      {listing.status === 'pubblicato' && (
                        <Link
                          href={`/annunci/${listing.id}`}
                          target="_blank"
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          👁️ Vedi Pubblico
                        </Link>
                      )}

                      {listing.status === 'in_attesa' && (
                        <>
                          <ApproveListingButton listingId={listing.id} adminId={user.id} />
                          <RejectListingButton listingId={listing.id} adminId={user.id} />
                        </>
                      )}

                      <DeleteListingButton listingId={listing.id} />
                    </div>
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
            Nessun annuncio trovato
          </h2>
          <p className="text-gray-600">
            {searchParams.status
              ? `Nessun annuncio con stato "${searchParams.status}"`
              : searchParams.search
              ? 'Prova con termini di ricerca diversi'
              : 'Non ci sono annunci al momento'}
          </p>
        </div>
      )}
    </div>
  )
}
