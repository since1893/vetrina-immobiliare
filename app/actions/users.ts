'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  const { error } = await supabase
    .from('users')
    .update({
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string || null,
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/profilo')
  return { success: true }
}

export async function requestInserzionista(reason: string) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  // Verifica che l'utente sia "utente" base
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'utente') {
    return { error: 'Solo gli utenti base possono fare questa richiesta' }
  }

  // Verifica che non ci sia già una richiesta in attesa
  const { data: existingRequest } = await supabase
    .from('role_requests')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'in_attesa')
    .single()

  if (existingRequest) {
    return { error: 'Hai già una richiesta in attesa' }
  }

  const { error } = await supabase
    .from('role_requests')
    .insert({
      user_id: user.id,
      requested_role: 'inserzionista',
      status: 'in_attesa',
      reason: reason,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/profilo')
  return { success: true }
}

export async function removeFavorite(favoriteId: string) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/preferiti')
  return { success: true }
}
