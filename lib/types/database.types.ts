export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'utente' | 'inserzionista' | 'admin'
          status: 'attivo' | 'sospeso' | 'in_attesa'
          created_at: string
          updated_at: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          email: string
          role?: 'utente' | 'inserzionista' | 'admin'
          status?: 'attivo' | 'sospeso' | 'in_attesa'
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: 'utente' | 'inserzionista' | 'admin'
          status?: 'attivo' | 'sospeso' | 'in_attesa'
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          title: string
          description: string
          type: 'vendita' | 'affitto_breve' | 'affitto_lungo' | 'cercasi'
          category: 'appartamento' | 'villa' | 'terreno' | 'commerciale' | 'altro'
          price: number
          location: string
          city: string
          province: string
          address: string | null
          images: string[]
          owner_id: string
          status: 'bozza' | 'in_attesa' | 'pubblicato' | 'scaduto' | 'rifiutato'
          created_at: string
          updated_at: string
          published_at: string | null
          expires_at: string | null
          views: number
          surface: number | null
          rooms: number | null
          bathrooms: number | null
          floor: number | null
          energy_class: string | null
          features: string[]
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'vendita' | 'affitto_breve' | 'affitto_lungo' | 'cercasi'
          category: 'appartamento' | 'villa' | 'terreno' | 'commerciale' | 'altro'
          price: number
          location: string
          city: string
          province: string
          address?: string | null
          images?: string[]
          owner_id: string
          status?: 'bozza' | 'in_attesa' | 'pubblicato' | 'scaduto' | 'rifiutato'
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
          views?: number
          surface?: number | null
          rooms?: number | null
          bathrooms?: number | null
          floor?: number | null
          energy_class?: string | null
          features?: string[]
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'vendita' | 'affitto_breve' | 'affitto_lungo' | 'cercasi'
          category?: 'appartamento' | 'villa' | 'terreno' | 'commerciale' | 'altro'
          price?: number
          location?: string
          city?: string
          province?: string
          address?: string | null
          images?: string[]
          owner_id?: string
          status?: 'bozza' | 'in_attesa' | 'pubblicato' | 'scaduto' | 'rifiutato'
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
          views?: number
          surface?: number | null
          rooms?: number | null
          bathrooms?: number | null
          floor?: number | null
          energy_class?: string | null
          features?: string[]
        }
      }
      role_requests: {
        Row: {
          id: string
          user_id: string
          requested_role: 'inserzionista'
          status: 'in_attesa' | 'approvato' | 'rifiutato'
          reason: string | null
          admin_notes: string | null
          created_at: string
          updated_at: string
          reviewed_by: string | null
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          requested_role: 'inserzionista'
          status?: 'in_attesa' | 'approvato' | 'rifiutato'
          reason?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          requested_role?: 'inserzionista'
          status?: 'in_attesa' | 'approvato' | 'rifiutato'
          reason?: string | null
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          site_name: string
          site_description: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          contact_email: string
          contact_phone: string | null
          facebook_url: string | null
          instagram_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_name?: string
          site_description?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          contact_email: string
          contact_phone?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_name?: string
          site_description?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          contact_email?: string
          contact_phone?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
