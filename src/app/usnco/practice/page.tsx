'use client'
import { useState, useEffect } from 'react'
import MCQExam, { MCQQuestion } from '@/app/components/MCQExam'
import FRQViewer, { FRQProblem, FRQPart } from '@/app/components/FRQViewer'
import type { MCQRow, FRQRow } from '@/lib/supabase'

type Tab = 'local' | 'national1' | 'national2' | 'national3'

const TABS: { id: Tab; label: string; sub: string; color: string }[] = [
  { id: 'local',    label: 'Local',       sub: '60 MCQ · 110 min',    color: 'text-orange-300 border-orange-500' },
  { id: 'national1',label: 'National I',  sub: '60 MCQ · 110 min',    color: 'text-red-300 border-red-500' },
  { id: 'national2',label: 'National II', sub: 'FRQ · 105 min',       color: 'text-yellow-300 border-yellow-500' },
  { id: 'national3',label: 'National III',sub: 'Lab · 90 min',        color: 'text-green-300 border-green-500' },
]

function mcqRowToQuestion(r: MCQRow): MCQQuestion {
  return {
    id: r.id,
    stem: r.stem,
    options: r.options,
    answer: r.correct_answer,
    unit: r.topic ?? undefined,
    has_visual: r.has_visual,
    image_url: r.image_url ?? undefined,
  }
}

function frqRowToProblem(r: FRQRow, idx: number): FRQProblem {
  return {
    id: r.id ?? idx,
    year: r.year,
    number: r.problem_number,
    type: 'SAQ',
    total_points: r.total_points ?? 0,
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
    source: `USNCO ${r.year} ${r.frq_type === 'Part3_Lab' ? 'Part III' : 'Part II'}`,
  }
}

function useYears(tab: Tab) {
  const [years, setYears] = useState<number[]>([])

  useEffect(() => {
    let url = ''
    if (tab === 'local')    url = '/api/usnco/mcq?years=true&source=USNCO_Local'
    if (tab === 'national1') url = '/api/usnco/mcq?years=true&source=USNCO_Nat_Part1'
    if (tab === 'national2') url = '/api/usnco/frq?years=true&part=Part2'
    if (tab === 'national3') url = '/api/usnco/frq?years=true&part=Part3_Lab'
    if (!url) return
    fetch(url)
      .then(r => r.json())
      .then((data) => {
        // MCQ years endpoint returns [{source, year}], FRQ returns [number]
        const raw: number[] = Array.isArray(data) && typeof data[0] === 'object'
          ? (data as {year: number}[]).map(d => d.year)
          : data as number[]
        setYears([...new Set(raw)].sort((a, b) => b - a))
      })
      .catch(() => {})
  }, [tab])

  return years
}

export default function USNCOPracticePage() {
  const [tab, setTab]           = useState<Tab>('local')
  const [started, setStarted]   = useState(false)
  const [selectedYear, setYear] = useState<number | null>(null)
  const [mcqQs, setMcqQs]       = useState<MCQQuestion[]>([])
  const [frqPs, setFrqPs]       = useState<FRQProblem[]>([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const years = useYears(tab)
  const isMCQ = tab === 'local' || tab === 'national1'

  // Auto-select most recent year when tab/years change
  useEffect(() => {
    if (years.length > 0) setYear(years[0])
    setStarted(false)
    setMcqQs([])
    setFrqPs([])
  }, [tab, years.join(',')])

  // Fetch questions when year selected
  useEffect(() => {
    if (!selectedYear) return
    setLoading(true)
    setError(null)

    let url = ''
    if (tab === 'local')     url = `/api/usnco/mcq?source=USNCO_Local&year=${selectedYear}`
    if (tab === 'national1') url = `/api/usnco/mcq?source=USNCO_Nat_Part1&year=${selectedYear}`
    if (tab === 'national2') url = `/api/usnco/frq?part=Part2&year=${selectedYear}`
    if (tab === 'national3') url = `/api/usnco/frq?part=Part3_Lab&year=${selectedYear}`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (isMCQ) setMcqQs((data as MCQRow[]).map(mcqRowToQuestion))
        else       setFrqPs((data as FRQRow[]).map(frqRowToProblem))
      })
      .catch(() => setError('Failed to load questions'))
      .finally(() => setLoading(false))
  }, [tab, selectedYear])

  // Exam mode
  if (started && isMCQ && mcqQs.length > 0) {
    const examNames: Record<Tab, string> = {
      local:     `USNCO Local Exam ${selectedYear}`,
      national1: `USNCO National Exam ${selectedYear} — Part I`,
      national2: '',
      national3: '',
    }
    return <MCQExam questions={mcqQs} examName={examNames[tab]} mode="practice" onExit={() => setStarted(false)} />
  }
  if (started && !isMCQ && frqPs.length > 0) {
    const labels: Record<Tab, string> = {
      local:     '',
      national1: '',
      national2: `USNCO National ${selectedYear} — Part II Free Response`,
      national3: `USNCO National ${selectedYear} — Part III Laboratory`,
    }
    return <FRQViewer problems={frqPs} examLabel={labels[tab]} />
  }

  const questionCount = isMCQ ? mcqQs.length : frqPs.length

  return (
    <div className="min-h-screen bg-[#060610] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <a href="/usnco" className="text-sm text-gray-500 hover:text-white transition-colors mb-8 inline-block">← USNCO Hub</a>
        <h1 className="text-4xl font-black mb-2">USNCO Practice</h1>
        <p className="text-gray-400 mb-8">Practice for all stages of the US National Chemistry Olympiad.</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setStarted(false) }}
              className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors -mb-px ${tab === t.id ? t.color : 'border-transparent text-gray-500 hover:text-white'}`}>
              {t.label}
              <span className="ml-1 text-[10px] font-normal opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>

        {/* Year selector */}
        {years.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-xs text-gray-500 self-center mr-1">Year:</span>
            {years.map(y => (
              <button key={y} onClick={() => setYear(y)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all ${
                  selectedYear === y ? 'bg-orange-600 border-orange-500 text-white' : 'border-white/15 text-gray-400 hover:border-white/30'
                }`}>
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Info cards */}
        <div className="grid gap-5 md:grid-cols-2 mb-8">
          <div className="border border-white/10 rounded-2xl p-6">
            {tab === 'local' && <>
              <div className="text-sm font-bold text-orange-300 mb-3">USNCO Local Exam</div>
              <div className="space-y-1 text-sm text-gray-400">
                <div>60 MCQ · 110 minutes · No penalty for wrong answers</div>
                <div>Held at your school/regional site (Feb–Mar)</div>
                <div>Top ~1,500 students advance to National</div>
              </div>
            </>}
            {tab === 'national1' && <>
              <div className="text-sm font-bold text-red-300 mb-3">National Exam — Part I</div>
              <div className="space-y-1 text-sm text-gray-400">
                <div>60 MCQ · 110 minutes</div>
                <div>College-level analytical, physical, organic, inorganic</div>
                <div>Held at regional sites (April)</div>
              </div>
            </>}
            {tab === 'national2' && <>
              <div className="text-sm font-bold text-yellow-300 mb-3">National Exam — Part II</div>
              <div className="space-y-1 text-sm text-gray-400">
                <div>8 free-response problems · 105 minutes</div>
                <div>Multi-part calculations and explanations</div>
                <div>Covers thermodynamics, equilibrium, kinetics, electrochemistry</div>
              </div>
            </>}
            {tab === 'national3' && <>
              <div className="text-sm font-bold text-green-300 mb-3">National Exam — Part III</div>
              <div className="space-y-1 text-sm text-gray-400">
                <div>2 laboratory problems · 90 minutes</div>
                <div>Experimental design and data analysis</div>
                <div>Tests practical lab reasoning skills</div>
              </div>
            </>}
          </div>

          <div className="border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
            <div className="text-sm font-bold text-gray-400 mb-3">Question Bank</div>
            {loading
              ? <div className="text-blue-400 text-sm">Loading {selectedYear}…</div>
              : questionCount > 0
                ? <div className="text-green-400 text-sm">{questionCount} {isMCQ ? 'questions' : 'problems'} from {selectedYear} ready</div>
                : selectedYear
                  ? <div className="text-gray-500 text-sm">Select a year to load questions</div>
                  : <div className="text-gray-500 text-sm">Loading years…</div>
            }
            {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
          </div>
        </div>

        <button
          disabled={loading || questionCount === 0}
          onClick={() => setStarted(true)}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl font-bold text-lg transition-colors">
          {loading ? 'Loading…' : `Start ${TABS.find(t => t.id === tab)?.label} ${selectedYear ?? ''} →`}
        </button>
      </div>
    </div>
  )
}
