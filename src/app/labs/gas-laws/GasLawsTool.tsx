'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { solveIdealGas, IdealGasVariable } from '@/lib/gasLaws/idealGas'
import { isothermSweep, percentDeviation, idealPressure, vdwPressure, idealPressureDerivation, vdwPressureDerivation, findDeviationCutoffVolume } from '@/lib/gasLaws/vanDerWaals'
import { VDW_GASES, vdwGasById } from '@/lib/gasLaws/constants'

type Tab = 'ideal' | 'real'

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 8,
        border: `1px solid ${active ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
        background: active ? '#f9731620' : 'rgba(255,255,255,0.03)',
        color: active ? '#f97316' : '#94a3b8',
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function NumberField({ label, value, onChange, unit, disabled }: { label: string; value: string; onChange: (v: string) => void; unit: string; disabled?: boolean }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: disabled ? '#475569' : '#94a3b8', display: 'block', marginBottom: 4 }}>{label} {disabled && '(solving for this)'}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
            color: disabled ? '#475569' : '#f8fafc',
            fontSize: 13,
          }}
        />
        <span style={{ fontSize: 12, color: '#64748b', width: 36 }}>{unit}</span>
      </div>
    </div>
  )
}

function IdealGasCalculator() {
  const [solveFor, setSolveFor] = useState<IdealGasVariable>('P')
  const [P, setP] = useState('1')
  const [V, setV] = useState('22.4')
  const [n, setN] = useState('1')
  const [T, setT] = useState('273.15')

  const result = useMemo(() => {
    try {
      const inputs: Record<IdealGasVariable, number | undefined> = {
        P: solveFor === 'P' ? undefined : Number(P),
        V: solveFor === 'V' ? undefined : Number(V),
        n: solveFor === 'n' ? undefined : Number(n),
        T: solveFor === 'T' ? undefined : Number(T),
      }
      if (Object.entries(inputs).some(([k, v]) => k !== solveFor && (v === undefined || Number.isNaN(v)))) return null
      return solveIdealGas(inputs)
    } catch {
      return null
    }
  }, [solveFor, P, V, n, T])

  const UNIT: Record<IdealGasVariable, string> = { P: 'atm', V: 'L', n: 'mol', T: 'K' }

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 320, flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Solve for</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['P', 'V', 'n', 'T'] as IdealGasVariable[]).map((v) => (
            <ModeButton key={v} active={solveFor === v} onClick={() => setSolveFor(v)}>{v}</ModeButton>
          ))}
        </div>
        <NumberField label="Pressure (P)" value={P} onChange={setP} unit="atm" disabled={solveFor === 'P'} />
        <NumberField label="Volume (V)" value={V} onChange={setV} unit="L" disabled={solveFor === 'V'} />
        <NumberField label="Moles (n)" value={n} onChange={setN} unit="mol" disabled={solveFor === 'n'} />
        <NumberField label="Temperature (T)" value={T} onChange={setT} unit="K" disabled={solveFor === 'T'} />
        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>PV = nRT, R = 0.08206 L·atm/(mol·K). STP here means 273.15 K, 1 atm (the classic US-textbook convention giving 22.4 L/mol).</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ padding: 20, borderRadius: 12, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Solving for {solveFor}</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#f97316' }}>
            {result === null ? '—' : `${result.toFixed(4)} ${UNIT[solveFor]}`}
          </div>
        </div>
      </div>
    </div>
  )
}

const PLOT_W = 560
const PLOT_H = 360
const PAD = 44

interface IsothermPlotProps {
  points: { V: number; idealP: number; vdwP: number | null }[]
  vBound: number
  markerV: number
  markerIdealP: number | null
  markerVdwP: number | null
}

function IsothermPlot({ points, vBound, markerV, markerIdealP, markerVdwP }: IsothermPlotProps) {
  const maxV = Math.max(...points.map((p) => p.V), markerV)
  const maxP = Math.max(...points.map((p) => p.idealP), ...points.filter((p) => p.vdwP !== null).map((p) => p.vdwP as number), markerIdealP ?? 0)
  const x = (v: number) => PAD + (v / maxV) * (PLOT_W - 2 * PAD)
  const y = (p: number) => PLOT_H - PAD - (p / maxP) * (PLOT_H - 2 * PAD)

  const idealPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.V)} ${y(p.idealP)}`).join(' ')
  const vdwPoints = points.filter((p) => p.vdwP !== null)
  const vdwPath = vdwPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.V)} ${y(p.vdwP as number)}`).join(' ')
  const showMarker = markerIdealP !== null && markerVdwP !== null

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width="100%" height="100%">
      <line x1={PAD} y1={PLOT_H - PAD} x2={PLOT_W - PAD} y2={PLOT_H - PAD} stroke="#475569" strokeWidth={1.5} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={PLOT_H - PAD} stroke="#475569" strokeWidth={1.5} />
      <text x={PLOT_W / 2} y={PLOT_H - 8} textAnchor="middle" fontSize={11} fill="#64748b">Volume (L)</text>
      <text x={14} y={PLOT_H / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(-90 14 ${PLOT_H / 2})`}>Pressure (atm)</text>
      <rect x={PAD} y={PAD} width={Math.max(0, x(vBound) - PAD)} height={PLOT_H - 2 * PAD} fill="rgba(239,68,68,0.08)" />
      <path d={idealPath} fill="none" stroke="#22c55e" strokeWidth={2.5} />
      <path d={vdwPath} fill="none" stroke="#a855f7" strokeWidth={2.5} />
      {showMarker && (
        <>
          <line x1={x(markerV)} y1={y(markerIdealP!)} x2={x(markerV)} y2={y(markerVdwP!)} stroke="#f97316" strokeWidth={1.5} strokeDasharray="4,3" />
          <circle cx={x(markerV)} cy={y(markerIdealP!)} r={4.5} fill="#22c55e" stroke="#08020d" strokeWidth={1.5} />
          <circle cx={x(markerV)} cy={y(markerVdwP!)} r={4.5} fill="#a855f7" stroke="#08020d" strokeWidth={1.5} />
        </>
      )}
      <g transform={`translate(${PLOT_W - PAD - 150}, ${PAD + 8})`}>
        <line x1={0} y1={0} x2={20} y2={0} stroke="#22c55e" strokeWidth={2.5} />
        <text x={26} y={4} fontSize={11} fill="#cbd5e1">Ideal gas (PV=nRT)</text>
        <line x1={0} y1={18} x2={20} y2={18} stroke="#a855f7" strokeWidth={2.5} />
        <text x={26} y={22} fontSize={11} fill="#cbd5e1">Van der Waals (real)</text>
        <line x1={0} y1={36} x2={20} y2={36} stroke="#f97316" strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={26} y={40} fontSize={11} fill="#cbd5e1">Your V — the gap</text>
      </g>
    </svg>
  )
}

function DerivationCard({ title, color, formula, substitution, simplified, result }: { title: string; color: string; formula: string; substitution: string; simplified?: string; result: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 10, background: `${color}0a`, border: `1px solid ${color}40` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, fontFamily: 'monospace' }}>{formula}</div>
      <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: simplified ? 6 : 0, fontFamily: 'monospace' }}>{substitution}</div>
      {simplified && <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6, fontFamily: 'monospace' }}>{simplified}</div>}
      <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'monospace', marginTop: 8 }}>{result}</div>
    </div>
  )
}

function RealGasComparison() {
  const [gasId, setGasId] = useState('co2')
  const [n, setN] = useState('1')
  const [T, setT] = useState('273.15')
  const [V, setV] = useState('1')

  const gas = vdwGasById(gasId)
  // Clamped strictly positive: a zero/negative n, T, or V (typed directly, or reached via the
  // number-input spinner going below 0) makes vBound = n·b zero or negative, which breaks the very
  // first probe point inside findDeviationCutoffVolume before its own loop ever gets a chance to react.
  const nNum = Math.max(Number(n) || 1, 1e-6)
  const tNum = Math.max(Number(T) || 1, 1e-6)
  const vNum = Math.max(Number(V) || 1, 1e-6)
  const vBound = nNum * gas.b

  const volumes = useMemo(() => {
    // candidateLo stays a comfortable distance from the excluded-volume asymptote (where P shoots
    // toward infinity for BOTH models) — right at the asymptote, that runaway spike would dominate the
    // y-axis scale and squash the actually-interesting, finite deviation region down to invisibility.
    // lo is then pulled in further (but never past the asymptote guard) so the user's own V is always
    // inside the plotted window, not off the left edge.
    const cutoff = findDeviationCutoffVolume(nNum, tNum, gas, 0.5)
    const candidateLo = Math.max(vBound * 1.3, cutoff / 8)
    const lo = Math.max(vBound * 1.05, Math.min(candidateLo, vNum * 0.8))
    const hi = Math.max(cutoff, lo * 3, vNum * 1.3)
    return Array.from({ length: 80 }, (_, i) => lo + ((hi - lo) * i) / 79)
  }, [nNum, tNum, gas, vBound, vNum])

  const points = useMemo(() => isothermSweep(nNum, tNum, gas, volumes), [nNum, tNum, gas, volumes])

  const deviation = vNum > vBound ? percentDeviation(nNum, vNum, tNum, gas) : null
  const pIdeal = vNum > 0 ? idealPressure(nNum, vNum, tNum) : null
  const pVdw = vNum > vBound ? vdwPressure(nNum, vNum, tNum, gas) : null

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 300, flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Gas</div>
        <select
          value={gasId}
          onChange={(e) => setGasId(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 12, marginBottom: 4 }}
        >
          {VDW_GASES.map((g) => (
            <option key={g.id} value={g.id} style={{ background: '#1a1f2f' }}>{g.label}</option>
          ))}
        </select>
        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 16 }}>a = {gas.a} L²·atm/mol² (attraction) · b = {gas.b} L/mol (excluded volume)</div>

        <NumberField label="Moles (n)" value={n} onChange={setN} unit="mol" />
        <NumberField label="Temperature (T)" value={T} onChange={setT} unit="K" />
        <NumberField label="Volume (V)" value={V} onChange={setV} unit="L" />
        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6, marginTop: 8 }}>
          The shaded red region marks V ≤ n·b, where the gas's own molecules would need negative free
          volume — the van der Waals equation breaks down there (not drawn).
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ height: 360, marginBottom: 16 }}>
          <IsothermPlot points={points} vBound={vBound} markerV={vNum} markerIdealP={pIdeal} markerVdwP={pVdw} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ fontSize: 10, color: '#86efac' }}>Ideal P at this V</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>{pIdeal !== null ? `${pIdeal.toFixed(3)} atm` : '—'}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
            <div style={{ fontSize: 10, color: '#d8b4fe' }}>Van der Waals P</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#a855f7' }}>{pVdw !== null ? `${pVdw.toFixed(3)} atm` : 'invalid (V ≤ n·b)'}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: 10, color: '#fca5a5' }}>Deviation from ideal</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>{deviation !== null ? `${deviation.toFixed(2)}%` : '—'}</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, marginTop: 12, marginBottom: 16 }}>
          {deviation !== null && deviation < 0
            ? 'Negative deviation: intermolecular ATTRACTION (the a term) dominates — real molecules pull on each other right as they\'re about to strike the wall, so the real pressure is LOWER than ideal predicts.'
            : deviation !== null && deviation > 0
            ? 'Positive deviation: EXCLUDED VOLUME (the b term) dominates — the molecules themselves take up enough of the container that there\'s less free room to move, so the real pressure is HIGHER than ideal predicts.'
            : 'At low density (large V), both correction terms vanish and the real gas behaves essentially ideally.'}
        </div>

        {vNum > 0 && (
          <>
            <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step-by-step calculation</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <DerivationCard title="Ideal gas law" color="#22c55e" {...idealPressureDerivation(nNum, vNum, tNum)} />
              {vNum > vBound ? (
                <DerivationCard title="Van der Waals (real gas)" color="#a855f7" {...vdwPressureDerivation(nNum, vNum, tNum, gas)} />
              ) : (
                <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: '#64748b' }}>
                  Van der Waals is undefined here — V must exceed n·b ({(nNum * gas.b).toFixed(4)} L).
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function GasLawsPage() {
  const [tab, setTab] = useState<Tab>('ideal')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Gas Laws — Ideal Gas Law &amp; Van der Waals Real-Gas Comparison</strong>
      </div>
      <div style={{ padding: 24, maxWidth: 980 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <ModeButton active={tab === 'ideal'} onClick={() => setTab('ideal')}>Ideal Gas Law Calculator</ModeButton>
          <ModeButton active={tab === 'real'} onClick={() => setTab('real')}>Real Gas (Van der Waals) Comparison</ModeButton>
        </div>
        {tab === 'ideal' ? <IdealGasCalculator /> : <RealGasComparison />}
      </div>
    </div>
  )
}
