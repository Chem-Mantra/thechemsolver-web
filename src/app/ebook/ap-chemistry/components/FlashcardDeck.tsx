'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Flashcard } from '../types'

function Card({ card, flipped, onFlip }: { card: Flashcard; flipped: boolean; onFlip: () => void }) {
  return (
    <div
      className="relative mx-auto h-44 w-full max-w-xl cursor-pointer"
      style={{ perspective: 1000 }}
      onClick={onFlip}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-indigo-800 bg-gradient-to-br from-indigo-950 to-slate-900 px-6 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">Question</p>
          <p className="text-base font-semibold text-white">{card.front}</p>
          <p className="mt-3 text-xs text-slate-500">Click to flip</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-teal-700 bg-gradient-to-br from-teal-950 to-slate-900 px-6 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-400">Answer</p>
          <p className="text-sm leading-relaxed text-white">{card.back}</p>
          <p className="mt-3 text-xs text-slate-500">Click to flip back</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const go = (dir: number) => {
    setFlipped(false)
    setTimeout(() => setIndex((i) => (i + dir + cards.length) % cards.length), 150)
  }

  if (!cards.length) return null

  return (
    <div className="my-8">
      <h3 className="mb-4 text-lg font-bold text-white">Flashcard Review</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card card={cards[index]} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          onClick={() => go(-1)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
        >
          ← Prev
        </button>
        <span className="text-sm text-slate-400">
          {index + 1} / {cards.length}
        </span>
        <button
          onClick={() => go(1)}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
