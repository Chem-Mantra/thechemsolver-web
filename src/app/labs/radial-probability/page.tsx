'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'

// ── Hydrogen-like wavefunctions ────────────────────────────────
function factorial(n: number): number {
  if (n <= 1) return 1; return n * factorial(n - 1)
}

function laguerreAssoc(n: number, l: number, x: number): number {
  const k = n - l - 1
  const alpha = 2 * l + 1
  if (k < 0) return 0
  if (k === 0) return 1
  if (k === 1) return 1 + alpha - x
  let l0 = 1, l1 = 1 + alpha - x
  for (let i = 1; i < k; i++) {
    const l2 = ((2 * i + 1 + alpha - x) * l1 - (i + alpha) * l0) / (i + 1)
    l0 = l1; l1 = l2
  }
  return l1
}

function radialWavefunction(n: number, l: number, r: number, Z: number): number {
  const rho = 2 * Z * r / n
  const norm = Math.sqrt(
    Math.pow(2 * Z / n, 3) * factorial(n - l - 1) / (2 * n * Math.pow(factorial(n + l), 3))
  )
  return norm * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerreAssoc(n, l, rho)
}

function radialProbDensity(n: number, l: number, r: number, Z: number): number {
  const R = radialWavefunction(n, l, r, Z)
  return r * r * R * R
}

// ── Orbital data ───────────────────────────────────────────────
interface Orbital {
  id: string; n: number; l: number; label: string; color: string
  nodes: number; shape: string; penetration: string; shielding: string; description: string
}

const ORBITALS: Orbital[] = [
  { id: '1s', n: 1, l: 0, label: '1s', color: '#06b6d4',  nodes: 0, shape: 'Sphere',              penetration: 'Maximum — closest to nucleus', shielding: 'No inner electrons to shield', description: 'No radial nodes. One smooth peak very close to nucleus. Most penetrating orbital.' },
  { id: '2s', n: 2, l: 0, label: '2s', color: '#f97316',  nodes: 1, shape: 'Sphere (with node)',   penetration: 'High — inner lobe penetrates', shielding: 'Moderate — partly shields 2p',  description: 'One radial node creates inner and outer lobe. Inner lobe penetrates — 2s penetrates more than 2p.' },
  { id: '2p', n: 2, l: 1, label: '2p', color: '#a78bfa',  nodes: 0, shape: 'Dumbbell',             penetration: 'Lower than 2s',               shielding: 'Less penetrating than 2s',     description: 'No radial nodes. Peaks farther from nucleus than 2s. Three degenerate px, py, pz.' },
  { id: '3s', n: 3, l: 0, label: '3s', color: '#fbbf24',  nodes: 2, shape: 'Sphere (2 nodes)',     penetration: 'Good penetration',             shielding: 'Shields 3p and 3d',            description: 'Two radial nodes; three lobes. 3s > 3p > 3d in penetration — explains aufbau order.' },
  { id: '3p', n: 3, l: 1, label: '3p', color: '#22c55e',  nodes: 1, shape: 'Dumbbell (1 node)',    penetration: 'Moderate',                     shielding: 'Less than 3s',                 description: 'One radial node. Less penetrating than 3s, more than 3d. Slater rules reflect this.' },
  { id: '3d', n: 3, l: 2, label: '3d', color: '#ec4899',  nodes: 0, shape: 'Cloverleaf',           penetration: 'Lowest (3rd shell)',           shielding: 'Least among 3s, 3p, 3d',      description: 'No radial nodes; mainly stays away from nucleus. Less shielded → higher Z_eff.' },
  { id: '4f', n: 4, l: 3, label: '4f', color: '#34d399',  nodes: 0, shape: 'Complex (7 types)',    penetration: 'Very low',                     shielding: 'Poor — lanthanide contraction', description: 'No radial nodes; poor shielding causes lanthanide contraction. Why 4f fills after 6s.' },
]

const MAX_R = 60
const STEPS = 500

function generateData(orbitals: Orbital[], Z: number) {
  return Array.from({ length: STEPS }, (_, i) => {
    const r = (i + 1) * MAX_R / STEPS
    const point: Record<string, number> = { r }
    orbitals.forEach(orb => { point[orb.id] = radialProbDensity(orb.n, orb.l, r, Z) })
    return point
  })
}

function findNodes(n: number, l: number, Z: number): number[] {
  if (n - l - 1 === 0) return []
  const nodes: number[] = []
  let prev = radialWavefunction(n, l, 0.01, Z)
  for (let i = 2; i < STEPS; i++) {
    const r = i * MAX_R / STEPS
    const curr = radialWavefunction(n, l, r, Z)
    if (Math.abs(prev) > 0 && prev * curr < 0) nodes.push(r)
    prev = curr
    if (nodes.length >= n - l) break
  }
  return nodes
}

export default function RadialProbability() {
  const [selected, setSelected] = useState<string[]>(['1s', '2s', '2p'])
  const [Z, setZ] = useState(1)
  const [showNodes, setShowNodes] = useState(true)
  const [zoom, setZoom] = useState(30)

  const selectedOrbitals = ORBITALS.filter(o => selected.includes(o.id))
  const data = useMemo(() => generateData(selectedOrbitals, Z), [selected, Z])
  const displayData = useMemo(() => data.filter(d => d.r <= zoom), [data, zoom])
  const nodePositions = useMemo(() => selectedOrbitals.flatMap(orb => findNodes(orb.n, orb.l, Z).map(r => ({ r, orb }))), [selected, Z])

  const toggleOrb = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Radial Probability Distribution — Hydrogen-like Orbitals</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Controls */}
        <div style={{ width: 210, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Select Orbitals</div>
          {ORBITALS.map(orb => (
            <button key={orb.id} onClick={() => toggleOrb(orb.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '7px 10px', borderRadius: 8, marginBottom: 5, border: `1px solid ${selected.includes(orb.id) ? orb.color + '70' : 'rgba(255,255,255,0.06)'}`, background: selected.includes(orb.id) ? orb.color + '15' : 'rgba(255,255,255,0.02)', color: selected.includes(orb.id) ? orb.color : '#849495', fontSize: 12, cursor: 'pointer' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: selected.includes(orb.id) ? orb.color : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}>{orb.label}</div>
                <div style={{ fontSize: 9, opacity: 0.7 }}>{orb.nodes} node{orb.nodes !== 1 ? 's' : ''} · {orb.shape}</div>
              </div>
            </button>
          ))}

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 14, marginBottom: 6 }}>Atomic Number Z = {Z}</div>
          <input type="range" min={1} max={36} step={1} value={Z} onChange={e => setZ(+e.target.value)} style={{ width: '100%', accentColor: '#06b6d4' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#849495' }}><span>H</span><span>Kr</span></div>

          <div style={{ fontSize: 9, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 12, marginBottom: 6 }}>r max = {zoom} a₀</div>
          <input type="range" min={5} max={60} step={5} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: '100%', accentColor: '#a78bfa' }} />

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11, color: '#849495', cursor: 'pointer' }}>
            <input type="checkbox" checked={showNodes} onChange={e => setShowNodes(e.target.checked)} style={{ accentColor: '#fbbf24' }} />
            Show node positions
          </label>

          <div style={{ marginTop: 14, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Key Formula</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#f8fafc' }}>P(r) = r² |R_nl(r)|²</div>
            <div style={{ fontSize: 9, color: '#849495', marginTop: 4 }}>
              Radial nodes = n − l − 1<br />
              Total nodes = n − 1<br />
              r_mp ≈ n²a₀/Z (for s)
            </div>
          </div>
        </div>

        {/* Main chart */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, overflow: 'hidden' }}>
          <div style={{ fontSize: 11, color: '#849495', marginBottom: 6 }}>
            Radial Probability Density P(r) = r² |R<sub>nl</sub>|² for Z = {Z}
            {Z > 1 && <span style={{ marginLeft: 8, color: '#06b6d4' }}>— peaks shift inward as Z increases (stronger nuclear attraction)</span>}
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={displayData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="r" tickFormatter={v => Number(v).toFixed(0)}
                  label={{ value: 'r (Bohr radii, a₀)', position: 'insideBottom', offset: -18, fill: '#849495', fontSize: 11 }}
                  tick={{ fill: '#849495', fontSize: 9 }} />
                <YAxis tick={{ fill: '#849495', fontSize: 9 }} tickFormatter={v => Number(v).toFixed(3)}
                  label={{ value: 'P(r)', angle: -90, position: 'insideLeft', fill: '#849495', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#130818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 10 }}
                  formatter={(v: number, name: string) => [v.toFixed(6), name]}
                  labelFormatter={(r: number) => `r = ${Number(r).toFixed(2)} a₀`} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                {selectedOrbitals.map(orb => (
                  <Line key={orb.id} type="monotone" dataKey={orb.id} stroke={orb.color} strokeWidth={2.5}
                    dot={false} name={orb.label} animationDuration={200} />
                ))}
                {showNodes && nodePositions.filter(np => np.r <= zoom).map((np, i) => (
                  <ReferenceLine key={i} x={np.r} stroke={np.orb.color} strokeDasharray="3 2" strokeOpacity={0.5}
                    label={{ value: `node`, position: 'top', fill: np.orb.color, fontSize: 8 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Info cards */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {selectedOrbitals.map(orb => {
              const nodes = findNodes(orb.n, orb.l, Z)
              return (
                <div key={orb.id} style={{ flex: '1 1 200px', background: `${orb.color}0e`, border: `1px solid ${orb.color}35`, borderRadius: 12, padding: '8px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: orb.color }} />
                    <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 13, color: orb.color }}>{orb.label}</span>
                    <span style={{ fontSize: 9, color: '#849495' }}>n={orb.n}, l={orb.l}, nodes={orb.nodes}</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#f8fafc', marginBottom: 4 }}>{orb.description}</div>
                  <div style={{ fontSize: 9, color: '#849495' }}>
                    Node r: <span style={{ color: orb.color, fontFamily: 'monospace' }}>
                      {nodes.length ? nodes.map(r => r.toFixed(1) + 'a₀').join(', ') : 'no nodes'}
                    </span> · {orb.penetration}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: rules */}
        <div style={{ width: 185, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 12, overflowY: 'auto', fontSize: 9 }}>
          <div style={{ color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Penetration Order</div>
          <div style={{ color: '#f8fafc', background: 'rgba(6,182,212,0.08)', padding: '6px 8px', borderRadius: 8, marginBottom: 10, fontFamily: 'monospace' }}>
            ns {'>'} np {'>'} nd {'>'} nf
          </div>
          {[
            { title: 'Why 4s before 3d?', content: '4s penetrates inner shells better than 3d → lower effective Z_eff → lower energy. After 3d fills, 3d drops below 4s.', color: '#f97316' },
            { title: 'Anomalies: Cr, Cu', content: 'Cr: [Ar]3d⁵4s¹ (not 3d⁴4s²)\nCu: [Ar]3d¹⁰4s¹ (not 3d⁹4s²)\nHalf-filled/fully-filled d is extra stable.', color: '#fbbf24' },
            { title: 'Slater Rules (σ)', content: 'Z_eff = Z − σ\n• Same n: 0.35 (0.30 for 1s)\n• (n−1): 0.85 for s/p, 1.0 for d/f\n• (n−2) and below: 1.0\nHigher n_eff = less penetration', color: '#a78bfa' },
            { title: 'Lanthanide Contraction', content: '4f poor penetration → high Z_eff for 4f electrons → small lanthanide radii. 5d ≈ 4d in size due to this.', color: '#34d399' },
            { title: 'JEE Focus', content: '• Nodes: n−l−1 radial, l angular\n• Degenerate: same n+l (fill order)\n• Aufbau: fill lowest n+l first\n• Hund: maximize spin in degenerate', color: '#22c55e' },
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
