'use client'

import { useState } from 'react'
import type { MCQ } from '../types'

function MCQCard({ mcq, index }: { mcq: MCQ; index: number }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
  }

  const optionStyle = (i: number) => {
    if (!submitted) {
      return selected === i
        ? 'border-emerald-500 bg-emerald-950/60 text-white'
        : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500 hover:bg-slate-800/60'
    }
    if (i === mcq.correct) return 'border-emerald-500 bg-emerald-950/50 text-emerald-200'
    if (i === selected)    return 'border-rose-500 bg-rose-950/50 text-rose-300'
    return 'border-slate-800 bg-slate-900/20 text-slate-500 opacity-50'
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="mb-4 font-medium text-white">
        <span className="mr-2 text-sm font-bold text-emerald-400">Q{index + 1}.</span>
        {mcq.question}
      </p>
      <div className="flex flex-col gap-2">
        {mcq.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !submitted && setSelected(i)}
            className={`cursor-pointer rounded-lg border px-4 py-2.5 text-left text-sm transition-all duration-150 ${optionStyle(i)}`}
            disabled={submitted}
          >
            <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="mt-4 rounded-lg bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40"
        >
          Check Answer
        </button>
      )}

      {submitted && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            selected === mcq.correct
              ? 'border border-emerald-700 bg-emerald-950/40 text-emerald-200'
              : 'border border-rose-700 bg-rose-950/40 text-rose-200'
          }`}
        >
          <p className="mb-1 font-semibold">
            {selected === mcq.correct ? '✅ Correct!' : `❌ Incorrect — correct answer: ${String.fromCharCode(65 + mcq.correct)}`}
          </p>
          <p className="leading-relaxed text-slate-300">{mcq.explanation}</p>
        </div>
      )}
    </div>
  )
}

export default function MCQSection({ mcqs }: { mcqs: MCQ[] }) {
  return (
    <div className="my-8">
      <h3 className="mb-4 text-lg font-bold text-white">Practice Questions</h3>
      <div className="flex flex-col gap-4">
        {mcqs.map((mcq, i) => (
          <MCQCard key={i} mcq={mcq} index={i} />
        ))}
      </div>
    </div>
  )
}
