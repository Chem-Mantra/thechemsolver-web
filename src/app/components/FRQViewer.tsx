'use client'
import { useState, useEffect } from 'react'
import NextImage from 'next/image'
import RichText from './RichText'

function ProblemImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  if (error) return null
  return (
    <div className="mt-3 relative">
      {!loaded && (
        <div className="h-40 rounded-xl border border-white/10 bg-white/[0.03] animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-600">Loading diagram…</span>
        </div>
      )}
      <NextImage
        src={src} alt={alt}
        width={900} height={675}
        style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
        className={`max-h-72 rounded-xl border border-white/10 ${loaded ? 'block' : 'hidden'}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}

export interface FRQPart {
  label: string          // 'a', 'b', 'c', 'i', 'ii', etc.
  question: string
  points: number
  model_answer?: string
  image_url?: string
}

export interface FRQProblem {
  id: number
  year: number
  number: number
  type: 'LEQ' | 'SAQ'   // Long Essay (10 pts) or Short Answer (4 pts)
  total_points: number
  context: string         // problem setup / given data
  parts: FRQPart[]
  has_visual?: boolean
  image_url?: string
  source?: string         // e.g. "AP Chemistry 2024 FRQ"
}

interface Props {
  problems: FRQProblem[]
  examLabel: string       // "AP Chemistry FRQ" or "USNCO National Part III"
}

export default function FRQViewer({ problems, examLabel }: Props) {
  const [selected, setSelected] = useState(0)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [revealAll, setRevealAll] = useState(false)

  // Prefetch all images for the selected problem as soon as it's chosen
  useEffect(() => {
    const prob = problems[selected]
    if (!prob) return
    const urls: string[] = []
    if (prob.image_url) urls.push(prob.image_url)
    prob.parts.forEach(p => { if (p.image_url) urls.push(p.image_url) })
    urls.forEach(url => { const img = new Image(); img.src = url })
  }, [selected, problems])

  const prob = problems[selected]
  if (!prob) return null

  const toggleReveal = (key: string) =>
    setRevealed(p => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n })

  const isRevealed = (key: string) => revealAll || revealed.has(key)

  return (
    <div className="min-h-screen bg-[#060610] text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#060610]/95 backdrop-blur border-b border-white/10 px-5 py-3 flex items-center gap-4">
        <span className="font-bold text-sm flex-1">{examLabel}</span>
        <button
          onClick={() => setRevealAll(p => !p)}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${revealAll ? 'bg-green-600/30 border-green-500/50 text-green-300' : 'border-white/15 text-gray-400 hover:border-white/30'}`}>
          {revealAll ? '🔓 All Revealed' : '👁 Reveal All Answers'}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r border-white/10 bg-black/20 overflow-y-auto p-3 hidden md:block">
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 px-1">Problems</div>
          <div className="space-y-1">
            {problems.map((p, i) => (
              <button key={i} onClick={() => { setSelected(i); setRevealAll(false) }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors ${selected === i ? 'bg-blue-600/25 border border-blue-500/40 text-white' : 'hover:bg-white/5 text-gray-400 border border-transparent'}`}>
                <div className="font-semibold">Problem {p.number}</div>
                <div className="text-[10px] mt-0.5 opacity-70">{p.year} · {p.type} · {p.total_points} pts</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Problem display */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 py-8">

            {/* Problem header */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{prob.source ?? `${prob.year} · Problem ${prob.number}`}</div>
                <h1 className="text-xl font-bold">Problem {prob.number}</h1>
              </div>
              <div className="ml-auto flex gap-2">
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${prob.type === 'LEQ' ? 'bg-purple-900/30 border-purple-700/40 text-purple-300' : 'bg-blue-900/30 border-blue-700/40 text-blue-300'}`}>
                  {prob.type === 'LEQ' ? 'Long Essay · 10 pts' : 'Short Answer · 4 pts'}
                </span>
              </div>
            </div>

            {/* Context / given data */}
            {prob.context && (
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Given / Context</div>
                <RichText text={prob.context} className="text-sm leading-relaxed text-gray-200" />
                {prob.image_url && <ProblemImage src={prob.image_url} alt="Problem diagram" />}
              </div>
            )}

            {/* Parts */}
            <div className="space-y-4">
              {prob.parts.map((part, pi) => (
                <div key={pi} className="border border-white/10 rounded-2xl overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 text-sm font-bold">
                      {part.label.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <RichText text={part.question} className="text-sm leading-relaxed" />
                        <span className="text-xs text-gray-600 shrink-0 mt-0.5">{part.points} pt{part.points !== 1 ? 's' : ''}</span>
                      </div>
                      {part.image_url && <ProblemImage src={part.image_url} alt={`Part ${part.label} diagram`} />}
                    </div>
                  </div>

                  {/* Answer reveal */}
                  {part.model_answer && (
                    <div className="border-t border-white/10">
                      {!isRevealed(`${selected}-${pi}`) ? (
                        <button
                          onClick={() => toggleReveal(`${selected}-${pi}`)}
                          className="w-full text-left px-5 py-3 text-xs text-gray-500 hover:text-blue-400 hover:bg-white/[0.02] transition-colors">
                          👁 Show model answer
                        </button>
                      ) : (
                        <div className="px-5 py-4 bg-green-900/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Model Answer</span>
                            <button onClick={() => toggleReveal(`${selected}-${pi}`)} className="text-[10px] text-gray-600 hover:text-gray-400">Hide</button>
                          </div>
                          <RichText text={part.model_answer ?? ''} className="text-sm text-green-100 leading-relaxed" />
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
              <button onClick={() => { setSelected(p => Math.min(problems.length - 1, p + 1)); setRevealAll(false) }}
                disabled={selected === problems.length - 1}
                className="ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold disabled:opacity-30 transition-colors">
                Next Problem →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
