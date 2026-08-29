import { getLiveVolumeStats } from '@/lib/productResults'
import {
  getAdminSummaryCounts,
  getRecentCheckPayments,
  getRecentCheckRequests,
  getRecentLeads,
  getRetainerCustomersWithWatches,
} from '@/lib/adminData'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

function fmt(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function Card({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="pa-glass p-5">
      <div className="pa-display text-3xl font-bold mb-1" style={{ color: 'var(--primary)' }}>{value}</div>
      <div className="text-sm leading-snug" style={{ color: 'var(--on-surface-variant)' }}>{label}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="pa-display text-lg font-bold mb-3" style={{ color: 'var(--on-surface)' }}>{title}</h2>
      <div className="pa-glass overflow-x-auto">{children}</div>
    </section>
  )
}

const th = 'text-left text-xs uppercase tracking-wide px-4 py-2 whitespace-nowrap'
const td = 'text-sm px-4 py-2 whitespace-nowrap'

export default async function AdminDashboardPage() {
  const [liveStats, counts, leads, checkRequests, checkPayments, retainers] = await Promise.all([
    getLiveVolumeStats(),
    getAdminSummaryCounts(),
    getRecentLeads(),
    getRecentCheckRequests(),
    getRecentCheckPayments(),
    getRetainerCustomersWithWatches(),
  ])

  return (
    <div className="min-h-screen w-full px-6 md:px-12 py-10" style={{ background: 'var(--surface-container-low)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="pa-display text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>Admin</h1>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 max-w-md">
          <Card value={liveStats.uniquePatents} label="real 2025 patents analyzed" />
          <Card value={liveStats.totalResults} label="results published" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          <Card value={counts.totalLeads} label="total leads" />
          <Card value={counts.pendingCheckRequests} label="pending check requests" />
          <Card value={counts.checkPaymentsFound} label="paid checks — found" />
          <Card value={counts.checkPaymentsQueued} label="paid checks — queued" />
          <Card value={counts.activeRetainerCustomers} label="active retainer customers" />
        </div>

        <Section title={`Recent leads (${leads.length})`}>
          <table className="w-full border-collapse">
            <thead><tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th className={th}>Name</th><th className={th}>Email</th><th className={th}>Company</th><th className={th}>Patent</th><th className={th}>When</th>
            </tr></thead>
            <tbody>
              {leads.length === 0 && <tr><td className={td} colSpan={5} style={{ color: 'var(--on-surface-muted)' }}>No leads yet.</td></tr>}
              {leads.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td className={td}>{l.name}</td>
                  <td className={td}>{l.email}</td>
                  <td className={td}>{l.company}</td>
                  <td className={td}>{l.patent_number || '—'}</td>
                  <td className={td} style={{ color: 'var(--on-surface-muted)' }}>{fmt(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title={`Recent check requests (${checkRequests.length})`}>
          <table className="w-full border-collapse">
            <thead><tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th className={th}>Patent</th><th className={th}>Requester</th><th className={th}>Status</th><th className={th}>Fulfilled</th><th className={th}>When</th>
            </tr></thead>
            <tbody>
              {checkRequests.length === 0 && <tr><td className={td} colSpan={5} style={{ color: 'var(--on-surface-muted)' }}>No check requests yet.</td></tr>}
              {checkRequests.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td className={td}>{r.patent_number}</td>
                  <td className={td}>{r.requester_name ? `${r.requester_name} — ` : ''}{r.requester_email}</td>
                  <td className={td}>{r.status}</td>
                  <td className={td} style={{ color: 'var(--on-surface-muted)' }}>{fmt(r.fulfilled_at)}</td>
                  <td className={td} style={{ color: 'var(--on-surface-muted)' }}>{fmt(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title={`Recent paid checks (${checkPayments.length})`}>
          <table className="w-full border-collapse">
            <thead><tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th className={th}>Provider</th><th className={th}>Patent</th><th className={th}>Requester</th><th className={th}>Outcome</th><th className={th}>When</th>
            </tr></thead>
            <tbody>
              {checkPayments.length === 0 && <tr><td className={td} colSpan={5} style={{ color: 'var(--on-surface-muted)' }}>No paid checks yet.</td></tr>}
              {checkPayments.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td className={td}>{p.provider}</td>
                  <td className={td}>{p.patent_number}</td>
                  <td className={td}>{p.requester_name ? `${p.requester_name} — ` : ''}{p.requester_email}</td>
                  <td className={td}>{p.outcome}</td>
                  <td className={td} style={{ color: 'var(--on-surface-muted)' }}>{fmt(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title={`Retainer customers (${retainers.length})`}>
          <table className="w-full border-collapse">
            <thead><tr style={{ borderBottom: '1px solid var(--border-light)' }}>
              <th className={th}>Company</th><th className={th}>Contact</th><th className={th}>Status</th><th className={th}>Watching</th><th className={th}>Since</th>
            </tr></thead>
            <tbody>
              {retainers.length === 0 && <tr><td className={td} colSpan={5} style={{ color: 'var(--on-surface-muted)' }}>No retainer customers yet.</td></tr>}
              {retainers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td className={td}>{c.company}</td>
                  <td className={td}>{c.contact_name ? `${c.contact_name} — ` : ''}{c.contact_email}</td>
                  <td className={td}>{c.status}</td>
                  <td className={td}>{c.watches.map((w) => w.seed_patent).join(', ') || '—'}</td>
                  <td className={td} style={{ color: 'var(--on-surface-muted)' }}>{fmt(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  )
}
