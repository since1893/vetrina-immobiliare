import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default async function LoginPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Se già loggato, reindirizza alla dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-primary-600">
            🏠 Vetrina Immobiliare
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Accedi al tuo account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Oppure{' '}
            <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
              registrati gratuitamente
            </Link>
          </p>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Footer */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Torna alla home
          </Link>
        </div>
      </div>
    </div>
  )
}
