'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { predictMechanism } from '@/lib/mechanismDecision/predict'
import { REAGENTS, reagentById } from '@/lib/mechanismDecision/reagents'
import { SubstrateClass, Solvent, Mechanism, Likelihood } from '@/lib/mechanismDecision/types'

const SUBSTRATES: { value: SubstrateClass; label: string; sub: string }[] = [
  { value: 'methyl', label: 'Methyl', sub: 'CH₃–LG' },
  { value: 'primary', label: '1° Primary', sub: 'R–CH₂–LG' },
  { value: 'secondary', label: '2° Secondary', sub: 'R₂CH–LG' },
  { value: 'tertiary', label: '3° Tertiary', sub: 'R₃C–LG' },
]

const MECHANISM_COLOR: Record<Mechanism, string> = { SN1: '#06b6d4', SN2: '#22c55e', E1: '#f97316', E2: '#ef4444' }
const LIKELIHOOD_LABEL: Record<Likelihood, string> = { dominant: 'DOMINANT', minor: 'minor product', none: 'does not occur' }

interface Preset {
  label: string
  substrate: SubstrateClass
  resonanceStabilized: boolean
  reagentId: string
  solvent: Solvent
  heat: boolean
}

const PRESETS: Preset[] = [
  { label: 'tert-Butyl bromide + H₂O', substrate: 'tertiary', resonanceStabilized: false, reagentId: 'water', solvent: 'protic', heat: false },
  { label: '2-Bromobutane + NaI / acetone', substrate: 'secondary', resonanceStabilized: false, reagentId: 'nai-acetone', solvent: 'aprotic', heat: false },
  { label: '2-Bromobutane + NaOEt/EtOH, heat', substrate: 'secondary', resonanceStabilized: false, reagentId: 'naoet-etoh', solvent: 'protic', heat: true },
  { label: 'tert-Butyl bromide + t-BuOK', substrate: 'tertiary', resonanceStabilized: false, reagentId: 'tbuok', solvent: 'aprotic', heat: false },
  { label: 'Allyl bromide + H₂O (resonance)', substrate: 'primary', resonanceStabilized: true, reagentId: 'water', solvent: 'protic', heat: false },
  { label: 'Methyl bromide + NaOH(aq)', substrate: 'methyl', resonanceStabilized: false, reagentId: 'naoh-aq', solvent: 'protic', heat: false },
]

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
      }}
    >
      {children}
    </button>
  )
}

export default function SnE1E2Page() {
  const [substrate, setSubstrate] = useState<SubstrateClass>('tertiary')
  const [resonanceStabilized, setResonanceStabilized] = useState(false)
  const [reagentId, setReagentId] = useState('water')
  const [solvent, setSolvent] = useState<Solvent>('protic')
  const [heat, setHeat] = useState(false)

  const reagent = reagentById(reagentId)
  const result = useMemo(
    () => predictMechanism({ substrate, resonanceStabilized, reagentId, solvent, heat }),
    [substrate, resonanceStabilized, reagentId, solvent, heat]
  )

  function applyPreset(p: Preset) {
    setSubstrate(p.substrate)
    setResonanceStabilized(p.resonanceStabilized)
    setReagentId(p.reagentId)
    setSolvent(p.solvent)
    setHeat(p.heat)
  }

  function selectReagent(id: string) {
    setReagentId(id)
    setSolvent(reagentById(id).defaultSolvent)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>SN1 vs SN2 vs E1 vs E2 — Mechanism Predictor</strong>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 16 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Quick examples</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            {PRESETS.map((p) => (
              <ModeButton key={p.label} active={false} onClick={() => applyPreset(p)}>{p.label}</ModeButton>
            ))}
          </div>

          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>1. Substrate class</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            {SUBSTRATES.map((s) => (
              <ModeButton key={s.value} active={substrate === s.value} onClick={() => setSubstrate(s.value)}>
                {s.label}
                <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>{s.sub}</div>
              </ModeButton>
            ))}
          </div>
          {(substrate === 'primary' || substrate === 'secondary') && (
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8', marginBottom: 18, cursor: 'pointer' }}>
              <input type="checkbox" checked={resonanceStabilized} onChange={(e) => setResonanceStabilized(e.target.checked)} />
              Resonance-stabilized (allylic/benzylic) — lets a carbocation form
            </label>
          )}
          {substrate === 'tertiary' || substrate === 'methyl' ? <div style={{ marginBottom: 18 }} /> : null}

          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>2. Nucleophile / base</div>
          <select
            value={reagentId}
            onChange={(e) => selectReagent(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 12, marginBottom: 8 }}
          >
            {REAGENTS.map((r) => (
              <option key={r.id} value={r.id} style={{ background: '#1a1f2f' }}>{r.label}</option>
            ))}
          </select>
          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginBottom: 18 }}>{reagent.note}</div>

          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>3. Solvent</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            <ModeButton active={solvent === 'protic'} onClick={() => setSolvent('protic')}>Polar protic<div style={{ fontSize: 9, opacity: 0.7 }}>H₂O, ROH</div></ModeButton>
            <ModeButton active={solvent === 'aprotic'} onClick={() => setSolvent('aprotic')}>Polar aprotic<div style={{ fontSize: 9, opacity: 0.7 }}>DMSO, acetone</div></ModeButton>
          </div>

          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>4. Temperature</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <ModeButton active={!heat} onClick={() => setHeat(false)}>Room temp</ModeButton>
            <ModeButton active={heat} onClick={() => setHeat(true)}>Heat (Δ)</ModeButton>
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.3)',
              marginBottom: 20,
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            {result.summary}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            {(['SN2', 'SN1', 'E2', 'E1'] as Mechanism[]).map((m) => {
              const v = result.verdicts.find((x) => x.mechanism === m)!
              const color = MECHANISM_COLOR[m]
              return (
                <div
                  key={m}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: v.likelihood === 'none' ? 'rgba(255,255,255,0.02)' : `${color}10`,
                    border: `1px solid ${v.likelihood === 'none' ? 'rgba(255,255,255,0.08)' : color + '50'}`,
                    opacity: v.likelihood === 'none' ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <strong style={{ fontSize: 18, color }}>{m}</strong>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: `${color}20`, color }}>
                      {LIKELIHOOD_LABEL[v.likelihood]}
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
                    {v.reasoning.map((line, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{line}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {result.productHint && (
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', fontSize: 13, lineHeight: 1.6, color: '#d8b4fe', marginBottom: 16 }}>
              <strong style={{ color: '#a855f7' }}>Product to expect: </strong>
              {result.productHint}
            </div>
          )}

          {result.caveats.map((c, i) => (
            <div key={i} style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, marginBottom: 6 }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
