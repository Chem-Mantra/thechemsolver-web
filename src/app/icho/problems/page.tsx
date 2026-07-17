'use client'

import AccessGate from '@/app/AccessGate'
import { useState, useEffect } from 'react'
import IChOProblemViewer, { IChOProblem, IChOPart, IChOSubPart } from '@/app/components/IChOProblemViewer'
import type { IChORow } from '@/lib/supabase'

function rowToProblem(r: IChORow, idx: number): IChOProblem {
  return {
    id: r.id ?? idx,
    year: r.year ?? 0,
    source: r.icho_edition || `IChO ${r.year} Prep Problem ${r.problem_number}`,
    title: r.title ?? '',
    domain: r.domain ?? 'Chemistry',
    context: r.context ?? '',
    total_points: r.total_points ?? undefined,
    parts: (r.parts ?? []).map((p): IChOPart => ({
      label: p.label,
      question: p.question,
      points: p.points ?? undefined,
      model_answer: p.model_answer ?? undefined,
      image_url: p.image_url ?? undefined,
      sub_parts: p.sub_parts?.map((sp): IChOSubPart => ({
        label: sp.label,
        question: sp.question,
        points: sp.points ?? undefined,
        model_answer: sp.model_answer ?? undefined,
        image_url: sp.image_url ?? undefined,
      })),
    })),
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
  }
}

type Source = 'IChO_Prep' | 'IChO_Volumes'

function IChOProblemsPageInner() {
  const [source, setSource]         = useState<Source>('IChO_Prep')
  const [years, setYears]           = useState<number[]>([])
  const [selectedYear, setYear]     = useState<number | null>(null)
  const [problems, setProblems]     = useState<IChOProblem[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [launched, setLaunched]     = useState(false)

  // Load available years for selected source
  useEffect(() => {
    setYears([])
    setYear(null)
    setProblems([])
    fetch('/api/icho?years=true')
      .then(r => r.json())
      .then((data: { source: Source; year: number }[]) => {
        const filtered = data
          .filter(d => d.source === source && d.year)
          .map(d => d.year)
        const sorted = [...new Set(filtered)].sort((a, b) => b - a)
        setYears(sorted)
        if (sorted.length > 0) setYear(sorted[0])
      })
      .catch(() => {})
  }, [source])

  // Fetch problems when year/source changes
  useEffect(() => {
    if (source === 'IChO_Volumes') {
      setLoading(true)
      fetch(`/api/icho?source=IChO_Volumes`)
        .then(r => r.json())
        .then((data: IChORow[]) => setProblems(data.map(rowToProblem)))
        .catch(() => setError('Failed to load problems'))
        .finally(() => setLoading(false))
      return
    }
    if (!selectedYear) return
    setLoading(true)
    setError(null)
    fetch(`/api/icho?source=${source}&year=${selectedYear}`)
      .then(r => r.json())
      .then((data: IChORow[]) => setProblems(data.map(rowToProblem)))
      .catch(() => setError('Failed to load problems'))
      .finally(() => setLoading(false))
  }, [source, selectedYear])

  if (launched && problems.length > 0) {
    const label = source === 'IChO_Volumes'
      ? 'IChO Historical Problems'
      : `IChO ${selectedYear} Preparatory Problems`
    return <IChOProblemViewer problems={problems} examLabel={label} />
  }

  return (
    <div className="min-h-screen bg-[#060610] text-white px-6 py-12">
      <div className="max-w-xl mx-auto">
        <a href="/icho" className="text-sm text-gray-500 hover:text-white transition-colors mb-8 inline-block">← IChO Hub</a>
        <h1 className="text-4xl font-black mb-2">IChO Problems</h1>
        <p className="text-gray-400 mb-8">International Chemistry Olympiad preparatory and past problems.</p>

        {/* Source toggle */}
        <div className="flex gap-2 mb-6">
          {(['IChO_Prep', 'IChO_Volumes'] as Source[]).map(s => (
            <button key={s} onClick={() => { setSource(s); setLaunched(false) }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                source === s
                  ? 'bg-yellow-600/30 border-yellow-500/50 text-yellow-300'
                  : 'border-white/15 text-gray-400 hover:border-white/30'
              }`}>
              {s === 'IChO_Prep' ? 'Prep Problems (2001–2019)' : 'Historical Problems (Vol 1–4)'}
            </button>
          ))}
        </div>

        {/* Year selector — only for Prep */}
        {source === 'IChO_Prep' && years.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-xs text-gray-500 self-center mr-1">Year:</span>
            {years.map(y => (
              <button key={y} onClick={() => setYear(y)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${
                  selectedYear === y
                    ? 'bg-yellow-600 border-yellow-500 text-white'
                    : 'border-white/15 text-gray-400 hover:border-white/30'
                }`}>
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="border border-white/10 rounded-2xl p-6 mb-6">
          {loading
            ? <div className="text-blue-400">Loading problems…</div>
            : problems.length > 0
              ? <div className="text-green-400">{problems.length} problems ready</div>
              : <div className="text-gray-500">Select a year to load problems</div>
          }
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

          <div className="mt-4 text-sm text-gray-400 space-y-1">
            {source === 'IChO_Prep' ? <>
              <div>Multi-part open-ended problems from IChO preparatory booklets</div>
              <div>Covers physical, organic, inorganic, analytical chemistry</div>
              <div>Olympiad-level — deeper than AP/USNCO</div>
            </> : <>
              <div>Problems from official IChO volumes (IChO 1–50)</div>
              <div>Spans 1968–2019 across all chemistry domains</div>
            </>}
          </div>
        </div>

        <button
          disabled={loading || problems.length === 0}
          onClick={() => setLaunched(true)}
          className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-colors">
          {loading ? 'Loading…' : `Open ${problems.length} Problems →`}
        </button>
      </div>
    </div>
  )
}

export default function IChOProblemsPage() {
  return (
    <AccessGate title='Keep practicing IChO problems'>
      <IChOProblemsPageInner />
    </AccessGate>
  )
}
