export const LISTING_TYPES = {
  vendita: 'Vendita',
  affitto_breve: 'Affitto Breve',
  affitto_lungo: 'Affitto Lungo',
  cercasi: 'Cercasi',
} as const

export const LISTING_CATEGORIES = {
  appartamento: 'Appartamento',
  villa: 'Villa',
  terreno: 'Terreno',
  commerciale: 'Commerciale',
  altro: 'Altro',
} as const

export const LISTING_STATUS = {
  bozza: 'Bozza',
  in_attesa: 'In Attesa',
  pubblicato: 'Pubblicato',
  scaduto: 'Scaduto',
  rifiutato: 'Rifiutato',
} as const

export const USER_ROLES = {
  utente: 'Utente',
  inserzionista: 'Inserzionista',
  admin: 'Admin',
} as const

export const PROVINCES = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno',
  'Asti', 'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento',
  'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari',
  'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti',
  'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara',
  'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia',
  'Grosseto', 'Imperia', 'Isernia', 'La Spezia', 'L\'Aquila', 'Latina',
  'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata', 'Mantova',
  'Massa-Carrara', 'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza',
  'Napoli', 'Novara', 'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma',
  'Pavia', 'Perugia', 'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa',
  'Pistoia', 'Pordenone', 'Potenza', 'Prato', 'Ragusa', 'Ravenna',
  'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini', 'Roma', 'Rovigo',
  'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Sud Sardegna',
  'Taranto', 'Teramo', 'Terni', 'Torino', 'Trapani', 'Trento', 'Treviso',
  'Trieste', 'Udine', 'Varese', 'Venezia', 'Verbano-Cusio-Ossola', 'Vercelli',
  'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo',
]
