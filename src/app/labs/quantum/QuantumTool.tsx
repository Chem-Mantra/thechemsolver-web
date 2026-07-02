'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'

// ── Quantum Numbers & Electronic Configuration ─────────────────

const ELEMENTS_BASIC = [
  {Z:1,sym:'H',config:'1s¹'},{Z:2,sym:'He',config:'1s²'},
  {Z:3,sym:'Li',config:'[He]2s¹'},{Z:4,sym:'Be',config:'[He]2s²'},
  {Z:5,sym:'B',config:'[He]2s²2p¹'},{Z:6,sym:'C',config:'[He]2s²2p²'},
  {Z:7,sym:'N',config:'[He]2s²2p³'},{Z:8,sym:'O',config:'[He]2s²2p⁴'},
  {Z:9,sym:'F',config:'[He]2s²2p⁵'},{Z:10,sym:'Ne',config:'[He]2s²2p⁶'},
  {Z:11,sym:'Na',config:'[Ne]3s¹'},{Z:12,sym:'Mg',config:'[Ne]3s²'},
  {Z:13,sym:'Al',config:'[Ne]3s²3p¹'},{Z:14,sym:'Si',config:'[Ne]3s²3p²'},
  {Z:15,sym:'P',config:'[Ne]3s²3p³'},{Z:16,sym:'S',config:'[Ne]3s²3p⁴'},
  {Z:17,sym:'Cl',config:'[Ne]3s²3p⁵'},{Z:18,sym:'Ar',config:'[Ne]3s²3p⁶'},
  {Z:19,sym:'K',config:'[Ar]4s¹'},{Z:20,sym:'Ca',config:'[Ar]4s²'},
  {Z:24,sym:'Cr',config:'[Ar]3d⁵4s¹',exception:true},{Z:29,sym:'Cu',config:'[Ar]3d¹⁰4s¹',exception:true},
  {Z:26,sym:'Fe',config:'[Ar]3d⁶4s²'},{Z:28,sym:'Ni',config:'[Ar]3d⁸4s²'},
]

// Orbital shapes info
const ORBITAL_INFO = [
  {orb:'1s', n:1, l:0, ml:[0], shape:'Sphere (no nodes)', nodes:0, radialNodes:0, angularNodes:0, color:'#06b6d4',
   desc:'Spherically symmetric. Highest electron density at nucleus. Most penetrating orbital. Bohr radius a₀=0.529 Å for H.'},
  {orb:'2s', n:2, l:0, ml:[0], shape:'Sphere with 1 radial node', nodes:1, radialNodes:1, angularNodes:0, color:'#f97316',
   desc:'Same shape as 1s but larger. Inner lobe penetrates close to nucleus. 2s penetrates more than 2p (important for shielding).'},
  {orb:'2p', n:2, l:1, ml:[-1,0,1], shape:'Dumbbell', nodes:1, radialNodes:0, angularNodes:1, color:'#a78bfa',
   desc:'Three degenerate orbitals: 2px, 2py, 2pz (perpendicular). One angular node (nodal plane). 3 orientations.'},
  {orb:'3s', n:3, l:0, ml:[0], shape:'Sphere with 2 radial nodes', nodes:2, radialNodes:2, angularNodes:0, color:'#fbbf24',
   desc:'Two radial nodes, three lobes. Penetrates very close to nucleus. Shielding: 3s > 3p > 3d (important for periodic trends).'},
  {orb:'3p', n:3, l:1, ml:[-1,0,1], shape:'Dumbbell with 1 radial node', nodes:2, radialNodes:1, angularNodes:1, color:'#22c55e',
   desc:'Three degenerate 3px, 3py, 3pz. 1 radial + 1 angular node. Less penetrating than 3s.'},
  {orb:'3d', n:3, l:2, ml:[-2,-1,0,1,2], shape:'Cloverleaf (4 lobes)', nodes:2, radialNodes:0, angularNodes:2, color:'#ec4899',
   desc:'5 degenerate orbitals. No radial nodes. Poor penetration and shielding. This is why 4s fills before 3d and lanthanide contraction occurs.'},
  {orb:'4f', n:4, l:3, ml:[-3,-2,-1,0,1,2,3], shape:'Complex (7 types)', nodes:3, radialNodes:0, angularNodes:3, color:'#34d399',
   desc:'7 degenerate orbitals (4 × cloverleaf + 3 complex). Very poor shielding → lanthanide contraction. Fills after 6s.'},
]

// Aufbau filling order
const FILLING_ORDER = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s','5f','6d','7p']

function getElectronConfig(Z: number): string {
  const found = ELEMENTS_BASIC.find(e=>e.Z===Z)
  if (found) return found.config
  return '—'
}

function calcQN(orbLabel: string) {
  const info = ORBITAL_INFO.find(o=>o.orb===orbLabel)
  if (!info) return null
  return info
}

export default function QuantumSim() {
  const [selOrb, setSelOrb] = useState('2p')
  const [Z, setZ] = useState(6)
  const [tab, setTab] = useState<'orbitals'|'aufbau'|'qnumbers'|'rules'>('orbitals')

  const orb = ORBITAL_INFO.find(o=>o.orb===selOrb)!
  const elConfig = getElectronConfig(Z)
  const el = ELEMENTS_BASIC.find(e=>e.Z===Z)

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',flexShrink:0}}>
        <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <strong style={{fontSize:14}}>Quantum Numbers, Orbitals & Electronic Configuration</strong>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left: orbital selector */}
        <div style={{width:155,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',padding:10,overflowY:'auto'}}>
          <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8}}>Orbitals</div>
          {ORBITAL_INFO.map(o=>(
            <button key={o.orb} onClick={()=>setSelOrb(o.orb)}
              style={{display:'block',width:'100%',textAlign:'left',padding:'7px 9px',borderRadius:8,marginBottom:4,border:`1px solid ${selOrb===o.orb?o.color+'60':'rgba(255,255,255,0.06)'}`,background:selOrb===o.orb?o.color+'14':'rgba(255,255,255,0.02)',color:selOrb===o.orb?o.color:'#849495',fontSize:11,cursor:'pointer',fontFamily:'monospace'}}>
              <span style={{fontWeight:700}}>{o.orb}</span>
              <span style={{fontSize:8,opacity:0.6,display:'block'}}>n={o.n} l={o.l} nodes={o.nodes}</span>
            </button>
          ))}
        </div>
        {/* Main */}
        <div style={{flex:1,overflowY:'auto',padding:12,display:'flex',flexDirection:'column',gap:10}}>
          {/* Orbital detail */}
          <div style={{background:`${orb.color}0e`,border:`1px solid ${orb.color}35`,borderRadius:14,padding:'10px 14px'}}>
            <div style={{display:'flex',gap:20,flexWrap:'wrap',alignItems:'flex-start'}}>
              {/* Orbital SVG */}
              <div style={{background:'rgba(9,14,28,0.7)',borderRadius:12,padding:12,flexShrink:0}}>
                <OrbitalShape orb={selOrb} color={orb.color}/>
              </div>
              <div style={{flex:1,minWidth:220}}>
                <div style={{fontSize:24,fontWeight:900,fontFamily:'monospace',color:orb.color,marginBottom:4}}>{orb.orb}</div>
                <div style={{fontSize:12,color:'#f8fafc',marginBottom:8}}>{orb.shape}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}}>
                  {[
                    {label:'n (principal)',val:orb.n,color:'#06b6d4'},
                    {label:'l (azimuthal)',val:orb.l,color:'#a78bfa'},
                    {label:'mₗ values',val:orb.ml.join(', '),color:'#22c55e'},
                    {label:'Max electrons',val:2*(2*orb.l+1),color:'#fbbf24'},
                    {label:'Radial nodes',val:orb.radialNodes,color:'#f97316'},
                    {label:'Angular nodes',val:orb.angularNodes,color:'#ec4899'},
                  ].map(x=>(
                    <div key={x.label} style={{background:'rgba(0,0,0,0.3)',borderRadius:7,padding:'5px 9px'}}>
                      <div style={{fontSize:8,color:'#849495'}}>{x.label}</div>
                      <div style={{fontSize:12,fontWeight:700,fontFamily:'monospace',color:x.color as string}}>{x.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:10,color:'#849495',lineHeight:1.6}}>{orb.desc}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:'flex',gap:0,background:'rgba(9,14,28,0.7)',borderRadius:10,overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)',flexShrink:0}}>
            {[['orbitals','Orbital Shapes'],['aufbau','Aufbau & Config'],['qnumbers','QN Summary'],['rules','Filling Rules']].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id as typeof tab)}
                style={{flex:1,padding:'7px',border:'none',borderBottom:`2px solid ${tab===id?orb.color:'transparent'}`,background:tab===id?`${orb.color}15`:'transparent',color:tab===id?orb.color:'#849495',fontSize:10,cursor:'pointer'}}>
                {label}
              </button>
            ))}
          </div>

          {tab==='orbitals' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {ORBITAL_INFO.map(o=>(
                <div key={o.orb} onClick={()=>setSelOrb(o.orb)} style={{background:`${o.color}0a`,border:`1px solid ${o.color}${selOrb===o.orb?'60':'20'}`,borderRadius:10,padding:'9px 10px',cursor:'pointer'}}>
                  <div style={{fontFamily:'monospace',fontSize:14,fontWeight:900,color:o.color,marginBottom:4}}>{o.orb}</div>
                  <div style={{fontSize:8,color:'#849495',marginBottom:4}}>{o.shape}</div>
                  <div style={{fontSize:8,color:'#849495'}}>
                    <div>n={o.n} l={o.l}</div>
                    <div>{2*(2*o.l+1)} max e⁻ · {o.nodes} node{o.nodes!==1?'s':''}</div>
                    <div>{2*o.l+1} orbital{(2*o.l+1)!==1?'s':''}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==='aufbau' && (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <span style={{fontSize:10,color:'#849495'}}>Element Z =</span>
                <input type="range" min={1} max={36} step={1} value={Z} onChange={e=>setZ(+e.target.value)} style={{flex:1,accentColor:orb.color}}/>
                <span style={{fontSize:12,fontFamily:'monospace',color:'#f8fafc',fontWeight:700}}>{el?.sym ?? '?'} (Z={Z})</span>
              </div>
              <div style={{background:'rgba(9,14,28,0.8)',border:`1px solid ${orb.color}30`,borderRadius:12,padding:'10px 14px'}}>
                <div style={{fontSize:11,color:'#849495',marginBottom:4}}>Electronic Configuration:</div>
                <div style={{fontSize:18,fontFamily:'monospace',fontWeight:900,color:orb.color}}>{elConfig}</div>
                {el?.exception && (
                  <div style={{marginTop:6,fontSize:10,color:'#fbbf24',background:'rgba(251,191,36,0.1)',padding:'5px 9px',borderRadius:7}}>
                    ⚠️ EXCEPTION: half-filled or fully-filled d orbital extra stability!
                  </div>
                )}
              </div>
              <div>
                <div style={{fontSize:9,color:'#849495',marginBottom:8}}>Aufbau filling order (n+l rule):</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {FILLING_ORDER.map((orbl,i)=>(
                    <div key={orbl} style={{padding:'4px 9px',borderRadius:20,fontSize:10,fontFamily:'monospace',fontWeight:700,background:i<12?`${orb.color}18`:'rgba(255,255,255,0.04)',color:i<12?orb.color:'#849495',border:`1px solid ${i<12?orb.color+'40':'rgba(255,255,255,0.08)'}`}}>
                      {orbl}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab==='qnumbers' && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[
                {qn:'n — Principal QN',range:'1, 2, 3, 4…',meaning:'Shell (energy level). Determines size and energy of orbital. n=1: K shell; n=2: L; n=3: M; n=4: N.',formula:'E_n = −13.6/n² eV (H atom). r_n = 0.529n² Å',color:'#06b6d4'},
                {qn:'l — Azimuthal QN',range:'0 to (n−1)',meaning:'Subshell (shape). l=0: s; l=1: p; l=2: d; l=3: f. Determines angular momentum.',formula:'L = √(l(l+1))·ℏ. Number of orbitals in subshell = 2l+1',color:'#a78bfa'},
                {qn:'mₗ — Magnetic QN',range:'−l, …, 0, …, +l',meaning:'Orbital orientation in space. 2l+1 values. Describes which orbital in the subshell.',formula:'Each mₗ value = one orbital. Total orbitals = n²',color:'#22c55e'},
                {qn:'ms — Spin QN',range:'+½ or −½',meaning:'Electron spin. Only two values. Every orbital holds max 2 electrons with opposite spins.',formula:'Max e⁻ in nth shell = 2n². Max in subshell = 2(2l+1)',color:'#ec4899'},
              ].map(x=>(
                <div key={x.qn} style={{background:`${x.color}0a`,border:`1px solid ${x.color}25`,borderRadius:12,padding:'10px 14px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:x.color,marginBottom:4}}>{x.qn}</div>
                  <div style={{fontSize:9,color:'#fbbf24',marginBottom:4}}>Range: {x.range}</div>
                  <div style={{fontSize:10,color:'#f8fafc',marginBottom:5,lineHeight:1.5}}>{x.meaning}</div>
                  <div style={{fontSize:9,fontFamily:'monospace',color:'#849495',background:'rgba(0,0,0,0.3)',padding:'4px 8px',borderRadius:6}}>{x.formula}</div>
                </div>
              ))}
            </div>
          )}

          {tab==='rules' && (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                {title:'Aufbau Principle',content:'Fill orbitals in order of increasing energy. Use (n+l) rule: lower (n+l) fills first. Equal (n+l): lower n fills first.\nOrder: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p\nWhy 4s before 3d? 4s (n+l=4) < 3d (n+l=5).',color:'#06b6d4'},
                {title:'Pauli Exclusion Principle',content:'No two electrons in an atom can have all four quantum numbers identical.\nMeans: maximum 2 electrons per orbital (with opposite spins).\nConsequence: max e⁻ per shell = 2n². Max per subshell = 2(2l+1).',color:'#a78bfa'},
                {title:"Hund's Rule of Maximum Multiplicity",content:'In degenerate orbitals (same subshell), fill singly first before pairing.\nElectrons in singly occupied orbitals must have parallel spins (same ms).\nReason: minimizes electron-electron repulsion.\nExample: Carbon [He]2s²2p¹↑p¹↑ NOT 2p²↑↓ in one orbital.',color:'#22c55e'},
                {title:'Exceptional Configurations (KEY for JEE)',content:'Cr: [Ar]3d⁵4s¹ (not 3d⁴4s²) — half-filled d (extra stable)\nCu: [Ar]3d¹⁰4s¹ (not 3d⁹4s²) — fully filled d (extra stable)\nSame for Mo, Ag, Pd ([Kr]4d¹⁰), Au, Pt in 5d/6d\nFor lanthanides: La [Xe]5d¹6s², Gd [Xe]4f⁷5d¹6s², Eu [Xe]4f⁷6s²',color:'#fbbf24'},
                {title:'n+l Rule (Madelung Rule)',content:'Energy ordering: lower (n+l) → lower energy. Equal (n+l): lower n → lower energy.\n4s: n+l = 4+0 = 4 (fills before 3d: n+l = 3+2 = 5)\n4f: n+l = 4+3 = 7 (fills after 6s: n+l = 6+0 = 6)\nImportant: after elements fill 3d, the 3d electrons are BELOW 4s in energy\n→ Fe²⁺ loses 4s electrons first: [Ar]3d⁶ not [Ar]3d⁴4s²',color:'#f97316'},
              ].map(x=>(
                <div key={x.title} style={{background:`${x.color}08`,border:`1px solid ${x.color}25`,borderRadius:11,padding:'10px 14px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:x.color,marginBottom:5}}>{x.title}</div>
                  <div style={{fontSize:10,color:'#849495',whiteSpace:'pre-line',lineHeight:1.6}}>{x.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrbitalShape({orb, color}: {orb:string; color:string}) {
  return (
    <svg viewBox="0 0 150 150" width={140} height={140}>
      {orb.endsWith('s') && (
        <>
          <circle cx={75} cy={75} r={45} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5}/>
          {orb==='2s'&&<circle cx={75} cy={75} r={20} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/>}
          {orb==='3s'&&<><circle cx={75} cy={75} r={18} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/><circle cx={75} cy={75} r={32} fill="none" stroke={color} strokeWidth={1} strokeDasharray="3,2" opacity={0.5}/></>}
          <circle cx={75} cy={75} r={5} fill={color} opacity={0.8}/>
          <text x={75} y={140} textAnchor="middle" fill="#849495" fontSize={9}>{orb} — sphere</text>
        </>
      )}
      {orb.endsWith('p') && (
        <>
          <ellipse cx={75} cy={40} rx={18} ry={28} fill={color} opacity={0.3} stroke={color} strokeWidth={1}/>
          <ellipse cx={75} cy={110} rx={18} ry={28} fill={color} opacity={0.2} stroke={color} strokeWidth={1}/>
          <line x1={75} y1={10} x2={75} y2={140} stroke={color} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.3}/>
          <circle cx={75} cy={75} r={3} fill={color} opacity={0.9}/>
          <text x={75} y={148} textAnchor="middle" fill="#849495" fontSize={9}>{orb} — dumbbell</text>
        </>
      )}
      {orb.endsWith('d') && (
        <>
          {[0,90].map(rot=>(
            <g key={rot} transform={`rotate(${rot},75,75)`}>
              <ellipse cx={75} cy={40} rx={16} ry={26} fill={color} opacity={0.2} stroke={color} strokeWidth={1}/>
              <ellipse cx={75} cy={110} rx={16} ry={26} fill={color} opacity={0.2} stroke={color} strokeWidth={1}/>
            </g>
          ))}
          <circle cx={75} cy={75} r={4} fill={color} opacity={0.9}/>
          <text x={75} y={148} textAnchor="middle" fill="#849495" fontSize={9}>{orb} — cloverleaf</text>
        </>
      )}
      {orb.endsWith('f') && (
        <>
          {[0,45,90,135].map(rot=>(
            <g key={rot} transform={`rotate(${rot},75,75)`}>
              <ellipse cx={75} cy={45} rx={12} ry={22} fill={color} opacity={0.18} stroke={color} strokeWidth={0.8}/>
              <ellipse cx={75} cy={105} rx={12} ry={22} fill={color} opacity={0.18} stroke={color} strokeWidth={0.8}/>
            </g>
          ))}
          <circle cx={75} cy={75} r={4} fill={color} opacity={0.9}/>
          <text x={75} y={148} textAnchor="middle" fill="#849495" fontSize={9}>{orb} — complex</text>
        </>
      )}
    </svg>
  )
}
