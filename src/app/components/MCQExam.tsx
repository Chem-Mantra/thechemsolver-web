'use client'
import { useState, useEffect, useCallback } from 'react'

export interface MCQQuestion {
  id: number
  stem: string
  options: { A: string; B: string; C: string; D: string }
  answer: 'A' | 'B' | 'C' | 'D'
  explanation?: string
  unit?: string
  image_url?: string
  has_visual?: boolean
}

interface Props {
  questions: MCQQuestion[]
  examName: string
  timeLimitSeconds: number   // 5400 for AP (90 min), 6600 for USNCO (110 min)
  onExit?: () => void
}

type Status = 'unseen' | 'answered' | 'flagged' | 'answered-flagged'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const STATUS_COLOR: Record<Status, string> = {
  unseen:           'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10',
  answered:         'bg-blue-600/80 border-blue-500 text-white',
  flagged:          'bg-orange-600/80 border-orange-500 text-white',
  'answered-flagged': 'bg-orange-500/60 border-orange-400 text-white',
}

export default function MCQExam({ questions, examName, timeLimitSeconds, onExit }: Props) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({})
  const [flags, setFlags] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds)
  const [submitted, setSubmitted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [reviewMode, setReviewMode] = useState(false)

  // Timer
  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { handleSubmit(); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [submitted])

  const handleSubmit = useCallback(() => {
    setSubmitted(true)
    setShowConfirm(false)
  }, [])

  const status = (i: number): Status => {
    const ans = answers[i] !== undefined
    const fl = flags.has(i)
    if (ans && fl) return 'answered-flagged'
    if (ans) return 'answered'
    if (fl) return 'flagged'
    return 'unseen'
  }

  const q = questions[current]
  const answered = Object.keys(answers).length
  const score = submitted ? questions.filter((q, i) => answers[i] === q.answer).length : 0
  const pct = submitted ? Math.round((score / questions.length) * 100) : 0

  if (!q) return null

  // ── Results screen ────────────────────────────────────────────────────────
  if (submitted && !reviewMode) {
    return (
      <div className="min-h-screen bg-[#060610] text-white flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{pct >= 70 ? '🎉' : pct >= 50 ? '📊' : '💪'}</div>
            <h1 className="text-3xl font-black mb-1">{examName}</h1>
            <p className="text-gray-400 text-sm">Exam Complete</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Score', value: `${score} / ${questions.length}`, color: 'text-white' },
              { label: 'Percentage', value: `${pct}%`, color: pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400' },
              { label: 'Time Used', value: fmt(timeLimitSeconds - timeLeft), color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Score bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Correct: {score}</span>
              <span>Incorrect: {questions.length - score - (answered - score)}</span>
              <span>Unanswered: {questions.length - answered}</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
              <div className="bg-green-500 h-full transition-all" style={{ width: `${pct}%` }} />
              <div className="bg-red-500/60 h-full transition-all" style={{ width: `${Math.round(((answered - score) / questions.length) * 100)}%` }} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setReviewMode(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors">
              Review All Questions
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="flex-1 border border-white/20 hover:border-white/40 text-white font-semibold py-3 rounded-xl transition-colors">
                Exit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Review mode ───────────────────────────────────────────────────────────
  if (submitted && reviewMode) {
    return (
      <div className="min-h-screen bg-[#060610] text-white">
        <div className="sticky top-0 bg-[#060610]/95 backdrop-blur border-b border-white/10 px-5 py-3 flex items-center justify-between z-40">
          <span className="font-bold text-sm">{examName} — Review</span>
          <div className="flex gap-3">
            <button onClick={() => setReviewMode(false)} className="text-xs border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/5">
              ← Back to Results
            </button>
            {onExit && (
              <button onClick={onExit} className="text-xs bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/15">Exit</button>
            )}
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
          {questions.map((q, i) => {
            const userAns = answers[i]
            const correct = userAns === q.answer
            return (
              <div key={i} className={`border rounded-2xl p-6 ${correct ? 'border-green-700/40 bg-green-900/10' : userAns ? 'border-red-700/40 bg-red-900/10' : 'border-white/10 bg-white/[0.02]'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-gray-500">Q{i + 1}</span>
                  {q.unit && <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-700/30 px-2 py-0.5 rounded-full">{q.unit}</span>}
                  <span className={`text-xs font-semibold ml-auto ${correct ? 'text-green-400' : userAns ? 'text-red-400' : 'text-gray-500'}`}>
                    {correct ? '✓ Correct' : userAns ? '✗ Incorrect' : '— Not answered'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4">{q.stem}</p>
                {q.image_url && <img src={q.image_url} alt="Question diagram" className="max-h-48 mb-4 rounded-lg" />}
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => {
                    const isCorrect = opt === q.answer
                    const isUser = opt === userAns
                    return (
                      <div key={opt}
                        className={`flex gap-3 text-sm px-4 py-2.5 rounded-xl border ${
                          isCorrect ? 'bg-green-900/30 border-green-600/50 text-green-300' :
                          isUser && !isCorrect ? 'bg-red-900/30 border-red-600/50 text-red-300' :
                          'bg-white/[0.02] border-white/5 text-gray-400'
                        }`}>
                        <span className="font-bold shrink-0">{opt}.</span>
                        <span>{q.options[opt]}</span>
                        {isCorrect && <span className="ml-auto text-green-400 shrink-0">✓</span>}
                        {isUser && !isCorrect && <span className="ml-auto text-red-400 shrink-0">✗</span>}
                      </div>
                    )
                  })}
                </div>
                {q.explanation && (
                  <div className="mt-4 bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 text-xs text-blue-200 leading-relaxed">
                    <span className="font-bold text-blue-400">Explanation: </span>{q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Active exam ───────────────────────────────────────────────────────────
  const unanswered = questions.length - answered

  return (
    <div className="min-h-screen bg-[#060610] text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#060610]/95 backdrop-blur border-b border-white/10 px-4 py-2.5 flex items-center gap-4">
        <span className="font-bold text-sm truncate flex-1">{examName}</span>
        <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-400' : timeLeft < 600 ? 'text-orange-400' : 'text-white'}`}>
          <span className="text-xs font-normal text-gray-500 font-sans">Time</span>
          {fmt(timeLeft)}
        </div>
        <div className="text-xs text-gray-500">{answered}/{questions.length} answered</div>
        <button onClick={() => setShowConfirm(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0">
          Submit Exam
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — question grid */}
        <aside className="w-52 shrink-0 border-r border-white/10 bg-black/20 overflow-y-auto p-3 hidden md:block">
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2 px-1">Questions</div>
          <div className="grid grid-cols-5 gap-1 mb-4">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`aspect-square text-xs font-medium rounded-lg border transition-all ${STATUS_COLOR[status(i)]} ${current === i ? 'ring-2 ring-white/30' : ''}`}>
                {i + 1}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div className="space-y-1.5 px-1">
            {[
              { color: 'bg-blue-600/80', label: 'Answered' },
              { color: 'bg-orange-600/80', label: 'Flagged' },
              { color: 'bg-white/5', label: 'Unseen' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className={`w-3 h-3 rounded-sm ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </aside>

        {/* Main question area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 py-8">
            {/* Question header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-white/10 border border-white/15 text-xs font-bold px-3 py-1.5 rounded-full">
                Question {current + 1} of {questions.length}
              </span>
              {q.unit && (
                <span className="text-xs bg-blue-900/40 text-blue-400 border border-blue-700/30 px-2.5 py-1 rounded-full">
                  {q.unit}
                </span>
              )}
              <button
                onClick={() => setFlags(p => { const n = new Set(p); n.has(current) ? n.delete(current) : n.add(current); return n })}
                className={`ml-auto text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${flags.has(current) ? 'bg-orange-600/30 border-orange-500/50 text-orange-300' : 'border-white/10 text-gray-500 hover:text-orange-400 hover:border-orange-700/40'}`}>
                {flags.has(current) ? '🚩 Flagged' : '🏳 Flag'}
              </button>
            </div>

            {/* Stem */}
            <p className="text-base leading-relaxed mb-6">{q.stem}</p>
            {q.image_url && (
              <img src={q.image_url} alt="Diagram" className="max-h-64 mb-6 rounded-xl border border-white/10" />
            )}

            {/* Options */}
            <div className="space-y-3 mb-10">
              {(['A', 'B', 'C', 'D'] as const).map(opt => {
                const selected = answers[current] === opt
                return (
                  <button key={opt} onClick={() => setAnswers(p => ({ ...p, [current]: opt }))}
                    className={`w-full flex gap-4 items-start text-left px-5 py-4 rounded-2xl border transition-all ${
                      selected
                        ? 'bg-blue-600/25 border-blue-500/60 text-white'
                        : 'bg-white/[0.03] border-white/8 text-gray-300 hover:bg-white/[0.06] hover:border-white/15'
                    }`}>
                    <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                      selected ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/20 text-gray-500'
                    }`}>{opt}</span>
                    <span className="text-sm leading-relaxed pt-0.5">{q.options[opt]}</span>
                  </button>
                )
              })}
            </div>

            {/* Nav */}
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}
                className="px-5 py-2.5 border border-white/15 rounded-xl text-sm font-medium disabled:opacity-30 hover:bg-white/5 transition-colors">
                ← Previous
              </button>
              {answers[current] && (
                <button onClick={() => setAnswers(p => { const n = { ...p }; delete n[current]; return n })}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-2">
                  Clear answer
                </button>
              )}
              <button onClick={() => setCurrent(p => Math.min(questions.length - 1, p + 1))}
                disabled={current === questions.length - 1}
                className="ml-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold disabled:opacity-30 transition-colors">
                Next →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Submit confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-5">
          <div className="bg-[#0d0d1f] border border-white/15 rounded-2xl p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">Submit Exam?</h2>
            <div className="space-y-1 text-sm text-gray-400 mb-6">
              <p>Answered: <span className="text-white font-semibold">{answered} / {questions.length}</span></p>
              {unanswered > 0 && <p className="text-orange-400">⚠ {unanswered} question{unanswered > 1 ? 's' : ''} not answered</p>}
              {flags.size > 0 && <p className="text-orange-300">🚩 {flags.size} flagged for review</p>}
              <p>Time remaining: <span className="text-white font-semibold">{fmt(timeLeft)}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 border border-white/20 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
                Continue Exam
              </button>
              <button onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
