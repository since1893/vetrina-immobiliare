import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, formatDate } from '@/lib/utils/formatting'
import { LISTING_TYPES } from '@/lib/utils/constants'
import DeleteListingButton from '@/components/listings/DeleteListingButton'

export default async function InserzionistAnnunciPage({
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

  // Verifica ruolo
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'inserzionista' && userData?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Query con filtro opzionale per status
  let query = supabase
    .from('listings')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: listings } = await query

  // Conta per status
  const { data: allListings } = await supabase
    .from('listings')
    .select('status')
    .eq('owner_id', user.id)

  const counts = {
    tutti: allListings?.length || 0,
    pubblicato: allListings?.filter(l => l.status === 'pubblicato').length || 0,
    in_attesa: allListings?.filter(l => l.status === 'in_attesa').length || 0,
    bozza: allListings?.filter(l => l.status === 'bozza').length || 0,
    rifiutato: allListings?.filter(l => l.status === 'rifiutato').length || 0,
  }

  const activeStatus = searchParams.status || 'tutti'

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">I Miei Annunci</h1>
          <p className="text-gray-600">
            Gestisci e modifica i tuoi annunci immobiliari
          </p>
        </div>
        <Link href="/dashboard/inserzionista/annunci/nuovo" className="btn-primary">
          ➕ Nuovo Annuncio
        </Link>
      </div>

      {/* Filtri per stato */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/inserzionista/annunci"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === 'tutti'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutti ({counts.tutti})
          </Link>
          <Link
            href="/dashboard/inserzionista/annunci?status=pubblicato"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === 'pubblicato'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Pubblicati ({counts.pubblicato})
          </Link>
          <Link
            href="/dashboard/inserzionista/annunci?status=in_attesa"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === 'in_attesa'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⏳ In Attesa ({counts.in_attesa})
          </Link>
          <Link
            href="/dashboard/inserzionista/annunci?status=bozza"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === 'bozza'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📝 Bozze ({counts.bozza})
          </Link>
          <Link
            href="/dashboard/inserzionista/annunci?status=rifiutato"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeStatus === 'rifiutato'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ❌ Rifiutati ({counts.rifiutato})
          </Link>
        </div>
      </div>

      {/* Lista Annunci */}
      {listings && listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Immagine */}
                <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                      <div className="flex items-center gap-2 mb-2">
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
                      <p className="text-gray-600 text-sm mb-2">
                        📍 {listing.city}, {listing.province}
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

                  {/* Statistiche */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    {listing.rooms && <span>🛏️ {listing.rooms} camere</span>}
                    {listing.bathrooms && <span>🚿 {listing.bathrooms} bagni</span>}
                    {listing.surface && <span>📐 {listing.surface} m²</span>}
                    <span>👁️ {listing.views || 0} views</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Creato il {formatDate(listing.created_at)}
                      {listing.published_at && (
                        <> • Pubblicato il {formatDate(listing.published_at)}</>
                      )}
                    </div>

                    {/* Azioni */}
                    <div className="flex items-center gap-2">
                      {listing.status === 'pubblicato' && (
                        <Link
                          href={`/annunci/${listing.id}`}
                          target="_blank"
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          👁️ Vedi
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/inserzionista/annunci/${listing.id}`}
                        className="px-3 py-1.5 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"
                      >
                        ✏️ Modifica
                      </Link>
                      <DeleteListingButton listingId={listing.id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {activeStatus === 'tutti'
              ? 'Nessun annuncio ancora'
              : `Nessun annuncio con stato "${activeStatus}"`}
          </h2>
          <p className="text-gray-600 mb-6">
            {activeStatus === 'tutti'
              ? 'Inizia creando il tuo primo annuncio immobiliare'
              : 'Prova a cambiare filtro o crea un nuovo annuncio'}
          </p>
          <Link href="/dashboard/inserzionista/annunci/nuovo" className="btn-primary">
            ➕ Crea Nuovo Annuncio
          </Link>
        </div>
      )}
    </div>
  )
}
