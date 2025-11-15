import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SiteSettingsForm from '@/components/admin/SiteSettingsForm'

export default async function AdminImpostazioniPage() {
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

  // Recupera impostazioni sito (crea se non esiste)
  let { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  // Se non esistono impostazioni, crea record di default
  if (!settings) {
    const { data: newSettings } = await supabase
      .from('site_settings')
      .insert({
        site_name: 'Vetrina Immobiliare',
        site_description: 'Pubblica e cerca annunci immobiliari gratuitamente',
        primary_color: '#3b82f6',
        secondary_color: '#2563eb',
        contact_email: 'info@vetrinaimmobiliare.it',
      })
      .select()
      .single()
    
    settings = newSettings
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Impostazioni Sito
        </h1>
        <p className="text-gray-600">
          Personalizza nome, colori e immagini del sito
        </p>
      </div>

      <div className="max-w-3xl">
        {settings && <SiteSettingsForm settings={settings} />}
      </div>
    </div>
  )
}
