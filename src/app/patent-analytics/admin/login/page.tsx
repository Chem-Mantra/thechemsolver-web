'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/patent-analytics/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed.')
      router.push('/patent-analytics/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ background: 'var(--surface-container-low)' }}>
      <form onSubmit={submit} className="pa-glass pa-glass-elevated w-full max-w-sm p-8" style={{ background: 'var(--surface-bright)' }}>
        <h1 className="pa-display text-xl font-bold mb-1" style={{ color: 'var(--on-surface)' }}>Patent Analytics admin</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--on-surface-muted)' }}>Sign in to view submissions and stats.</p>
        <input
          type="password"
          required
          autoFocus
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="text-base px-4 py-3 rounded-lg outline-none disabled:opacity-60 w-full mb-4"
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border-light)' }}
        />
        {error && <p className="text-sm mb-4" style={{ color: '#ba1a1a' }}>{error}</p>}
        <button type="submit" disabled={loading} className="pa-btn-primary text-sm font-medium px-5 py-3 w-full disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
