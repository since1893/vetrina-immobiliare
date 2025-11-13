'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Non autenticato')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    throw new Error('Permessi insufficienti')
  }

  return { user, supabase }
}

export async function changeUserRole(userId: string, newRole: string) {
  try {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin/utenti')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function toggleUserStatus(userId: string, newStatus: string) {
  try {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin/utenti')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function approveRoleRequest(requestId: string) {
  try {
    const { user, supabase } = await verifyAdmin()

    // Recupera la richiesta
    const { data: request } = await supabase
      .from('role_requests')
      .select('user_id')
      .eq('id', requestId)
      .single()

    if (!request) {
      return { error: 'Richiesta non trovata' }
    }

    // Aggiorna richiesta
    await supabase
      .from('role_requests')
      .update({
        status: 'approvato',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    // Aggiorna ruolo utente
    await supabase
      .from('users')
      .update({ role: 'inserzionista' })
      .eq('id', request.user_id)

    revalidatePath('/admin/richieste')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function rejectRoleRequest(requestId: string, adminNotes: string) {
  try {
    const { user, supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('role_requests')
      .update({
        status: 'rifiutato',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
      })
      .eq('id', requestId)

    if (error) throw error

    revalidatePath('/admin/richieste')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function approveListing(listingId: string) {
  try {
    const { supabase } = await verifyAdmin()

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + 90)

    const { error } = await supabase
      .from('listings')
      .update({
        status: 'pubblicato',
        published_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq('id', listingId)

    if (error) throw error

    revalidatePath('/admin/annunci')
    revalidatePath('/annunci')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function rejectListing(listingId: string) {
  try {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('listings')
      .update({ status: 'rifiutato' })
      .eq('id', listingId)

    if (error) throw error

    revalidatePath('/admin/annunci')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    const { supabase } = await verifyAdmin()

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) throw error

    revalidatePath('/admin/utenti')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
