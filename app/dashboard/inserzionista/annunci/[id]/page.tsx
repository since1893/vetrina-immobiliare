import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ListingForm from '@/components/listings/ListingForm'
import Link from 'next/link'

export default async function ModificaAnnuncioPage({
  params,
}: {
  params: { id: string }
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

  // Recupera l'annuncio
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Verifica che l'utente sia il proprietario (o admin)
  if (listing.owner_id !== user.id && userData?.role !== 'admin') {
    redirect('/dashboard/inserzionista/annunci')
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/inserzionista/annunci"
            className="text-primary-600 hover:text-primary-700 text-sm mb-4 inline-block"
          >
            ← Torna agli annunci
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Modifica Annuncio
          </h1>
          <p className="text-gray-600">
            Aggiorna le informazioni del tuo immobile
          </p>
        </div>

        {/* Status Info */}
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Stato attuale: 
                <span className={`ml-2 badge ${
                  listing.status === 'pubblicato' ? 'badge-success' :
                  listing.status === 'in_attesa' ? 'badge-warning' :
                  listing.status === 'bozza' ? 'badge-info' :
                  'badge-danger'
                }`}>
                  {listing.status}
                </span>
              </p>
              {listing.status === 'pubblicato' && (
                <p>Questo annuncio è pubblico. Le modifiche saranno visibili immediatamente.</p>
              )}
              {listing.status === 'in_attesa' && (
                <p>Questo annuncio è in attesa di approvazione da parte dell'admin.</p>
              )}
              {listing.status === 'rifiutato' && (
                <p className="text-red-800">Questo annuncio è stato rifiutato. Modifica e invia nuovamente per approvazione.</p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <ListingForm userId={user.id} mode="edit" listing={listing} />
      </div>
    </div>
  )
}
