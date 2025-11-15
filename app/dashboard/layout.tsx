import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function DashboardLayout({
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

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Unico */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary-600">
              🏠 Vetrina Immobiliare
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/annunci" className="text-gray-700 hover:text-primary-600">
                Annunci
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
              {(userData?.role === 'inserzionista' || userData?.role === 'admin') && (
                <Link href="/dashboard/inserzionista" className="text-gray-700 hover:text-primary-600">
                  I Miei Annunci
                </Link>
              )}
              {userData?.role === 'admin' && (
                <Link href="/admin" className="text-gray-700 hover:text-primary-600">
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {userData?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userData?.role}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {userData?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="container-custom py-3">
          <nav className="flex gap-4 overflow-x-auto">
            <Link href="/dashboard" className="text-sm text-gray-700 hover:text-primary-600 whitespace-nowrap">
              Dashboard
            </Link>
            <Link href="/dashboard/preferiti" className="text-sm text-gray-700 hover:text-primary-600 whitespace-nowrap">
              Preferiti
            </Link>
            <Link href="/dashboard/profilo" className="text-sm text-gray-700 hover:text-primary-600 whitespace-nowrap">
              Profilo
            </Link>
            {(userData?.role === 'inserzionista' || userData?.role === 'admin') && (
              <Link href="/dashboard/inserzionista" className="text-sm text-gray-700 hover:text-primary-600 whitespace-nowrap">
                I Miei Annunci
              </Link>
            )}
            {userData?.role === 'admin' && (
              <Link href="/admin" className="text-sm text-gray-700 hover:text-primary-600 whitespace-nowrap">
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container-custom py-6 text-center text-sm text-gray-600">
          <p>&copy; 2024 Vetrina Immobiliare. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  )
}
