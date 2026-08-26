'use client'

import { useState } from 'react'
import { trackEvent, TCSEvents } from '@/lib/analytics'

const EXAMS = [
  { id: 'AP Chemistry', label: 'AP Chemistry', color: 'text-blue-300 border-blue-500/40' },
  { id: 'Organic Chemistry (Orgo 1 & 2)', label: 'Orgo 1 & 2', color: 'text-emerald-300 border-emerald-500/40' },
  { id: 'USNCO', label: 'USNCO', color: 'text-orange-300 border-orange-500/40' },
  { id: 'IChO', label: 'IChO', color: 'text-yellow-300 border-yellow-500/40' },
] as const

export default function InterestForm() {
  const [studentName, setStudentName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [country, setCountry] = useState('')
  const [gradeYear, setGradeYear] = useState('')
  const [message, setMessage] = useState('')
  const [exams, setExams] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  function toggleExam(id: string) {
    setExams((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          email,
          mobile,
          country,
          gradeYear,
          message,
          examInterest: exams,
          source: 'homepage_interest',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      trackEvent(TCSEvents.emailSubscribe, {
        source: 'homepage_interest',
        exams: exams.join(','),
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-white mb-2">
          Thanks, {studentName.split(' ')[0] || 'there'}!
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          Your interest is recorded. We&apos;ll reach out about{' '}
          <strong className="text-white">{exams.join(', ')}</strong> prep. Check your email/WhatsApp
          soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 shadow-2xl"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-3">
        Register interest
      </div>
      <h3 className="text-xl md:text-2xl font-black text-white mb-2">
        Prep for AP · Orgo · USNCO · IChO
      </h3>
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
        Tell us which exam you&apos;re aiming for — we&apos;ll guide you to the right tools and study
        path. Free 15-day trial on every lab.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">Your name *</label>
          <input
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
            placeholder="Full name"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
              placeholder="you@school.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              Mobile / WhatsApp
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
              placeholder="With country code if outside India"
            />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 -mt-2">Email or mobile required</p>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">
            Exam interest * (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {EXAMS.map((ex) => {
              const on = exams.includes(ex.id)
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => toggleExam(ex.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    on
                      ? `${ex.color} bg-white/10`
                      : 'border-white/10 text-gray-400 hover:border-white/25'
                  }`}
                >
                  {on ? '✓ ' : ''}
                  {ex.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              Grade / Year (optional)
            </label>
            <input
              value={gradeYear}
              onChange={(e) => setGradeYear(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
              placeholder="e.g. Grade 11, Freshman"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              Country (optional)
            </label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
              placeholder="e.g. USA, India, UAE"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Anything else? (optional)
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 resize-y"
            placeholder="Goals, timeline, topics you want help with…"
          />
        </div>
      </div>

      {status === 'error' && <p className="text-sm text-red-400 mt-4">{error}</p>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-bold py-3.5 text-sm transition-colors"
      >
        {status === 'submitting' ? 'Sending…' : 'Register interest'}
      </button>
      <p className="text-[11px] text-gray-600 text-center mt-3 leading-relaxed">
        We only use your details to help with exam prep. No spam.
      </p>
    </form>
  )
}
