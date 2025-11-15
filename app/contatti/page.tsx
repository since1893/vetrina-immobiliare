import Link from 'next/link'

export const metadata = {
  title: 'Contatti - Vetrina Immobiliare',
  description: 'Contattaci per supporto e informazioni',
}

export default function ContattiPage() {
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contattaci
            </h1>
            <p className="text-xl text-gray-600">
              Siamo qui per aiutarti! Scegli il metodo che preferisci
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">
                Inviaci un'email e ti risponderemo entro 24 ore
              </p>
              <a
                href="mailto:info@vetrinaimmobiliare.it"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                info@vetrinaimmobiliare.it
              </a>
            </div>

            {/* Supporto */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Supporto Tecnico</h3>
              <p className="text-gray-600 mb-4">
                Problemi con la piattaforma? Contatta il supporto
              </p>
              <a
                href="mailto:supporto@vetrinaimmobiliare.it"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                supporto@vetrinaimmobiliare.it
              </a>
            </div>

            {/* Admin */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Diventa Inserzionista</h3>
              <p className="text-gray-600 mb-4">
                Vuoi pubblicare annunci? Richiedi l'upgrade
              </p>
              <Link
                href="/signup"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Registrati e richiedi →
              </Link>
            </div>

            {/* Social */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Social Media</h3>
              <p className="text-gray-600 mb-4">
                Seguici sui social per aggiornamenti e novità
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Facebook
                </a>
                <a href="#" className="text-primary-600 hover:text-primary-700">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Domande Frequenti
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Come posso pubblicare un annuncio?
                </h3>
                <p className="text-gray-600">
                  Registrati, richiedi di diventare inserzionista e attendi l'approvazione dell'admin. 
                  Potrai poi pubblicare annunci illimitati gratuitamente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Il servizio è davvero gratuito?
                </h3>
                <p className="text-gray-600">
                  Sì, Vetrina Immobiliare è 100% gratuita sia per chi cerca casa 
                  che per chi pubblica annunci.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quanto tempo richiede l'approvazione?
                </h3>
                <p className="text-gray-600">
                  Le richieste vengono revisionate manualmente dall'admin. 
                  Generalmente entro 24-48 ore riceverai una risposta.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Posso modificare un annuncio già pubblicato?
                </h3>
                <p className="text-gray-600">
                  Sì, accedi alla tua dashboard inserzionista e modifica l'annuncio quando vuoi.
                </p>
              </div>
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
