import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/formatting'
import { LISTING_TYPES } from '@/lib/utils/constants'

export const revalidate = 60 // Rivalidazione ogni 60 secondi

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // Verifica se l'utente è loggato
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Recupera gli ultimi annunci pubblicati
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'pubblicato')
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/annunci" className="text-gray-700 hover:text-primary-600">
                Annunci
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <span className="text-sm text-gray-600">
                    👤 {user.email}
                  </span>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-primary-600">
                    Accedi
                  </Link>
                  <Link href="/signup" className="btn-primary">
                    Registrati
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Trova la tua casa ideale
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Pubblica e cerca annunci immobiliari gratuitamente
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Cerca per città, zona..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
            />
            <Link 
              href="/annunci"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-medium"
            >
              Cerca
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {listings?.length || 0}+
              </div>
              <div className="text-gray-600">Annunci Attivi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Gratuito</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Sempre Disponibile</div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Ultimi Annunci
            </h2>
            <Link href="/annunci" className="text-primary-600 hover:text-primary-700 font-medium">
              Vedi tutti →
            </Link>
          </div>

          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/annunci/${listing.id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
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
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-info">
                        {LISTING_TYPES[listing.type as keyof typeof LISTING_TYPES]}
                      </span>
                    </div>
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
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Nessun annuncio disponibile al momento
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vuoi pubblicare un annuncio?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Registrati gratuitamente e inizia a pubblicare i tuoi annunci
          </p>
          {user ? (
            <Link href="/dashboard" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium">
              Vai alla Dashboard
            </Link>
          ) : (
            <Link href="/signup" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium">
              Registrati Gratis
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container-custom text-center">
          <p>&copy; 2024 Vetrina Immobiliare. Tutti i diritti riservati.</p>
          <div className="mt-4 space-x-4">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Termini di Servizio</Link>
            <Link href="#" className="hover:text-white">Contatti</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
