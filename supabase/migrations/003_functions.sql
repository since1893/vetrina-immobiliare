-- =============================================
-- FUNCTION: Crea profilo utente automaticamente dopo signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger che si attiva quando un nuovo utente si registra
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FUNCTION: Approva richiesta inserzionista
-- =============================================
CREATE OR REPLACE FUNCTION approve_role_request(
  request_id UUID,
  admin_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Verifica che chi chiama sia admin
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Solo gli admin possono approvare richieste';
  END IF;

  -- Recupera l'user_id dalla richiesta
  SELECT user_id INTO target_user_id
  FROM role_requests
  WHERE id = request_id AND status = 'in_attesa';

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Richiesta non trovata o già processata';
  END IF;

  -- Aggiorna la richiesta
  UPDATE role_requests
  SET 
    status = 'approvato',
    reviewed_by = admin_id,
    reviewed_at = NOW(),
    admin_notes = notes
  WHERE id = request_id;

  -- Aggiorna il ruolo dell'utente
  UPDATE users
  SET role = 'inserzionista'
  WHERE id = target_user_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Rifiuta richiesta inserzionista
-- =============================================
CREATE OR REPLACE FUNCTION reject_role_request(
  request_id UUID,
  admin_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Verifica che chi chiama sia admin
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE id = admin_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Solo gli admin possono rifiutare richieste';
  END IF;

  -- Aggiorna la richiesta
  UPDATE role_requests
  SET 
    status = 'rifiutato',
    reviewed_by = admin_id,
    reviewed_at = NOW(),
    admin_notes = notes
  WHERE id = request_id AND status = 'in_attesa';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Richiesta non trovata o già processata';
  END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Pubblica annuncio (cambia status)
-- =============================================
CREATE OR REPLACE FUNCTION publish_listing(
  listing_id UUID,
  admin_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  listing_owner_id UUID;
BEGIN
  -- Recupera l'owner dell'annuncio
  SELECT owner_id INTO listing_owner_id
  FROM listings
  WHERE id = listing_id;

  -- Verifica permessi: owner o admin
  IF auth.uid() != listing_owner_id AND NOT is_admin() THEN
    RAISE EXCEPTION 'Non hai i permessi per pubblicare questo annuncio';
  END IF;

  -- Pubblica l'annuncio
  UPDATE listings
  SET 
    status = 'pubblicato',
    published_at = NOW(),
    expires_at = NOW() + INTERVAL '90 days'
  WHERE id = listing_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Conta annunci per utente
-- =============================================
CREATE OR REPLACE FUNCTION count_user_listings(user_id UUID)
RETURNS TABLE (
  total INTEGER,
  pubblicati INTEGER,
  in_attesa INTEGER,
  bozze INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total,
    COUNT(*) FILTER (WHERE status = 'pubblicato')::INTEGER as pubblicati,
    COUNT(*) FILTER (WHERE status = 'in_attesa')::INTEGER as in_attesa,
    COUNT(*) FILTER (WHERE status = 'bozza')::INTEGER as bozze
  FROM listings
  WHERE owner_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Ricerca annunci con filtri
-- =============================================
CREATE OR REPLACE FUNCTION search_listings(
  search_query TEXT DEFAULT NULL,
  listing_type TEXT DEFAULT NULL,
  listing_category TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  city_filter TEXT DEFAULT NULL,
  province_filter TEXT DEFAULT NULL
)
RETURNS SETOF listings AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM listings
  WHERE 
    status = 'pubblicato'
    AND (search_query IS NULL OR 
         title ILIKE '%' || search_query || '%' OR 
         description ILIKE '%' || search_query || '%')
    AND (listing_type IS NULL OR type = listing_type)
    AND (listing_category IS NULL OR category = listing_category)
    AND (min_price IS NULL OR price >= min_price)
    AND (max_price IS NULL OR price <= max_price)
    AND (city_filter IS NULL OR city ILIKE '%' || city_filter || '%')
    AND (province_filter IS NULL OR province = province_filter)
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- FUNCTION: Toggle favorite (aggiungi/rimuovi)
-- =============================================
CREATE OR REPLACE FUNCTION toggle_favorite(
  user_id UUID,
  listing_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  favorite_exists BOOLEAN;
BEGIN
  -- Verifica se esiste già
  SELECT EXISTS (
    SELECT 1 FROM favorites
    WHERE favorites.user_id = toggle_favorite.user_id
    AND favorites.listing_id = toggle_favorite.listing_id
  ) INTO favorite_exists;

  IF favorite_exists THEN
    -- Rimuovi
    DELETE FROM favorites
    WHERE favorites.user_id = toggle_favorite.user_id
    AND favorites.listing_id = toggle_favorite.listing_id;
    RETURN FALSE;
  ELSE
    -- Aggiungi
    INSERT INTO favorites (user_id, listing_id)
    VALUES (toggle_favorite.user_id, toggle_favorite.listing_id);
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: Statistiche admin dashboard
-- =============================================
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_users INTEGER,
  total_inserzionisti INTEGER,
  total_listings INTEGER,
  published_listings INTEGER,
  pending_requests INTEGER,
  pending_listings INTEGER
) AS $$
BEGIN
  -- Verifica che chi chiama sia admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Solo gli admin possono vedere queste statistiche';
  END IF;

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM users) as total_users,
    (SELECT COUNT(*)::INTEGER FROM users WHERE role = 'inserzionista') as total_inserzionisti,
    (SELECT COUNT(*)::INTEGER FROM listings) as total_listings,
    (SELECT COUNT(*)::INTEGER FROM listings WHERE status = 'pubblicato') as published_listings,
    (SELECT COUNT(*)::INTEGER FROM role_requests WHERE status = 'in_attesa') as pending_requests,
    (SELECT COUNT(*)::INTEGER FROM listings WHERE status = 'in_attesa') as pending_listings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
