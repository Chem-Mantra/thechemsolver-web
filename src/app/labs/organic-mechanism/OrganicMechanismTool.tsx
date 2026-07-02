'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MECHANISMS = [
  {
    name: 'SN2 Nucleophilic Substitution',
    steps: ['Nu⁻ attacks from backside', 'Simultaneous bond breaking/forming', 'Walden inversion at carbon', 'Product with inverted config'],
    type: 'Concerted',  conditions: 'Polar aprotic solvent, strong Nu⁻, primary substrate',
    color: 'text-primary-container',
  },
  {
    name: 'E2 Elimination',
    steps: ['Base abstracts β-H', 'Simultaneous C-X bond breaking', 'π bond formation', 'Zaitsev/Hofmann product'],
    type: 'Concerted',  conditions: 'Strong base, high temp, anti-periplanar requirement',
    color: 'text-secondary',
  },
  {
    name: 'Aldol Condensation',
    steps: ['Base deprotonates α-carbon', 'Enolate attacks carbonyl', 'β-hydroxy carbonyl forms', 'Dehydration → α,β-unsaturated'],
    type: 'Step-wise',  conditions: 'Dilute NaOH, α-H required, both components',
    color: 'text-saffron-500',
  },
]

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

export default function OrganicMechanismFlowSimulator() {
  const [active, setActive] = useState(0)
  const mechanism = MECHANISMS[active]

  return (
    <div className="bg-background text-on-surface min-h-screen hex-bg">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-on-primary-fixed-variant/20 flex justify-between items-center px-4 md:px-gutter h-16"
        style={{ boxShadow: '0 0 20px rgba(0,242,255,0.1)' }} aria-label="Organic mechanism simulator navigation">
        <div className="flex items-center gap-5 md:gap-6">
          <Link href="/" className="font-bold text-teal-300 tracking-tight" style={{ fontFamily: 'var(--font-sora)', fontSize: '17px' }}>CHEM MANTRA</Link>
          <nav className="hidden md:flex gap-6" aria-label="Lab sections">
            {['LAB MODULES','COMMAND CENTER','TACTICAL DRILLS'].map((l, i) => (
              <Link key={l} href="#" className={`font-label-sm text-label-sm text-[11px] tracking-widest transition-all ${i === 0 ? 'text-primary-container font-bold border-b-2 border-primary-container pb-1' : 'text-on-surface-variant hover:text-primary-fixed'}`}>
                {l}
              </Link>
            ))}
          </nav>
        </div>
        <motion.button type="button" className="px-4 py-2 bg-primary-container text-on-primary font-bold text-xs rounded-lg"
          style={{ boxShadow: '0 0 12px rgba(0,219,231,0.3)' }} whileTap={{ scale: 0.96 }}>
          Run Mechanism
        </motion.button>
      </header>

      <main className="pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto space-y-6 md:space-y-8">
        <FadeUp>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 bg-primary-container inline-block" aria-hidden="true" />
              <span className="text-primary-container font-label-sm text-[11px] uppercase tracking-widest">Organic Chemistry Lab</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-teal-300" style={{ fontFamily: 'var(--font-sora)' }}>
              Organic Mechanism Flow Simulator
            </h1>
          </div>
        </FadeUp>

        {/* Mechanism selector */}
        <div className="flex gap-3 flex-wrap">
          {MECHANISMS.map(({ name }, i) => (
            <motion.button key={name} type="button" onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg font-label-sm text-xs uppercase transition-all ${i === active ? 'bg-primary-container text-on-primary' : 'glass-panel text-on-surface-variant border border-white/10 hover:border-primary-container/30'}`}
              whileTap={{ scale: 0.96 }}>
              {name.split(' ').slice(0, 2).join(' ')}
            </motion.button>
          ))}
        </div>

        {/* Active mechanism */}
        <FadeUp key={active} delay={0.05}>
          <div className="glass-panel p-5 md:p-8 rounded-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-bold text-on-surface text-xl mb-1" style={{ fontFamily: 'var(--font-sora)' }}>{mechanism.name}</h2>
                <span className={`text-[11px] px-2 py-0.5 rounded border font-label-sm ${mechanism.color} border-current bg-current/10`}>{mechanism.type}</span>
              </div>
            </div>

            {/* Step flow */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 overflow-x-auto pb-2">
              {mechanism.steps.map((step, i) => (
                <div key={i} className="flex md:flex-col items-center gap-2 md:gap-1">
                  <div className="flex md:flex-col items-center gap-2">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary-container/20 border border-primary-container/40 flex items-center justify-center">
                      <span className="font-bold text-primary-container text-xs" style={{ fontFamily: 'var(--font-sora)' }}>{i + 1}</span>
                    </div>
                    {i < mechanism.steps.length - 1 && (
                      <span className="text-primary-container opacity-40 md:hidden" aria-hidden="true">→</span>
                    )}
                  </div>
                  <div className="min-w-[120px] md:min-w-0 glass-panel rounded-lg p-3 text-[11px] text-on-surface leading-relaxed text-center">{step}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-2">Conditions</div>
              <p className="text-sm text-on-surface">{mechanism.conditions}</p>
            </div>
          </div>
        </FadeUp>
      </main>
    </div>
  )
}
