-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELLA: users
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'utente' CHECK (role IN ('utente', 'inserzionista', 'admin')),
  status TEXT NOT NULL DEFAULT 'attivo' CHECK (status IN ('attivo', 'sospeso', 'in_attesa')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELLA: listings (annunci)
-- =============================================
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vendita', 'affitto_breve', 'affitto_lungo', 'cercasi')),
  category TEXT NOT NULL CHECK (category IN ('appartamento', 'villa', 'terreno', 'commerciale', 'altro')),
  price DECIMAL(12, 2) NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  address TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'bozza' CHECK (status IN ('bozza', 'in_attesa', 'pubblicato', 'scaduto', 'rifiutato')),
  views INTEGER DEFAULT 0,
  surface DECIMAL(10, 2),
  rooms INTEGER,
  bathrooms INTEGER,
  floor INTEGER,
  energy_class TEXT,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Indici per performance
CREATE INDEX idx_listings_owner ON listings(owner_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_province ON listings(province);
CREATE INDEX idx_listings_created ON listings(created_at DESC);

-- =============================================
-- TABELLA: role_requests (richieste upgrade)
-- =============================================
CREATE TABLE IF NOT EXISTS role_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_role TEXT NOT NULL DEFAULT 'inserzionista' CHECK (requested_role IN ('inserzionista')),
  status TEXT NOT NULL DEFAULT 'in_attesa' CHECK (status IN ('in_attesa', 'approvato', 'rifiutato')),
  reason TEXT,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici
CREATE INDEX idx_role_requests_user ON role_requests(user_id);
CREATE INDEX idx_role_requests_status ON role_requests(status);

-- =============================================
-- TABELLA: favorites (preferiti)
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- Indici
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id);

-- =============================================
-- TABELLA: site_settings (impostazioni sito)
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT DEFAULT 'Vetrina Immobiliare',
  site_description TEXT DEFAULT 'Pubblica e cerca annunci immobiliari gratuitamente',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#1e40af',
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserisci impostazioni di default
INSERT INTO site_settings (contact_email) 
VALUES ('info@vetrinaimmobiliare.it')
ON CONFLICT DO NOTHING;

-- =============================================
-- TRIGGER: aggiornamento automatico updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applica trigger a tutte le tabelle
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_requests_updated_at BEFORE UPDATE ON role_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- FUNCTION: incrementa views annuncio
-- =============================================
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings
  SET views = views + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;
