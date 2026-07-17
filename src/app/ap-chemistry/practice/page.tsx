'use client'

import AccessGate from '@/app/AccessGate'
import { useState, useEffect } from 'react'
import MCQExam, { MCQQuestion } from '@/app/components/MCQExam'
import FRQViewer, { FRQProblem, FRQPart } from '@/app/components/FRQViewer'
import type { FRQRow } from '@/lib/supabase'
import { AP_UNITS } from '@/data/apUnits'

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

// ── "By Chapter" types + row mappers ──────────────────────────────────────

interface ChapterUnit {
  n: number
  name: string
  weight: string
  mcq_count: number
  frq_count: number
}

interface ChapterMCQRow {
  id: number
  stem: string
  options: { A: string; B: string; C: string; D: string }
  correct_answer: 'A' | 'B' | 'C' | 'D'
  topic: string
  subtopic: string | null
  has_visual: boolean
  image_url: string | null
  unit_title: string
  year: number
}

interface ChapterFRQRow {
  id: number
  problem_number: number
  frq_type: string
  context: string
  parts: FRQPart[]
  total_points: number | null
  topic: string
  has_visual: boolean
  image_url: string | null
  unit_title: string
  year: number
}

function chapterMcqToQuestion(r: ChapterMCQRow): MCQQuestion {
  return {
    id: r.id,
    stem: r.stem,
    options: r.options,
    answer: r.correct_answer,
    unit: r.unit_title,
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
  }
}

function chapterFrqToProblem(r: ChapterFRQRow): FRQProblem {
  return {
    id: r.id,
    year: r.year,
    number: r.problem_number,
    type: (r.frq_type === 'LEQ' ? 'LEQ' : 'SAQ') as 'LEQ' | 'SAQ',
    total_points: r.total_points ?? (r.frq_type === 'LEQ' ? 10 : 4),
    context: r.context ?? '',
    parts: r.parts ?? [],
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
    source: `AP Chemistry ${r.unit_title}`,
  }
}

// ── "Practice Exams by Year" types + row mappers (2012-2019 official set) ──

interface ExamYear {
  year: number
  mcq_count: number
  frq_count: number
}

interface ExamMCQRow {
  id: number
  question_number: number
  stem: string
  options: { A: string; B: string; C: string; D: string }
  correct_answer: 'A' | 'B' | 'C' | 'D'
  topic: string
  subtopic: string | null
  has_visual: boolean
  image_url: string | null
  year: number
}

interface ExamFRQRow {
  id: number
  problem_number: number
  frq_type: string
  context: string
  parts: FRQPart[]
  total_points: number | null
  topic: string
  has_visual: boolean
  image_url: string | null
  year: number
}

function examMcqToQuestion(r: ExamMCQRow): MCQQuestion {
  return {
    id: r.id,
    stem: r.stem,
    options: r.options,
    answer: r.correct_answer,
    unit: r.topic,
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
  }
}

function examFrqToProblem(r: ExamFRQRow): FRQProblem {
  return {
    id: r.id,
    year: r.year,
    number: r.problem_number,
    type: (r.frq_type === 'LEQ' ? 'LEQ' : 'SAQ') as 'LEQ' | 'SAQ',
    total_points: r.total_points ?? (r.frq_type === 'LEQ' ? 10 : 4),
    context: r.context ?? '',
    parts: r.parts ?? [],
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
    source: `AP Chemistry ${r.year} Official Practice Exam`,
  }
}

type Mode = 'year' | 'exam' | 'chapter'

function APPracticePageInner() {
  const [mode, setMode] = useState<Mode>('year')

  // ── "By Year" state (unchanged behavior) ──────────────────────────────
  const [section, setSection]     = useState<'mcq' | 'frq'>('frq')
  const [started, setStarted]     = useState(false)
  const [years, setYears]         = useState<number[]>([])
  const [selectedYear, setYear]   = useState<number | null>(null)
  const [problems, setProblems]   = useState<FRQProblem[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

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

  // ── "By Chapter" state ─────────────────────────────────────────────────
  const [units, setUnits]               = useState<ChapterUnit[]>([])
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null)
  const [chSection, setChSection]       = useState<'mcq' | 'frq'>('mcq')
  const [chStarted, setChStarted]       = useState(false)
  const [chMcqQs, setChMcqQs]           = useState<MCQQuestion[]>([])
  const [chFrqPs, setChFrqPs]           = useState<FRQProblem[]>([])
  const [chLoading, setChLoading]       = useState(false)
  const [chError, setChError]           = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'chapter') return
    fetch('/api/ap/chapters')
      .then(r => r.json())
      .then((data: ChapterUnit[]) => setUnits(data))
      .catch(() => setChError('Failed to load chapters'))
  }, [mode])

  useEffect(() => {
    if (selectedUnit === null) return
    setChStarted(false)
    setChLoading(true)
    setChError(null)
    Promise.all([
      fetch(`/api/ap/chapters/${selectedUnit}?type=mcq`).then(r => r.json()),
      fetch(`/api/ap/chapters/${selectedUnit}?type=frq`).then(r => r.json()),
    ])
      .then(([mcqData, frqData]: [ChapterMCQRow[], ChapterFRQRow[]]) => {
        setChMcqQs(mcqData.map(chapterMcqToQuestion))
        setChFrqPs(frqData.map(chapterFrqToProblem))
        setChSection(mcqData.length > 0 ? 'mcq' : 'frq')
      })
      .catch(() => setChError('Failed to load questions for this unit'))
      .finally(() => setChLoading(false))
  }, [selectedUnit])

  // ── "Practice Exams by Year" state ─────────────────────────────────────
  const [examYears, setExamYears]     = useState<ExamYear[]>([])
  const [selectedExamYear, setExamYear] = useState<number | null>(null)
  const [exSection, setExSection]     = useState<'mcq' | 'frq'>('mcq')
  const [exStarted, setExStarted]     = useState(false)
  const [exMcqQs, setExMcqQs]         = useState<MCQQuestion[]>([])
  const [exFrqPs, setExFrqPs]         = useState<FRQProblem[]>([])
  const [exLoading, setExLoading]     = useState(false)
  const [exError, setExError]         = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'exam') return
    fetch('/api/ap/official-years')
      .then(r => r.json())
      .then((data: ExamYear[]) => setExamYears(data))
      .catch(() => setExError('Failed to load exam years'))
  }, [mode])

  useEffect(() => {
    if (selectedExamYear === null) return
    setExStarted(false)
    setExLoading(true)
    setExError(null)
    Promise.all([
      fetch(`/api/ap/official-years/${selectedExamYear}?type=mcq`).then(r => r.json()),
      fetch(`/api/ap/official-years/${selectedExamYear}?type=frq`).then(r => r.json()),
    ])
      .then(([mcqData, frqData]: [ExamMCQRow[], ExamFRQRow[]]) => {
        setExMcqQs(mcqData.map(examMcqToQuestion))
        setExFrqPs(frqData.map(examFrqToProblem))
        setExSection(mcqData.length > 0 ? 'mcq' : 'frq')
      })
      .catch(() => setExError('Failed to load questions for this year'))
      .finally(() => setExLoading(false))
  }, [selectedExamYear])

  const selectedUnitInfo = units.find(u => u.n === selectedUnit)
  const selectedExamYearInfo = examYears.find(y => y.year === selectedExamYear)

  // ── Exam-mode renders ───────────────────────────────────────────────────

  if (started && section === 'frq' && problems.length > 0) {
    return (
      <FRQViewer
        problems={problems}
        examLabel={`AP Chemistry ${selectedYear} — Section II Free Response`}
      />
    )
  }

  if (chStarted && chSection === 'mcq' && chMcqQs.length > 0) {
    return (
      <MCQExam
        questions={chMcqQs}
        examName={`AP Chemistry — ${selectedUnitInfo?.name ?? ''}`}
        mode="practice"
        onExit={() => setChStarted(false)}
      />
    )
  }
  if (chStarted && chSection === 'frq' && chFrqPs.length > 0) {
    return (
      <FRQViewer
        problems={chFrqPs}
        examLabel={`AP Chemistry — ${selectedUnitInfo?.name ?? ''} (Free Response)`}
      />
    )
  }

  if (exStarted && exSection === 'mcq' && exMcqQs.length > 0) {
    return (
      <MCQExam
        questions={exMcqQs}
        examName={`AP Chemistry ${selectedExamYear} Practice Exam — Section I`}
        mode="practice"
        onExit={() => setExStarted(false)}
      />
    )
  }
  if (exStarted && exSection === 'frq' && exFrqPs.length > 0) {
    return (
      <FRQViewer
        problems={exFrqPs}
        examLabel={`AP Chemistry ${selectedExamYear} Practice Exam — Section II Free Response`}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#060610] text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="text-xs text-blue-400 uppercase tracking-widest mb-2">AP Chemistry</div>
          <h1 className="text-3xl font-bold mb-2">Practice Exam</h1>
          <p className="text-gray-500 text-sm">Official past-paper questions from College Board</p>
        </div>

        {/* Top-level mode tabs */}
        <div className="flex gap-1 mb-6 border-b border-white/10 justify-center">
          <button
            onClick={() => setMode('year')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              mode === 'year' ? 'text-blue-300 border-blue-500' : 'border-transparent text-gray-500 hover:text-white'
            }`}>
            By Year
          </button>
          <button
            onClick={() => setMode('exam')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              mode === 'exam' ? 'text-blue-300 border-blue-500' : 'border-transparent text-gray-500 hover:text-white'
            }`}>
            Practice Exams
          </button>
          <button
            onClick={() => setMode('chapter')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              mode === 'chapter' ? 'text-blue-300 border-blue-500' : 'border-transparent text-gray-500 hover:text-white'
            }`}>
            By Chapter
          </button>
        </div>

        {mode === 'year' && (
          <>
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

            <div className="grid grid-cols-2 gap-4">
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
          </>
        )}

        {mode === 'exam' && (
          <>
            {selectedExamYear === null ? (
              <>
                <p className="text-center text-sm text-gray-500 mb-5">
                  Full official practice exams (2012–2019) — real MCQ + FRQ sections, pick a year.
                </p>
                <div className="grid gap-2">
                  {examYears.map(y => {
                    const total = y.mcq_count + y.frq_count
                    return (
                      <button
                        key={y.year}
                        onClick={() => setExamYear(y.year)}
                        disabled={total === 0}
                        className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-left hover:border-blue-500/40 hover:bg-blue-600/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <span className="text-xs font-bold text-blue-400 shrink-0 w-14">{y.year}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">AP Chemistry {y.year} Practice Exam</p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {y.mcq_count} MCQ · {y.frq_count} FRQ
                        </span>
                      </button>
                    )
                  })}
                </div>
                {exError && <div className="mt-4 text-red-400 text-sm text-center">{exError}</div>}
              </>
            ) : (
              <>
                <button
                  onClick={() => setExamYear(null)}
                  className="text-sm text-gray-500 hover:text-white transition-colors mb-5 inline-block">
                  ← All years
                </button>
                <h2 className="text-lg font-bold mb-5">AP Chemistry {selectedExamYearInfo?.year} Practice Exam</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${exSection === 'mcq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'} ${exMcqQs.length === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                    onClick={() => setExSection('mcq')}>
                    <div className="font-bold mb-1">Section I — MCQ</div>
                    <div className="text-sm text-gray-400">
                      {exLoading ? 'Loading…' : `${exMcqQs.length} questions`}
                    </div>
                  </div>
                  <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${exSection === 'frq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'} ${exFrqPs.length === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                    onClick={() => setExSection('frq')}>
                    <div className="font-bold mb-1">Section II — FRQ</div>
                    <div className="text-sm text-gray-400">
                      {exLoading ? 'Loading…' : `${exFrqPs.length} problems`}
                    </div>
                  </div>
                </div>

                {exError && <div className="mt-4 text-red-400 text-sm text-center">{exError}</div>}

                <button
                  disabled={exLoading || (exSection === 'mcq' ? exMcqQs.length === 0 : exFrqPs.length === 0)}
                  onClick={() => setExStarted(true)}
                  className="mt-5 w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-colors">
                  {exLoading ? 'Loading…' : `Start ${exSection === 'mcq' ? 'Section I — MCQ' : 'Section II — FRQ'} →`}
                </button>
              </>
            )}
          </>
        )}

        {mode === 'chapter' && (
          <>
            {selectedUnit === null ? (
              <>
                <p className="text-center text-sm text-gray-500 mb-5">
                  Pick a unit to practice its official AP questions, pulled from real 2012–2019 exams.
                </p>
                <div className="grid gap-2">
                  {AP_UNITS.map(u => {
                    const counts = units.find(x => x.n === u.n)
                    const total = (counts?.mcq_count ?? 0) + (counts?.frq_count ?? 0)
                    return (
                      <button
                        key={u.n}
                        onClick={() => setSelectedUnit(u.n)}
                        disabled={total === 0}
                        className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-left hover:border-blue-500/40 hover:bg-blue-600/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <span className="text-xs font-bold text-blue-400 shrink-0 w-8">U{u.n}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{u.name}</p>
                          <p className="text-[11px] text-gray-500">{u.weight} of exam</p>
                        </div>
                        <span className="text-xs text-gray-500 shrink-0">
                          {counts ? `${counts.mcq_count} MCQ · ${counts.frq_count} FRQ` : '…'}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {chError && <div className="mt-4 text-red-400 text-sm text-center">{chError}</div>}
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="text-sm text-gray-500 hover:text-white transition-colors mb-5 inline-block">
                  ← All chapters
                </button>
                <h2 className="text-lg font-bold mb-5">{selectedUnitInfo?.name}</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${chSection === 'mcq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'} ${chMcqQs.length === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                    onClick={() => setChSection('mcq')}>
                    <div className="font-bold mb-1">MCQ</div>
                    <div className="text-sm text-gray-400">
                      {chLoading ? 'Loading…' : `${chMcqQs.length} questions`}
                    </div>
                  </div>
                  <div className={`border rounded-2xl p-6 cursor-pointer transition-all ${chSection === 'frq' ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 hover:border-white/20'} ${chFrqPs.length === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                    onClick={() => setChSection('frq')}>
                    <div className="font-bold mb-1">FRQ</div>
                    <div className="text-sm text-gray-400">
                      {chLoading ? 'Loading…' : `${chFrqPs.length} problems`}
                    </div>
                  </div>
                </div>

                {chError && <div className="mt-4 text-red-400 text-sm text-center">{chError}</div>}

                <button
                  disabled={chLoading || (chSection === 'mcq' ? chMcqQs.length === 0 : chFrqPs.length === 0)}
                  onClick={() => setChStarted(true)}
                  className="mt-5 w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-colors">
                  {chLoading ? 'Loading…' : `Start ${chSection === 'mcq' ? 'MCQ' : 'FRQ'} Practice →`}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function APPracticePage() {
  return (
    <AccessGate title='Keep practicing AP Chemistry'>
      <APPracticePageInner />
    </AccessGate>
  )
}
