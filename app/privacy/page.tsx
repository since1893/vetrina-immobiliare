import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Vetrina Immobiliare',
  description: 'Informativa sulla privacy e trattamento dati personali',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              ← Torna alla Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            
            <div className="prose max-w-none text-gray-700 space-y-6">
              <p className="text-sm text-gray-500">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
              </p>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduzione</h2>
                <p>
                  Vetrina Immobiliare si impegna a proteggere la privacy degli utenti. 
                  Questa Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo 
                  i tuoi dati personali.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Dati Raccolti</h2>
                <p>Raccogliamo le seguenti informazioni:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome completo e indirizzo email (durante la registrazione)</li>
                  <li>Numero di telefono (opzionale)</li>
                  <li>Informazioni sugli annunci pubblicati</li>
                  <li>Immagini caricate dagli inserzionisti</li>
                  <li>Cookie tecnici per il funzionamento del sito</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Utilizzo dei Dati</h2>
                <p>I tuoi dati vengono utilizzati per:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Gestire il tuo account e le tue pubblicazioni</li>
                  <li>Permettere la visualizzazione pubblica degli annunci</li>
                  <li>Comunicazioni relative al servizio</li>
                  <li>Migliorare l'esperienza utente</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Condivisione dei Dati</h2>
                <p>
                  I tuoi dati personali NON vengono venduti a terze parti. 
                  Le informazioni di contatto negli annunci sono visibili pubblicamente 
                  solo se scegli di pubblicarle.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Sicurezza</h2>
                <p>
                  Utilizziamo Supabase (certificato SOC 2 Type II) per garantire 
                  la massima sicurezza dei dati. I dati sono criptati e protetti 
                  da accessi non autorizzati.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. I Tuoi Diritti (GDPR)</h2>
                <p>Hai diritto a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Accedere ai tuoi dati personali</li>
                  <li>Richiedere la modifica o cancellazione dei dati</li>
                  <li>Opporti al trattamento dei dati</li>
                  <li>Richiedere la portabilità dei dati</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookie</h2>
                <p>
                  Utilizziamo solo cookie tecnici strettamente necessari per il 
                  funzionamento del sito (autenticazione e sessione utente). 
                  Non utilizziamo cookie di profilazione o tracciamento.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contatti</h2>
                <p>
                  Per esercitare i tuoi diritti o per qualsiasi domanda sulla privacy, 
                  contattaci a: <a href="mailto:privacy@vetrinaimmobiliare.it" className="text-primary-600 hover:underline">privacy@vetrinaimmobiliare.it</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="container-custom text-center">
          <p>&copy; 2024 Vetrina Immobiliare. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  )
}
