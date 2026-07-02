'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  boilingPointElevation,
  freezingPointDepression,
  osmoticPressureAtm,
  raoultVaporPressure,
  boilingPointDerivation,
  freezingPointDerivation,
  osmoticPressureDerivation,
} from '@/lib/colligative/core'
import { SOLVENTS, solventById, SOLUTES, soluteById } from '@/lib/colligative/constants'

type Tab = 'bpfp' | 'osmotic' | 'raoult'

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
        <span style={{ fontSize: 12, color: '#64748b', width: 50 }}>{unit}</span>
      </div>
    </div>
  )
}

function DerivationCard({ title, color, formula, substitution, result }: { title: string; color: string; formula: string; substitution: string; result: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 10, background: `${color}0d`, border: `1px solid ${color}50` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6, fontFamily: 'monospace' }}>{formula}</div>
      <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 6, fontFamily: 'monospace' }}>{substitution}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'monospace', marginTop: 8 }}>{result}</div>
    </div>
  )
}

const VANT_HOFF_CAVEAT =
  "Real solutions usually show a slightly LOWER van't Hoff factor than this ideal value, especially at higher concentration — ions partially re-pair instead of staying fully dissociated. This calculator uses the ideal i."

function BoilingFreezingPanel() {
  const [solventId, setSolventId] = useState('water')
  const [soluteId, setSoluteId] = useState('nacl')
  const [molality, setMolality] = useState('1')

  const solvent = solventById(solventId)
  const solute = soluteById(soluteId)
  const m = Math.max(Number(molality) || 0, 0)

  const bp = useMemo(() => boilingPointElevation(m, solute.i, solvent), [m, solute, solvent])
  const fp = useMemo(() => freezingPointDepression(m, solute.i, solvent), [m, solute, solvent])
  const bpD = useMemo(() => boilingPointDerivation(m, solute.i, solvent), [m, solute, solvent])
  const fpD = useMemo(() => freezingPointDerivation(m, solute.i, solvent), [m, solute, solvent])

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 300, flexShrink: 0 }}>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Solvent</div>
        <select value={solventId} onChange={(e) => setSolventId(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 12, marginBottom: 4 }}>
          {SOLVENTS.map((s) => (
            <option key={s.id} value={s.id} style={{ background: '#1a1f2f' }}>{s.label}</option>
          ))}
        </select>
        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 16 }}>Kb = {solvent.Kb} °C·kg/mol · Kf = {solvent.Kf} °C·kg/mol</div>

        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Solute (van't Hoff factor i)</div>
        <select value={soluteId} onChange={(e) => setSoluteId(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 12, marginBottom: 4 }}>
          {SOLUTES.map((s) => (
            <option key={s.id} value={s.id} style={{ background: '#1a1f2f' }}>{s.label} (i={s.i})</option>
          ))}
        </select>
        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 16 }}>{VANT_HOFF_CAVEAT}</div>

        <NumberField label="Molality (m)" value={molality} onChange={setMolality} unit="mol/kg" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: 10, color: '#fca5a5' }}>Boiling point elevation</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>+{bp.deltaTb.toFixed(3)} °C</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>New bp: {bp.newBoilingPointC.toFixed(3)} °C</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)' }}>
            <div style={{ fontSize: 10, color: '#67e8f9' }}>Freezing point depression</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#06b6d4' }}>−{fp.deltaTf.toFixed(3)} °C</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>New fp: {fp.newFreezingPointC.toFixed(3)} °C</div>
          </div>
        </div>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step-by-step calculation</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <DerivationCard title="Boiling point elevation" color="#ef4444" {...bpD} />
          <DerivationCard title="Freezing point depression" color="#06b6d4" {...fpD} />
        </div>
      </div>
    </div>
  )
}

function OsmoticPanel() {
  const [molarity, setMolarity] = useState('0.3')
  const [soluteId, setSoluteId] = useState('nonelectrolyte')
  const [temperature, setTemperature] = useState('310.15')

  const solute = soluteById(soluteId)
  const M = Math.max(Number(molarity) || 0, 0)
  const T = Math.max(Number(temperature) || 1, 1)

  const pi = useMemo(() => osmoticPressureAtm(M, solute.i, T), [M, solute, T])
  const d = useMemo(() => osmoticPressureDerivation(M, solute.i, T), [M, solute, T])

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 300, flexShrink: 0 }}>
        <NumberField label="Molarity (M)" value={molarity} onChange={setMolarity} unit="mol/L" />
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Solute (van't Hoff factor i)</div>
        <select value={soluteId} onChange={(e) => setSoluteId(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 12, marginBottom: 16 }}>
          {SOLUTES.map((s) => (
            <option key={s.id} value={s.id} style={{ background: '#1a1f2f' }}>{s.label} (i={s.i})</option>
          ))}
        </select>
        <NumberField label="Temperature (T)" value={temperature} onChange={setTemperature} unit="K" />
        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>310.15 K (37 °C) is body temperature — a 0.30 M nonelectrolyte solution at this temperature gives roughly the physiological osmotic pressure of blood plasma (~7.6 atm).</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ padding: 20, borderRadius: 12, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Osmotic pressure</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#a855f7' }}>{pi.toFixed(3)} atm</div>
        </div>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step-by-step calculation</div>
        <DerivationCard title="Van't Hoff osmotic pressure equation" color="#a855f7" {...d} />
      </div>
    </div>
  )
}

function RaoultPanel() {
  const [moleFraction, setMoleFraction] = useState('0.1')
  const [pureVP, setPureVP] = useState('760')

  const x = Math.min(Math.max(Number(moleFraction) || 0, 0), 1)
  const p0 = Math.max(Number(pureVP) || 0, 0)
  const r = useMemo(() => raoultVaporPressure(x, p0), [x, p0])

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ width: 300, flexShrink: 0 }}>
        <NumberField label="Solute mole fraction (X_solute)" value={moleFraction} onChange={setMoleFraction} unit="" />
        <NumberField label="Pure solvent vapor pressure (P°)" value={pureVP} onChange={setPureVP} unit="mmHg" />
        <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
          Raoult's law is unit-agnostic for pressure — enter P° in mmHg, atm, or kPa and the result comes
          back in the same unit. 760 mmHg = 1 atm is the default (normal atmospheric pressure).
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ fontSize: 10, color: '#86efac' }}>Solution vapor pressure</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>{r.solutionVaporPressure.toFixed(3)}</div>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontSize: 10, color: '#fca5a5' }}>Vapor pressure lowering (ΔP)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444' }}>{r.vaporPressureLowering.toFixed(3)}</div>
          </div>
        </div>
        <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Step-by-step calculation</div>
        <DerivationCard
          title="Raoult's Law"
          color="#22c55e"
          formula="P_solution = X_solvent · P°  (X_solvent = 1 − X_solute)"
          substitution={`P_solution = (1 − ${x}) × ${p0}`}
          result={`P_solution = ${r.solutionVaporPressure.toFixed(3)}  →  ΔP = ${r.vaporPressureLowering.toFixed(3)}`}
        />
      </div>
    </div>
  )
}

export default function ColligativePropertiesPage() {
  const [tab, setTab] = useState<Tab>('bpfp')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Colligative Properties Calculator</strong>
      </div>
      <div style={{ padding: 24, maxWidth: 980 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <ModeButton active={tab === 'bpfp'} onClick={() => setTab('bpfp')}>Boiling/Freezing Point</ModeButton>
          <ModeButton active={tab === 'osmotic'} onClick={() => setTab('osmotic')}>Osmotic Pressure</ModeButton>
          <ModeButton active={tab === 'raoult'} onClick={() => setTab('raoult')}>Vapor Pressure (Raoult's Law)</ModeButton>
        </div>
        {tab === 'bpfp' && <BoilingFreezingPanel />}
        {tab === 'osmotic' && <OsmoticPanel />}
        {tab === 'raoult' && <RaoultPanel />}
      </div>
    </div>
  )
}
