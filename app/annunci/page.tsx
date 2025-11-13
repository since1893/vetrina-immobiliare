import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatting'
import { LISTING_TYPES, LISTING_CATEGORIES, PROVINCES } from '@/lib/utils/constants'
import ListingFilters from '@/components/listings/ListingFilters'

export const revalidate = 60

type SearchParams = {
  search?: string
  type?: string
  category?: string
  city?: string
  province?: string
  min_price?: string
  max_price?: string
}

export default async function AnnunciPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createServerSupabaseClient()

  // Costruisci la query con filtri
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'pubblicato')
    .order('created_at', { ascending: false })

  // Applica filtri se presenti
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  if (searchParams.type) {
    query = query.eq('type', searchParams.type)
  }

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.city) {
    query = query.ilike('city', `%${searchParams.city}%`)
  }

  if (searchParams.province) {
    query = query.eq('province', searchParams.province)
  }

  if (searchParams.min_price) {
    query = query.gte('price', parseFloat(searchParams.min_price))
  }

  if (searchParams.max_price) {
    query = query.lte('price', parseFloat(searchParams.max_price))
  }

  const { data: listings, error } = await query

  const hasFilters = Object.keys(searchParams).length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/annunci" className="text-primary-600 font-medium">
                Annunci
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-primary-600">
                Accedi
              </Link>
              <Link href="/signup" className="btn-primary">
                Registrati
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        {/* Titolo e contatore */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tutti gli Annunci
          </h1>
          <p className="text-gray-600">
            {listings?.length || 0} {listings?.length === 1 ? 'annuncio trovato' : 'annunci trovati'}
            {hasFilters && ' con i filtri selezionati'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filtri */}
          <aside className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                🔍 Filtra Risultati
              </h2>
              <ListingFilters />
            </div>
          </aside>

          {/* Griglia Annunci */}
          <main className="lg:col-span-3">
            {listings && listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/annunci/${listing.id}`}
                    className="card hover:shadow-lg transition-shadow group"
                  >
                    {/* Immagine */}
                    <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          🏠 Nessuna immagine
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="badge badge-info">
                          {LISTING_TYPES[listing.type as keyof typeof LISTING_TYPES]}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="badge bg-white text-gray-700">
                          {LISTING_CATEGORIES[listing.category as keyof typeof LISTING_CATEGORIES]}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {listing.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(listing.price)}
                        {listing.type.includes('affitto') && (
                          <span className="text-sm font-normal text-gray-500">/mese</span>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                      📍 {listing.city}, {listing.province}
                    </div>

                    {listing.rooms && (
                      <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-200">
                        <span>🛏️ {listing.rooms}</span>
                        {listing.bathrooms && <span>🚿 {listing.bathrooms}</span>}
                        {listing.surface && <span>📐 {listing.surface} m²</span>}
                      </div>
                    )}

                    {listing.views > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        👁️ {listing.views} visualizzazioni
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Nessun annuncio trovato
                </h2>
                <p className="text-gray-600 mb-6">
                  {hasFilters 
                    ? 'Prova a modificare i filtri di ricerca'
                    : 'Al momento non ci sono annunci disponibili'
                  }
                </p>
                {hasFilters && (
                  <Link href="/annunci" className="btn-primary inline-block">
                    Rimuovi Filtri
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container-custom text-center">
          <p>&copy; 2024 Vetrina Immobiliare. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  )
}
