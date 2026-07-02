'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { predictMassSpectrum } from '@/lib/massSpec/core'
import { MASS_SPEC_MOLECULES, massSpecMoleculeById } from '@/lib/massSpec/molecules'

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
const PLOT_H = 260
const PAD_L = 36
const PAD_R = 20
const PAD_B = 36

function MassSpectrumPlot({ peaks, maxMz }: { peaks: ReturnType<typeof predictMassSpectrum>; maxMz: number }) {
  const x = (mz: number) => PAD_L + (mz / maxMz) * (PLOT_W - PAD_L - PAD_R)
  const yBase = PLOT_H - PAD_B
  const maxHeight = PLOT_H - PAD_B - 20

  return (
    <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width="100%" height="100%">
      <line x1={PAD_L} y1={yBase} x2={PLOT_W - PAD_R} y2={yBase} stroke="#475569" strokeWidth={1.5} />
      {Array.from({ length: Math.floor(maxMz / 10) + 1 }, (_, i) => i * 10).map((mz) => (
        <g key={mz}>
          <line x1={x(mz)} y1={yBase} x2={x(mz)} y2={yBase + 4} stroke="#475569" strokeWidth={1} />
          <text x={x(mz)} y={yBase + 16} textAnchor="middle" fontSize={9} fill="#64748b">{mz}</text>
        </g>
      ))}
      <text x={PLOT_W / 2} y={PLOT_H - 4} textAnchor="middle" fontSize={11} fill="#94a3b8">m/z</text>

      {peaks.map((p, i) => {
        const height = p.isBasePeak ? maxHeight : maxHeight * 0.55
        const color = p.isMolecularIon ? '#a855f7' : p.isBasePeak ? '#f97316' : '#06b6d4'
        return (
          <g key={i}>
            <line x1={x(p.mz)} y1={yBase} x2={x(p.mz)} y2={yBase - height} stroke={color} strokeWidth={3} />
            <text x={x(p.mz)} y={yBase - height - 6} textAnchor="middle" fontSize={10} fill={color} fontWeight={700}>{p.mz}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function MassSpecPage() {
  const [moleculeId, setMoleculeId] = useState('ethanol')
  const molecule = massSpecMoleculeById(moleculeId)
  const peaks = useMemo(() => predictMassSpectrum(molecule), [molecule])
  const maxMz = Math.max(...peaks.map((p) => p.mz)) * 1.15

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Mass Spectrometry Fragmentation Predictor (Basic)</strong>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 16 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Molecule</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            {MASS_SPEC_MOLECULES.map((m) => (
              <ModeButton key={m.id} active={moleculeId === m.id} onClick={() => setMoleculeId(m.id)}>
                {m.name}
                <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>{m.formulaLabel}</div>
              </ModeButton>
            ))}
          </div>
          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.6 }}>
            This covers a curated set of classic EI-MS teaching examples (alpha-cleavage, tropylium
            formation, tertiary-cation-driven halide loss) — it doesn't predict fragmentation from an
            arbitrary drawn structure or simulate isotope patterns in detail.
          </div>
        </div>

        <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <div style={{ marginBottom: 8, fontSize: 13, color: '#94a3b8' }}>{molecule.name} ({molecule.formulaLabel})</div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16 }}>{molecule.molecularIonNote}</div>
          <div style={{ height: 280, marginBottom: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <MassSpectrumPlot peaks={peaks} maxMz={maxMz} />
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#94a3b8', marginBottom: 16 }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#a855f7', borderRadius: 5, marginRight: 4 }} />Molecular ion (M⁺•)</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#f97316', borderRadius: 5, marginRight: 4 }} />Base peak</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#06b6d4', borderRadius: 5, marginRight: 4 }} />Other fragment</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['m/z', 'Peak', 'Fragment / ion', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#f97316', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {peaks.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 700, color: p.isMolecularIon ? '#a855f7' : p.isBasePeak ? '#f97316' : '#06b6d4' }}>{p.mz}</td>
                  <td style={{ padding: '8px 10px' }}>{p.label}</td>
                  <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{p.description}</td>
                  <td style={{ padding: '8px 10px', color: '#f97316', fontWeight: 700, fontSize: 10 }}>{p.isBasePeak ? 'BASE PEAK' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
