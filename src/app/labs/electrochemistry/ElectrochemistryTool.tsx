'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'

const MECHANISMS = [
  { id: 'oxidation',   label: 'Oxidation Half-Cell',  eq: 'Zn → Zn²⁺ + 2e⁻',      E: '+0.76 V', color: 'text-primary-container' },
  { id: 'reduction',   label: 'Reduction Half-Cell',  eq: 'Cu²⁺ + 2e⁻ → Cu',       E: '+0.34 V', color: 'text-secondary' },
  { id: 'cell',        label: 'Overall Cell Reaction', eq: 'Zn + Cu²⁺ → Zn²⁺ + Cu',  E: '+1.10 V', color: 'text-tertiary-fixed-dim' },
]

const SIDEBAR_NAV = [
  { icon: 'electric_bolt', label: 'Galvanic Cell',    active: true  },
  { icon: 'battery_charging_full', label: 'Electrolytic', active: false },
  { icon: 'timeline',     label: 'Nernst Equation',  active: false },
  { icon: 'science',      label: 'Corrosion Lab',    active: false },
]

export default function ElectrochemistrySimulator() {
  const [voltage, setVoltage] = useState(50)
  const [current, setCurrent] = useState(40)

  const emf = (1.10 - (voltage - 50) * 0.005).toFixed(3)
  const concentrationQ = (current * 0.02).toFixed(2)

  return (
    <div className="bg-background text-on-background min-h-screen hex-bg">
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-4 md:px-margin-desktop h-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20"
        style={{ boxShadow: '0 0 20px rgba(0,242,255,0.15)' }} aria-label="Electrochemistry simulator navigation">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-primary-container uppercase tracking-tighter"
            style={{ fontFamily: 'var(--font-sora)', fontSize: '16px' }}>CHEM MANTRA TACTICAL HUD</Link>
        </div>
        <nav className="hidden md:flex gap-6 items-center" aria-label="Simulator sections">
          {['DASHBOARD','MECHANISMS','RANK PROJECTION','RESOURCES'].map((l, i) => (
            <Link key={l} href="#" className={`text-sm font-medium transition-all ${i === 1 ? 'text-primary-container border-b-2 border-primary-container font-bold px-1' : 'text-on-surface-variant hover:text-primary-container'}`}>
              {l}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary-container text-[22px]" aria-hidden="true">notifications_active</span>
          <Link href="/dashboard" aria-label="Profile">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSd157J4MfXpp2YQoA3UT4BUkXgZ3Ts0FDVR_aCRNWmDoOqwEs1v06mYsw_MoVvd1WKOJ6z-Yqf19Q7o3jUIE7ZOpEP6u_AdjhksTxcIeYP70cgW2iWry6GtXg5kUaMT-I6EEysYU1WQgZEk64ulTgFupX82OBvlD88bA6HLSH8X7WQNuHJJ-oGE-aJ3gxu8guEm4lQ5z_qwwgOAV7OIJKSUmifbf9O3iJdV6wE3pWr-8cljVEwpfdha86yWOKmIyOuS0t4rM8haR9"
              alt="User rank avatar" width={40} height={40} className="rounded-full border-2 border-primary-container" unoptimized />
          </Link>
        </div>
      </header>

      <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 bg-surface-container-low/90 backdrop-blur-lg border-r border-outline-variant/10 pt-24 pb-8 hidden md:flex"
        aria-label="Simulator navigation">
        <div className="px-6 mb-8">
          <h2 className="font-bold text-primary-container" style={{ fontFamily: 'var(--font-sora)', fontSize: '18px' }}>OPERATOR 01</h2>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant text-[10px]">IIT-JEE ADVANCED</p>
        </div>
        <nav className="flex-1 space-y-1" aria-label="Lab sections">
          {SIDEBAR_NAV.map(({ icon, label, active }) => (
            <Link key={label} href="#"
              className={`flex items-center gap-3 px-6 py-3 transition-all text-sm ${active ? 'bg-secondary-container/20 text-primary-container border-r-4 border-primary-container' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
              aria-current={active ? 'page' : undefined}>
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">{icon}</span>
              <span className="font-label-sm text-label-sm">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-6">
          <div className="glass-panel p-4 rounded-xl border-primary-container/20">
            <div className="text-[10px] text-on-surface-variant uppercase mb-2 font-label-sm">Cell EMF</div>
            <div className="font-bold text-primary-container text-2xl" style={{ fontFamily: 'var(--font-sora)' }}>{emf} V</div>
            <div className="h-1.5 bg-surface-container rounded-full mt-2 overflow-hidden">
              <motion.div className="h-full bg-primary-container rounded-full"
                animate={{ width: `${Math.min(100, parseFloat(emf) * 80)}%` }}
                transition={{ duration: 0.4 }} />
            </div>
          </div>
        </div>
      </aside>

      <main className="md:ml-64 pt-24 px-4 md:px-8 pb-12 max-w-6xl mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1 w-6 bg-primary-container inline-block" aria-hidden="true" />
              <span className="text-primary-container font-label-sm text-[11px] uppercase tracking-widest">Galvanic Cell Analysis</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-container" style={{ fontFamily: 'var(--font-sora)' }}>
              Advanced Electrochemistry Simulator
            </h1>
          </div>
          <motion.button type="button" className="px-5 py-2.5 bg-primary-container text-on-primary font-bold text-sm rounded-lg"
            style={{ boxShadow: '0 0 15px rgba(0,219,231,0.3)' }} whileTap={{ scale: 0.96 }}>
            RUN SIMULATION
          </motion.button>
        </div>

        {/* Half-cell reactions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {MECHANISMS.map(({ id, label, eq, E, color }, i) => (
            <motion.div key={id} className="glass-panel p-5 rounded-xl"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>
              <div className={`font-label-sm text-[10px] ${color} uppercase tracking-widest mb-3`}>{label}</div>
              <div className="font-mono text-on-surface mb-3 text-sm" style={{ fontFamily: 'var(--font-space-mono)' }}>{eq}</div>
              <div className={`font-bold ${color} text-2xl`} style={{ fontFamily: 'var(--font-sora)' }}>E° = {E}</div>
            </motion.div>
          ))}
        </div>

        {/* Nernst equation controls */}
        <div className="glass-panel p-5 md:p-8 rounded-xl">
          <h3 className="font-bold text-on-surface mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-sora)', fontSize: '18px' }}>
            <span className="material-symbols-outlined text-primary-container text-[20px]" aria-hidden="true">calculate</span>
            Nernst Equation: E = E° - (RT/nF)·ln Q
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Temperature (K)', value: `${(298 + (voltage - 50) * 0.5).toFixed(1)} K`, val: voltage, setter: setVoltage },
              { label: '[Zn²⁺] / [Cu²⁺]',  value: `${concentrationQ}`,                           val: current, setter: setCurrent },
            ].map(({ label, value, val, setter }) => (
              <div key={label} className="space-y-3">
                <div className="flex justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[11px]">{label}</label>
                  <span className="text-primary-container font-mono text-sm">{value}</span>
                </div>
                <input type="range" min="0" max="100" value={val} onChange={e => setter(Number(e.target.value))} className="w-full" aria-label={label} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Standard EMF',  value: '1.10 V',       color: 'text-primary-container' },
              { label: 'Actual EMF',    value: `${emf} V`,     color: 'text-secondary' },
              { label: 'Faraday (F)',   value: '96485 C/mol',  color: 'text-on-surface-variant' },
              { label: 'n (electrons)', value: '2',            color: 'text-on-surface-variant' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className="text-[10px] text-on-surface-variant uppercase font-label-sm mb-1">{label}</div>
                <div className={`font-bold ${color} text-lg`} style={{ fontFamily: 'var(--font-sora)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
