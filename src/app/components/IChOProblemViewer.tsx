'use client'
import { useState } from 'react'
import ChemText from './ChemText'

export interface IChOSubPart {
  label: string         // 'i', 'ii', etc.
  question: string
  points?: number
  model_answer?: string
  image_url?: string
}

export interface IChOPart {
  label: string         // 'a', 'b', 'c', '1', '2', etc.
  question: string
  points?: number
  model_answer?: string
  image_url?: string
  sub_parts?: IChOSubPart[]
}

export interface IChOProblem {
  id: number
  year: number
  source: string        // e.g. "IChO 2023 Preparatory Problem 3"
  title: string
  domain: string        // e.g. "Physical Chemistry — Thermodynamics"
  context: string
  total_points?: number
  parts: IChOPart[]
  has_visual?: boolean
  image_url?: string
}

interface Props {
  problems: IChOProblem[]
  examLabel: string
}

export default function IChOProblemViewer({ problems, examLabel }: Props) {
  const [selected, setSelected] = useState(0)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [revealAll, setRevealAll] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const domains = ['all', ...Array.from(new Set(problems.map(p => p.domain.split(' — ')[0])))]
  const filtered = filter === 'all' ? problems : problems.filter(p => p.domain.startsWith(filter))

  const prob = filtered[selected] ?? problems[0]
  if (!prob) return null

  const isRevealed = (key: string) => revealAll || revealed.has(key)
  const toggleReveal = (key: string) =>
    setRevealed(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n })

  return (
    <div className="min-h-screen bg-[#060610] text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#060610]/95 backdrop-blur border-b border-white/10 px-5 py-3 flex items-center gap-4">
        <span className="font-bold text-sm flex-1">{examLabel}</span>
        <button
          onClick={() => setRevealAll(p => !p)}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${revealAll ? 'bg-yellow-600/30 border-yellow-500/50 text-yellow-300' : 'border-white/15 text-gray-400 hover:border-white/30'}`}>
          {revealAll ? '🔓 All Solutions Visible' : '👁 Show All Solutions'}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-white/10 bg-black/20 overflow-y-auto p-3 hidden md:block">

          {/* Domain filter */}
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 px-1">Filter by Domain</div>
          <div className="flex flex-wrap gap-1 mb-4">
            {domains.map(d => (
              <button key={d} onClick={() => { setFilter(d); setSelected(0) }}
                className={`text-[10px] px-2 py-1 rounded-full border transition-colors capitalize ${filter === d ? 'bg-yellow-600/30 border-yellow-500/40 text-yellow-300' : 'border-white/10 text-gray-500 hover:border-white/20'}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 px-1">
            Problems ({filtered.length})
          </div>
          <div className="space-y-1">
            {filtered.map((p, i) => (
              <button key={p.id} onClick={() => { setSelected(i); setRevealAll(false) }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors ${selected === i && filtered[selected]?.id === p.id ? 'bg-yellow-600/20 border border-yellow-500/30 text-white' : 'hover:bg-white/5 text-gray-400 border border-transparent'}`}>
                <div className="font-semibold truncate">{p.title}</div>
                <div className="text-[10px] mt-0.5 opacity-60">{p.source}</div>
                <div className="text-[10px] mt-0.5 text-yellow-600/80">{p.domain}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Problem display */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-8">

            {/* Header */}
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">{prob.source}</div>
              <div className="flex flex-wrap items-start gap-3">
                <div>
                  <h1 className="text-2xl font-black">{prob.title}</h1>
                </div>
                <div className="ml-auto flex flex-wrap gap-2">
                  <span className="text-xs bg-yellow-900/30 border border-yellow-700/40 text-yellow-300 px-3 py-1.5 rounded-full">
                    {prob.domain}
                  </span>
                  {prob.total_points && (
                    <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-full">
                      {prob.total_points} pts
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Context */}
            {prob.context && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6 mt-5">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Problem Context</div>
                <ChemText text={prob.context} className="text-sm leading-relaxed text-gray-200 whitespace-pre-line block" block />
                {prob.image_url && (
                  <img src={prob.image_url} alt="Problem diagram" className="mt-4 max-h-72 rounded-xl border border-white/10" />
                )}
              </div>
            )}

            {/* Parts */}
            <div className="space-y-4">
              {prob.parts.map((part, pi) => (
                <div key={pi} className="border border-white/10 rounded-2xl overflow-hidden">
                  {/* Part header */}
                  <div className="flex items-start gap-4 p-5">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-yellow-600/20 border border-yellow-500/30 flex items-center justify-center text-yellow-300 text-sm font-bold">
                      {part.label.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <ChemText text={part.question} className="text-sm leading-relaxed block" block />
                        {part.points && <span className="text-xs text-gray-600 shrink-0 mt-0.5">{part.points} pt{part.points !== 1 ? 's' : ''}</span>}
                      </div>
                      {part.image_url && (
                        <img src={part.image_url} alt={`Part ${part.label} diagram`} className="mt-3 max-h-72 rounded-xl border border-white/10" />
                      )}
                    </div>
                  </div>

                  {/* Sub-parts */}
                  {part.sub_parts && part.sub_parts.length > 0 && (
                    <div className="border-t border-white/5 px-5 pb-3 space-y-3">
                      {part.sub_parts.map((sp, si) => (
                        <div key={si} className="bg-white/[0.02] border border-white/8 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <span className="shrink-0 text-xs text-yellow-500/70 font-bold mt-0.5">{sp.label}.</span>
                            <ChemText text={sp.question} className="text-xs leading-relaxed text-gray-300 block" block />
                            {sp.points && <span className="text-[10px] text-gray-600 shrink-0 ml-auto">{sp.points}p</span>}
                          </div>
                          {sp.model_answer && (
                            <div className="mt-3 border-t border-white/5 pt-3">
                              {!isRevealed(`${prob.id}-${pi}-${si}`) ? (
                                <button onClick={() => toggleReveal(`${prob.id}-${pi}-${si}`)}
                                  className="text-[10px] text-gray-600 hover:text-yellow-400 transition-colors">
                                  Show solution →
                                </button>
                              ) : (
                                <div className="bg-yellow-900/10 rounded-lg p-3">
                                  <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-1">Solution</div>
                                  <ChemText text={sp.model_answer ?? ''} className="text-xs text-yellow-100 leading-relaxed whitespace-pre-line block" block />
                                  <button onClick={() => toggleReveal(`${prob.id}-${pi}-${si}`)} className="text-[9px] text-gray-600 hover:text-gray-400 mt-2 block">Hide</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Part-level answer (no sub-parts) */}
                  {!part.sub_parts?.length && part.model_answer && (
                    <div className="border-t border-white/10">
                      {!isRevealed(`${prob.id}-${pi}`) ? (
                        <button onClick={() => toggleReveal(`${prob.id}-${pi}`)}
                          className="w-full text-left px-5 py-3 text-xs text-gray-500 hover:text-yellow-400 hover:bg-white/[0.02] transition-colors">
                          👁 Show model solution
                        </button>
                      ) : (
                        <div className="px-5 py-4 bg-yellow-900/10">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Model Solution</span>
                            <button onClick={() => toggleReveal(`${prob.id}-${pi}`)} className="text-[10px] text-gray-600 hover:text-gray-400">Hide</button>
                          </div>
                          <ChemText text={part.model_answer ?? ''} className="text-sm text-yellow-100 leading-relaxed whitespace-pre-line block" block />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nav */}
            <div className="flex gap-3 mt-8">
              <button onClick={() => { setSelected(p => Math.max(0, p - 1)); setRevealAll(false) }}
                disabled={selected === 0}
                className="px-5 py-2.5 border border-white/15 rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-white/5 transition-colors">
                ← Previous
              </button>
              <button onClick={() => { setSelected(p => Math.min(filtered.length - 1, p + 1)); setRevealAll(false) }}
                disabled={selected === filtered.length - 1}
                className="ml-auto px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-sm font-semibold disabled:opacity-30 transition-colors">
                Next Problem →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
