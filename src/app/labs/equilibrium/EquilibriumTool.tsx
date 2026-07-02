'use client'
import Link from 'next/link'
import { useState, useMemo, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, ReferenceLine } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

// ── Real Equilibrium Simulator ─────────────────────────────────
// ICE table math, Kc ↔ Kp conversion, Le Chatelier perturbations

interface Reaction {
  id: string; equation: string; label: string
  a: number; b: number; c: number; d: number  // stoichiometric coefficients aA + bB ⇌ cC + dD
  nameA: string; nameB: string; nameC: string; nameD: string
  Kc: number; deltaH: number  // kJ/mol (negative = exothermic)
  gasPhase: boolean; deltaGas: number // Δn_gas = (c+d)-(a+b)
  color: string; description: string
}

const REACTIONS: Reaction[] = [
  {
    id: 'haber', equation: 'N₂ + 3H₂ ⇌ 2NH₃', label: 'Haber Process',
    a: 1, b: 3, c: 2, d: 0, nameA: 'N₂', nameB: 'H₂', nameC: 'NH₃', nameD: '',
    Kc: 4.1e-4, deltaH: -92, gasPhase: true, deltaGas: -2, color: '#06b6d4',
    description: 'Industrial ammonia synthesis. Exothermic — lower T favours product but slows rate.',
  },
  {
    id: 'hi', equation: 'H₂ + I₂ ⇌ 2HI', label: 'Hydrogen Iodide',
    a: 1, b: 1, c: 2, d: 0, nameA: 'H₂', nameB: 'I₂', nameC: 'HI', nameD: '',
    Kc: 54.3, deltaH: -9.4, gasPhase: true, deltaGas: 0, color: '#a78bfa',
    description: 'Δn=0: pressure has no effect on equilibrium position. Classic JEE problem.',
  },
  {
    id: 'pcl5', equation: 'PCl₅ ⇌ PCl₃ + Cl₂', label: 'PCl₅ Decomposition',
    a: 1, b: 0, c: 1, d: 1, nameA: 'PCl₅', nameB: '', nameC: 'PCl₃', nameD: 'Cl₂',
    Kc: 0.042, deltaH: 88, gasPhase: true, deltaGas: 1, color: '#f97316',
    description: 'Endothermic with Δn=+1. Higher T and lower P both favour dissociation.',
  },
  {
    id: 'n2o4', equation: 'N₂O₄ ⇌ 2NO₂', label: 'Dinitrogen Tetroxide',
    a: 1, b: 0, c: 2, d: 0, nameA: 'N₂O₄', nameB: '', nameC: 'NO₂', nameD: '',
    Kc: 0.0059, deltaH: 57.2, gasPhase: true, deltaGas: 1, color: '#ec4899',
    description: 'Colourless → brown. Temperature demonstration — heat → darker brown as NO₂ increases.',
  },
  {
    id: 'water', equation: 'CO + H₂O ⇌ CO₂ + H₂', label: 'Water-Gas Shift',
    a: 1, b: 1, c: 1, d: 1, nameA: 'CO', nameB: 'H₂O', nameC: 'CO₂', nameD: 'H₂',
    Kc: 1.4e5, deltaH: -41, gasPhase: true, deltaGas: 0, color: '#22c55e',
    description: 'Large Kc — strongly product-favoured. Used in hydrogen production from syngas.',
  },
]

// ICE table solver: find equilibrium concentrations given initial concs and Kc
// For aA + bB ⇌ cC + dD; solve via bisection on Kc equation
function solveEquilibrium(rxn: Reaction, initA: number, initB: number, initC: number, initD: number, Kc: number): { A: number; B: number; C: number; D: number; x: number; Q: number } {
  const { a, b, c, d } = rxn
  const hasB = b > 0, hasD = d > 0

  // Q calculation
  const denomQ = Math.pow(Math.max(initA, 1e-15), a) * (hasB ? Math.pow(Math.max(initB, 1e-15), b) : 1)
  const numerQ = Math.pow(Math.max(initC, 1e-15), c) * (hasD ? Math.pow(Math.max(initD, 1e-15), d) : 1)
  const Q = denomQ > 0 ? numerQ / denomQ : 0

  // Bisection to find x (extent of reaction)
  const direction = Q < Kc ? 1 : -1 // forward or reverse
  const maxX = direction > 0
    ? Math.min(
        a > 0 ? initA / a : 1e10,
        hasB ? initB / b : 1e10,
      )
    : Math.min(
        c > 0 ? initC / c : 1e10,
        hasD ? initD / d : 1e10,
      )

  let lo = 0, hi = maxX * 0.9999
  for (let iter = 0; iter < 60; iter++) {
    const x = (lo + hi) / 2
    const eA = initA - direction * a * x
    const eB = hasB ? initB - direction * b * x : 1
    const eC = initC + direction * c * x
    const eD = hasD ? initD + direction * d * x : 1
    if (eA <= 0 || eB <= 0 || eC < 0 || eD < 0) { hi = x; continue }
    const denom = Math.pow(eA, a) * (hasB ? Math.pow(eB, b) : 1)
    const numer = Math.pow(Math.max(eC, 1e-15), c) * (hasD ? Math.pow(Math.max(eD, 1e-15), d) : 1)
    const Ktest = denom > 0 ? numer / denom : 0
    if (Ktest < Kc) lo = x; else hi = x
  }
  const x = (lo + hi) / 2
  return {
    A: Math.max(0, initA - direction * a * x),
    B: hasB ? Math.max(0, initB - direction * b * x) : 0,
    C: Math.max(0, initC + direction * c * x),
    D: hasD ? Math.max(0, initD + direction * d * x) : 0,
    x: direction * x,
    Q,
  }
}

// Generate concentration vs time curve (conceptual — exponential approach to eq)
function generateTimeSeries(eqA: number, eqB: number, eqC: number, eqD: number, initA: number, initB: number, rxn: Reaction, points = 100) {
  return Array.from({ length: points }, (_, i) => {
    const frac = 1 - Math.exp(-5 * i / points)
    return {
      t: i,
      [rxn.nameA]: +(initA + (eqA - initA) * frac).toFixed(4),
      [rxn.nameB]: rxn.b > 0 ? +(initB + (eqB - initB) * frac).toFixed(4) : undefined,
      [rxn.nameC]: +(eqC * frac).toFixed(4),
      [rxn.nameD]: rxn.d > 0 ? +(eqD * frac).toFixed(4) : undefined,
    }
  })
}

const PERTURBATIONS = [
  { id: 'add_A',  label: '+[A]',      desc: 'Add more reactant A' },
  { id: 'add_C',  label: '+[C]',      desc: 'Add more product C' },
  { id: 'remove_C', label: '−[C]',   desc: 'Remove product C' },
  { id: 'inc_T',  label: '↑ T',       desc: 'Increase temperature' },
  { id: 'dec_T',  label: '↓ T',       desc: 'Decrease temperature' },
  { id: 'inc_P',  label: '↑ P',       desc: 'Increase pressure (compress)' },
  { id: 'dec_P',  label: '↓ P',       desc: 'Decrease pressure (expand)' },
  { id: 'add_cat', label: 'Catalyst',  desc: 'Add catalyst' },
]

export default function EquilibriumSimulator() {
  const [rxnId, setRxnId] = useState('haber')
  const [initA, setInitA] = useState(1.0)
  const [initB, setInitB] = useState(3.0)
  const [initC, setInitC] = useState(0.0)
  const [lastPert, setLastPert] = useState<string | null>(null)
  const [pertEffect, setPertEffect] = useState<string>('')

  const rxn = REACTIONS.find(r => r.id === rxnId)!

  const eq = useMemo(() => solveEquilibrium(rxn, initA, initB > 0 ? initB : 0, initC, 0, rxn.Kc), [rxnId, initA, initB, initC])
  const timeSeries = useMemo(() => generateTimeSeries(eq.A, eq.B, eq.C, eq.D, initA, initB, rxn), [eq])

  const Kp = useMemo(() => rxn.deltaGas !== 0 ? rxn.Kc * Math.pow(0.08206 * 298, rxn.deltaGas) : rxn.Kc, [rxnId])
  const Qval = eq.Q

  // Verify Kc from eq concentrations
  const Kccheck = useMemo(() => {
    const { A, B, C, D } = eq
    const denom = Math.pow(Math.max(A, 1e-15), rxn.a) * (rxn.b > 0 ? Math.pow(Math.max(B, 1e-15), rxn.b) : 1)
    const numer = Math.pow(Math.max(C, 1e-15), rxn.c) * (rxn.d > 0 ? Math.pow(Math.max(D, 1e-15), rxn.d) : 1)
    return denom > 0 ? numer / denom : 0
  }, [eq])

  const applyPerturbation = useCallback((pertId: string) => {
    setLastPert(pertId)
    switch (pertId) {
      case 'add_A':   setInitA(v => +(v + 0.5).toFixed(2)); setPertEffect('Q < Kc → equilibrium shifts FORWARD to consume added A and produce more products'); break
      case 'add_C':   setInitC(eq.C + 0.3); setPertEffect('Q > Kc → equilibrium shifts REVERSE to consume added product C, producing more reactants'); break
      case 'remove_C': setInitC(Math.max(0, eq.C - 0.3)); setPertEffect('Q < Kc → equilibrium shifts FORWARD to replace removed product C'); break
      case 'inc_T':
        if (rxn.deltaH < 0) setPertEffect('Exothermic: heat is a product. Adding heat (↑T) shifts equilibrium LEFT → less product, Kc decreases')
        else setPertEffect('Endothermic: heat is a reactant. Adding heat (↑T) shifts equilibrium RIGHT → more product, Kc increases')
        break
      case 'dec_T':
        if (rxn.deltaH < 0) setPertEffect('Exothermic: lower T favours forward reaction → shifts RIGHT, Kc increases')
        else setPertEffect('Endothermic: lower T favours reverse reaction → shifts LEFT, Kc decreases')
        break
      case 'inc_P':
        if (rxn.deltaGas < 0) setPertEffect(`Δn = ${rxn.deltaGas} < 0: higher P shifts equilibrium to FEWER MOLES side → forward, more product`)
        else if (rxn.deltaGas > 0) setPertEffect(`Δn = ${rxn.deltaGas} > 0: higher P shifts equilibrium to FEWER MOLES side → reverse, more reactant`)
        else setPertEffect('Δn = 0: pressure has NO effect on equilibrium position (equal moles each side)')
        break
      case 'dec_P':
        if (rxn.deltaGas > 0) setPertEffect(`Δn = ${rxn.deltaGas} > 0: lower P shifts to MORE moles side → forward`)
        else if (rxn.deltaGas < 0) setPertEffect(`Δn = ${rxn.deltaGas} < 0: lower P shifts to MORE moles side → reverse`)
        else setPertEffect('Δn = 0: pressure change has no effect on this equilibrium')
        break
      case 'add_cat': setPertEffect('Catalyst: speeds up BOTH forward and reverse reactions equally. Kc unchanged. Equilibrium reached faster but position unchanged.'); break
    }
  }, [rxn, eq])

  const shift = eq.x > 0 ? 'Forward ⇒' : eq.x < 0 ? '⇐ Reverse' : 'At Eq'
  const shiftColor = eq.x > 0 ? '#22c55e' : eq.x < 0 ? '#ef4444' : '#fbbf24'
  const speciesColors: Record<string, string> = {
    [rxn.nameA]: '#06b6d4', [rxn.nameB]: '#a78bfa', [rxn.nameC]: '#22c55e', [rxn.nameD]: '#fbbf24',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Chemical Equilibrium — Le Chatelier, ICE Table & Kc/Kp</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left controls */}
        <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Reaction</div>
          {REACTIONS.map(r => (
            <button key={r.id} onClick={() => { setRxnId(r.id); setInitA(1); setInitB(r.b > 0 ? 3 : 0); setInitC(0); setLastPert(null); setPertEffect('') }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 9, marginBottom: 5, border: `1px solid ${rxnId === r.id ? r.color + '60' : 'rgba(255,255,255,0.06)'}`, background: rxnId === r.id ? r.color + '12' : 'rgba(255,255,255,0.02)', color: rxnId === r.id ? r.color : '#849495', fontSize: 10, cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 11 }}>{r.equation}</div>
              <div style={{ fontSize: 8, opacity: 0.7, marginTop: 2 }}>{r.label} · Kc={r.Kc < 0.001 ? r.Kc.toExponential(1) : r.Kc < 1000 ? r.Kc.toFixed(2) : r.Kc.toExponential(1)} · ΔH={r.deltaH > 0 ? '+' : ''}{r.deltaH} kJ/mol</div>
            </button>
          ))}

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 14, marginBottom: 8 }}>Initial Concentrations (M)</div>
          {[
            { label: `[${rxn.nameA}]₀`, val: initA, set: setInitA, min: 0, max: 5 },
            ...(rxn.b > 0 ? [{ label: `[${rxn.nameB}]₀`, val: initB, set: setInitB, min: 0, max: 5 }] : []),
            { label: `[${rxn.nameC}]₀`, val: initC, set: setInitC, min: 0, max: 3 },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#849495', marginBottom: 4 }}>
                <span style={{ fontFamily: 'monospace' }}>{item.label}</span>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>{item.val.toFixed(2)} M</span>
              </div>
              <input type="range" min={item.min} max={item.max} step={0.05} value={item.val}
                onChange={e => { item.set(+e.target.value); setLastPert(null); setPertEffect('') }}
                style={{ width: '100%', accentColor: rxn.color }} />
            </div>
          ))}

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 12, marginBottom: 8 }}>Le Chatelier Perturbations</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {PERTURBATIONS.map(p => (
              <button key={p.id} onClick={() => applyPerturbation(p.id)}
                title={p.desc}
                style={{ padding: '6px 4px', borderRadius: 8, border: `1px solid ${lastPert === p.id ? rxn.color + '60' : 'rgba(255,255,255,0.1)'}`, background: lastPert === p.id ? rxn.color + '18' : 'rgba(255,255,255,0.03)', color: lastPert === p.id ? rxn.color : '#849495', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 14, overflow: 'hidden', gap: 10 }}>
          {/* Reaction banner */}
          <div style={{ background: `${rxn.color}10`, border: `1px solid ${rxn.color}40`, borderRadius: 12, padding: '10px 16px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, fontFamily: 'monospace', color: rxn.color }}>{rxn.equation}</div>
              <div style={{ fontSize: 10, color: '#849495', marginTop: 3 }}>{rxn.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginLeft: 'auto' }}>
              {[
                { label: 'Kc', val: rxn.Kc < 0.001 ? rxn.Kc.toExponential(2) : rxn.Kc < 10000 ? rxn.Kc.toFixed(3) : rxn.Kc.toExponential(2), color: rxn.color },
                { label: 'Kp', val: Kp < 0.001 ? Kp.toExponential(2) : Kp < 10000 ? Kp.toFixed(3) : Kp.toExponential(2), color: '#fbbf24' },
                { label: 'ΔH', val: `${rxn.deltaH > 0 ? '+' : ''}${rxn.deltaH} kJ`, color: rxn.deltaH < 0 ? '#22c55e' : '#ef4444' },
                { label: 'Δn(gas)', val: String(rxn.deltaGas), color: rxn.deltaGas === 0 ? '#849495' : '#a78bfa' },
                { label: 'Q vs Kc', val: Qval < rxn.Kc * 0.99 ? 'Q < Kc' : Qval > rxn.Kc * 1.01 ? 'Q > Kc' : 'Q = Kc', color: Qval < rxn.Kc * 0.99 ? '#22c55e' : Qval > rxn.Kc * 1.01 ? '#ef4444' : '#fbbf24' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 8, color: '#849495' }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace', color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ICE Table */}
          <div style={{ background: 'rgba(26,31,47,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>ICE Table (mol/L)</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: 'monospace' }}>
                <thead>
                  <tr>
                    <th style={{ color: '#849495', padding: '4px 8px', textAlign: 'left', fontSize: 9 }}></th>
                    {[rxn.nameA, rxn.b > 0 ? rxn.nameB : null, rxn.nameC, rxn.d > 0 ? rxn.nameD : null].filter(Boolean).map(name => (
                      <th key={name} style={{ color: speciesColors[name!] ?? '#f8fafc', padding: '4px 12px', textAlign: 'center' }}>{name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { row: 'I (Initial)', vals: [initA, rxn.b > 0 ? initB : null, initC, rxn.d > 0 ? 0 : null], style: {} },
                    { row: 'C (Change)', vals: [-(rxn.a * eq.x), rxn.b > 0 ? -(rxn.b * eq.x) : null, rxn.c * eq.x, rxn.d > 0 ? rxn.d * eq.x : null], style: { color: eq.x > 0 ? '#22c55e' : '#ef4444' } },
                    { row: 'E (Equilibrium)', vals: [eq.A, rxn.b > 0 ? eq.B : null, eq.C, rxn.d > 0 ? eq.D : null], style: { fontWeight: 700, borderTop: '1px solid rgba(255,255,255,0.1)' } },
                  ].map(({ row, vals, style }) => (
                    <tr key={row}>
                      <td style={{ color: '#849495', padding: '5px 8px', fontSize: 9 }}>{row}</td>
                      {vals.filter(v => v !== null).map((v, i) => (
                        <td key={i} style={{ padding: '5px 12px', textAlign: 'center', ...style }}>
                          {v! >= 0 ? '+' : ''}{Number(v!).toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 10, color: shiftColor, fontWeight: 700 }}>Shift: {shift}</div>
              <div style={{ fontSize: 10, color: '#849495' }}>|x| = {Math.abs(eq.x).toFixed(4)} M</div>
              <div style={{ fontSize: 10, color: '#849495' }}>Kc verified = {Kccheck < 0.001 ? Kccheck.toExponential(2) : Kccheck.toFixed(4)}</div>
            </div>
          </div>

          {/* Perturbation feedback */}
          <AnimatePresence>
            {pertEffect && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ background: `${rxn.color}10`, border: `1px solid ${rxn.color}35`, borderRadius: 10, padding: '8px 14px', borderLeft: `3px solid ${rxn.color}` }}>
                <div style={{ fontSize: 10, color: '#849495', fontWeight: 700, marginBottom: 3 }}>Le Chatelier Principle:</div>
                <div style={{ fontSize: 11, color: '#f8fafc' }}>{pertEffect}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chart */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <div style={{ fontSize: 10, color: '#849495', marginBottom: 4 }}>Concentration vs Time (approach to equilibrium)</div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={timeSeries} margin={{ top: 5, right: 20, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="t" label={{ value: 'Time →', position: 'insideBottom', offset: -16, fill: '#849495', fontSize: 10 }} tick={false} />
                <YAxis tick={{ fill: '#849495', fontSize: 9 }} label={{ value: '[conc] (M)', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#130818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }} formatter={(v: number) => [`${Number(v).toFixed(4)} M`]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {[rxn.nameA, rxn.b > 0 ? rxn.nameB : null, rxn.nameC, rxn.d > 0 ? rxn.nameD : null].filter(Boolean).map(name => (
                  <Line key={name} type="monotone" dataKey={name!} stroke={speciesColors[name!] ?? '#849495'} strokeWidth={2.5} dot={false} name={name!} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: theory */}
        <div style={{ width: 185, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto', fontSize: 9 }}>
          <div style={{ color: rxn.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Equilibrium Laws</div>
          {[
            { title: 'Kc Expression', content: `For aA + bB ⇌ cC + dD:\nKc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ\n\nPure solids and liquids: concentration is constant → excluded from Kc expression`, color: rxn.color },
            { title: 'Kp = Kc × (RT)^Δn', content: `Kp relates partial pressures\nΔn = moles gas products − moles gas reactants\nFor this reaction: Δn = ${rxn.deltaGas}\nR = 0.0821 L·atm/mol·K`, color: '#fbbf24' },
            { title: 'Q vs Kc (Reaction Quotient)', content: 'Q < Kc → reaction goes FORWARD\nQ > Kc → reaction goes REVERSE\nQ = Kc → system AT equilibrium\n\nQ uses any concentrations;\nKc uses equilibrium concentrations', color: '#22c55e' },
            { title: 'Le Chatelier Principle', content: 'A system at equilibrium shifts to oppose any change:\n• Add reactant → shift forward\n• Add product → shift reverse\n• ↑ T exo rxn → shift reverse\n• ↑ T endo rxn → shift forward\n• ↑ P: shift to fewer gas moles\n• Catalyst: no shift, faster rate', color: '#a78bfa' },
            { title: 'ΔG and K', content: 'ΔG° = −RT ln K\nK > 1: ΔG° < 0 (product-favoured)\nK < 1: ΔG° > 0 (reactant-favoured)\nAt equilibrium: ΔG = 0\nΔG = ΔG° + RT ln Q', color: '#ec4899' },
            { title: 'van\'t Hoff Equation', content: 'ln(K₂/K₁) = −ΔH/R × (1/T₂ − 1/T₁)\nExothermic: K↓ as T↑\nEndothermic: K↑ as T↑\nPlot ln K vs 1/T → slope = −ΔH/R', color: '#f97316' },
          ].map(item => (
            <div key={item.title} style={{ marginBottom: 10, padding: '7px 9px', background: `${item.color}08`, border: `1px solid ${item.color}25`, borderRadius: 9 }}>
              <div style={{ color: item.color, fontWeight: 700, marginBottom: 3 }}>{item.title}</div>
              <div style={{ color: '#849495', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
