import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vetrina Immobiliare - Annunci Immobiliari Gratuiti',
  description: 'Pubblica e cerca annunci immobiliari: vendita, affitto breve, affitto lungo. Piattaforma gratuita per privati e agenzie.',
  keywords: ['immobiliare', 'annunci', 'casa', 'appartamento', 'vendita', 'affitto'],
  authors: [{ name: 'Vetrina Immobiliare' }],
  openGraph: {
    title: 'Vetrina Immobiliare',
    description: 'Pubblica e cerca annunci immobiliari gratuitamente',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
