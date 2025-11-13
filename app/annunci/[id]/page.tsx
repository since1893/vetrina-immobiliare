import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice, formatDate } from '@/lib/utils/formatting'
import { LISTING_TYPES, LISTING_CATEGORIES } from '@/lib/utils/constants'
import Link from 'next/link'
import AddToFavoritesButton from '@/components/listings/AddToFavoritesButton'
import ImageGallery from '@/components/listings/ImageGallery'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('title, description')
    .eq('id', params.id)
    .single()

  return {
    title: listing?.title || 'Annuncio',
    description: listing?.description || 'Dettagli annuncio immobiliare',
  }
}

export default async function AnnuncioDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()

  // Incrementa visualizzazioni
  await supabase.rpc('increment_listing_views', { listing_id: params.id })

  // Recupera annuncio
  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      owner:users (
        id,
        full_name,
        email,
        phone
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Verifica se l'utente corrente ha salvato questo annuncio
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isFavorite = false
  if (user) {
    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listing.id)
      .single()
    
    isFavorite = !!favorite
  }

  const owner = listing.owner as any

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>
            
            <nav className="flex items-center space-x-6">
              <Link href="/annunci" className="text-gray-700 hover:text-primary-600">
                ← Tutti gli annunci
              </Link>
              {user ? (
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="btn-primary">
                  Accedi
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenuto Principale */}
          <main className="lg:col-span-2 space-y-6">
            {/* Galleria Immagini */}
            <div className="card p-0 overflow-hidden">
              <ImageGallery images={listing.images || []} title={listing.title} />
            </div>

            {/* Info Principali */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-info">
                      {LISTING_TYPES[listing.type as keyof typeof LISTING_TYPES]}
                    </span>
                    <span className="badge bg-gray-200 text-gray-700">
                      {LISTING_CATEGORIES[listing.category as keyof typeof LISTING_CATEGORIES]}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-1">
                    📍 {listing.location}, {listing.city} ({listing.province})
                  </p>
                </div>

                {user && (
                  <AddToFavoritesButton
                    listingId={listing.id}
                    userId={user.id}
                    isFavorite={isFavorite}
                  />
                )}
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-gray-200 my-4">
                <div>
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(listing.price)}
                    {listing.type.includes('affitto') && (
                      <span className="text-lg font-normal text-gray-500">/mese</span>
                    )}
                  </div>
                </div>
                
                {listing.surface && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{listing.surface}</div>
                    <div className="text-sm text-gray-600">m²</div>
                  </div>
                )}

                {listing.rooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{listing.rooms}</div>
                    <div className="text-sm text-gray-600">Camere</div>
                  </div>
                )}

                {listing.bathrooms && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{listing.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bagni</div>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Descrizione</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>
            </div>

            {/* Caratteristiche */}
            {(listing.floor !== null || listing.energy_class || (listing.features && listing.features.length > 0)) && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Caratteristiche</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.floor !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏢</span>
                      <div>
                        <div className="text-sm text-gray-600">Piano</div>
                        <div className="font-medium">{listing.floor === 0 ? 'Terra' : listing.floor}</div>
                      </div>
                    </div>
                  )}

                  {listing.energy_class && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <div className="text-sm text-gray-600">Classe Energetica</div>
                        <div className="font-medium">{listing.energy_class}</div>
                      </div>
                    </div>
                  )}

                  {listing.features && listing.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      <div className="font-medium capitalize">
                        {feature.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info aggiuntive */}
            <div className="card bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>👁️ {listing.views} visualizzazioni</span>
                <span>📅 Pubblicato il {formatDate(listing.published_at || listing.created_at)}</span>
              </div>
            </div>
          </main>

          {/* Sidebar Contatti */}
          <aside className="space-y-6">
            <div className="card sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📞 Informazioni Contatto
              </h2>

              <div className="space-y-4">
                {owner?.full_name && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Inserzionista</div>
                    <div className="font-medium text-gray-900">{owner.full_name}</div>
                  </div>
                )}

                {owner?.phone && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Telefono</div>
                    <a
                      href={`tel:${owner.phone}`}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      {owner.phone}
                    </a>
                  </div>
                )}

                {owner?.email && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Email</div>
                    <a
                      href={`mailto:${owner.email}`}
                      className="font-medium text-primary-600 hover:text-primary-700 break-all"
                    >
                      {owner.email}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {owner?.phone && (
                    <a
                      href={`tel:${owner.phone}`}
                      className="btn-primary w-full text-center block"
                    >
                      📞 Chiama Ora
                    </a>
                  )}
                  
                  {owner?.email && (
                    <a
                      href={`mailto:${owner.email}?subject=Richiesta info: ${listing.title}`}
                      className="btn-secondary w-full text-center block"
                    >
                      ✉️ Invia Email
                    </a>
                  )}
                </div>
              </div>

              {listing.address && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Indirizzo</div>
                  <div className="text-gray-900">{listing.address}</div>
                </div>
              )}
            </div>

            {/* Avviso */}
            <div className="card bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Attenzione alle truffe</p>
                  <p>Non effettuare pagamenti prima di aver visionato l'immobile.</p>
                </div>
              </div>
            </div>
          </aside>
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
