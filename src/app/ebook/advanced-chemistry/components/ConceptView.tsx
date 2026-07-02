'use client'

import { motion } from 'framer-motion'
import type { Concept } from '../types'
import Callout from './Callout'
import FormulaBlock from './FormulaBlock'
import MCQSection from './MCQSection'
import FlashcardDeck from './FlashcardDeck'

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-700 bg-slate-800/80">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/20'}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2.5 text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ConceptView({
  concept,
  accentHex,
  onComplete,
}: {
  concept: Concept
  accentHex: string
  onComplete: () => void
}) {
  return (
    <motion.div
      key={concept.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-4xl pb-20"
    >
      {/* Concept header */}
      <div className="mb-8">
        <div
          className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
          style={{ background: accentHex + '22', color: accentHex }}
        >
          {concept.estimatedMinutes} min read
        </div>
        <h2 className="text-3xl font-bold text-white">{concept.title}</h2>
        <p className="mt-1 text-slate-400">{concept.subtitle}</p>
      </div>

      {/* Content blocks */}
      <div className="space-y-2">
        {concept.blocks.map((block, i) => {
          switch (block.type) {
            case 'text':
              return (
                <p key={i} className="leading-relaxed text-slate-300">
                  {block.body}
                </p>
              )
            case 'formula':
              return (
                <FormulaBlock
                  key={i}
                  latex={block.latex}
                  display={block.display}
                  caption={block.caption}
                />
              )
            case 'callout':
              return (
                <Callout
                  key={i}
                  variant={block.variant}
                  title={block.title}
                  body={block.body}
                />
              )
            case 'list':
              return block.variant === 'numbered' ? (
                <ol key={i} className="ml-5 list-decimal space-y-1.5 text-slate-300">
                  {block.items.map((item, j) => (
                    <li key={j} className="leading-relaxed">{item}</li>
                  ))}
                </ol>
              ) : (
                <ul key={i} className="ml-5 list-disc space-y-1.5 text-slate-300">
                  {block.items.map((item, j) => (
                    <li key={j} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )
            case 'table':
              return <TableBlock key={i} headers={block.headers} rows={block.rows} />
            case 'simulation':
              return (
                <div key={i} className="my-5 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-8 text-center">
                  <p className="text-sm font-semibold text-slate-400">{block.title}</p>
                  <p className="mt-1 text-xs text-slate-600">{block.description}</p>
                </div>
              )
            default:
              return null
          }
        })}
      </div>

      {/* Divider */}
      <div className="my-10 h-px bg-slate-800" />

      {/* MCQ */}
      <MCQSection mcqs={concept.mcqs} />

      {/* Divider */}
      <div className="my-10 h-px bg-slate-800" />

      {/* Flashcards */}
      <FlashcardDeck cards={concept.flashcards} />

      {/* Mark complete */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={onComplete}
          className="rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-95"
          style={{ background: accentHex }}
        >
          Mark Complete &amp; Continue →
        </button>
      </div>
    </motion.div>
  )
}
