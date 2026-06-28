'use client'
import Link from 'next/link'
import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Dot } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

// ── Full PhET-style Titration Simulator ───────────────────────
// Real pH calculations for all titration types with live S-curve

interface TitrationConfig {
  id: string; name: string; color: string
  analyteLabel: string; titrantLabel: string
  analyteMolar: number; titrantMolar: number
  analyteVol: number  // mL
  Ka?: number; Kb?: number  // acid/base dissociation constants
  pHStart: number  // approximate starting pH
  epIndicator: string; epColor: string
  description: string
}

const CONFIGS: TitrationConfig[] = [
  {
    id: 'sa-sb', name: 'Strong Acid + Strong Base (NaOH vs HCl)',
    color: '#06b6d4', analyteLabel: 'HCl', titrantLabel: 'NaOH',
    analyteMolar: 0.1, titrantMolar: 0.1, analyteVol: 25,
    pHStart: 1.0, epIndicator: 'Phenolphthalein (8.2–10)', epColor: '#ec4899',
    description: 'Sharpest equivalence point. pH jumps ≈4→10 over 0.05 mL near EP.',
  },
  {
    id: 'wa-sb', name: 'Weak Acid + Strong Base (NaOH vs CH₃COOH)',
    color: '#f97316', analyteLabel: 'CH₃COOH', titrantLabel: 'NaOH',
    analyteMolar: 0.1, titrantMolar: 0.1, analyteVol: 25, Ka: 1.8e-5,
    pHStart: 2.87, epIndicator: 'Phenolphthalein (8.2–10)', epColor: '#ec4899',
    description: 'Buffer region before EP. EP pH > 7 (acetate is basic). Half-EP: pH = pKa = 4.74.',
  },
  {
    id: 'sa-wb', name: 'Strong Acid + Weak Base (HCl vs NH₃)',
    color: '#a78bfa', analyteLabel: 'NH₃', titrantLabel: 'HCl',
    analyteMolar: 0.1, titrantMolar: 0.1, analyteVol: 25, Kb: 1.8e-5,
    pHStart: 11.13, epIndicator: 'Methyl Orange (3.1–4.4)', epColor: '#f97316',
    description: 'EP pH < 7 (ammonium is acidic). Methyl orange indicator. Half-EP: pOH = pKb.',
  },
  {
    id: 'wa-wb', name: 'Weak Acid + Weak Base',
    color: '#22c55e', analyteLabel: 'CH₃COOH', titrantLabel: 'NH₃',
    analyteMolar: 0.1, titrantMolar: 0.1, analyteVol: 25, Ka: 1.8e-5, Kb: 1.8e-5,
    pHStart: 2.87, epIndicator: 'No sharp EP — mixed indicator', epColor: '#fbbf24',
    description: 'No sharp equivalence jump. EP pH ≈ 7 + ½(pKa − pKb). Difficult to titrate precisely.',
  },
]

// Real pH calculations
function calcPH(config: TitrationConfig, volAdded: number): number {
  const { analyteMolar: Ca, titrantMolar: Cb, analyteVol: Va, Ka, Kb } = config
  const nA = Ca * Va / 1000 // mol analyte
  const nB = Cb * volAdded / 1000 // mol titrant
  const Vtotal = (Va + volAdded) / 1000 // L

  if (config.id === 'sa-sb') {
    // Strong acid titrated by strong base
    if (nB < nA) { const H = (nA - nB) / Vtotal; return -Math.log10(H) }
    if (Math.abs(nB - nA) < 1e-8) return 7.0
    const OH = (nB - nA) / Vtotal
    return 14 + Math.log10(OH)
  }

  if (config.id === 'wa-sb' && Ka) {
    // Weak acid titrated by strong base
    if (nB < nA) {
      const nHA = (nA - nB) / Vtotal
      const nA_ = nB / Vtotal
      if (nA_ < 1e-9) {
        // Before any titrant: pH of weak acid
        const H = Math.sqrt(Ka * Ca)
        return -Math.log10(H)
      }
      // Henderson-Hasselbalch (buffer)
      return -Math.log10(Ka) + Math.log10(nA_ / nHA)
    }
    if (Math.abs(nB - nA) < 1e-8) {
      // EP: hydrolysis of conjugate base
      const Cb_ = nA / Vtotal
      const Kb_ = 1e-14 / Ka
      const OH = Math.sqrt(Kb_ * Cb_)
      return 14 + Math.log10(OH)
    }
    const OH = (nB - nA) / Vtotal
    return 14 + Math.log10(OH)
  }

  if (config.id === 'sa-wb' && Kb) {
    // Weak base (NH₃) titrated by strong acid (HCl)
    if (nB < nA) {
      const nB_ = (nA - nB) / Vtotal // excess acid = NH4+ effectively
      const nBH = nB / Vtotal
      // after all base consumed, it's just strong acid
      const Ka_ = 1e-14 / Kb
      if (nBH < 1e-9) {
        const OH = Math.sqrt(Kb * Cb)
        return 14 + Math.log10(OH)
      }
      // Buffer: pOH = pKb + log[BH+]/[B]
      const pOH = -Math.log10(Kb) + Math.log10(nBH / (nA - nB))
      return 14 - pOH
    }
    if (Math.abs(nB - nA) < 1e-8) {
      // EP: hydrolysis of NH4+
      const Ca_ = nA / Vtotal
      const Ka_ = 1e-14 / Kb
      const H = Math.sqrt(Ka_ * Ca_)
      return -Math.log10(H)
    }
    const H = (nB - nA) / Vtotal
    return -Math.log10(H)
  }

  if (config.id === 'wa-wb' && Ka && Kb) {
    // Weak acid + weak base: approximate
    if (nB < nA - 0.001) {
      const r = nB / (nA - nB)
      return -Math.log10(Ka) + Math.log10(r)
    }
    if (nB > nA + 0.001) {
      const r = (nB - nA) / nA
      return 14 + Math.log10(Kb) + Math.log10(1 / (1 + r))
    }
    // EP: pH ≈ 7 + ½(pKa − pKb)
    return 7 + 0.5 * (Math.log10(1 / Ka) - Math.log10(1 / Kb))
  }

  return 7
}

// Indicator colour at given pH
function indicatorColor(pH: number): string {
  if (pH < 4.4) return '#ef4444'   // red (acidic)
  if (pH < 7)   return '#f97316'   // orange
  if (pH < 8.2) return '#fbbf24'   // yellow/green
  if (pH < 10)  return '#ec4899'   // pink (phenolphthalein)
  return '#a78bfa'                  // purple (very basic)
}

// Build full S-curve data
function buildCurve(config: TitrationConfig, maxVol: number) {
  const epVol = config.analyteMolar * config.analyteVol / config.titrantMolar
  const points: { vol: number; pH: number }[] = []
  // Dense points near EP
  for (let v = 0; v <= maxVol; v += maxVol > 60 ? 0.5 : 0.25) {
    const pH = Math.max(0, Math.min(14, calcPH(config, v)))
    points.push({ vol: +v.toFixed(2), pH: +pH.toFixed(4) })
  }
  return { points, epVol }
}

export default function TitrationSimulator() {
  const [configId, setConfigId] = useState('sa-sb')
  const [volAdded, setVolAdded] = useState(0)
  const [animRunning, setAnimRunning] = useState(false)
  const [showIndicator, setShowIndicator] = useState(true)
  const animRef = useRef<ReturnType<typeof setInterval>>()

  const config = CONFIGS.find(c => c.id === configId)!
  const maxVol = config.analyteMolar * config.analyteVol / config.titrantMolar * 2.2

  const { points: curveData, epVol } = useMemo(() => buildCurve(config, maxVol), [configId])
  const currentPH = useMemo(() => Math.max(0, Math.min(14, calcPH(config, volAdded))), [configId, volAdded])
  const indColor = indicatorColor(currentPH)

  const next = useCallback(() => {
    setVolAdded(v => {
      const nv = +(v + 0.25).toFixed(2)
      if (nv >= maxVol) { setAnimRunning(false); return maxVol }
      return nv
    })
  }, [maxVol])

  useEffect(() => {
    clearInterval(animRef.current)
    if (!animRunning) return
    animRef.current = setInterval(next, 80)
    return () => clearInterval(animRef.current)
  }, [animRunning, next])

  useEffect(() => { setVolAdded(0); setAnimRunning(false) }, [configId])

  const pctComplete = Math.min(100, volAdded / epVol * 100)
  const passedEP = volAdded > epVol * 1.01

  // Buffer region for weak acid/base
  const halfEPVol = epVol / 2
  const atHalfEP = Math.abs(volAdded - halfEPVol) < 0.5

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Titration Simulator — Real S-Curve with Equivalence Point Detection</strong>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button onClick={() => { setVolAdded(0); setAnimRunning(false) }}
            style={{ padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#849495', fontSize: 11, cursor: 'pointer' }}>⟳ Reset</button>
          <button onClick={() => setAnimRunning(p => !p)}
            style={{ padding: '3px 12px', borderRadius: 20, border: `1px solid ${config.color}50`, background: animRunning ? `${config.color}25` : 'transparent', color: config.color, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            {animRunning ? '⏸ Pause' : '▶ Auto-Titrate'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: config + controls */}
        <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Titration Type</div>
          {CONFIGS.map(c => (
            <button key={c.id} onClick={() => setConfigId(c.id)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 9, marginBottom: 5, border: `1px solid ${configId === c.id ? c.color + '60' : 'rgba(255,255,255,0.06)'}`, background: configId === c.id ? c.color + '12' : 'rgba(255,255,255,0.02)', color: configId === c.id ? c.color : '#849495', fontSize: 9, cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontSize: 10 }}>{c.analyteLabel} vs {c.titrantLabel}</div>
              <div style={{ opacity: 0.7, marginTop: 2 }}>{c.name.split('(')[0].trim()}</div>
            </button>
          ))}

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 14, marginBottom: 8 }}>Burette Control</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 10, color: '#849495' }}>
            <span>Added: {volAdded.toFixed(2)} mL</span>
            <span>Max: {maxVol.toFixed(1)} mL</span>
          </div>
          <input type="range" min={0} max={maxVol} step={0.05} value={volAdded}
            onChange={e => { setVolAdded(+e.target.value); setAnimRunning(false) }}
            style={{ width: '100%', accentColor: config.color }} />

          {/* Drop-by-drop buttons */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[0.1, 0.5, 1.0].map(drop => (
              <button key={drop} onClick={() => setVolAdded(v => Math.min(maxVol, +(v + drop).toFixed(2)))}
                style={{ flex: 1, padding: '5px 0', borderRadius: 8, border: `1px solid ${config.color}40`, background: 'transparent', color: config.color, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>
                +{drop}
              </button>
            ))}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 11, color: '#849495', cursor: 'pointer' }}>
            <input type="checkbox" checked={showIndicator} onChange={e => setShowIndicator(e.target.checked)} style={{ accentColor: config.color }} />
            Show indicator colour
          </label>

          {/* Acid-base info */}
          <div style={{ marginTop: 14, background: `${config.color}08`, border: `1px solid ${config.color}25`, borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: config.color, fontWeight: 700, marginBottom: 4 }}>Setup</div>
            {[
              { label: 'Analyte', val: `${config.analyteVol} mL ${config.analyteMolar}M ${config.analyteLabel}` },
              { label: 'Titrant', val: `${config.titrantMolar}M ${config.titrantLabel}` },
              { label: 'EP vol', val: `${epVol.toFixed(2)} mL` },
              { label: 'EP pH', val: calcPH(config, epVol).toFixed(2) },
              { label: 'Indicator', val: config.epIndicator },
              ...(config.Ka ? [{ label: 'Ka', val: config.Ka.toExponential(2) }, { label: 'pKa', val: (-Math.log10(config.Ka)).toFixed(2) }] : []),
              ...(config.Kb ? [{ label: 'Kb', val: config.Kb.toExponential(2) }, { label: 'pKb', val: (-Math.log10(config.Kb)).toFixed(2) }] : []),
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#849495', marginBottom: 3 }}>
                <span>{item.label}:</span><span style={{ color: '#f8fafc', fontFamily: 'monospace' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 14, overflow: 'hidden', gap: 10 }}>
          {/* Live pH + flask visualization */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'stretch' }}>
            {/* Big pH display */}
            <div style={{ background: 'rgba(26,31,47,0.9)', border: `1px solid ${config.color}40`, borderRadius: 14, padding: '14px 20px', textAlign: 'center', minWidth: 140, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 9, color: '#849495', marginBottom: 4 }}>Current pH</div>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: 'monospace', color: currentPH < 7 ? '#ef4444' : currentPH > 7 ? '#06b6d4' : '#22c55e', lineHeight: 1 }}>{currentPH.toFixed(2)}</div>
              <div style={{ fontSize: 10, color: '#849495', marginTop: 6 }}>{currentPH < 3 ? 'Strongly acidic' : currentPH < 7 ? 'Acidic' : currentPH === 7 ? 'Neutral' : currentPH < 11 ? 'Basic' : 'Strongly basic'}</div>
              <div style={{ fontSize: 9, color: '#849495', marginTop: 4 }}>Vol: {volAdded.toFixed(2)} mL</div>
            </div>

            {/* Flask visualisation */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: 100 }}>
              <svg viewBox="0 0 80 120" width={80} height={120}>
                {/* Flask body */}
                <path d="M 28 20 L 28 60 L 10 105 L 70 105 L 52 60 L 52 20 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                {/* Liquid fill */}
                <clipPath id="flask-clip">
                  <path d="M 28 20 L 28 60 L 10 105 L 70 105 L 52 60 L 52 20 Z" />
                </clipPath>
                <rect x={0} y={105 - Math.min(90, pctComplete * 0.7)} width={80} height={100}
                  fill={showIndicator ? indColor : config.color} opacity={0.7} clipPath="url(#flask-clip)" />
                {/* Neck */}
                <rect x={26} y={8} width={28} height={14} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                {/* Drops animation */}
                {animRunning && (
                  <motion.circle cx={40} cy={6} r={2} fill={showIndicator ? indColor : config.color}
                    animate={{ cy: [6, 24] }} transition={{ duration: 0.15, repeat: Infinity, ease: 'easeIn' }} />
                )}
              </svg>
              <div style={{ fontSize: 9, color: '#849495', textAlign: 'center', marginTop: 4 }}>{pctComplete.toFixed(0)}% to EP</div>
              {showIndicator && <div style={{ width: 20, height: 20, borderRadius: '50%', background: indColor, marginTop: 6, boxShadow: `0 0 10px ${indColor}70` }} />}
            </div>

            {/* EP / status */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AnimatePresence>
                {Math.abs(volAdded - epVol) < 0.5 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ background: '#22c55e18', border: '2px solid #22c55e', borderRadius: 12, padding: '8px 14px' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#22c55e' }}>⚡ EQUIVALENCE POINT!</div>
                    <div style={{ fontSize: 10, color: '#849495', marginTop: 2 }}>Volume = {volAdded.toFixed(2)} mL · pH = {currentPH.toFixed(2)}</div>
                    <div style={{ fontSize: 9, color: '#849495', marginTop: 2 }}>{config.epIndicator}</div>
                  </motion.div>
                )}
              </AnimatePresence>
              {atHalfEP && config.Ka && (
                <div style={{ background: '#f9731618', border: '1px solid #f97316', borderRadius: 10, padding: '7px 12px', fontSize: 10 }}>
                  <span style={{ color: '#f97316', fontWeight: 700 }}>Half-EP:</span> <span style={{ color: '#f8fafc' }}>pH = pKa = {(-Math.log10(config.Ka)).toFixed(2)}</span>
                  <div style={{ fontSize: 9, color: '#849495' }}>Henderson-Hasselbalch: [HA] = [A⁻], so pH = pKa</div>
                </div>
              )}
              {passedEP && (
                <div style={{ background: '#a78bfa15', border: '1px solid #a78bfa40', borderRadius: 10, padding: '7px 12px', fontSize: 10 }}>
                  <span style={{ color: '#a78bfa', fontWeight: 700 }}>Past EP:</span> <span style={{ color: '#849495' }}>{(volAdded - epVol).toFixed(2)} mL excess titrant</span>
                </div>
              )}
              <div style={{ background: 'rgba(26,31,47,0.8)', borderRadius: 10, padding: '8px 12px', fontSize: 10 }}>
                <div style={{ color: '#849495', fontSize: 9, marginBottom: 4 }}>Description</div>
                <div style={{ color: '#f8fafc' }}>{config.description}</div>
              </div>
            </div>

            {/* Burette */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
              <div style={{ fontSize: 9, color: '#849495', marginBottom: 4 }}>Burette</div>
              <svg viewBox="0 0 40 160" width={40} height={160}>
                <rect x={15} y={0} width={10} height={140} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} rx={2} />
                {/* Titrant level */}
                <rect x={15} y={0} width={10} height={Math.max(0, 140 - (volAdded / maxVol) * 140)}
                  fill={config.color} opacity={0.7} rx={2} />
                {/* Scale marks */}
                {[0, 25, 50, 75, 100].map(pct => (
                  <g key={pct}>
                    <line x1={8} y1={140 - pct * 1.4} x2={15} y2={140 - pct * 1.4} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                    <text x={7} y={143 - pct * 1.4} fill="#849495" fontSize={5} textAnchor="end">{Math.round(pct * maxVol / 100)}</text>
                  </g>
                ))}
                <polygon points="18,141 22,141 20,148" fill={config.color} />
              </svg>
            </div>
          </div>

          {/* S-curve chart */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <div style={{ fontSize: 10, color: '#849495', marginBottom: 4 }}>Titration Curve (pH vs Volume of Titrant added)</div>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={curveData} margin={{ top: 5, right: 20, left: 5, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="vol" type="number" domain={[0, maxVol]}
                  label={{ value: `Volume ${config.titrantLabel} added (mL)`, position: 'insideBottom', offset: -16, fill: '#849495', fontSize: 10 }}
                  tick={{ fill: '#849495', fontSize: 9 }} />
                <YAxis domain={[0, 14]} ticks={[0, 2, 4, 7, 10, 12, 14]}
                  tick={{ fill: '#849495', fontSize: 9 }}
                  label={{ value: 'pH', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#130818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }}
                  formatter={(v: number) => [v.toFixed(4), 'pH']}
                  labelFormatter={(v: number) => `Vol = ${Number(v).toFixed(2)} mL`} />
                {/* pH=7 neutral line */}
                <ReferenceLine y={7} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 2" />
                {/* Equivalence point */}
                <ReferenceLine x={epVol} stroke="#22c55e" strokeDasharray="5 3" label={{ value: 'EP', position: 'top', fill: '#22c55e', fontSize: 10 }} />
                {/* Half-EP for weak acid */}
                {config.Ka && <ReferenceLine x={halfEPVol} stroke="#f97316" strokeDasharray="3 3" label={{ value: '½EP', position: 'top', fill: '#f97316', fontSize: 9 }} />}
                {/* Current position */}
                <ReferenceLine x={volAdded} stroke="rgba(255,255,255,0.5)" strokeDasharray="2 2" />
                <Line type="monotone" dataKey="pH" stroke={config.color} strokeWidth={2.5} dot={false} />
                {/* Current point dot */}
                <ReferenceLine x={volAdded} y={currentPH} stroke="transparent">
                  <Dot cx={volAdded} cy={currentPH} r={6} fill="#fff" stroke={config.color} strokeWidth={2} />
                </ReferenceLine>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 185, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto', fontSize: 9 }}>
          <div style={{ color: config.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Titration Theory</div>
          {[
            { title: 'pH Formulas', content: 'Strong acid: pH = −log[H⁺]\nWeak acid: pH = ½(pKa − log Ca)\nBuffer (H-H): pH = pKa + log([A⁻]/[HA])\nSalt of WA+SB: pH = 7 + ½pKa\nSalt of SA+WB: pH = 7 − ½pKb', color: config.color },
            { title: 'Equivalence Point', content: 'SA + SB: pH = 7 exactly\nWA + SB: pH > 7 (conjugate base hydrolysis)\nSA + WB: pH < 7 (conjugate acid hydrolysis)\nWA + WB: pH ≈ 7 + ½(pKa − pKb)', color: '#22c55e' },
            { title: 'Half-Equivalence Point', content: 'At ½ EP for WA + SB:\n[HA] = [A⁻]\n∴ pH = pKa (simplest!)\n\nFor SA + WB:\npOH = pKb\n∴ pH = 14 − pKb', color: '#f97316' },
            { title: 'Indicators', content: 'Phenolphthalein: 8.2–10 (colourless→pink)\nMethyl orange: 3.1–4.4 (red→yellow)\nMethyl red: 4.4–6.2\nBromothymol blue: 6.0–7.6\nUniversal: full pH range', color: '#a78bfa' },
            { title: 'Buffer Capacity', content: 'Maximum buffer capacity at pH = pKa\n(equal moles HA and A⁻)\nBuffer range: pKa ± 1\nChoose buffer whose pKa ≈ desired pH', color: '#fbbf24' },
            { title: 'Degree of Hydrolysis', content: 'h = √(Kh/C)\nKh = Kw/Ka (for anion)\nKh = Kw/Kb (for cation)\nHigher Kh → more hydrolysis → greater pH shift from 7', color: '#ec4899' },
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
