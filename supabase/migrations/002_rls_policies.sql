-- =============================================
-- ABILITA RLS SU TUTTE LE TABELLE
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLICIES: users
-- =============================================

-- Tutti possono leggere i profili pubblici
CREATE POLICY "Public users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Gli utenti possono aggiornare solo il proprio profilo
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Solo gli utenti autenticati possono inserire il proprio profilo
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Solo admin possono eliminare utenti
CREATE POLICY "Only admins can delete users"
  ON users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- POLICIES: listings
-- =============================================

-- Tutti possono vedere gli annunci pubblicati
CREATE POLICY "Published listings are viewable by everyone"
  ON listings FOR SELECT
  USING (
    status = 'pubblicato' 
    OR owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo inserzionisti e admin possono creare annunci
CREATE POLICY "Inserzionisti can insert listings"
  ON listings FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role IN ('inserzionista', 'admin')
    )
  );

-- Gli owner possono aggiornare i propri annunci
CREATE POLICY "Owners can update own listings"
  ON listings FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Gli owner e admin possono eliminare annunci
CREATE POLICY "Owners can delete own listings"
  ON listings FOR DELETE
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- POLICIES: role_requests
-- =============================================

-- Gli utenti possono vedere solo le proprie richieste
CREATE POLICY "Users can view own requests"
  ON role_requests FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Gli utenti possono creare richieste solo per se stessi
CREATE POLICY "Users can create own requests"
  ON role_requests FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'utente'
    )
  );

-- Solo admin possono aggiornare le richieste
CREATE POLICY "Only admins can update requests"
  ON role_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo admin possono eliminare richieste
CREATE POLICY "Only admins can delete requests"
  ON role_requests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- POLICIES: favorites
-- =============================================

-- Gli utenti possono vedere solo i propri preferiti
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (user_id = auth.uid());

-- Gli utenti possono aggiungere preferiti solo per se stessi
CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Gli utenti possono eliminare solo i propri preferiti
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (user_id = auth.uid());

-- =============================================
-- POLICIES: site_settings
-- =============================================

-- Tutti possono leggere le impostazioni del sito
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Solo admin possono aggiornare le impostazioni
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- FUNCTION: verifica se utente è admin
-- =============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION: verifica se utente è inserzionista
-- =============================================
CREATE OR REPLACE FUNCTION is_inserzionista()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('inserzionista', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
