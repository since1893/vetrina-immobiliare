import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export default async function SignupPage() {
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
            Crea il tuo account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hai già un account?{' '}
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Accedi qui
            </Link>
          </p>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-2">ℹ️ Dopo la registrazione:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Potrai salvare annunci preferiti</li>
            <li>Richiedere di diventare inserzionista</li>
            <li>Pubblicare annunci (dopo approvazione admin)</li>
          </ul>
        </div>

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
