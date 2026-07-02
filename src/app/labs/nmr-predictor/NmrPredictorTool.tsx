'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { predictSpectrum } from '@/lib/nmrPredictor/core'
import { NMR_MOLECULES, nmrMoleculeById } from '@/lib/nmrPredictor/molecules'

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 10px',
        borderRadius: 8,
        border: `1px solid ${active ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
        background: active ? '#f9731620' : 'rgba(255,255,255,0.03)',
        color: active ? '#f97316' : '#94a3b8',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
      }}
    >
      {children}
    </button>
  )
}

const PLOT_W = 640
const PLOT_H = 220
const PAD_L = 30
const PAD_R = 30
const PPM_MAX = 12
const PPM_MIN = 0

function ppmToX(ppm: number): number {
  return PAD_L + ((PPM_MAX - ppm) / (PPM_MAX - PPM_MIN)) * (PLOT_W - PAD_L - PAD_R)
}

const SIGNAL_COLORS = ['#06b6d4', '#f97316', '#22c55e', '#a855f7', '#ef4444', '#eab308']

function Spectrum({ signals }: { signals: ReturnType<typeof predictSpectrum> }) {
  return (
    <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width="100%" height="100%">
      <line x1={PAD_L} y1={PLOT_H - 30} x2={PLOT_W - PAD_R} y2={PLOT_H - 30} stroke="#475569" strokeWidth={1.5} />
      {Array.from({ length: 13 }, (_, i) => i).map((ppm) => (
        <g key={ppm}>
          <line x1={ppmToX(ppm)} y1={PLOT_H - 30} x2={ppmToX(ppm)} y2={PLOT_H - 26} stroke="#475569" strokeWidth={1} />
          <text x={ppmToX(ppm)} y={PLOT_H - 12} textAnchor="middle" fontSize={10} fill="#64748b">{ppm}</text>
        </g>
      ))}
      <text x={PLOT_W / 2} y={PLOT_H - 0} textAnchor="middle" fontSize={11} fill="#94a3b8">δ (ppm)</text>

      {signals.map((s, i) => {
        const color = SIGNAL_COLORS[i % SIGNAL_COLORS.length]
        const cx = ppmToX(s.shiftPpm)
        const peakHeight = 24 + s.integration * 10
        const peakGap = 5
        const n = s.peakCount > 6 ? 5 : s.peakCount
        const startX = cx - ((n - 1) * peakGap) / 2
        return (
          <g key={i}>
            {Array.from({ length: n }, (_, j) => {
              const x = startX + j * peakGap
              const jitter = [0.7, 1, 0.85, 0.6, 0.95][j % 5]
              const h = s.multiplicity === 'multiplet' ? peakHeight * jitter : peakHeight
              return <line key={j} x1={x} y1={PLOT_H - 30} x2={x} y2={PLOT_H - 30 - h} stroke={color} strokeWidth={2} />
            })}
            <text x={cx} y={PLOT_H - 34 - peakHeight} textAnchor="middle" fontSize={10} fill={color} fontWeight={700}>{s.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function NmrPredictorPage() {
  const [moleculeId, setMoleculeId] = useState('ethanol')
  const molecule = nmrMoleculeById(moleculeId)
  const signals = useMemo(() => predictSpectrum(molecule), [molecule])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>¹H NMR Spectrum Predictor (Basic)</strong>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 16 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Molecule</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {NMR_MOLECULES.map((m) => (
              <ModeButton key={m.id} active={moleculeId === m.id} onClick={() => setMoleculeId(m.id)}>
                {m.name}
                <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>{m.formula}</div>
              </ModeButton>
            ))}
          </div>
          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
            This covers a curated set of classic intro-organic molecules whose spectra are
            well-established teaching examples — it doesn't parse arbitrary drawn structures or predict
            aromatic substitution/vinyl coupling patterns.
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>{molecule.name} ({molecule.formula}) — {molecule.totalH} total H, {signals.length} signal{signals.length > 1 ? 's' : ''}</div>
          <div style={{ height: 240, marginBottom: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <Spectrum signals={signals} />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Signal', 'Shift (ppm)', 'Integration', 'Multiplicity', 'Why'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#f97316', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signals.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 700, color: SIGNAL_COLORS[i % SIGNAL_COLORS.length] }}>{s.label}</td>
                  <td style={{ padding: '8px 10px' }}>{s.shiftPpm.toFixed(1)}</td>
                  <td style={{ padding: '8px 10px' }}>{s.integration}H</td>
                  <td style={{ padding: '8px 10px', textTransform: 'capitalize' }}>{s.multiplicity}{s.multiplicity !== 'multiplet' && s.multiplicity !== 'singlet' ? ` (${s.peakCount} peaks)` : ''}</td>
                  <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{s.assignment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
