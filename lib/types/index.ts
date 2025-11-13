import { Database } from './database.types'

export type User = Database['public']['Tables']['users']['Row']
export type Listing = Database['public']['Tables']['listings']['Row']
export type RoleRequest = Database['public']['Tables']['role_requests']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type SiteSettings = Database['public']['Tables']['site_settings']['Row']

export type UserRole = 'utente' | 'inserzionista' | 'admin'
export type UserStatus = 'attivo' | 'sospeso' | 'in_attesa'
export type ListingType = 'vendita' | 'affitto_breve' | 'affitto_lungo' | 'cercasi'
export type ListingCategory = 'appartamento' | 'villa' | 'terreno' | 'commerciale' | 'altro'
export type ListingStatus = 'bozza' | 'in_attesa' | 'pubblicato' | 'scaduto' | 'rifiutato'
