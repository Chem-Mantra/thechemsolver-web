'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { trackEvent, TCSEvents } from '@/lib/analytics'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'submitting' || status === 'done') return
    setStatus('submitting')

    // Store as a lead note so support can triage without a new table.
    const payload = {
      email: email.trim().toLowerCase(),
      source_page: 'contact',
      // Leads table may ignore unknown cols — keep core email + source.
    }
    const { error } = await supabase.from('Leads').upsert(payload, {
      onConflict: 'email',
      ignoreDuplicates: false,
    })

    // Always open mailto as reliable fallback (works even if Leads write fails).
    const subject = encodeURIComponent(`TheChemSolver contact from ${name || email}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
    )
    if (typeof window !== 'undefined') {
      window.location.href = `mailto:support@thechemsolver.com?subject=${subject}&body=${body}`
    }

    trackEvent(TCSEvents.emailSubscribe, { source: 'contact_form' })
    setStatus(error ? 'error' : 'done')
  }

  if (status === 'done') {
    return (
      <p className="text-sm text-emerald-400">
        Thanks — your email client should open with the message. If it didn&apos;t, write us at{' '}
        <a href="mailto:support@thechemsolver.com" className="underline">
          support@thechemsolver.com
        </a>
        .
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Email *</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60"
          placeholder="you@school.edu"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Message *</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/60 resize-y"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg px-4 py-3 transition-colors"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-amber-300">
          We couldn&apos;t save the lead, but your mail app should still open.
        </p>
      )}
    </form>
  )
}
