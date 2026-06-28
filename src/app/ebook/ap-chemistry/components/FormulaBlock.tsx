'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function FormulaBlock({
  latex,
  display = false,
  caption,
}: {
  latex: string
  display?: boolean
  caption?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, {
        displayMode: display,
        throwOnError: false,
        trust: false,
      })
    } catch {
      if (ref.current) ref.current.textContent = latex
    }
  }, [latex, display])

  return (
    <div className="my-5">
      <div
        className={`overflow-x-auto rounded-xl bg-slate-900/60 px-6 py-4 text-center ${
          display ? 'text-xl' : 'text-base'
        }`}
        ref={ref}
      />
      {caption && (
        <p className="mt-2 text-center text-xs text-slate-400 italic">{caption}</p>
      )}
    </div>
  )
}
