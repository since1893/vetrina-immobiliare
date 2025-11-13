import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils/formatting'
import { LISTING_TYPES } from '@/lib/utils/constants'
import Link from 'next/link'
import RemoveFavoriteButton from '@/components/listings/RemoveFavoriteButton'

export default async function PreferitiPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Recupera i preferiti con i dettagli degli annunci
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      listing:listings (
        id,
        title,
        description,
        type,
        category,
        price,
        city,
        province,
        images,
        rooms,
        bathrooms,
        surface,
        status
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">I Miei Preferiti</h1>
        <p className="text-gray-600">
          Annunci salvati per consultazione rapida
        </p>
      </div>

      {favorites && favorites.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            {favorites.length} {favorites.length === 1 ? 'annuncio salvato' : 'annunci salvati'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const listing = favorite.listing as any

              // Se l'annuncio è stato eliminato
              if (!listing) {
                return (
                  <div key={favorite.id} className="card bg-gray-50">
                    <p className="text-gray-500 text-center py-8">
                      Annuncio non più disponibile
                    </p>
                    <RemoveFavoriteButton favoriteId={favorite.id} />
                  </div>
                )
              }

              return (
                <div key={favorite.id} className="card hover:shadow-lg transition-shadow relative">
                  {/* Pulsante Rimuovi */}
                  <div className="absolute top-4 right-4 z-10">
                    <RemoveFavoriteButton favoriteId={favorite.id} />
                  </div>

                  <Link href={`/annunci/${listing.id}`}>
                    {/* Immagine */}
                    <div className="relative h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      {listing.images && listing.images.length > 0 ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
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
                      {listing.status !== 'pubblicato' && (
                        <div className="absolute top-2 right-2">
                          <span className="badge badge-warning">
                            {listing.status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {listing.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {listing.description}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="text-gray-500 text-sm">
                        📍 {listing.city}
                      </div>
                    </div>

                    {listing.rooms && (
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                        <span>🛏️ {listing.rooms} camere</span>
                        {listing.bathrooms && <span>🚿 {listing.bathrooms} bagni</span>}
                        {listing.surface && <span>📐 {listing.surface} m²</span>}
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Salvato il {new Date(favorite.created_at).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nessun preferito salvato
          </h2>
          <p className="text-gray-600 mb-6">
            Inizia a esplorare gli annunci e salva quelli che ti interessano
          </p>
          <Link href="/annunci" className="btn-primary inline-block">
            🔍 Cerca Annunci
          </Link>
        </div>
      )}
    </div>
  )
}
