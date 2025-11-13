import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ListingForm from '@/components/listings/ListingForm'

export default async function NuovoAnnuncioPage() {
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

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crea Nuovo Annuncio
          </h1>
          <p className="text-gray-600">
            Compila il form per pubblicare un nuovo immobile
          </p>
        </div>

        <ListingForm userId={user.id} mode="create" />
      </div>
    </div>
  )
}
