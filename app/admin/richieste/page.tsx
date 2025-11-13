import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatDate } from '@/lib/utils/formatting'
import ApproveRequestButton from '@/components/admin/ApproveRequestButton'
import RejectRequestButton from '@/components/admin/RejectRequestButton'

export default async function AdminRichiesePage({
  searchParams,
}: {
  searchParams: { status?: string }
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

  // Query richieste con filtro
  let query = supabase
    .from('role_requests')
    .select(`
      *,
      user:users (
        id,
        email,
        full_name,
        phone,
        role
      ),
      reviewer:reviewed_by (
        full_name,
        email
      )
    `)
    .order('created_at', { ascending: false })

  if (searchParams.status) {
    query = query.eq('status', searchParams.status)
  }

  const { data: requests } = await query

  // Conta per status
  const { data: allRequests } = await supabase
    .from('role_requests')
    .select('status')

  const counts = {
    tutte: allRequests?.length || 0,
    in_attesa: allRequests?.filter(r => r.status === 'in_attesa').length || 0,
    approvato: allRequests?.filter(r => r.status === 'approvato').length || 0,
    rifiutato: allRequests?.filter(r => r.status === 'rifiutato').length || 0,
  }

  return (
    <div className="container-custom">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Richieste Inserzionista
        </h1>
        <p className="text-gray-600">
          Approva o rifiuta le richieste di upgrade a inserzionista
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">{counts.tutte}</div>
          <div className="text-sm text-gray-600">Totali</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{counts.in_attesa}</div>
          <div className="text-sm text-gray-600">In Attesa</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{counts.approvato}</div>
          <div className="text-sm text-gray-600">Approvate</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{counts.rifiutato}</div>
          <div className="text-sm text-gray-600">Rifiutate</div>
        </div>
      </div>

      {/* Filtri */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/richieste"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !searchParams.status
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutte ({counts.tutte})
          </a>
          <a
            href="/admin/richieste?status=in_attesa"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchParams.status === 'in_attesa'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⏳ In Attesa ({counts.in_attesa})
          </a>
          <a
            href="/admin/richieste?status=approvato"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchParams.status === 'approvato'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Approvate ({counts.approvato})
          </a>
          <a
            href="/admin/richieste?status=rifiutato"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              searchParams.status === 'rifiutato'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ❌ Rifiutate ({counts.rifiutato})
          </a>
        </div>
      </div>

      {/* Lista Richieste */}
      {requests && requests.length > 
