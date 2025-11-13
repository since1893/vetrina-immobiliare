import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verifica ruolo admin
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-purple-900 text-white sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold">
                ⚙️ Admin Panel
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/admin" className="hover:text-purple-200">
                  Dashboard
                </Link>
                <Link href="/admin/utenti" className="hover:text-purple-200">
                  Utenti
                </Link>
                <Link href="/admin/richieste" className="hover:text-purple-200">
                  Richieste
                </Link>
                <Link href="/admin/annunci" className="hover:text-purple-200">
                  Annunci
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm hover:text-purple-200">
                🏠 Vai al Sito
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="md:hidden bg-purple-800 text-white border-b border-purple-700">
        <div className="container-custom py-3">
          <nav className="flex gap-4 overflow-x-auto">
            <Link href="/admin" className="text-sm whitespace-nowrap hover:text-purple-200">
              Dashboard
            </Link>
            <Link href="/admin/utenti" className="text-sm whitespace-nowrap hover:text-purple-200">
              Utenti
            </Link>
            <Link href="/admin/richieste" className="text-sm whitespace-nowrap hover:text-purple-200">
              Richieste
            </Link>
            <Link href="/admin/annunci" className="text-sm whitespace-nowrap hover:text-purple-200">
              Annunci
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container-custom py-6 text-center text-sm text-gray-600">
          <p>👑 Pannello Amministratore - Vetrina Immobiliare</p>
        </div>
      </footer>
    </div>
  )
}
