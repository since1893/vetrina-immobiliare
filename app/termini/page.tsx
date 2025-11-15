import Link from 'next/link'

export const metadata = {
  title: 'Termini di Servizio - Vetrina Immobiliare',
  description: 'Condizioni d\'uso della piattaforma Vetrina Immobiliare',
}

export default function TerminiPage() {
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
              Termini di Servizio
            </h1>
            
            <div className="prose max-w-none text-gray-700 space-y-6">
              <p className="text-sm text-gray-500">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
              </p>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Accettazione dei Termini</h2>
                <p>
                  Utilizzando Vetrina Immobiliare, accetti questi Termini di Servizio. 
                  Se non accetti questi termini, non utilizzare la piattaforma.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Descrizione del Servizio</h2>
                <p>
                  Vetrina Immobiliare è una piattaforma gratuita che permette di pubblicare 
                  e visualizzare annunci immobiliari. Il servizio è fornito "così com'è" 
                  senza garanzie di alcun tipo.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Registrazione e Account</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Devi fornire informazioni accurate durante la registrazione</li>
                  <li>Sei responsabile della sicurezza del tuo account</li>
                  <li>Non puoi condividere il tuo account con altri</li>
                  <li>Devi avere almeno 18 anni per registrarti</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Regole per gli Annunci</h2>
                <p>Gli inserzionisti si impegnano a:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pubblicare solo annunci veritieri e legali</li>
                  <li>Non pubblicare contenuti offensivi, illegali o ingannevoli</li>
                  <li>Utilizzare immagini di cui hanno i diritti</li>
                  <li>Aggiornare o rimuovere annunci non più validi</li>
                  <li>Non pubblicare spam o contenuti duplicati</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Contenuti Vietati</h2>
                <p>È vietato pubblicare:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Annunci falsi o fraudolenti</li>
                  <li>Contenuti che violano diritti di terzi</li>
                  <li>Materiale pornografico o offensivo</li>
                  <li>Contenuti che violano le leggi italiane</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Moderazione</h2>
                <p>
                  Ci riserviamo il diritto di:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Approvare, modificare o rifiutare qualsiasi annuncio</li>
                  <li>Sospendere o eliminare account che violano i termini</li>
                  <li>Rimuovere contenuti inappropriati senza preavviso</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitazione di Responsabilità</h2>
                <p>
                  Vetrina Immobiliare non è responsabile per:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>L'accuratezza degli annunci pubblicati</li>
                  <li>Transazioni tra utenti</li>
                  <li>Perdite o danni derivanti dall'uso del servizio</li>
                  <li>Interruzioni o malfunzionamenti del servizio</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Proprietà Intellettuale</h2>
                <p>
                  Il design, logo e codice di Vetrina Immobiliare sono protetti da copyright. 
                  Gli utenti mantengono i diritti sui contenuti che pubblicano.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Modifiche ai Termini</h2>
                <p>
                  Possiamo modificare questi termini in qualsiasi momento. 
                  Le modifiche saranno efficaci dalla data di pubblicazione.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Legge Applicabile</h2>
                <p>
                  Questi termini sono regolati dalla legge italiana. 
                  Per controversie è competente il Foro di [Città].
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contatti</h2>
                <p>
                  Per domande sui Termini di Servizio: 
                  <a href="mailto:info@vetrinaimmobiliare.it" className="text-primary-600 hover:underline ml-1">
                    info@vetrinaimmobiliare.it
                  </a>
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
