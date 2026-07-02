'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { solvePhotoelectric, thresholdWavelengthNm, keVsFrequencySweep, wavelengthToFrequencyHz, photoelectricDerivation } from '@/lib/photoelectric/core'
import { METALS, metalById } from '@/lib/photoelectric/constants'

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        border: `1px solid ${active ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
        background: active ? '#f9731620' : 'rgba(255,255,255,0.03)',
        color: active ? '#f97316' : '#94a3b8',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function NumberField({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 13 }}
        />
        <span style={{ fontSize: 12, color: '#64748b', width: 30 }}>{unit}</span>
      </div>
    </div>
  )
}

const PRESET_WAVELENGTHS = [
  { label: 'UV-C (250 nm)', nm: 250 },
  { label: 'Violet (410 nm)', nm: 410 },
  { label: 'Blue (470 nm)', nm: 470 },
  { label: 'Green (530 nm)', nm: 530 },
  { label: 'Yellow (580 nm)', nm: 580 },
  { label: 'Red (650 nm)', nm: 650 },
  { label: 'Near-IR (850 nm)', nm: 850 },
]

const PLOT_W = 560
const PLOT_H = 300
const PAD = 48

function EinsteinPlot({ points, workFunctionEV, markerFreq, markerKe }: {
  points: { frequencyHz: number; keEV: number | null }[]
  workFunctionEV: number
  markerFreq: number
  markerKe: number | null
}) {
  const f0 = wavelengthToFrequencyHz(thresholdWavelengthNm(workFunctionEV))
  const maxF = Math.max(...points.map((p) => p.frequencyHz), markerFreq)
  const maxKe = Math.max(...points.filter((p) => p.keEV !== null).map((p) => p.keEV as number), markerKe ?? 0, 0.1)
  const x = (f: number) => PAD + (f / maxF) * (PLOT_W - 2 * PAD)
  const y = (ke: number) => PLOT_H - PAD - (ke / maxKe) * (PLOT_H - 2 * PAD)
  const zeroY = y(0)

  const emittingPoints = points.filter((p) => p.keEV !== null)
  const path = emittingPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.frequencyHz)} ${y(p.keEV as number)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width="100%" height="100%">
      <rect x={PAD} y={PAD} width={Math.max(0, x(f0) - PAD)} height={PLOT_H - 2 * PAD} fill="rgba(239,68,68,0.06)" />
      <line x1={PAD} y1={zeroY} x2={PLOT_W - PAD} y2={zeroY} stroke="#475569" strokeWidth={1.5} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={PLOT_H - PAD} stroke="#475569" strokeWidth={1.5} />
      <line x1={x(f0)} y1={PAD} x2={x(f0)} y2={zeroY} stroke="#ef4444" strokeWidth={1} strokeDasharray="4,3" />
      <text x={PLOT_W / 2} y={PLOT_H - 6} textAnchor="middle" fontSize={11} fill="#64748b">Frequency (Hz)</text>
      <text x={14} y={PLOT_H / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(-90 14 ${PLOT_H / 2})`}>KE_max (eV)</text>
      <path d={path} fill="none" stroke="#06b6d4" strokeWidth={2.5} />
      {markerKe !== null && (
        <circle cx={x(markerFreq)} cy={y(markerKe)} r={5} fill="#f97316" stroke="#08020d" strokeWidth={1.5} />
      )}
      {markerKe === null && (
        <circle cx={x(markerFreq)} cy={zeroY} r={5} fill="#475569" stroke="#08020d" strokeWidth={1.5} />
      )}
      <text x={PAD + 4} y={PAD + 12} fontSize={10} fill="#06b6d4">slope = h, x-intercept = f₀ = φ/h</text>
    </svg>
  )
}

export default function PhotoelectricEffectPage() {
  const [metalId, setMetalId] = useState('sodium')
  const [customPhi, setCustomPhi] = useState<string | null>(null)
  const [wavelength, setWavelength] = useState('400')

  const metal = metalById(metalId)
  const workFunctionEV = customPhi !== null && customPhi !== '' ? Number(customPhi) || metal.workFunctionEV : metal.workFunctionEV
  const lambdaNum = Math.max(Number(wavelength) || 1, 1)

  const result = useMemo(() => solvePhotoelectric(lambdaNum, workFunctionEV), [lambdaNum, workFunctionEV])
  const threshold = useMemo(() => thresholdWavelengthNm(workFunctionEV), [workFunctionEV])
  const derivation = useMemo(() => photoelectricDerivation(lambdaNum, workFunctionEV), [lambdaNum, workFunctionEV])

  const sweepWavelengths = useMemo(() => {
    const lo = Math.max(threshold * 0.3, 50)
    const hi = threshold * 2.5
    return Array.from({ length: 60 }, (_, i) => lo + ((hi - lo) * i) / 59)
  }, [threshold])
  const points = useMemo(() => keVsFrequencySweep(sweepWavelengths, workFunctionEV), [sweepWavelengths, workFunctionEV])
  const markerFreq = wavelengthToFrequencyHz(lambdaNum)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Photoelectric Effect — Einstein's Equation Simulator</strong>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 16 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Metal (work function φ)</div>
          <select
            value={metalId}
            onChange={(e) => { setMetalId(e.target.value); setCustomPhi(null) }}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 12, marginBottom: 8 }}
          >
            {METALS.map((m) => (
              <option key={m.id} value={m.id} style={{ background: '#1a1f2f' }}>{m.label} — φ={m.workFunctionEV} eV</option>
            ))}
          </select>
          <NumberField label="Or override φ directly" value={customPhi ?? String(metal.workFunctionEV)} onChange={setCustomPhi} unit="eV" />

          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, marginTop: 16 }}>Incident light wavelength</div>
          <NumberField label="Wavelength (λ)" value={wavelength} onChange={setWavelength} unit="nm" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {PRESET_WAVELENGTHS.map((p) => (
              <ModeButton key={p.label} active={Number(wavelength) === p.nm} onClick={() => setWavelength(String(p.nm))}>{p.label}</ModeButton>
            ))}
          </div>

          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
            Increasing the light's <strong>intensity</strong> increases the number of photoelectrons
            (current), not their individual kinetic energy — that's the result classical wave theory
            couldn't explain, and Einstein's photon picture does.
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: result.emits ? 'rgba(6,182,212,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${result.emits ? 'rgba(6,182,212,0.3)' : 'rgba(239,68,68,0.3)'}`,
              marginBottom: 20,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {result.emits
              ? `Photoelectrons ARE emitted — KE_max = ${result.maxKineticEnergyEV!.toFixed(3)} eV, stopping voltage = ${result.stoppingVoltageV!.toFixed(3)} V`
              : `No photoelectrons emitted — photon energy (${result.photonEnergyEV.toFixed(3)} eV) is below the work function (${workFunctionEV} eV), regardless of intensity`}
          </div>

          <div style={{ height: 300, marginBottom: 20 }}>
            <EinsteinPlot points={points} workFunctionEV={workFunctionEV} markerFreq={markerFreq} markerKe={result.maxKineticEnergyEV} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <div style={{ fontSize: 10, color: '#67e8f9' }}>Photon energy</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#06b6d4' }}>{result.photonEnergyEV.toFixed(3)} eV</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
              <div style={{ fontSize: 10, color: '#d8b4fe' }}>Threshold wavelength</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#a855f7' }}>{threshold.toFixed(1)} nm</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: result.emits ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${result.emits ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <div style={{ fontSize: 10, color: result.emits ? '#86efac' : '#fca5a5' }}>Stopping voltage</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: result.emits ? '#22c55e' : '#ef4444' }}>{result.emits ? `${result.stoppingVoltageV!.toFixed(3)} V` : 'n/a'}</div>
            </div>
          </div>

          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step-by-step calculation</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.4)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4', marginBottom: 8 }}>Photon energy</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, fontFamily: 'monospace' }}>{derivation.photonEnergyFormula}</div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6, fontFamily: 'monospace' }}>{derivation.photonEnergySubstitution}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#06b6d4', fontFamily: 'monospace', marginTop: 8 }}>{derivation.photonEnergyResult}</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.4)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316', marginBottom: 8 }}>Maximum kinetic energy</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, fontFamily: 'monospace' }}>{derivation.keFormula}</div>
              <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6, fontFamily: 'monospace' }}>{derivation.keSubstitution}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f97316', fontFamily: 'monospace', marginTop: 8 }}>{derivation.keResult}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
