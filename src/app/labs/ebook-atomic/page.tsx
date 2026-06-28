'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function FadeUp({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

const CHAPTERS = [
  {
    chapter: 1, title: 'Historical Models of the Atom',
    topics: ['Thomson Plum Pudding Model', 'Rutherford Nuclear Model', 'Bohr Quantized Orbits', 'Limitations of each model'],
    mastery: 88,
  },
  {
    chapter: 2, title: 'Quantum Mechanical Model',
    topics: ['Wave-particle duality', 'de Broglie wavelength λ = h/mv', 'Heisenberg Uncertainty Principle', 'Schrödinger equation and ψ'],
    mastery: 76,
  },
  {
    chapter: 3, title: 'Quantum Numbers',
    topics: ['n — Principal quantum number', 'l — Azimuthal (0 to n-1)', 'mₗ — Magnetic (-l to +l)', 'mₛ — Spin (+½ or -½)'],
    mastery: 92,
  },
  {
    chapter: 4, title: 'Atomic Orbitals & Shapes',
    topics: ['s orbitals — spherical', 'p orbitals — dumbbell (3 orientations)', 'd orbitals — cloverleaf (5 orientations)', 'Nodal planes and radial nodes'],
    mastery: 81,
  },
  {
    chapter: 5, title: 'Electronic Configuration',
    topics: ['Aufbau principle', 'Pauli exclusion principle', "Hund's rule of maximum multiplicity", 'Anomalous configurations: Cr, Cu, Mo, Ag'],
    mastery: 85,
  },
  {
    chapter: 6, title: 'Spectra & Energy Levels',
    topics: ['Hydrogen emission spectrum', 'Lyman (UV), Balmer (Vis), Paschen (IR)', 'En = -13.6/n² eV', 'Rydberg equation: 1/λ = R(1/n₁² - 1/n₂²)'],
    mastery: 71,
  },
]

export default function InteractiveEbookAtomicStructure() {
  const [activeChapter, setActiveChapter] = useState(0)
  const chapter = CHAPTERS[activeChapter]

  return (
    <div className="bg-background text-on-surface min-h-screen hex-bg">
      <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center px-4 md:px-margin-desktop py-4"
        aria-label="eBook navigation">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="font-bold text-primary-fixed-dim tracking-tighter" style={{ fontFamily: 'var(--font-sora)', fontSize: '20px' }}>Chem Mantra</Link>
          <nav className="hidden md:flex gap-4" aria-label="eBook sections">
            {['Dashboard', 'Practice', 'Resources'].map((l, i) => (
              <Link key={l} href={i === 0 ? '/dashboard/mastery' : '#'}
                className={`transition-colors text-sm ${i === 0 ? 'text-primary-fixed-dim border-b-2 border-primary-fixed-dim pb-1 font-bold' : 'text-on-surface-variant hover:text-primary-fixed-dim'}`}>
                {l}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Current Chapter</span>
            <span className="font-bold text-primary-fixed-dim text-sm" style={{ fontFamily: 'var(--font-sora)' }}>
              Ch {chapter.chapter}: {chapter.title.split(' ').slice(0, 3).join(' ')}...
            </span>
          </div>
          <Link href="/tests">
            <motion.button type="button" className="px-4 py-2 bg-primary-container text-on-primary font-bold text-xs rounded-lg"
              style={{ boxShadow: '0 0 12px rgba(0,219,231,0.3)' }} whileTap={{ scale: 0.96 }}>
              Practice
            </motion.button>
          </Link>
        </div>
      </header>

      <div className="pt-20 flex min-h-[calc(100vh-5rem)]">

        {/* Sidebar — chapter list */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/8 bg-surface-container-lowest/60 backdrop-blur overflow-y-auto"
          aria-label="Chapter navigation">
          <div className="p-5 border-b border-white/8">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1 w-6 bg-primary-fixed-dim inline-block rounded-full" aria-hidden="true" />
              <span className="font-label-sm text-[10px] text-primary-fixed-dim uppercase tracking-widest">Interactive eBook</span>
            </div>
            <h1 className="font-bold text-on-surface" style={{ fontFamily: 'var(--font-sora)', fontSize: '16px' }}>Atomic Structure</h1>
            <p className="text-on-surface-variant text-xs mt-1">JEE Advanced complete coverage</p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {CHAPTERS.map(({ chapter: num, title, mastery }, i) => (
              <button key={num} type="button" onClick={() => setActiveChapter(i)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${i === activeChapter ? 'bg-primary-fixed-dim/10 border border-primary-fixed-dim/30 text-primary-fixed-dim' : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'}`}
                aria-current={i === activeChapter ? 'true' : undefined}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider opacity-70">Chapter {num}</span>
                  <span className={`text-[10px] font-bold ${mastery >= 80 ? 'text-primary-container' : 'text-saffron-500'}`}>{mastery}%</span>
                </div>
                <span className="text-sm font-medium">{title}</span>
                <div className="h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${mastery >= 80 ? 'bg-primary-container' : 'bg-saffron-500'}`}
                    style={{ width: `${mastery}%` }} />
                </div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/8">
            <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-2">Overall Progress</div>
            <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary-container rounded-full"
                style={{ width: `${Math.round(CHAPTERS.reduce((a, c) => a + c.mastery, 0) / CHAPTERS.length)}%` }} />
            </div>
            <div className="text-xs text-primary-container mt-1 font-bold">
              {Math.round(CHAPTERS.reduce((a, c) => a + c.mastery, 0) / CHAPTERS.length)}% mastered
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          <motion.div key={activeChapter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }} className="max-w-3xl mx-auto space-y-6">

            <FadeUp>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-label-sm text-[10px] text-primary-fixed-dim uppercase tracking-widest">Chapter {chapter.chapter} of {CHAPTERS.length}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-label-sm ${chapter.mastery >= 80 ? 'text-primary-container border-primary-container/30 bg-primary-container/10' : 'text-saffron-500 border-saffron-500/30 bg-saffron-500/10'}`}>
                    {chapter.mastery}% mastered
                  </span>
                </div>
                <h2 className="font-bold text-on-surface text-2xl md:text-3xl" style={{ fontFamily: 'var(--font-sora)' }}>{chapter.title}</h2>
              </div>
            </FadeUp>

            {/* Topics */}
            <FadeUp delay={0.1}>
              <div className="glass-panel rounded-xl p-5 md:p-6">
                <h3 className="font-bold text-on-surface mb-5" style={{ fontFamily: 'var(--font-sora)', fontSize: '16px' }}>Key Topics</h3>
                <div className="space-y-3">
                  {chapter.topics.map((topic, i) => (
                    <motion.div key={topic}
                      className="flex items-start gap-4 bg-surface-container/40 rounded-lg p-4"
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}>
                      <span className="w-6 h-6 rounded-full bg-primary-fixed-dim/20 border border-primary-fixed-dim/40 flex items-center justify-center text-primary-fixed-dim font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-on-surface leading-relaxed">{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeUp>

            {/* Progress bar */}
            <FadeUp delay={0.2}>
              <div className="glass-panel rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase">Chapter Mastery</span>
                  <span className={`font-bold text-sm ${chapter.mastery >= 80 ? 'text-primary-container' : 'text-saffron-500'}`}
                    style={{ fontFamily: 'var(--font-sora)' }}>{chapter.mastery}%</span>
                </div>
                <div className="h-2.5 bg-surface-variant rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${chapter.mastery >= 80 ? 'bg-primary-container' : 'bg-saffron-500'}`}
                    initial={{ width: 0 }} animate={{ width: `${chapter.mastery}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
                </div>
              </div>
            </FadeUp>

            {/* Navigation buttons */}
            <FadeUp delay={0.25} className="flex gap-4">
              <motion.button type="button"
                onClick={() => setActiveChapter(i => Math.max(0, i - 1))}
                disabled={activeChapter === 0}
                className="flex-1 py-3 glass-panel border border-white/10 text-on-surface-variant font-bold text-sm rounded-xl disabled:opacity-40"
                whileTap={{ scale: 0.97 }}>
                ← Previous
              </motion.button>
              <Link href="/tests" className="flex-1">
                <motion.button type="button" className="w-full py-3 glass-panel border border-primary-container/30 text-primary-container font-bold text-sm rounded-xl"
                  whileTap={{ scale: 0.97 }}>
                  Practice Ch {chapter.chapter}
                </motion.button>
              </Link>
              <motion.button type="button"
                onClick={() => setActiveChapter(i => Math.min(CHAPTERS.length - 1, i + 1))}
                disabled={activeChapter === CHAPTERS.length - 1}
                className="flex-1 py-3 bg-primary-container text-on-primary font-bold text-sm rounded-xl disabled:opacity-40"
                style={{ boxShadow: '0 0 12px rgba(0,219,231,0.25)' }}
                whileTap={{ scale: 0.97 }}>
                Next →
              </motion.button>
            </FadeUp>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
