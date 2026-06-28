'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// ── Atomic Structure Evolution + Bohr Model ────────────────────

type Model = 'dalton'|'thomson'|'rutherford'|'bohr'|'quantum'

const MODELS: {id:Model;name:string;year:string;color:string;scientist:string}[] = [
  {id:'dalton',    name:'Dalton\'s Atomic Theory', year:'1803', color:'#849495', scientist:'John Dalton'},
  {id:'thomson',   name:'Plum Pudding Model',      year:'1904', color:'#f97316', scientist:'J.J. Thomson'},
  {id:'rutherford',name:'Nuclear Model',           year:'1911', color:'#ef4444', scientist:'Ernest Rutherford'},
  {id:'bohr',      name:'Bohr\'s Model',           year:'1913', color:'#06b6d4', scientist:'Niels Bohr'},
  {id:'quantum',   name:'Quantum Mechanical Model',year:'1926', color:'#a78bfa', scientist:'Schrödinger, Heisenberg'},
]

// Bohr model: En = -13.6 eV / n²  (for H)
const SPECTRAL_SERIES = [
  {name:'Lyman',   nf:1, nmin:2, nmax:6, region:'UV',       color:'#a78bfa'},
  {name:'Balmer',  nf:2, nmin:3, nmax:7, region:'Visible',   color:'#22c55e'},
  {name:'Paschen', nf:3, nmin:4, nmax:8, region:'IR',        color:'#f97316'},
  {name:'Brackett',nf:4, nmin:5, nmax:9, region:'Far IR',    color:'#fbbf24'},
  {name:'Pfund',   nf:5, nmin:6, nmax:10,region:'Far IR',    color:'#ec4899'},
]

function wavelength(ni:number, nf:number): number {
  // 1/λ = R·(1/nf² - 1/ni²)  R=1.097×10⁷ m⁻¹
  const R = 1.097e7
  const inv = R * (1/(nf*nf) - 1/(ni*ni))
  return 1e9 / inv // nm
}

function energy_eV(n: number): number { return -13.6 / (n * n) }

export default function AtomicEvolution() {
  const [model, setModel] = useState<Model>('bohr')
  const [seriesIdx, setSeriesIdx] = useState(1) // Balmer default
  const [niBohr, setNiBohr] = useState(3)
  const [nfBohr, setNfBohr] = useState(2)

  const series = SPECTRAL_SERIES[seriesIdx]
  const λ = wavelength(niBohr, nfBohr)
  const ΔE_eV = energy_eV(nfBohr) - energy_eV(niBohr)

  // Energy level diagram data
  const energyLevels = [1,2,3,4,5,6,7].map(n => ({n, E: +energy_eV(n).toFixed(3)}))

  // Spectral lines for selected series
  const spectralLines = useMemo(() => {
    const s = SPECTRAL_SERIES[seriesIdx]
    return Array.from({length: s.nmax - s.nmin + 1}, (_,i) => {
      const ni = s.nmin + i
      const lam = wavelength(ni, s.nf)
      return { ni, lambda: +lam.toFixed(1), E: +(energy_eV(s.nf) - energy_eV(ni)).toFixed(3) }
    })
  }, [seriesIdx])

  const th = MODELS.find(m=>m.id===model)!

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',flexShrink:0}}>
        <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <strong style={{fontSize:14}}>Atomic Structure — Model Evolution, Bohr Model & Spectral Lines</strong>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Model selector */}
        <div style={{width:180,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',padding:10,overflowY:'auto'}}>
          <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8}}>Atomic Models</div>
          {MODELS.map(m=>(
            <button key={m.id} onClick={()=>setModel(m.id)}
              style={{display:'block',width:'100%',textAlign:'left',padding:'9px 10px',borderRadius:9,marginBottom:5,border:`1px solid ${model===m.id?m.color+'60':'rgba(255,255,255,0.06)'}`,background:model===m.id?m.color+'14':'rgba(255,255,255,0.02)',color:model===m.id?m.color:'#849495',fontSize:10,cursor:'pointer'}}>
              <div style={{fontWeight:700}}>{m.name}</div>
              <div style={{fontSize:8,opacity:0.7}}>{m.scientist} · {m.year}</div>
            </button>
          ))}
          <div style={{marginTop:12,borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:10}}>
            <div style={{fontSize:9,color:'#f97316',fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Key Experiments</div>
            {[
              'Cathode ray tube → electron (Thomson)',
              'Gold foil scattering → nucleus (Rutherford)',
              'Photoelectric effect → photon (Einstein)',
              'Hydrogen spectrum → energy levels (Bohr)',
              'de Broglie: λ=h/mv (wave-particle)',
            ].map((r,i)=>(
              <div key={i} style={{fontSize:8,color:'#849495',marginBottom:3,lineHeight:1.4}}>• {r}</div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:12}}>
          <AnimatePresence mode="wait">
            <motion.div key={model} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}>
              {/* Model info */}
              <div style={{background:`${th.color}0e`,border:`1px solid ${th.color}35`,borderRadius:14,padding:'12px 16px',marginBottom:12}}>
                <div style={{fontSize:18,fontWeight:900,color:th.color}}>{th.name}</div>
                <div style={{fontSize:11,color:'#849495'}}>{th.scientist} · {th.year}</div>
                <div style={{marginTop:10,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                  {getModelContent(model).map((item,i)=>(
                    <div key={i} style={{background:'rgba(0,0,0,0.2)',borderRadius:8,padding:'8px 10px'}}>
                      <div style={{fontSize:9,color:th.color,fontWeight:700,marginBottom:3}}>{item.label}</div>
                      <div style={{fontSize:10,color:item.isDefect?'#ef4444':'#f8fafc',lineHeight:1.5}}>{item.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SVG model diagram */}
              <div style={{display:'flex',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}>
                <div style={{background:'rgba(9,14,28,0.8)',border:`1px solid ${th.color}25`,borderRadius:14,padding:16,flexShrink:0}}>
                  <ModelDiagram model={model} color={th.color}/>
                </div>
                {/* Bohr extras */}
                {model==='bohr' && (
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
                    <div style={{background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'10px 14px'}}>
                      <div style={{fontSize:9,color:'#06b6d4',fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Bohr Postulates</div>
                      {[
                        'Electrons move in fixed circular orbits (stationary states) — no energy radiated',
                        'Only orbits where mvr = nh/2π are allowed (angular momentum quantised)',
                        'Energy emitted/absorbed = ΔE = hν when electron jumps between orbits',
                        'Energy of nth orbit: Eₙ = −13.6/n² eV (for H)',
                        'Radius of nth orbit: rₙ = 0.529n² Å (Bohr radius)',
                      ].map((p,i)=>(
                        <div key={i} style={{fontSize:10,color:'#849495',marginBottom:4,lineHeight:1.5}}>• {p}</div>
                      ))}
                    </div>
                    <div style={{background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'10px 14px'}}>
                      <div style={{fontSize:9,color:'#fbbf24',fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Formulae (H-like atoms)</div>
                      {[
                        'Eₙ = −13.6 Z²/n² eV = −2.18×10⁻¹⁸ Z²/n² J',
                        'rₙ = 0.529 n²/Z Å',
                        'vₙ = 2.18×10⁶ Z/n m/s',
                        '1/λ = RH·Z²·(1/n₁² − 1/n₂²)  RH = 1.097×10⁷ m⁻¹',
                        'ΔE = hν = hc/λ   h = 6.626×10⁻³⁴ J·s',
                      ].map((f,i)=>(
                        <div key={i} style={{fontSize:10,fontFamily:'monospace',color:'#f8fafc',marginBottom:4}}>{f}</div>
                      ))}
                    </div>
                  </div>
                )}
                {model==='quantum' && (
                  <div style={{flex:1,display:'flex',flexDirection:'column',gap:10}}>
                    <div style={{background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'10px 14px'}}>
                      <div style={{fontSize:9,color:'#a78bfa',fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Quantum Numbers</div>
                      {[
                        {qn:'n (principal)',range:'1, 2, 3…',meaning:'Shell, energy, size. n=1 (K), 2 (L), 3 (M)…'},
                        {qn:'l (azimuthal)',range:'0 to n−1',meaning:'Subshell shape. l=0(s), 1(p), 2(d), 3(f)'},
                        {qn:'mₗ (magnetic)',range:'−l to +l',meaning:'Orientation. 2l+1 values per subshell'},
                        {qn:'ms (spin)',range:'+½ or −½',meaning:'Electron spin. Pauli: no 2 electrons same 4 QN'},
                      ].map(x=>(
                        <div key={x.qn} style={{marginBottom:7,paddingBottom:7,borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                          <div style={{display:'flex',gap:8,alignItems:'baseline'}}>
                            <span style={{fontFamily:'monospace',color:'#a78bfa',fontWeight:700,fontSize:11}}>{x.qn}</span>
                            <span style={{fontSize:9,color:'#849495'}}>Range: {x.range}</span>
                          </div>
                          <div style={{fontSize:9,color:'#f8fafc',marginTop:2}}>{x.meaning}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'10px 14px'}}>
                      <div style={{fontSize:9,color:'#a78bfa',fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Filling Rules</div>
                      {[
                        'Aufbau principle: fill lowest energy first. Order: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p…',
                        'Pauli exclusion: no two electrons can have all four quantum numbers identical',
                        "Hund's rule: in degenerate orbitals, fill each singly first (maximize unpaired spins)",
                        'n+l rule: lower (n+l) fills first. Equal (n+l): lower n fills first. Explains 4s < 3d.',
                      ].map((r,i)=>(
                        <div key={i} style={{fontSize:9,color:'#849495',marginBottom:4,lineHeight:1.5}}>• {r}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bohr spectral section (always shown) */}
          <div style={{background:'rgba(9,14,28,0.7)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:'12px 14px'}}>
            <div style={{fontSize:12,fontWeight:700,color:'#06b6d4',marginBottom:8}}>Hydrogen Spectral Series — Bohr Model</div>
            <div style={{display:'flex',gap:8,marginBottom:10,flexWrap:'wrap'}}>
              {SPECTRAL_SERIES.map((s,i)=>(
                <button key={i} onClick={()=>setSeriesIdx(i)}
                  style={{padding:'4px 10px',borderRadius:20,border:`1px solid ${seriesIdx===i?s.color:'rgba(255,255,255,0.1)'}`,background:seriesIdx===i?`${s.color}20`:'transparent',color:seriesIdx===i?s.color:'#849495',fontSize:10,cursor:'pointer'}}>
                  {s.name} (n→{s.nf})
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:220}}>
                <div style={{marginBottom:6,fontSize:10,color:'#849495'}}>Spectral lines in {series.name} series (n→{series.nf}, {series.region})</div>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  {spectralLines.map(line=>(
                    <div key={line.ni} style={{display:'flex',justifyContent:'space-between',fontSize:10,padding:'4px 8px',background:'rgba(26,31,47,0.8)',borderRadius:7,border:`1px solid ${series.color}25`}}>
                      <span style={{color:'#849495'}}>n={line.ni} → n={series.nf}</span>
                      <span style={{fontFamily:'monospace',color:series.color,fontWeight:700}}>{line.lambda} nm</span>
                      <span style={{fontFamily:'monospace',color:'#fbbf24'}}>{line.E.toFixed(2)} eV</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Energy level diagram */}
              <div style={{minWidth:220}}>
                <div style={{fontSize:10,color:'#849495',marginBottom:6}}>Energy levels (eV) — H atom</div>
                <svg viewBox="0 0 200 200" width="100%" height={170}>
                  {energyLevels.map(({n,E})=>{
                    const y = 170 + (E/13.6)*130
                    return (
                      <g key={n}>
                        <line x1={40} y1={y} x2={160} y2={y} stroke={n===nfBohr?series.color:n===niBohr?'#fbbf24':'rgba(255,255,255,0.2)'} strokeWidth={n===nfBohr||n===niBohr?2:1}/>
                        <text x={28} y={y+4} fill="#849495" fontSize={9} textAnchor="end">n={n}</text>
                        <text x={168} y={y+4} fill="#849495" fontSize={8}>{E} eV</text>
                      </g>
                    )
                  })}
                  {/* Transition arrow */}
                  {(() => {
                    const y1 = 170 + (energy_eV(niBohr)/13.6)*130
                    const y2 = 170 + (energy_eV(nfBohr)/13.6)*130
                    return <line x1={100} y1={y1} x2={100} y2={y2} stroke={series.color} strokeWidth={2} markerEnd="url(#arr3)"/>
                  })()}
                  <defs>
                    <marker id="arr3" markerWidth="6" markerHeight="5" refX="3" refY="2.5" orient="auto">
                      <polygon points="0 0,6 2.5,0 5" fill={series.color}/>
                    </marker>
                  </defs>
                </svg>
                <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}>
                  <div style={{display:'flex',gap:4,alignItems:'center',fontSize:9,color:'#849495'}}>
                    ni: <input type="number" min={series.nf+1} max={10} value={niBohr} onChange={e=>setNiBohr(Math.max(series.nf+1,+e.target.value))}
                      style={{width:36,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:5,color:'#f8fafc',fontSize:10,padding:'2px 5px'}}/>
                  </div>
                  <div style={{display:'flex',gap:4,alignItems:'center',fontSize:9,color:'#849495'}}>
                    nf: <input type="number" min={1} max={niBohr-1} value={nfBohr} onChange={e=>setNfBohr(Math.min(niBohr-1,+e.target.value))}
                      style={{width:36,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:5,color:'#f8fafc',fontSize:10,padding:'2px 5px'}}/>
                  </div>
                  <div style={{fontSize:9,color:series.color,fontFamily:'monospace'}}>λ = {λ.toFixed(1)} nm · ΔE = {ΔE_eV.toFixed(2)} eV</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModelDiagram({model, color}: {model:Model; color:string}) {
  return (
    <svg viewBox="0 0 200 200" width={190} height={190}>
      {model==='dalton' && (
        <>
          <circle cx={100} cy={100} r={55} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5}/>
          <text x={100} y={95} textAnchor="middle" fill={color} fontSize={12} fontWeight={700}>Solid</text>
          <text x={100} y={113} textAnchor="middle" fill={color} fontSize={12} fontWeight={700}>Sphere</text>
          <text x={100} y={185} textAnchor="middle" fill="#849495" fontSize={9}>Indivisible billiard ball</text>
        </>
      )}
      {model==='thomson' && (
        <>
          <circle cx={100} cy={100} r={55} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5}/>
          <text x={100} y={55} textAnchor="middle" fill={color} fontSize={9}>+ + + + +</text>
          <text x={100} y={72} textAnchor="middle" fill={color} fontSize={9}>Positive pudding</text>
          {[[65,95],[90,80],[115,105],[140,90],[80,115],[120,85]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={6} fill="#60a5fa" opacity={0.9}/>
          ))}
          <text x={100} y={175} textAnchor="middle" fill="#60a5fa" fontSize={8}>● = electrons embedded</text>
          <text x={100} y={188} textAnchor="middle" fill="#849495" fontSize={8}>Like plums in a pudding</text>
        </>
      )}
      {model==='rutherford' && (
        <>
          <circle cx={100} cy={100} r={10} fill={color} opacity={0.9}/>
          <text x={100} y={104} textAnchor="middle" fill="white" fontSize={7} fontWeight={700}>+</text>
          {[0,60,120,180,240,300].map((deg,i)=>{
            const r=55, x=100+r*Math.cos(deg*Math.PI/180), y=100+r*Math.sin(deg*Math.PI/180)
            return (
              <g key={i}>
                <ellipse cx={100} cy={100} rx={r*0.5} ry={r} fill="none" stroke={color} strokeWidth={0.8} opacity={0.3} transform={`rotate(${deg},100,100)`}/>
                <circle cx={x} cy={y} r={5} fill="#60a5fa"/>
              </g>
            )
          })}
          <text x={100} y={188} textAnchor="middle" fill="#849495" fontSize={8}>Dense nucleus + orbiting e⁻</text>
        </>
      )}
      {model==='bohr' && (
        <>
          <circle cx={100} cy={100} r={10} fill={color} opacity={0.9}/>
          {[1,2,3,4].map(n=>(
            <g key={n}>
              <circle cx={100} cy={100} r={n*22} fill="none" stroke={color} strokeWidth={0.8} opacity={0.4} strokeDasharray="4,2"/>
              <text x={100+n*22+4} y={103} fill={color} fontSize={7} opacity={0.6}>n={n}</text>
              <circle cx={100+n*22} cy={100} r={4} fill="#60a5fa"/>
            </g>
          ))}
          <text x={100} y={188} textAnchor="middle" fill="#849495" fontSize={8}>Fixed circular orbits (shells)</text>
        </>
      )}
      {model==='quantum' && (
        <>
          <circle cx={100} cy={100} r={10} fill={color} opacity={0.9}/>
          {/* Orbital cloud */}
          {Array.from({length:80},(_,i)=>{
            const r=20+Math.random()*55, θ=Math.random()*2*Math.PI
            const x=100+r*Math.cos(θ), y=100+r*Math.sin(θ)
            return <circle key={i} cx={x} cy={y} r={1.5} fill="#60a5fa" opacity={0.15+Math.random()*0.5}/>
          })}
          <text x={100} y={188} textAnchor="middle" fill="#849495" fontSize={8}>Probability cloud ψ² (orbital)</text>
        </>
      )}
    </svg>
  )
}

function getModelContent(model:Model): {label:string;content:string;isDefect?:boolean}[] {
  const data: Record<Model, {label:string;content:string;isDefect?:boolean}[]> = {
    dalton:[
      {label:'Postulates',content:'1. Atoms are indivisible particles\n2. All atoms of same element are identical\n3. Atoms combine in simple whole number ratios\n4. Chemical reactions rearrange atoms — not create/destroy'},
      {label:'Success',content:'Explained law of conservation of mass, definite proportions, and multiple proportions'},
      {label:'Failure',isDefect:true,content:'Cannot explain: sub-atomic particles, isotopes, isobars, allotropy, radioactivity, or spectral lines'},
    ],
    thomson:[
      {label:'Discovery',content:'J.J. Thomson discovered electron (1897) by cathode ray experiments. Measured e/m ratio = 1.76×10¹¹ C/kg'},
      {label:'Model',content:'Atom = positive sphere with electrons embedded like plums. Mass spread uniformly.'},
      {label:'Success',content:'Explained existence of electrons and electrical neutrality of atoms'},
      {label:'Failure',isDefect:true,content:'Rutherford\'s gold foil experiment completely disproved this model (1911)'},
    ],
    rutherford:[
      {label:'Gold Foil Experiment',content:'α-particles bombarded at gold foil. Most passed straight through. Some deflected. 1 in 20,000 bounced back! Proved: tiny, dense, positive nucleus.'},
      {label:'Model',content:'Nucleus (positive, tiny) at centre. Electrons orbit around it at large distances. Atom is mostly empty space.'},
      {label:'Success',content:'Explained large angle scattering. Estimated nuclear radius ~10⁻¹⁴ m vs atomic radius ~10⁻¹⁰ m'},
      {label:'Failure',isDefect:true,content:'Accelerating e⁻ should radiate → spiral into nucleus (Maxwell). Cannot explain discrete spectral lines.'},
    ],
    bohr:[
      {label:'Quantisation',content:'Angular momentum: L = mvr = nh/2π\nEnergy levels: Eₙ = −13.6/n² eV\nRadius: rₙ = 0.529n² Å (Bohr radius a₀)'},
      {label:'Spectral Success',content:'Explained Lyman, Balmer, Paschen series of H exactly. Rydberg constant from first principles: RH = me⁴/(8ε₀²h³c)'},
      {label:'Failure',isDefect:true,content:'Cannot explain: multi-electron atoms, fine structure (Zeeman/Stark effects), or wave nature of electron (de Broglie)'},
    ],
    quantum:[
      {label:'Schrödinger Equation',content:'Ĥψ = Eψ\nψ (wavefunction) gives probability of finding electron.\nψ² = probability density (orbital)\n|ψ|² integrated over all space = 1'},
      {label:'Heisenberg Uncertainty',content:'Δx·Δp ≥ h/4π\nCannot simultaneously know exact position AND momentum\nMakes Bohr\'s "orbit" concept meaningless'},
      {label:'de Broglie',content:'λ = h/mv (matter waves)\nElectron has wave nature: λ = h/mv\nOnly standing waves allowed → quantisation arises naturally'},
      {label:'Orbitals',content:'Region of space where probability of finding e⁻ is ≥90%. Described by quantum numbers n, l, mₗ, ms. Shapes: s (sphere), p (dumbbell), d (cloverleaf)'},
    ],
  }
  return data[model]
}
