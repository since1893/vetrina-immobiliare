'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  const listingData = {
    owner_id: user.id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    category: formData.get('category') as string,
    price: parseFloat(formData.get('price') as string),
    location: formData.get('location') as string,
    city: formData.get('city') as string,
    province: formData.get('province') as string,
    address: formData.get('address') as string || null,
    surface: formData.get('surface') ? parseFloat(formData.get('surface') as string) : null,
    rooms: formData.get('rooms') ? parseInt(formData.get('rooms') as string) : null,
    bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null,
    floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : null,
    energy_class: formData.get('energy_class') as string || null,
    status: formData.get('status') as string || 'bozza',
  }

  const { data, error } = await supabase
    .from('listings')
    .insert(listingData)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/inserzionista/annunci')
  redirect('/dashboard/inserzionista/annunci')
}

export async function updateListing(listingId: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  const updateData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    category: formData.get('category') as string,
    price: parseFloat(formData.get('price') as string),
    location: formData.get('location') as string,
    city: formData.get('city') as string,
    province: formData.get('province') as string,
    address: formData.get('address') as string || null,
    surface: formData.get('surface') ? parseFloat(formData.get('surface') as string) : null,
    rooms: formData.get('rooms') ? parseInt(formData.get('rooms') as string) : null,
    bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null,
    floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : null,
    energy_class: formData.get('energy_class') as string || null,
    status: formData.get('status') as string || 'bozza',
  }

  const { error } = await supabase
    .from('listings')
    .update(updateData)
    .eq('id', listingId)
    .eq('owner_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/inserzionista/annunci')
  revalidatePath(`/annunci/${listingId}`)
  redirect('/dashboard/inserzionista/annunci')
}

export async function deleteListing(listingId: string) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('owner_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/inserzionista/annunci')
  return { success: true }
}

export async function toggleFavorite(listingId: string) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Non autenticato' }
  }

  // Verifica se esiste già
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .single()

  if (existing) {
    // Rimuovi
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existing.id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/preferiti')
    return { isFavorite: false }
  } else {
    // Aggiungi
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        listing_id: listingId,
      })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/dashboard/preferiti')
    return { isFavorite: true }
  }
}
