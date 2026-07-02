'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

// ── Lewis Structure Builder ──────────────────────────────────────────────
// Pick a molecule/ion, get its atom skeleton, then build the structure:
// click a bond to cycle its order (single→double→triple), click an atom to
// cycle its lone pairs (0-4). Formal charge and octet status update live
// per atom, with the standard AP exceptions (H/He duet, B/Be electron
// deficient, period-3+ expanded octets) — and an overall electron-count
// check against what the formula/charge actually allows.

type AtomSpec = { id: string; el: string; x: number; y: number }
type BondSpec = { a: string; b: string }
type MoleculeSpec = { formula: string; name: string; charge: number; atoms: AtomSpec[]; bonds: BondSpec[] }

const VALENCE_E: Record<string, number> = {
  H: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, P: 5, S: 6, Cl: 7,
}
const PERIOD3_PLUS = new Set(['P', 'S', 'Cl', 'Si', 'Br', 'I', 'Xe'])

const ELEMENT_COLOR: Record<string, string> = {
  H: '#e2e8f0', C: '#94a3b8', N: '#60a5fa', O: '#f87171', F: '#86efac',
  Cl: '#4ade80', S: '#fbbf24', P: '#fb923c', B: '#f9a8d4', Be: '#5eead4',
}

function radial(cx: number, cy: number, r: number, count: number, startDeg = -90): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < count; i++) {
    const rad = ((startDeg + (360 / count) * i) * Math.PI) / 180
    pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)])
  }
  return pts
}
function bent(cx: number, cy: number, r: number): [number, number][] {
  return [-125, -55].map(deg => {
    const rad = (deg * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as [number, number]
  })
}
function linear(cx: number, cy: number, r: number): [number, number][] {
  return [[cx - r, cy], [cx + r, cy]]
}

const CX = 240, CY = 190
const [h2o1, h2o2] = bent(CX, CY - 20, 100)
const [co2_1, co2_2] = linear(CX, CY, 120)
const [n2_1, n2_2] = linear(CX, CY, 80)
const [o2_1, o2_2] = linear(CX, CY, 80)
const [co_1, co_2] = linear(CX, CY, 80)
const [be1, be2] = linear(CX, CY, 110)
const [so2_1, so2_2] = bent(CX, CY - 30, 110)
const [o3_1, o3_2] = bent(CX, CY - 30, 110)
const nh3pts = radial(CX, CY, 100, 3)
const ch4pts = radial(CX, CY, 110, 4)
const so3pts = radial(CX, CY, 110, 3)
const co3pts = radial(CX, CY, 110, 3)
const no3pts = radial(CX, CY, 110, 3)
const so4pts = radial(CX, CY, 110, 4)
const pcl5pts = radial(CX, CY, 120, 5)
const sf6pts = radial(CX, CY, 125, 6)
const bf3pts = radial(CX, CY, 110, 3)

const MOLECULES: MoleculeSpec[] = [
  { formula: 'H2O', name: 'Water', charge: 0,
    atoms: [{ id: 'O', el: 'O', x: CX, y: CY - 20 }, { id: 'H1', el: 'H', x: h2o1[0], y: h2o1[1] }, { id: 'H2', el: 'H', x: h2o2[0], y: h2o2[1] }],
    bonds: [{ a: 'O', b: 'H1' }, { a: 'O', b: 'H2' }] },
  { formula: 'CO2', name: 'Carbon dioxide', charge: 0,
    atoms: [{ id: 'C', el: 'C', x: CX, y: CY }, { id: 'O1', el: 'O', x: co2_1[0], y: co2_1[1] }, { id: 'O2', el: 'O', x: co2_2[0], y: co2_2[1] }],
    bonds: [{ a: 'C', b: 'O1' }, { a: 'C', b: 'O2' }] },
  { formula: 'NH3', name: 'Ammonia', charge: 0,
    atoms: [{ id: 'N', el: 'N', x: CX, y: CY }, ...nh3pts.map((p, i) => ({ id: `H${i + 1}`, el: 'H', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2].map(i => ({ a: 'N', b: `H${i + 1}` })) },
  { formula: 'CH4', name: 'Methane', charge: 0,
    atoms: [{ id: 'C', el: 'C', x: CX, y: CY }, ...ch4pts.map((p, i) => ({ id: `H${i + 1}`, el: 'H', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2, 3].map(i => ({ a: 'C', b: `H${i + 1}` })) },
  { formula: 'N2', name: 'Nitrogen gas', charge: 0,
    atoms: [{ id: 'N1', el: 'N', x: n2_1[0], y: n2_1[1] }, { id: 'N2', el: 'N', x: n2_2[0], y: n2_2[1] }],
    bonds: [{ a: 'N1', b: 'N2' }] },
  { formula: 'O2', name: 'Oxygen gas', charge: 0,
    atoms: [{ id: 'O1', el: 'O', x: o2_1[0], y: o2_1[1] }, { id: 'O2', el: 'O', x: o2_2[0], y: o2_2[1] }],
    bonds: [{ a: 'O1', b: 'O2' }] },
  { formula: 'CO', name: 'Carbon monoxide', charge: 0,
    atoms: [{ id: 'C', el: 'C', x: co_1[0], y: co_1[1] }, { id: 'O', el: 'O', x: co_2[0], y: co_2[1] }],
    bonds: [{ a: 'C', b: 'O' }] },
  { formula: 'HCN', name: 'Hydrogen cyanide', charge: 0,
    atoms: [{ id: 'H', el: 'H', x: 100, y: CY }, { id: 'C', el: 'C', x: 220, y: CY }, { id: 'N', el: 'N', x: 360, y: CY }],
    bonds: [{ a: 'H', b: 'C' }, { a: 'C', b: 'N' }] },
  { formula: 'SO2', name: 'Sulfur dioxide', charge: 0,
    atoms: [{ id: 'S', el: 'S', x: CX, y: CY - 30 }, { id: 'O1', el: 'O', x: so2_1[0], y: so2_1[1] }, { id: 'O2', el: 'O', x: so2_2[0], y: so2_2[1] }],
    bonds: [{ a: 'S', b: 'O1' }, { a: 'S', b: 'O2' }] },
  { formula: 'SO3', name: 'Sulfur trioxide', charge: 0,
    atoms: [{ id: 'S', el: 'S', x: CX, y: CY }, ...so3pts.map((p, i) => ({ id: `O${i + 1}`, el: 'O', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2].map(i => ({ a: 'S', b: `O${i + 1}` })) },
  { formula: 'CO3', name: 'Carbonate ion', charge: -2,
    atoms: [{ id: 'C', el: 'C', x: CX, y: CY }, ...co3pts.map((p, i) => ({ id: `O${i + 1}`, el: 'O', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2].map(i => ({ a: 'C', b: `O${i + 1}` })) },
  { formula: 'NO3', name: 'Nitrate ion', charge: -1,
    atoms: [{ id: 'N', el: 'N', x: CX, y: CY }, ...no3pts.map((p, i) => ({ id: `O${i + 1}`, el: 'O', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2].map(i => ({ a: 'N', b: `O${i + 1}` })) },
  { formula: 'SO4', name: 'Sulfate ion', charge: -2,
    atoms: [{ id: 'S', el: 'S', x: CX, y: CY }, ...so4pts.map((p, i) => ({ id: `O${i + 1}`, el: 'O', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2, 3].map(i => ({ a: 'S', b: `O${i + 1}` })) },
  { formula: 'PCl5', name: 'Phosphorus pentachloride', charge: 0,
    atoms: [{ id: 'P', el: 'P', x: CX, y: CY }, ...pcl5pts.map((p, i) => ({ id: `Cl${i + 1}`, el: 'Cl', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2, 3, 4].map(i => ({ a: 'P', b: `Cl${i + 1}` })) },
  { formula: 'SF6', name: 'Sulfur hexafluoride', charge: 0,
    atoms: [{ id: 'S', el: 'S', x: CX, y: CY }, ...sf6pts.map((p, i) => ({ id: `F${i + 1}`, el: 'F', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2, 3, 4, 5].map(i => ({ a: 'S', b: `F${i + 1}` })) },
  { formula: 'BF3', name: 'Boron trifluoride', charge: 0,
    atoms: [{ id: 'B', el: 'B', x: CX, y: CY }, ...bf3pts.map((p, i) => ({ id: `F${i + 1}`, el: 'F', x: p[0], y: p[1] }))],
    bonds: [0, 1, 2].map(i => ({ a: 'B', b: `F${i + 1}` })) },
  { formula: 'BeCl2', name: 'Beryllium chloride', charge: 0,
    atoms: [{ id: 'Be', el: 'Be', x: CX, y: CY }, { id: 'Cl1', el: 'Cl', x: be1[0], y: be1[1] }, { id: 'Cl2', el: 'Cl', x: be2[0], y: be2[1] }],
    bonds: [{ a: 'Be', b: 'Cl1' }, { a: 'Be', b: 'Cl2' }] },
  { formula: 'O3', name: 'Ozone', charge: 0,
    atoms: [{ id: 'O', el: 'O', x: CX, y: CY - 30 }, { id: 'O1', el: 'O', x: o3_1[0], y: o3_1[1] }, { id: 'O2', el: 'O', x: o3_2[0], y: o3_2[1] }],
    bonds: [{ a: 'O', b: 'O1' }, { a: 'O', b: 'O2' }] },
]

function bondKey(a: string, b: string) { return [a, b].sort().join('|') }

function angleDiff(a: number, b: number) {
  const d = Math.abs(a - b) % 360
  return Math.min(d, 360 - d)
}

export default function LewisStructureBuilder() {
  const [molIdx, setMolIdx] = useState(0)
  const mol = MOLECULES[molIdx]
  const [bonds, setBonds] = useState<Record<string, number>>({})
  const [lonePairs, setLonePairs] = useState<Record<string, number>>({})

  useEffect(() => {
    const b: Record<string, number> = {}
    mol.bonds.forEach(bd => { b[bondKey(bd.a, bd.b)] = 1 })
    setBonds(b)
    const lp: Record<string, number> = {}
    mol.atoms.forEach(a => { lp[a.id] = 0 })
    setLonePairs(lp)
  }, [molIdx]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalValence = useMemo(() => mol.atoms.reduce((s, a) => s + (VALENCE_E[a.el] ?? 0), 0) - mol.charge, [mol])

  function bondOrderSumFor(atomId: string) {
    return mol.bonds.filter(b => b.a === atomId || b.b === atomId).reduce((s, b) => s + (bonds[bondKey(b.a, b.b)] ?? 1), 0)
  }
  function electronsUsed() {
    const bondE = Object.values(bonds).reduce((s, o) => s + o * 2, 0)
    const lpE = Object.values(lonePairs).reduce((s, n) => s + n * 2, 0)
    return bondE + lpE
  }
  function formalCharge(atom: AtomSpec) {
    return (VALENCE_E[atom.el] ?? 0) - 2 * (lonePairs[atom.id] ?? 0) - bondOrderSumFor(atom.id)
  }
  function octetStatus(atom: AtomSpec): 'ok' | 'exception' | 'under' | 'over' {
    const count = 2 * (lonePairs[atom.id] ?? 0) + 2 * bondOrderSumFor(atom.id)
    const target = atom.el === 'H' ? 2 : 8
    if (count === target) return 'ok'
    if (count < target) {
      if (atom.el === 'B' && count === 6) return 'exception'
      if (atom.el === 'Be' && count === 4) return 'exception'
      return 'under'
    }
    return PERIOD3_PLUS.has(atom.el) ? 'exception' : 'over'
  }

  function cycleBond(a: string, b: string) {
    const key = bondKey(a, b)
    setBonds(prev => ({ ...prev, [key]: (prev[key] ?? 1) % 3 + 1 }))
  }
  function cycleLonePairs(atomId: string) {
    setLonePairs(prev => ({ ...prev, [atomId]: ((prev[atomId] ?? 0) + 1) % 5 }))
  }

  const used = electronsUsed()
  const allOk = mol.atoms.every(a => ['ok', 'exception'].includes(octetStatus(a)))
  const electronsMatch = used === totalValence
  const isValid = allOk && electronsMatch

  function bondAnglesFor(atomId: string) {
    return mol.bonds
      .filter(b => b.a === atomId || b.b === atomId)
      .map(b => {
        const other = mol.atoms.find(at => at.id === (b.a === atomId ? b.b : b.a))!
        const self = mol.atoms.find(at => at.id === atomId)!
        return (Math.atan2(other.y - self.y, other.x - self.x) * 180) / Math.PI
      })
  }
  function lonePairAngles(atomId: string, count: number) {
    const candidates = [0, 45, 90, 135, 180, 225, 270, 315, -45, -90, -135, -315]
    const used = bondAnglesFor(atomId)
    const free = candidates.filter(c => used.every(u => angleDiff(c, u) > 28))
    const pool = free.length >= count ? free : candidates
    return pool.slice(0, count)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 50, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 16 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 18 }}>Lewis Structure Builder</strong>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: controls */}
        <div style={{ width: 310, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 22, overflowY: 'auto' }}>
          <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Molecule / Ion</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {MOLECULES.map((m, i) => (
              <button key={m.formula} onClick={() => setMolIdx(i)}
                style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: i === molIdx ? 'rgba(34,211,238,0.15)' : 'transparent', color: i === molIdx ? '#22d3ee' : '#849495', fontSize: 14, cursor: 'pointer', fontFamily: 'monospace' }}>
                {m.formula}{m.charge !== 0 ? (m.charge > 0 ? `${m.charge}+` : `${-m.charge}-`).replace('1', '') : ''}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 22, fontWeight: 900, color: '#22d3ee', marginBottom: 2 }}>
            {mol.formula}{mol.charge !== 0 && <sup style={{ fontSize: 14 }}>{mol.charge > 0 ? '+' : (Math.abs(mol.charge) > 1 ? Math.abs(mol.charge) : '') + '−'}</sup>}
          </div>
          <div style={{ fontSize: 16, color: '#cbd5e1', marginBottom: 18 }}>{mol.name}</div>

          <div style={{ background: electronsMatch ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${electronsMatch ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#849495', marginBottom: 4 }}>Electrons placed</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: electronsMatch ? '#86efac' : '#fca5a5', fontFamily: 'monospace' }}>{used} / {totalValence}</div>
          </div>

          <div style={{ background: isValid ? 'rgba(34,197,94,0.08)' : 'rgba(251,191,36,0.08)', border: `1px solid ${isValid ? 'rgba(34,197,94,0.3)' : 'rgba(251,191,36,0.3)'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 18, fontSize: 14.5 }}>
            {isValid ? <span style={{ color: '#86efac' }}>✓ Valid Lewis structure</span> : <span style={{ color: '#fde68a' }}>⚠ Not complete — check electron count and octets below</span>}
          </div>

          <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Atoms — formal charge & octet</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 18 }}>
            {mol.atoms.map(a => {
              const status = octetStatus(a)
              const fc = formalCharge(a)
              const statusColor = status === 'ok' ? '#86efac' : status === 'exception' ? '#67e8f9' : '#fca5a5'
              return (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontFamily: 'monospace', padding: '5px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
                  <span style={{ color: ELEMENT_COLOR[a.el] }}>{a.id}</span>
                  <span style={{ color: '#cbd5e1' }}>FC {fc > 0 ? `+${fc}` : fc}</span>
                  <span style={{ color: statusColor }}>{status === 'ok' ? 'octet ✓' : status === 'exception' ? 'allowed' : status === 'under' ? 'incomplete' : 'too many'}</span>
                </div>
              )
            })}
          </div>

          <div style={{ fontSize: 12, color: '#849495', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>How to build it</div>
          <div style={{ fontSize: 14, color: '#849495', lineHeight: 1.9 }}>
            <div><strong style={{ color: '#cbd5e1' }}>Click a bond</strong> to cycle single → double → triple.</div>
            <div><strong style={{ color: '#cbd5e1' }}>Click an atom</strong> to cycle its lone pairs (0–4).</div>
            <div>Formal charge = valence e⁻ − lone-pair e⁻ − bonds.</div>
          </div>
        </div>

        {/* Main: diagram */}
        <div style={{ flex: 1, overflow: 'auto', padding: 26, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 480 380" width="100%" style={{ maxWidth: 620 }}>
            {mol.bonds.map(b => {
              const A = mol.atoms.find(a => a.id === b.a)!
              const B = mol.atoms.find(a => a.id === b.b)!
              const order = bonds[bondKey(b.a, b.b)] ?? 1
              const dx = B.x - A.x, dy = B.y - A.y
              const len = Math.hypot(dx, dy)
              const ux = dx / len, uy = dy / len
              const px = -uy, py = ux
              const ax = A.x + ux * 24, ay = A.y + uy * 24
              const bx = B.x - ux * 24, by = B.y - uy * 24
              const offsets = order === 1 ? [0] : order === 2 ? [-5, 5] : [-9, 0, 9]
              return (
                <g key={bondKey(b.a, b.b)} onClick={() => cycleBond(b.a, b.b)} style={{ cursor: 'pointer' }}>
                  <line x1={ax} y1={ay} x2={bx} y2={by} stroke="transparent" strokeWidth={20} />
                  {offsets.map((off, i) => (
                    <line key={i} x1={ax + px * off} y1={ay + py * off} x2={bx + px * off} y2={by + py * off} stroke="#cbd5e1" strokeWidth={3} strokeLinecap="round" />
                  ))}
                </g>
              )
            })}

            {mol.atoms.map(a => {
              const n = lonePairs[a.id] ?? 0
              const angles = lonePairAngles(a.id, n)
              return (
                <g key={a.id}>
                  {angles.map((deg, i) => {
                    const rad = (deg * Math.PI) / 180
                    const dist = 30
                    const lx = a.x + Math.cos(rad) * dist, ly = a.y + Math.sin(rad) * dist
                    const perpX = -Math.sin(rad) * 5, perpY = Math.cos(rad) * 5
                    return (
                      <g key={i}>
                        <circle cx={lx - perpX} cy={ly - perpY} r={2.6} fill="#fde68a" />
                        <circle cx={lx + perpX} cy={ly + perpY} r={2.6} fill="#fde68a" />
                      </g>
                    )
                  })}
                  <circle cx={a.x} cy={a.y} r={20} fill="#0b0f1c" stroke={ELEMENT_COLOR[a.el]} strokeWidth={2} onClick={() => cycleLonePairs(a.id)} style={{ cursor: 'pointer' }} />
                  <text x={a.x} y={a.y + 6} textAnchor="middle" fontSize={16} fontWeight={800} fill={ELEMENT_COLOR[a.el]} style={{ pointerEvents: 'none' }}>{a.el}</text>
                </g>
              )
            })}
          </svg>

          <div style={{ marginTop: 18, fontSize: 13, color: '#525a72', lineHeight: 1.8, maxWidth: 600, textAlign: 'center' }}>
            Total valence electrons = sum of each atom's valence electrons, adjusted for ion charge. Expanded octets are allowed for period-3+ atoms (P, S, Cl); B and Be are allowed to stop short of a full octet.
          </div>
        </div>
      </div>
    </div>
  )
}
