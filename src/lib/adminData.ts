import { supabaseAdmin } from './supabase-admin'

// SERVER-ONLY (via supabaseAdmin, service role) -- backs the
// /patent-analytics/admin dashboard. Every function here is a thin
// "recent rows" read, no pagination/filtering: current volume across all
// of these tables is near zero, so that infra would be speculative scope
// until it's actually needed.

export type Lead = {
  id: string
  name: string
  email: string
  company: string
  patent_number: string | null
  created_at: string
}

export async function getRecentLeads(limit = 50): Promise<Lead[]> {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('getRecentLeads failed:', error.message)
    return []
  }
  return data as Lead[]
}

export type CheckRequest = {
  id: string
  patent_number: string
  requester_email: string
  requester_name: string | null
  status: string
  fulfilled_at: string | null
  created_at: string
}

export async function getRecentCheckRequests(limit = 50): Promise<CheckRequest[]> {
  const { data, error } = await supabaseAdmin
    .from('check_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('getRecentCheckRequests failed:', error.message)
    return []
  }
  return data as CheckRequest[]
}

export type CheckPayment = {
  id: string
  provider: string
  patent_number: string
  requester_email: string
  requester_name: string | null
  outcome: string
  result_url: string | null
  created_at: string
}

export async function getRecentCheckPayments(limit = 50): Promise<CheckPayment[]> {
  const { data, error } = await supabaseAdmin
    .from('check_payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('getRecentCheckPayments failed:', error.message)
    return []
  }
  return data as CheckPayment[]
}

export type RetainerCustomerWithWatches = {
  id: string
  company: string
  contact_email: string
  contact_name: string | null
  status: string
  created_at: string
  watches: { seed_patent: string; last_checked_at: string | null }[]
}

export async function getRetainerCustomersWithWatches(limit = 50): Promise<RetainerCustomerWithWatches[]> {
  const { data: customers, error: customerError } = await supabaseAdmin
    .from('retainer_customers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (customerError || !customers) {
    console.warn('getRetainerCustomersWithWatches failed:', customerError?.message)
    return []
  }
  if (customers.length === 0) return []

  const { data: watches, error: watchError } = await supabaseAdmin
    .from('retainer_watches')
    .select('customer_id, seed_patent, last_checked_at')
    .in('customer_id', customers.map((c) => c.id))

  const watchesByCustomer = new Map<string, { seed_patent: string; last_checked_at: string | null }[]>()
  if (!watchError && watches) {
    for (const w of watches) {
      const list = watchesByCustomer.get(w.customer_id) || []
      list.push({ seed_patent: w.seed_patent, last_checked_at: w.last_checked_at })
      watchesByCustomer.set(w.customer_id, list)
    }
  }

  return customers.map((c) => ({
    id: c.id,
    company: c.company,
    contact_email: c.contact_email,
    contact_name: c.contact_name,
    status: c.status,
    created_at: c.created_at,
    watches: watchesByCustomer.get(c.id) || [],
  }))
}

export type AdminSummaryCounts = {
  totalLeads: number
  pendingCheckRequests: number
  checkPaymentsFound: number
  checkPaymentsQueued: number
  activeRetainerCustomers: number
}

export async function getAdminSummaryCounts(): Promise<AdminSummaryCounts> {
  const [leads, pendingRequests, paymentsFound, paymentsQueued, activeRetainers] = await Promise.all([
    supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('check_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdmin.from('check_payments').select('*', { count: 'exact', head: true }).eq('outcome', 'found'),
    supabaseAdmin.from('check_payments').select('*', { count: 'exact', head: true }).eq('outcome', 'queued'),
    supabaseAdmin.from('retainer_customers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  return {
    totalLeads: leads.count ?? 0,
    pendingCheckRequests: pendingRequests.count ?? 0,
    checkPaymentsFound: paymentsFound.count ?? 0,
    checkPaymentsQueued: paymentsQueued.count ?? 0,
    activeRetainerCustomers: activeRetainers.count ?? 0,
  }
}
