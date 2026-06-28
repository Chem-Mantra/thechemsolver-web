'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'

// ── Crystal Field Theory Simulator ────────────────────────────

interface Ligand {
  name: string; symbol: string; strength: number
  color: string; fieldStrength: string
}

const LIGANDS: Ligand[] = [
  { name: 'Iodide',   symbol: 'I⁻',   strength: 1,  color: '#a78bfa', fieldStrength: 'weak' },
  { name: 'Bromide',  symbol: 'Br⁻',  strength: 2,  color: '#8b5cf6', fieldStrength: 'weak' },
  { name: 'Chloride', symbol: 'Cl⁻',  strength: 3,  color: '#ef4444', fieldStrength: 'weak' },
  { name: 'Fluoride', symbol: 'F⁻',   strength: 4,  color: '#f87171', fieldStrength: 'weak' },
  { name: 'Water',    symbol: 'H₂O',  strength: 5,  color: '#06b6d4', fieldStrength: 'medium' },
  { name: 'Ammonia',  symbol: 'NH₃',  strength: 7,  color: '#22c55e', fieldStrength: 'medium' },
  { name: 'en',       symbol: 'en',   strength: 8,  color: '#34d399', fieldStrength: 'medium' },
  { name: 'Nitrite',  symbol: 'NO₂⁻', strength: 9,  color: '#fbbf24', fieldStrength: 'medium' },
  { name: 'Cyanide',  symbol: 'CN⁻',  strength: 11, color: '#f97316', fieldStrength: 'strong' },
  { name: 'CO',       symbol: 'CO',   strength: 12, color: '#ec4899', fieldStrength: 'strong' },
]

type Geometry = 'octahedral' | 'tetrahedral' | 'square-planar'

const METALS = [
  { sym: 'Ti³⁺', d: 1 }, { sym: 'V³⁺', d: 2 }, { sym: 'Cr³⁺', d: 3 }, { sym: 'Mn³⁺', d: 4 },
  { sym: 'Fe³⁺', d: 5 }, { sym: 'Fe²⁺', d: 6 }, { sym: 'Co²⁺', d: 7 },
  { sym: 'Ni²⁺', d: 8 }, { sym: 'Cu²⁺', d: 9 }, { sym: 'Zn²⁺', d: 10 },
]

const CFSE_TABLE: Record<number, { hs: string; ls: string; hsSpin: number; lsSpin: number }> = {
  0:  { hs: '0.0',  ls: '0.0',  hsSpin: 0, lsSpin: 0 },
  1:  { hs: '-0.4', ls: '-0.4', hsSpin: 1, lsSpin: 1 },
  2:  { hs: '-0.8', ls: '-0.8', hsSpin: 2, lsSpin: 2 },
  3:  { hs: '-1.2', ls: '-1.2', hsSpin: 3, lsSpin: 3 },
  4:  { hs: '-0.6', ls: '-1.6', hsSpin: 4, lsSpin: 2 },
  5:  { hs: '0.0',  ls: '-2.0', hsSpin: 5, lsSpin: 1 },
  6:  { hs: '-0.4', ls: '-2.4', hsSpin: 4, lsSpin: 0 },
  7:  { hs: '-0.8', ls: '-1.8', hsSpin: 3, lsSpin: 1 },
  8:  { hs: '-1.2', ls: '-1.2', hsSpin: 2, lsSpin: 2 },
  9:  { hs: '-0.6', ls: '-0.6', hsSpin: 1, lsSpin: 1 },
  10: { hs: '0.0',  ls: '0.0',  hsSpin: 0, lsSpin: 0 },
}

// Returns electron slots for orbital diagram
function getElectronSlots(nElec: number, isLowSpin: boolean, geometry: Geometry): number[] {
  const slots = [0, 0, 0, 0, 0]
  let e = nElec
  if (geometry === 'octahedral') {
    // slots: 0,1,2 = t2g; 3,4 = eg
    if (isLowSpin) {
      for (let i = 0; i < 3 && e > 0; i++) { slots[i]++; e-- }
      for (let i = 0; i < 3 && e > 0; i++) { slots[i]++; e-- }
      for (let i = 3; i < 5 && e > 0; i++) { slots[i]++; e-- }
      for (let i = 3; i < 5 && e > 0; i++) { slots[i]++; e-- }
    } else {
      for (let i = 0; i < 5 && e > 0; i++) { slots[i]++; e-- }
      for (let i = 0; i < 5 && e > 0; i++) { slots[i]++; e-- }
    }
  } else if (geometry === 'tetrahedral') {
    // slots: 0,1 = e; 2,3,4 = t2 — always HS
    for (let i = 0; i < 5 && e > 0; i++) { slots[i]++; e-- }
    for (let i = 0; i < 5 && e > 0; i++) { slots[i]++; e-- }
  } else {
    // square planar: fill from bottom
    const fillOrder = [3, 4, 2, 1, 0]
    for (const idx of fillOrder) { if (e > 0) { slots[idx]++; e-- } }
    for (const idx of fillOrder) { if (e > 0) { slots[idx]++; e-- } }
  }
  return slots
}

function magneticMoment(unpaired: number) {
  return Math.sqrt(unpaired * (unpaired + 2))
}

// Orbital box component
function OrbitalBox({ label, electrons, color, x, y }: { label: string; electrons: number; color: string; x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <line x1={0} y1={0} x2={60} y2={0} stroke={color} strokeWidth={2.5} />
      {electrons >= 1 && <text x={15} y={-5} fill="#f8fafc" fontSize={14} textAnchor="middle">↑</text>}
      {electrons >= 2 && <text x={45} y={-5} fill={color} fontSize={14} textAnchor="middle">↓</text>}
      <text x={30} y={12} fill={color} fontSize={8} textAnchor="middle">{label}</text>
    </g>
  )
}

export default function CrystalField() {
  const [nElec, setNElec] = useState(6)
  const [geometry, setGeometry] = useState<Geometry>('octahedral')
  const [ligandIdx, setLigandIdx] = useState(4)

  const ligand = LIGANDS[ligandIdx]
  const isLowSpin = ligand.strength >= 7 && geometry !== 'tetrahedral' && nElec >= 4 && nElec <= 7
  const slots = useMemo(() => getElectronSlots(nElec, isLowSpin, geometry), [nElec, isLowSpin, geometry])

  const tableRow = CFSE_TABLE[nElec] ?? CFSE_TABLE[0]
  const cfseVal = isLowSpin ? tableRow.ls : tableRow.hs
  const unpaired = isLowSpin ? tableRow.lsSpin : tableRow.hsSpin
  const mu = magneticMoment(unpaired)
  const spinLabel = isLowSpin ? 'Low Spin' : 'High Spin'
  const spinColor = isLowSpin ? '#06b6d4' : '#ef4444'

  // t2g labels for diagram
  const t2gLabels = ['dxy', 'dxz', 'dyz']
  const egLabels  = ['dx²-y²', 'dz²']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Crystal Field Theory — Splitting, CFSE & Spin State</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left controls */}
        <div style={{ width: 225, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>d-Electrons</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, marginBottom: 14 }}>
            {METALS.map(m => (
              <button key={m.d} onClick={() => setNElec(m.d)}
                style={{ padding: '5px 2px', borderRadius: 7, border: `1px solid ${nElec === m.d ? '#06b6d4' : 'rgba(255,255,255,0.1)'}`, background: nElec === m.d ? 'rgba(6,182,212,0.2)' : 'transparent', color: nElec === m.d ? '#06b6d4' : '#849495', fontSize: 9, cursor: 'pointer', fontWeight: nElec === m.d ? 700 : 400 }}>
                d{m.d}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Geometry</div>
          {(['octahedral', 'tetrahedral', 'square-planar'] as Geometry[]).map(g => (
            <button key={g} onClick={() => setGeometry(g)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, marginBottom: 5, border: `1px solid ${geometry === g ? '#a78bfa50' : 'rgba(255,255,255,0.06)'}`, background: geometry === g ? 'rgba(139,92,246,0.15)' : 'transparent', color: geometry === g ? '#a78bfa' : '#849495', fontSize: 11, cursor: 'pointer', fontWeight: geometry === g ? 700 : 400 }}>
              {g === 'octahedral' ? 'Octahedral (Oh)' : g === 'tetrahedral' ? 'Tetrahedral (Td)' : 'Square Planar (D4h)'}
            </button>
          ))}

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 12, marginBottom: 6 }}>Spectrochemical Series</div>
          <div style={{ fontSize: 8, color: '#849495', marginBottom: 8 }}>← weak field ···············strong field →</div>
          {LIGANDS.map((l, i) => (
            <button key={l.symbol} onClick={() => setLigandIdx(i)}
              style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%', padding: '4px 8px', borderRadius: 7, marginBottom: 3, border: `1px solid ${ligandIdx === i ? l.color + '60' : 'rgba(255,255,255,0.05)'}`, background: ligandIdx === i ? l.color + '15' : 'transparent', color: ligandIdx === i ? l.color : '#849495', fontSize: 10, cursor: 'pointer' }}>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', minWidth: 36 }}>{l.symbol}</span>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${l.strength * 8}%`, background: l.color, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 8 }}>{l.fieldStrength}</span>
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 14, overflow: 'hidden', gap: 12 }}>
          {/* Status bar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#a78bfa' }}>d{nElec} — {geometry}</div>
            <div style={{ padding: '3px 12px', borderRadius: 20, background: `${spinColor}20`, border: `1px solid ${spinColor}50`, color: spinColor, fontSize: 12, fontWeight: 700 }}>{spinLabel}</div>
            <div style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', fontSize: 11, color: '#849495' }}>
              Ligand: <span style={{ color: ligand.color, fontWeight: 700 }}>{ligand.symbol}</span>
            </div>
            {geometry === 'tetrahedral' && (
              <div style={{ fontSize: 10, color: '#849495', fontStyle: 'italic' }}>Δt = 4/9 Δo → always high spin</div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
            {/* SVG orbital diagram */}
            <div style={{ background: 'rgba(9,14,28,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 12, flex: '0 0 340px' }}>
              <div style={{ fontSize: 10, color: '#849495', marginBottom: 6 }}>d-Orbital Energy Level Diagram</div>
              <svg viewBox="0 0 330 240" width="100%" height="220">
                {/* Energy axis */}
                <line x1={25} y1={15} x2={25} y2={225} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <text x={14} y={120} fill="#849495" fontSize={8} textAnchor="middle" transform="rotate(-90,14,120)">Energy</text>

                {/* Free ion reference */}
                <line x1={35} y1={120} x2={80} y2={120} stroke="rgba(255,255,255,0.3)" strokeWidth={1} strokeDasharray="4,2" />
                <text x={83} y={124} fill="#849495" fontSize={8}>d (free ion)</text>

                {geometry === 'octahedral' && (
                  <>
                    {/* eg at top */}
                    {[0,1].map(i => (
                      <OrbitalBox key={i} label={egLabels[i]} electrons={slots[i+3]} color="#ef4444" x={35 + i * 80} y={55} />
                    ))}
                    {/* t2g at bottom */}
                    {[0,1,2].map(i => (
                      <OrbitalBox key={i} label={t2gLabels[i]} electrons={slots[i]} color="#06b6d4" x={35 + i * 75} y={170} />
                    ))}
                    {/* Δo bracket */}
                    <line x1={270} y1={55} x2={270} y2={170} stroke="rgba(255,193,7,0.6)" strokeWidth={1} strokeDasharray="3,2" />
                    <text x={278} y={115} fill="#fbbf24" fontSize={9}>Δo</text>
                    <text x={40} y={45} fill="#ef4444" fontSize={8}>eg (+0.6Δo)</text>
                    <text x={35} y={185} fill="#06b6d4" fontSize={8}>t2g (−0.4Δo)</text>
                  </>
                )}
                {geometry === 'tetrahedral' && (
                  <>
                    {/* t2 at top */}
                    {[0,1,2].map(i => (
                      <OrbitalBox key={i} label={t2gLabels[i]} electrons={slots[i+2]} color="#ef4444" x={35 + i * 75} y={60} />
                    ))}
                    {/* e at bottom */}
                    {[0,1].map(i => (
                      <OrbitalBox key={i} label={egLabels[i]} electrons={slots[i]} color="#06b6d4" x={70 + i * 90} y={175} />
                    ))}
                    <line x1={285} y1={60} x2={285} y2={175} stroke="rgba(255,193,7,0.6)" strokeWidth={1} strokeDasharray="3,2" />
                    <text x={293} y={120} fill="#fbbf24" fontSize={9}>Δt</text>
                    <text x={35} y={50} fill="#ef4444" fontSize={8}>t2 (+0.4Δt)</text>
                    <text x={65} y={190} fill="#06b6d4" fontSize={8}>e (−0.6Δt)</text>
                  </>
                )}
                {geometry === 'square-planar' && (
                  <>
                    {/* 5 separate levels */}
                    <OrbitalBox label="dx²-y²" electrons={slots[0]} color="#ef4444" x={120} y={30} />
                    <OrbitalBox label="dxy"    electrons={slots[1]} color="#f97316" x={120} y={80} />
                    <OrbitalBox label="dz²"    electrons={slots[2]} color="#a78bfa" x={120} y={135} />
                    <OrbitalBox label="dxz"    electrons={slots[3]} color="#06b6d4" x={50}  y={190} />
                    <OrbitalBox label="dyz"    electrons={slots[4]} color="#06b6d4" x={195} y={190} />
                    <text x={35} y={25} fill="#849495" fontSize={7}>Highest energy</text>
                    <text x={35} y={205} fill="#849495" fontSize={7}>Lowest energy</text>
                  </>
                )}
              </svg>
            </div>

            {/* Results */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { label: 'CFSE', value: `${cfseVal} × Δo`, desc: 'Crystal Field Stabilisation Energy (octahedral)', color: '#06b6d4' },
                { label: 'Unpaired e⁻', value: String(unpaired), desc: unpaired > 0 ? 'Paramagnetic' : 'Diamagnetic (all paired)', color: unpaired > 0 ? '#f97316' : '#22c55e' },
                { label: 'Spin-only μ', value: `${mu.toFixed(2)} BM`, desc: 'μ = √(n(n+2)) where n = unpaired electrons', color: '#a78bfa' },
                { label: 'Spin State', value: spinLabel, desc: isLowSpin ? 'Strong field: Δo > P (pairing energy)' : 'Weak field: Δo < P — Hund\'s rule preferred', color: spinColor },
              ].map(item => (
                <div key={item.label} style={{ background: `${item.color}0f`, border: `1px solid ${item.color}35`, borderRadius: 12, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#849495' }}>{item.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 900, fontFamily: 'monospace', color: item.color }}>{item.value}</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#849495', marginTop: 2 }}>{item.desc}</div>
                </div>
              ))}

              {/* Full CFSE table */}
              <div style={{ background: 'rgba(26,31,47,0.8)', borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Octahedral CFSE (in Δo units)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
                  {Object.entries(CFSE_TABLE).filter(([d]) => +d > 0).map(([d, row]) => (
                    <div key={d} style={{ background: nElec === +d ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '4px 6px', border: nElec === +d ? '1px solid rgba(6,182,212,0.4)' : '1px solid transparent', textAlign: 'center' }}>
                      <div style={{ fontSize: 9, color: nElec === +d ? '#06b6d4' : '#849495', fontWeight: nElec === +d ? 700 : 400 }}>d{d}</div>
                      <div style={{ fontSize: 8, color: '#ef4444' }}>HS:{row.hs}</div>
                      <div style={{ fontSize: 8, color: '#06b6d4' }}>LS:{row.ls}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right theory panel */}
        <div style={{ width: 190, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto', fontSize: 9 }}>
          <div style={{ color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>CFT Key Concepts</div>
          {[
            { title: 'CFSE Formula (Oh)', content: 'CFSE = n_t2g × (−0.4Δo) + n_eg × (0.6Δo)\n\nHigh spin d⁵: CFSE = 0 (symmetric half-fill)\nLow spin d⁶: CFSE = −2.4Δo (most stable)', color: '#06b6d4' },
            { title: 'High vs Low Spin Rule', content: 'Δo > P → Low Spin (pair first)\nΔo < P → High Spin (Hund)\n\nWeak ligands (Cl⁻, H₂O) → HS\nStrong ligands (CN⁻, CO) → LS\nTetrahedral: always HS (Δt too small)', color: '#f97316' },
            { title: 'Magnetic Moment', content: 'μ = √n(n+2) BM\n0 unpaired: 0 (diamagnetic)\n1: 1.73 BM\n2: 2.83 BM\n3: 3.87 BM\n4: 4.90 BM\n5: 5.92 BM (max)', color: '#a78bfa' },
            { title: 'Examples (JEE)', content: '[Fe(CN)₆]³⁻: d⁵, LS, 1 unpaired\n[Fe(H₂O)₆]³⁺: d⁵, HS, 5 unpaired\n[CoF₆]³⁻: d⁶, HS, 4 unpaired\n[Co(NH₃)₆]³⁺: d⁶, LS, 0 unpaired\nK₂[NiF₄]: d⁸, 2 unpaired', color: '#22c55e' },
            { title: 'Jahn-Teller Effect', content: 'd⁴, d⁹ in Oh: unequal occupation of eg → tetragonal distortion\nStrongest for Cu²⁺ (d⁹)\nCauses elongation along z-axis', color: '#fbbf24' },
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
