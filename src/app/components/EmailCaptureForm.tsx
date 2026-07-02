'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function EmailCaptureForm({
  sourcePage,
  compact = false,
}: {
  sourcePage: string
  compact?: boolean
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'submitting' || status === 'done') return
    setStatus('submitting')
    const { error } = await supabase
      .from('Leads')
      .upsert({ email: email.trim().toLowerCase(), source_page: sourcePage }, { onConflict: 'email', ignoreDuplicates: true })
    setStatus(error ? 'error' : 'done')
  }

  if (status === 'done') {
    return (
      <div className={`flex items-center gap-2 text-emerald-400 text-sm ${compact ? '' : 'justify-center'}`}>
        <span>✓</span> You're on the list — thanks!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${compact ? '' : 'justify-center max-w-md mx-auto'}`}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500/60"
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
      >
        {status === 'submitting' ? 'Joining…' : 'Get Free Updates'}
      </button>
      {status === 'error' && (
        <span className="text-red-400 text-xs sm:ml-2 sm:self-center">Something went wrong — try again.</span>
      )}
    </form>
  )
}
