'use client'
import { useState, useEffect } from 'react'
import FRQViewer, { FRQProblem, FRQPart } from '@/app/components/FRQViewer'
import type { FRQRow } from '@/lib/supabase'

function rowToFRQProblem(r: FRQRow, idx: number): FRQProblem {
  return {
    id: r.id ?? idx,
    year: r.year,
    number: r.problem_number,
    type: (r.frq_type === 'LEQ' ? 'LEQ' : 'SAQ') as 'LEQ' | 'SAQ',
    total_points: r.total_points ?? (r.frq_type === 'LEQ' ? 10 : 4),
    context: r.context ?? '',
    parts: (r.parts ?? []).map((p): FRQPart => ({
      label: p.label,
      question: p.question,
      points: p.points ?? 0,
      model_answer: p.model_answer ?? undefined,
      image_url: p.image_url ?? undefined,
    })),
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
    source: `AP Chemistry ${r.year} FRQ`,
  }
}

export default function APPracticePage() {
  const [section, setSection]     = useState<'mcq' | 'frq'>('frq')
  const [started, setStarted]     = useState(false)
  const [years, setYears]         = useState<number[]>([])
  const [selectedYear, setYear]   = useState<number | null>(null)
  const [problems, setProblems]   = useState<FRQProblem[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  // Load available FRQ years on mount
  useEffect(() => {
    fetch('/api/ap/frq?years=true')
      .then(r => r.json())
      .then((data: number[]) => {
        const sorted = [...data].sort((a, b) => b - a)
        setYears(sorted)
        if (sorted.length > 0) setYear(sorted[0])
      })
      .catch(() => setError('Failed to load available years'))
  }, [])

  // Fetch problems when year changes
  useEffect(() => {
    if (!selectedYear) return
    setLoading(true)
    setError(null)
    fetch(`/api/ap/frq?year=${selectedYear}`)
      .then(r => r.json())
      .then((data: FRQRow[]) => setProblems(data.map(rowToFRQProblem)))
      .catch(() => setError('Failed to load problems'))
      .finally(() => setLoading(false))
  }, [selectedYear])

  if (started && section === 'frq' && problems.length > 0) {
    return (
      <FRQViewer
        problems={problems}
        examLabel={`AP Chemistry ${selectedYear} — Section II Free Response`}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#060610] text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-xs text-blue-400 uppercase tracking-widest mb-2">AP Chemistry</div>
          <h1 className="text-3xl font-bold mb-2">Practice Exam</h1>
          <p className="text-gray-500 text-sm">Official past-paper questions from College Board</p>
        </div>

        {/* Year selector */}
        {years.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap justify-center">
            {years.map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  selectedYear === y
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'border-white/15 text-gray-400 hover:border-white/30'
                }`}>
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Section cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Section I — MCQ */}
          <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${section === 'mcq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => setSection('mcq')}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">I</div>
              <div>
                <div className="font-bold">Section I</div>
                <div className="text-xs text-gray-500">MCQ</div>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div>60 questions · 90 min</div>
              <div className="text-amber-500 text-xs mt-1">Not publicly released</div>
            </div>
          </div>

          {/* Section II — FRQ */}
          <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${section === 'frq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'}`}
            onClick={() => setSection('frq')}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">II</div>
              <div>
                <div className="font-bold">Section II</div>
                <div className="text-xs text-gray-500">FRQ</div>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-400">
              <div>7 problems · 105 min</div>
              {loading
                ? <div className="text-blue-400 text-xs mt-1">Loading…</div>
                : <div className="text-green-400 text-xs mt-1">{problems.length} problems from {selectedYear}</div>
              }
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm text-gray-400">
          {section === 'mcq' ? (
            <><span className="text-blue-300 font-semibold">Section I — MCQ:</span> College Board does not publicly release full MCQ papers. Section II FRQ papers are released annually.</>
          ) : (
            <><span className="text-purple-300 font-semibold">Section II — FRQ:</span> 3 Long Essay (LEQ, 10 pts each) + 4 Short Answer (SAQ, 4 pts each). Calculator and formula sheet provided on exam day.</>
          )}
        </div>

        {error && <div className="mt-4 text-red-400 text-sm text-center">{error}</div>}

        <button
          disabled={section === 'frq' && (loading || problems.length === 0)}
          onClick={() => setStarted(true)}
          className="mt-5 w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-colors">
          {loading ? 'Loading…' : `Start ${section === 'mcq' ? 'Section I — MCQ' : `Section II FRQ ${selectedYear}`} →`}
        </button>
      </div>
    </div>
  )
}
