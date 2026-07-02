'use client'
import Link from 'next/link'
import { useRef } from 'react'
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

export default function PeriodicPropertiesSimulator() {
  return (
    <div className="bg-background text-on-surface min-h-screen hex-bg">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 md:px-margin-desktop h-16"
        style={{ boxShadow: '0 0 20px rgba(0,219,231,0.1)' }} aria-label="Navigation">
        <Link href="/labs" className="font-bold text-primary-container tracking-tight" style={{ fontFamily: 'var(--font-sora)', fontSize: '17px' }}>Chem Mantra</Link>
        <span className="font-label-sm text-[11px] text-primary uppercase tracking-widest hidden md:block">Periodic Properties Variation Simulator</span>
        <Link href="/tests"><motion.button type="button" className="px-4 py-2 bg-primary-container text-on-primary font-bold text-xs rounded-lg" whileTap={{ scale: 0.96 }}>Practice</motion.button></Link>
      </header>
      <main className="pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto space-y-6">
        <FadeUp>
          <div className="flex items-center gap-2 mb-2"><span className="h-1 w-6 bg-primary-container inline-block" aria-hidden="true" />
            <span className="text-primary-container font-label-sm text-[11px] uppercase tracking-widest">Inorganic Chemistry</span></div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-sora)' }}>Periodic Properties Variation Simulator</h1>
          <p className="text-on-surface-variant mt-2 leading-relaxed">Atomic radius, ionization energy, electronegativity, electron affinity — trends and anomalies explained.</p>
        </FadeUp>

        <FadeUp delay={0.1} className="glass-panel rounded-xl p-5 md:p-6">
          <h2 className="font-bold text-on-surface mb-5 text-lg" style={{ fontFamily: 'var(--font-sora)' }}>
            Trends Across Period (→)
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Atomic Radius</span>
              <span className="text-sm text-on-surface">Decreases (↑ nuclear charge)</span>
            </div>
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Ionization Energy</span>
              <span className="text-sm text-on-surface">Increases (exceptions at Be/B, N/O)</span>
            </div>
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Electronegativity</span>
              <span className="text-sm text-on-surface">Increases (F maximum: 4.0)</span>
            </div>
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Electron Affinity</span>
              <span className="text-sm text-on-surface">Increases (Cl highest in practice)</span>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="glass-panel rounded-xl p-5 md:p-6">
          <h2 className="font-bold text-on-surface mb-5 text-lg" style={{ fontFamily: 'var(--font-sora)' }}>
            Trends Down Group (↓)
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Atomic Radius</span>
              <span className="text-sm text-on-surface">Increases (new electron shells)</span>
            </div>
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Ionization Energy</span>
              <span className="text-sm text-on-surface">Decreases (electron shielding)</span>
            </div>
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Electronegativity</span>
              <span className="text-sm text-on-surface">Decreases (Cs minimum)</span>
            </div>
            <div className="flex items-start gap-3 bg-surface-container/40 rounded-lg p-3">
              <span className="font-label-sm text-[10px] text-primary-container uppercase tracking-widest shrink-0 pt-0.5 w-28">Metallic Character</span>
              <span className="text-sm text-on-surface">Increases</span>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={0.3} className="flex gap-4">
          <Link href="/tests" className="flex-1"><motion.button type="button" className="w-full py-3 bg-primary-container text-on-primary font-bold text-sm rounded-xl" style={{ boxShadow: '0 0 15px rgba(0,219,231,0.3)' }} whileTap={{ scale: 0.96 }}>Practice Questions →</motion.button></Link>
          <Link href="/flashcards" className="flex-1"><motion.button type="button" className="w-full py-3 glass-panel border border-secondary/30 text-secondary font-bold text-sm rounded-xl" whileTap={{ scale: 0.96 }}>Flashcards</motion.button></Link>
        </FadeUp>
      </main>
    </div>
  )
}
