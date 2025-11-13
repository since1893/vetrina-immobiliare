'use client'

import Link from 'next/link'
import { useState } from 'react'
import Container from './Container'

interface HeaderProps {
  variant?: 'public' | 'dashboard' | 'admin'
}

export default function Header({ variant = 'public' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (variant === 'public') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/annunci" className="text-gray-700 hover:text-primary-600 transition-colors">
                Annunci
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                Accedi
              </Link>
              <Link href="/signup" className="btn-primary">
                Registrati
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Home
                </Link>
                <Link href="/annunci" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Annunci
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Accedi
                </Link>
                <Link href="/signup" className="btn-primary inline-block text-center">
                  Registrati
                </Link>
              </nav>
            </div>
          )}
        </Container>
      </header>
    )
  }

  if (variant === 'dashboard') {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="text-xl font-bold text-primary-600">
              🏠 Dashboard
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/annunci" className="text-gray-700 hover:text-primary-600">
                Annunci
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
            </nav>
          </div>
        </Container>
      </header>
    )
  }

  if (variant === 'admin') {
    return (
      <header className="bg-purple-900 text-white sticky top-0 z-50">
        <Container>
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-xl font-bold">
              ⚙️ Admin Panel
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/admin" className="hover:text-purple-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/utenti" className="hover:text-purple-200 transition-colors">
                Utenti
              </Link>
              <Link href="/admin/richieste" className="hover:text-purple-200 transition-colors">
                Richieste
              </Link>
              <Link href="/admin/annunci" className="hover:text-purple-200 transition-colors">
                Annunci
              </Link>
              <Link href="/" className="text-sm hover:text-purple-200 transition-colors">
                🏠 Vai al Sito
              </Link>
            </nav>
          </div>
        </Container>
      </header>
    )
  }

  return null
}
