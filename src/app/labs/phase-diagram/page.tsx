'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { vaporPressureCurveSweep, fusionBoundarySweep, classifyPoint, Phase } from '@/lib/phaseDiagram/core'
import { PHASE_SUBSTANCES, phaseSubstanceById } from '@/lib/phaseDiagram/constants'

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
        <span style={{ fontSize: 12, color: '#64748b', width: 30 }}>{unit}</span>
      </div>
    </div>
  )
}

const PHASE_COLOR: Record<Phase, string> = { solid: '#06b6d4', liquid: '#22c55e', gas: '#f97316', supercritical: '#a855f7' }
const PHASE_LABEL: Record<Phase, string> = { solid: 'Solid', liquid: 'Liquid', gas: 'Gas', supercritical: 'Supercritical fluid' }

const PLOT_W = 600
const PLOT_H = 420
const PAD = 56

function PhasePlot({ substanceId, markerC, markerAtm }: { substanceId: string; markerC: number; markerAtm: number }) {
  const substance = phaseSubstanceById(substanceId)
  const tMinK = substance.triplePointK - 80
  const tMaxK = substance.criticalPointK + 40
  const pMinAtm = Math.min(substance.triplePointAtm * 0.05, 0.01)
  const pMaxAtm = substance.criticalPointAtm * 1.4

  const vaporSweep = useMemo(() => vaporPressureCurveSweep(substance, tMinK, substance.criticalPointK, 100), [substance, tMinK])
  const fusionSweep = useMemo(() => fusionBoundarySweep(substance, substance.triplePointAtm, pMaxAtm, 40), [substance, pMaxAtm])

  const logPMin = Math.log10(pMinAtm)
  const logPMax = Math.log10(pMaxAtm)
  const x = (Tk: number) => PAD + ((Tk - 273.15 - (tMinK - 273.15)) / (tMaxK - tMinK)) * (PLOT_W - 2 * PAD)
  const y = (Patm: number) => PLOT_H - PAD - ((Math.log10(Patm) - logPMin) / (logPMax - logPMin)) * (PLOT_H - 2 * PAD)

  const vaporPath = vaporSweep.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.temperatureK)} ${y(p.pressureAtm)}`).join(' ')
  const fusionPath = fusionSweep.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.temperatureK)} ${y(p.pressureAtm)}`).join(' ')
  const [tx, ty] = [x(substance.triplePointK), y(substance.triplePointAtm)]
  const [cx, cy] = [x(substance.criticalPointK), y(substance.criticalPointAtm)]

  const markerK = markerC + 273.15
  const markerX = x(Math.max(tMinK, Math.min(tMaxK, markerK)))
  const markerY = y(Math.max(pMinAtm, Math.min(pMaxAtm, markerAtm)))

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width="100%" height="100%">
      <line x1={PAD} y1={PLOT_H - PAD} x2={PLOT_W - PAD} y2={PLOT_H - PAD} stroke="#475569" strokeWidth={1.5} />
      <line x1={PAD} y1={PAD} x2={PAD} y2={PLOT_H - PAD} stroke="#475569" strokeWidth={1.5} />
      <text x={PLOT_W / 2} y={PLOT_H - 14} textAnchor="middle" fontSize={11} fill="#64748b">Temperature (°C)</text>
      <text x={16} y={PLOT_H / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(-90 16 ${PLOT_H / 2})`}>Pressure (atm, log scale)</text>

      <path d={fusionPath} fill="none" stroke="#06b6d4" strokeWidth={2.5} />
      <path d={vaporPath} fill="none" stroke="#f97316" strokeWidth={2.5} />

      <circle cx={tx} cy={ty} r={4.5} fill="#fff" stroke="#000" strokeWidth={1} />
      <text x={tx + 8} y={ty - 6} fontSize={10} fill="#cbd5e1">Triple pt</text>
      <circle cx={cx} cy={cy} r={4.5} fill="#fff" stroke="#000" strokeWidth={1} />
      <text x={cx - 60} y={cy - 6} fontSize={10} fill="#cbd5e1">Critical pt</text>

      {substance.normalMeltingPointK && (
        <circle cx={x(substance.normalMeltingPointK)} cy={y(1)} r={3.5} fill="#94a3b8" />
      )}
      {substance.normalBoilingPointK && (
        <circle cx={x(substance.normalBoilingPointK)} cy={y(1)} r={3.5} fill="#94a3b8" />
      )}
      {substance.normalSublimationPointK && (
        <circle cx={x(substance.normalSublimationPointK)} cy={y(1)} r={3.5} fill="#94a3b8" />
      )}

      <circle cx={markerX} cy={markerY} r={6} fill="#fde047" stroke="#08020d" strokeWidth={1.5} />
    </svg>
  )
}

export default function PhaseDiagramPage() {
  const [substanceId, setSubstanceId] = useState('water')
  const [tempC, setTempC] = useState('25')
  const [pressureAtm, setPressureAtm] = useState('1')

  const substance = phaseSubstanceById(substanceId)
  const Tc = Number(tempC)
  const T = (Number.isFinite(Tc) ? Tc : 25) + 273.15
  const P = Math.max(Number(pressureAtm) || 1, 1e-4)

  const phase = useMemo(() => classifyPoint(substance, T, P), [substance, T, P])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Phase Diagram — P-T Diagram for Water &amp; CO₂</strong>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 16 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Substance</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {PHASE_SUBSTANCES.map((s) => (
              <ModeButton key={s.id} active={substanceId === s.id} onClick={() => setSubstanceId(s.id)}>{s.label}</ModeButton>
            ))}
          </div>

          <NumberField label="Temperature" value={tempC} onChange={setTempC} unit="°C" />
          <NumberField label="Pressure" value={pressureAtm} onChange={setPressureAtm} unit="atm" />

          {substanceId === 'co2' && (
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6, marginTop: 8 }}>
              CO₂'s triple point pressure (5.11 atm) is ABOVE 1 atm — that's why dry ice sublimes
              directly from solid to gas at room pressure instead of melting into a liquid.
            </div>
          )}
          {substanceId === 'water' && (
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6, marginTop: 8 }}>
              Water's fusion curve leans slightly LEFT with increasing pressure — ice is less dense than
              liquid water, so squeezing it favors the denser liquid and lowers the melting point.
            </div>
          )}

          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6, marginTop: 16 }}>
            This is a schematic diagram: the triple point and critical point are accurate reference
            values, but the curve shapes between them are a smooth Clausius-Clapeyron approximation, not
            a precise equation of state.
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: `${PHASE_COLOR[phase]}15`,
              border: `1px solid ${PHASE_COLOR[phase]}50`,
              marginBottom: 16,
              fontSize: 16,
              fontWeight: 800,
              color: PHASE_COLOR[phase],
            }}
          >
            At {tempC}°C and {pressureAtm} atm, {substance.label} is: {PHASE_LABEL[phase]}
          </div>
          <div style={{ height: 440 }}>
            <PhasePlot substanceId={substanceId} markerC={T - 273.15} markerAtm={P} />
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#06b6d4', borderRadius: 5, marginRight: 4 }} />Fusion boundary</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#f97316', borderRadius: 5, marginRight: 4 }} />Vaporization/sublimation boundary</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#94a3b8', borderRadius: 5, marginRight: 4 }} />Normal mp/bp/sublimation point (1 atm)</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#fde047', borderRadius: 5, marginRight: 4 }} />Your point</span>
          </div>
        </div>
      </div>
    </div>
  )
}
