'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { UNIT1 } from './content/unit1'
import { UNIT2 } from './content/unit2'
import { UNIT3 } from './content/unit3'
import { UNIT4 } from './content/unit4'
import { UNIT5 } from './content/unit5'
import { UNIT6 } from './content/unit6'
import { UNIT7 } from './content/unit7'
import { UNIT8 } from './content/unit8'
import { UNIT9 } from './content/unit9'
import ConceptView from './components/ConceptView'
import type { Concept } from './types'

const STORAGE_KEY = 'chem_ebook_v1'
const UNITS = [UNIT1, UNIT2, UNIT3, UNIT4, UNIT5, UNIT6, UNIT7, UNIT8, UNIT9]

type StoredState = {
  completedConcepts: string[]
  lastConceptId: string | null
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { completedConcepts: [], lastConceptId: null }
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

// Circular progress ring
function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const r = 16
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" className="shrink-0 rotate-[-90deg]">
      <circle cx={20} cy={20} r={r} fill="none" stroke="#1e293b" strokeWidth={4} />
      <circle
        cx={20} cy={20} r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        className="transition-all duration-500"
      />
    </svg>
  )
}

export default function EbookClient() {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  // Load persisted state
  useEffect(() => {
    const stored = loadState()
    setCompleted(new Set(stored.completedConcepts))
    const all = UNITS.flatMap((u) => u.concepts)
    const first = all[0]?.id ?? null
    setActiveId(stored.lastConceptId ?? first)
  }, [])

  // Copy protection
  useEffect(() => {
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('copy', block)
    document.addEventListener('cut', block)
    document.addEventListener('contextmenu', block)
    return () => {
      document.removeEventListener('copy', block)
      document.removeEventListener('cut', block)
      document.removeEventListener('contextmenu', block)
    }
  }, [])

  const markComplete = useCallback(
    (conceptId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev)
        next.add(conceptId)
        // advance to next concept automatically
        const all = UNITS.flatMap((u) => u.concepts)
        const idx = all.findIndex((c) => c.id === conceptId)
        const nextConcept = all[idx + 1] ?? null
        const nextId = nextConcept ? nextConcept.id : conceptId
        saveState({ completedConcepts: [...next], lastConceptId: nextId })
        if (nextConcept) {
          setActiveId(nextId)
          contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }
        return next
      })
    },
    []
  )

  const selectConcept = (id: string) => {
    setActiveId(id)
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    saveState({ completedConcepts: [...completed], lastConceptId: id })
  }

  const allConcepts: Concept[] = UNITS.flatMap((u) => u.concepts)
  const totalConcepts = allConcepts.length
  const doneCount = allConcepts.filter((c) => completed.has(c.id)).length
  const overallPct = totalConcepts ? Math.round((doneCount / totalConcepts) * 100) : 0

  const activeConcept = allConcepts.find((c) => c.id === activeId) ?? allConcepts[0]

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#08020d] text-white"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`flex shrink-0 flex-col border-r border-slate-800 bg-slate-900/80 transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Logo / title area */}
        <div className="border-b border-slate-800 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">AP Chemistry</p>
          <p className="mt-0.5 text-sm font-bold text-white">Interactive Ebook</p>

          {/* Overall progress */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-indigo-400">{overallPct}%</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {doneCount} / {totalConcepts} concepts done
          </p>
        </div>

        {/* Unit sections */}
        <div className="flex-1 overflow-y-auto p-3">
          {UNITS.map((unit) => {
            const unitDone = unit.concepts.filter((c) => completed.has(c.id)).length
            const unitPct = unit.concepts.length
              ? Math.round((unitDone / unit.concepts.length) * 100)
              : 0

            return (
              <div key={unit.id} className="mb-4">
                {/* Unit header */}
                <div className="mb-2 flex items-center gap-2 px-2">
                  <ProgressRing pct={unitPct} color={unit.accentHex} />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      Unit {unit.number}: {unit.title}
                    </p>
                    <p className="text-xs text-slate-500">{unit.examWeight} exam weight</p>
                  </div>
                </div>

                {/* Concept list */}
                <ul className="space-y-0.5">
                  {unit.concepts.map((c) => {
                    const isDone = completed.has(c.id)
                    const isActive = activeId === c.id
                    return (
                      <li key={c.id}>
                        <button
                          onClick={() => selectConcept(c.id)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                            isActive
                              ? 'bg-indigo-600/30 font-semibold text-white ring-1 ring-indigo-600/50'
                              : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : isActive
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isDone ? '✓' : ''}
                          </span>
                          <span className="truncate leading-tight">{c.title}</span>
                          <span className="ml-auto shrink-0 text-xs text-slate-600">
                            {c.estimatedMinutes}m
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-800 bg-slate-900/60 px-4 py-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="Toggle sidebar"
          >
            ☰
          </button>
          {activeConcept && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{activeConcept.title}</p>
              <p className="truncate text-xs text-slate-500">{activeConcept.subtitle}</p>
            </div>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-500">{overallPct}% complete</span>
          </div>
        </header>

        {/* Scrollable content area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-6 py-8 md:px-12"
          style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
        >
          {activeConcept && (
            <ConceptView
              concept={activeConcept}
              accentHex={activeConcept.accentHex}
              onComplete={() => markComplete(activeConcept.id)}
            />
          )}
        </div>
      </div>

      {/* Print shield */}
      <style>{`
        @media print { body { display: none !important; } }
      `}</style>
    </div>
  )
}
