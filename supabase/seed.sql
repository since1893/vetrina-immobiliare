-- =============================================
-- SEED DATA: Dati di esempio per testing
-- =============================================

-- NOTA: Questi dati sono per TESTING locale
-- NON eseguire in produzione!

-- =============================================
-- 1. Crea utente ADMIN di test
-- =============================================
-- IMPORTANTE: Prima devi registrare manualmente un utente su Supabase
-- Poi copia il suo UUID e inseriscilo qui sotto

-- Esempio (sostituisci con il TUO user ID):
-- INSERT INTO users (id, email, full_name, role, status)
-- VALUES (
--   'YOUR-USER-UUID-HERE',
--   'admin@vetrinaimmobiliare.it',
--   'Admin Test',
--   'admin',
--   'attivo'
-- ) ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- =============================================
-- 2. Crea utenti di test
-- =============================================

-- Utente base (deve prima registrarsi via Auth)
-- INSERT INTO users (id, email, full_name, role, status)
-- VALUES (
--   'user-uuid-1',
--   'utente@test.it',
--   'Mario Rossi',
--   'utente',
--   'attivo'
-- );

-- Inserzionista (deve prima registrarsi via Auth)
-- INSERT INTO users (id, email, full_name, role, status, phone)
-- VALUES (
--   'user-uuid-2',
--   'inserzionista@test.it',
--   'Luigi Verdi',
--   'inserzionista',
--   'attivo',
--   '+39 123 456 7890'
-- );

-- =============================================
-- 3. Annunci di esempio
-- =============================================

-- NOTA: Sostituisci 'user-uuid-2' con l'ID del tuo utente inserzionista

-- INSERT INTO listings (
--   owner_id,
--   title,
--   description,
--   type,
--   category,
--   price,
--   location,
--   city,
--   province,
--   address,
--   status,
--   surface,
--   rooms,
--   bathrooms,
--   floor,
--   energy_class,
--   features,
--   published_at
-- ) VALUES
-- (
--   'user-uuid-2',
--   'Appartamento moderno in centro',
--   'Bellissimo appartamento completamente ristrutturato nel cuore della città. Luminoso, silenzioso e dotato di ogni comfort. Ideale per coppie o piccole famiglie.',
--   'vendita',
--   'appartamento',
--   250000.00,
--   'Centro Storico',
--   'Milano',
--   'Milano',
--   'Via Roma, 15',
--   'pubblicato',
--   85.00,
--   3,
--   2,
--   2,
--   'A',
--   ARRAY['balcone', 'aria_condizionata', 'riscaldamento_autonomo', 'porta_blindata'],
--   NOW()
-- ),
-- (
--   'user-uuid-2',
--   'Villa con giardino e piscina',
--   'Splendida villa indipendente con ampio giardino privato e piscina. Zona residenziale tranquilla e ben servita. Finiture di pregio.',
--   'vendita',
--   'villa',
--   580000.00,
--   'Zona Residenziale',
--   'Roma',
--   'Roma',
--   'Via dei Pini, 42',
--   'pubblicato',
--   220.00,
--   5,
--   3,
--   0,
--   'B',
--   ARRAY['giardino', 'piscina', 'garage', 'cantina', 'allarme'],
--   NOW()
-- ),
-- (
--   'user-uuid-2',
--   'Monolocale affitto breve turistico',
--   'Grazioso monolocale ideale per soggiorni turistici. Posizione strategica vicino ai principali mezzi di trasporto.',
--   'affitto_breve',
--   'appartamento',
--   80.00,
--   'Stazione Centrale',
--   'Firenze',
--   'Firenze',
--   NULL,
--   'pubblicato',
--   35.00,
--   1,
--   1,
--   3,
--   'C',
--   ARRAY['wifi', 'aria_condizionata', 'cucina_attrezzata'],
--   NOW()
-- ),
-- (
--   'user-uuid-2',
--   'Ufficio open space luminoso',
--   'Ufficio openspace di 120mq in zona commerciale. Ottimo per attività professionali. Disponibile da subito.',
--   'affitto_lungo',
--   'commerciale',
--   1500.00,
--   'Quartiere Affari',
--   'Bologna',
--   'Bologna',
--   'Via Indipendenza, 88',
--   'pubblicato',
--   120.00,
--   NULL,
--   2,
--   1,
--   NULL,
--   ARRAY['aria_condizionata', 'parcheggio', 'ascensore'],
--   NOW()
-- );

-- =============================================
-- 4. Richieste di esempio
-- =============================================

-- INSERT INTO role_requests (user_id, requested_role, status, reason)
-- VALUES (
--   'user-uuid-1',
--   'inserzionista',
--   'in_attesa',
--   'Sono un agente immobiliare e vorrei pubblicare annunci per i miei clienti.'
-- );

-- =============================================
-- 5. Preferiti di esempio
-- =============================================

-- INSERT INTO favorites (user_id, listing_id)
-- SELECT 'user-uuid-1', id
-- FROM listings
-- LIMIT 2;

-- =============================================
-- ISTRUZIONI PER L'USO:
-- =============================================

-- 1. Vai su Supabase Dashboard
-- 2. SQL Editor
-- 3. Esegui prima le migrations (001, 002, 003)
-- 4. Registra manualmente 2-3 utenti via interfaccia web
-- 5. Copia i loro UUID dalla tabella auth.users
-- 6. Sostituisci gli UUID nei commenti sopra
-- 7. Togli i commenti (--) dalle INSERT che vuoi eseguire
-- 8. Esegui questo file

-- OPPURE:

-- Usa l'app normalmente:
-- - Registra utenti
-- - Crea annunci
-- - Testa le funzionalità

-- =============================================
-- QUERY UTILI PER IL TESTING:
-- =============================================

-- Visualizza tutti gli utenti
-- SELECT id, email, role, status FROM users;

-- Visualizza tutti gli annunci
-- SELECT id, title, city, price, status, owner_id FROM listings;

-- Visualizza richieste pendenti
-- SELECT * FROM role_requests WHERE status = 'in_attesa';

-- Promuovi un utente ad admin manualmente
-- UPDATE users SET role = 'admin' WHERE email = 'tuaemail@test.it';

-- Conta annunci per città
-- SELECT city, COUNT(*) as total 
-- FROM listings 
-- WHERE status = 'pubblicato' 
-- GROUP BY city 
-- ORDER BY total DESC;
