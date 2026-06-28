'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Stereochemistry Simulator ──────────────────────────────────

type StereoConcept = 'rs'|'ez'|'optical'|'diastereomers'|'meso'|'conformations'

const CONCEPTS: {id:StereoConcept;label:string;color:string}[] = [
  {id:'rs',   label:'R/S Configuration',  color:'#06b6d4'},
  {id:'ez',   label:'E/Z Isomerism',      color:'#a78bfa'},
  {id:'optical',label:'Optical Isomers',  color:'#22c55e'},
  {id:'diastereomers',label:'Diastereomers',color:'#f97316'},
  {id:'meso', label:'Meso Compounds',     color:'#ec4899'},
  {id:'conformations',label:'Conformations',color:'#fbbf24'},
]

// R/S priority examples
const RS_EXAMPLES = [
  {
    name:'(R)-2-Bromobutane',sense:'R',
    center:'C2', groups:['Br (1st)','OH','CH₂CH₃','CH₃ (4th)'],
    desc:'Priority: Br > OH > CH₂CH₃ > CH₃ (atomic number order). Rotate molecule so lowest priority (CH₃) points away. Remaining 3 groups go clockwise → R.',
    svg:`<circle cx="100" cy="100" r="14" fill="#06b6d4" opacity="0.9"/>
<text x="100" y="104" text-anchor="middle" fill="white" font-size="11" font-weight="700">C*</text>
<text x="100" y="35" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">Br ①</text>
<line x1="100" y1="55" x2="100" y2="86" stroke="#ef4444" stroke-width="2"/>
<text x="168" y="100" text-anchor="middle" fill="#22c55e" font-size="11" font-weight="700">OH ②</text>
<line x1="155" y1="100" x2="114" y2="100" stroke="#22c55e" stroke-width="2"/>
<text x="32" y="100" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">Et ③</text>
<line x1="50" y1="100" x2="86" y2="100" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,2"/>
<text x="100" y="170" text-anchor="middle" fill="#849495" font-size="10">CH₃ ④</text>
<line x1="100" y1="155" x2="100" y2="114" stroke="#849495" stroke-width="1.5"/>
<path d="M 130 62 A 52 52 0 0 1 162 95" fill="none" stroke="#06b6d4" stroke-width="2" marker-end="url(#arr)"/>
<text x="160" y="58" fill="#06b6d4" font-size="10" font-weight="700">R ↻</text>`,
  },
  {
    name:'(S)-Lactic Acid',sense:'S',
    center:'C2', groups:['OH (1st)','COOH','CH₃','H (4th)'],
    desc:'Priority: OH > COOH > CH₃ > H. With H pointing away from you, the 1→2→3 rotation is anti-clockwise → S configuration.',
    svg:`<circle cx="100" cy="100" r="14" fill="#a78bfa" opacity="0.9"/>
<text x="100" y="104" text-anchor="middle" fill="white" font-size="11" font-weight="700">C*</text>
<text x="100" y="35" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="700">OH ①</text>
<line x1="100" y1="52" x2="100" y2="86" stroke="#ef4444" stroke-width="2"/>
<text x="168" y="100" text-anchor="middle" fill="#22c55e" font-size="10" font-weight="700">COOH ②</text>
<line x1="148" y1="100" x2="114" y2="100" stroke="#22c55e" stroke-width="2" stroke-dasharray="4,2"/>
<text x="32" y="100" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="700">CH₃ ③</text>
<line x1="52" y1="100" x2="86" y2="100" stroke="#fbbf24" stroke-width="2"/>
<text x="100" y="170" text-anchor="middle" fill="#849495" font-size="10">H ④</text>
<line x1="100" y1="155" x2="100" y2="114" stroke="#849495" stroke-width="1.5"/>
<path d="M 70 60 A 52 52 0 0 0 38 95" fill="none" stroke="#a78bfa" stroke-width="2" marker-end="url(#arr2)"/>
<text x="28" y="58" fill="#a78bfa" font-size="10" font-weight="700">S ↺</text>`,
  },
]

const EZ_EXAMPLES = [
  {name:'(E)-2-Butene',sense:'E',
   desc:'Higher priority group on EACH carbon is on OPPOSITE sides (E = entgegen, German for "opposite").\nC1: CH₃ > H. C2: CH₃ > H. The two CH₃ groups are TRANS → E.',
   svg:`<line x1="50" y1="100" x2="100" y2="100" stroke="#f8fafc" stroke-width="2"/>
<line x1="100" y1="100" x2="150" y2="100" stroke="#f8fafc" stroke-width="3"/>
<line x1="150" y1="100" x2="200" y2="100" stroke="#f8fafc" stroke-width="2"/>
<line x1="103" y1="100" x2="147" y2="100" stroke="#fbbf24" stroke-width="3"/>
<circle cx="100" cy="100" r="8" fill="#a78bfa"/>
<circle cx="150" cy="100" r="8" fill="#a78bfa"/>
<text x="30" y="88" fill="#ef4444" font-size="11" font-weight="700">CH₃①</text>
<text x="170" y="170" fill="#ef4444" font-size="11" font-weight="700">CH₃①</text>
<text x="30" y="125" fill="#849495" font-size="10">H ②</text>
<text x="170" y="85" fill="#849495" font-size="10">H ②</text>
<line x1="44" y1="94" x2="94" y2="96" stroke="#ef4444" stroke-width="1.5"/>
<line x1="106" y1="104" x2="156" y2="158" stroke="#ef4444" stroke-width="1.5"/>
<line x1="44" y1="116" x2="94" y2="104" stroke="#849495" stroke-width="1.5"/>
<line x1="106" y1="96" x2="170" y2="88" stroke="#849495" stroke-width="1.5"/>
<text x="115" y="78" fill="#a78bfa" font-size="11" font-weight="700">(E)</text>`,
  },
  {name:'(Z)-2-Butene',sense:'Z',
   desc:'Higher priority groups on SAME side (Z = zusammen, German for "together").\nBoth CH₃ groups are on the same side of the double bond → Z.',
   svg:`<line x1="50" y1="100" x2="100" y2="100" stroke="#f8fafc" stroke-width="2"/>
<line x1="100" y1="100" x2="150" y2="100" stroke="#fbbf24" stroke-width="3"/>
<line x1="150" y1="100" x2="200" y2="100" stroke="#f8fafc" stroke-width="2"/>
<circle cx="100" cy="100" r="8" fill="#22c55e"/>
<circle cx="150" cy="100" r="8" fill="#22c55e"/>
<text x="30" y="88" fill="#ef4444" font-size="11" font-weight="700">CH₃①</text>
<text x="160" y="88" fill="#ef4444" font-size="11" font-weight="700">CH₃①</text>
<text x="30" y="128" fill="#849495" font-size="10">H ②</text>
<text x="162" y="128" fill="#849495" font-size="10">H ②</text>
<line x1="44" y1="94" x2="94" y2="97" stroke="#ef4444" stroke-width="1.5"/>
<line x1="106" y1="97" x2="158" y2="92" stroke="#ef4444" stroke-width="1.5"/>
<text x="115" y="78" fill="#22c55e" font-size="11" font-weight="700">(Z)</text>`,
  },
]

const OPTICAL_EXAMPLES = [
  {name:'Enantiomers — (R) and (S) lactic acid',
   desc:'Non-superimposable mirror images. Identical physical properties (mp, bp, solubility) EXCEPT:\n• Rotate plane-polarised light by equal amounts in OPPOSITE directions\n• Different biological activity (enzymes are stereospecific)\n• Racemic mixture (50:50) = optically inactive (rotations cancel)',
   structures:['COOH above, OH right, H left, CH₃ below → (R)','Mirror image → (S)'],
   rule:'Two compounds are enantiomers if: 1 chiral centre → guaranteed enantiomers. Also: non-superimposable mirror images with any number of stereocentres.',
  },
  {name:'Diastereomers — (2R,3R) and (2R,3S) tartaric acid',
   desc:'Stereoisomers that are NOT mirror images (have different configurations at one or more but not all stereocentres).\n• Different physical properties (mp, bp, solubility ALL different)\n• Different chemical properties too\n• Example: D-glucose and D-galactose are diastereomers (differ only at C4)',
   structures:['(2R,3R)-tartaric acid','(2R,3S)-tartaric acid (meso — achiral!)'],
   rule:'n stereocentres → max 2ⁿ stereoisomers. But meso compounds reduce this number.',
  },
]

const MESO_EXAMPLES = [
  {name:'meso-Tartaric acid (2R,3S)',
   desc:'Has TWO chiral centres but is ACHIRAL overall because it has an internal plane of symmetry (σ).\n\n• Superimposable on its mirror image\n• Optically inactive despite having stereocentres\n• NOT same as racemic mixture (meso = single pure compound, racemic = 50:50 mixture)\n\nOther meso examples: meso-2,3-dibromobutane, meso-2,3-dichloropentanedioic acid',
  },
]

const CONFORMATIONS = [
  {name:'Ethane conformations',
   desc:'Newman projection: look along C–C bond.\n• Staggered (anti/gauche): most stable — 60° torsion angle\n• Eclipsed: least stable — 0° torsion angle, max H-H repulsion\n• Energy barrier ≈ 12 kJ/mol (small, rotation occurs at room temp)',
   antiGaucheDiff:'Anti > Gauche > Eclipsed in stability for n-butane',
  },
  {name:'Cyclohexane: chair vs boat',
   desc:'Chair: most stable — all bonds staggered. No angle or torsion strain.\n• Axial bonds (up/down)\n• Equatorial bonds (sideways)\n\nBoat: less stable — eclipsing and "flagpole" H-H interactions\n1,3-diaxial interactions: bulky groups prefer equatorial\ntert-Butyl cyclohexane: locks ring (t-Bu always equatorial)',
   antiGaucheDiff:'Chair-chair interconversion (ring flip) at room temp — axial ⇌ equatorial',
  },
]

export default function StereochemistrySim() {
  const [concept, setConcept] = useState<StereoConcept>('rs')
  const [rsIdx, setRsIdx] = useState(0)
  const [ezIdx, setEzIdx] = useState(0)
  const [optIdx, setOptIdx] = useState(0)

  const th = CONCEPTS.find(c=>c.id===concept)!

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',flexShrink:0}}>
        <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <strong style={{fontSize:14}}>Stereochemistry — R/S · E/Z · Optical Isomers · Meso · Conformations</strong>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left nav */}
        <div style={{width:185,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',padding:10,overflowY:'auto'}}>
          <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8}}>Topics</div>
          {CONCEPTS.map(c=>(
            <button key={c.id} onClick={()=>setConcept(c.id)}
              style={{display:'block',width:'100%',textAlign:'left',padding:'9px 10px',borderRadius:9,marginBottom:5,border:`1px solid ${concept===c.id?c.color+'60':'rgba(255,255,255,0.06)'}`,background:concept===c.id?c.color+'14':'rgba(255,255,255,0.02)',color:concept===c.id?c.color:'#849495',fontSize:11,cursor:'pointer',fontWeight:concept===c.id?700:400}}>
              {c.label}
            </button>
          ))}
          {/* Quick rules */}
          <div style={{marginTop:14,borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:10}}>
            <div style={{fontSize:9,color:'#f97316',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>CIP Priority Rules</div>
            {['1. Higher atomic number = higher priority','2. For isotopes: higher mass = higher priority','3. Double bond = phantom atom (count twice)','4. Point lowest priority AWAY, then read 1→2→3:\n   Clockwise = R, Anti-clockwise = S'].map((r,i)=>(
              <div key={i} style={{fontSize:8,color:'#849495',marginBottom:4,lineHeight:1.4}}>• {r}</div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{flex:1,overflowY:'auto',padding:16}}>
          <AnimatePresence mode="wait">
            <motion.div key={concept} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.2}}>

              {concept==='rs' && (
                <div>
                  <h2 style={{fontSize:18,fontWeight:900,color:th.color,marginBottom:8}}>R/S Configuration (CIP Rules)</h2>
                  <p style={{fontSize:11,color:'#849495',marginBottom:16}}>CIP (Cahn-Ingold-Prelog) rules assign absolute configuration to each chiral centre. R = Rectus (right, clockwise). S = Sinister (left, anticlockwise).</p>
                  <div style={{display:'flex',gap:10,marginBottom:12}}>
                    {RS_EXAMPLES.map((ex,i)=>(
                      <button key={i} onClick={()=>setRsIdx(i)}
                        style={{padding:'5px 14px',borderRadius:20,border:`1px solid ${rsIdx===i?th.color:'rgba(255,255,255,0.1)'}`,background:rsIdx===i?`${th.color}20`:'transparent',color:rsIdx===i?th.color:'#849495',fontSize:10,cursor:'pointer'}}>
                        {ex.name}
                      </button>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:20,alignItems:'flex-start',flexWrap:'wrap'}}>
                    <div style={{background:'rgba(9,14,28,0.8)',borderRadius:14,padding:16,border:`1px solid ${th.color}30`}}>
                      <svg viewBox="0 0 200 200" width={200} height={200} style={{display:'block'}}>
                        <defs>
                          <marker id="arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                            <polygon points="0 0,6 2.5,0 5" fill="#06b6d4"/>
                          </marker>
                          <marker id="arr2" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                            <polygon points="0 0,6 2.5,0 5" fill="#a78bfa"/>
                          </marker>
                        </defs>
                        <g dangerouslySetInnerHTML={{__html:RS_EXAMPLES[rsIdx].svg}}/>
                      </svg>
                    </div>
                    <div style={{flex:1,minWidth:220}}>
                      <div style={{fontSize:16,fontWeight:900,color:th.color,fontFamily:'monospace',marginBottom:8}}>{RS_EXAMPLES[rsIdx].name}</div>
                      <div style={{background:'rgba(26,31,47,0.8)',borderRadius:10,padding:'10px 14px',marginBottom:10}}>
                        <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',marginBottom:5}}>Priority Groups</div>
                        {RS_EXAMPLES[rsIdx].groups.map((g,i)=>(
                          <div key={i} style={{fontSize:11,color:['#ef4444','#22c55e','#fbbf24','#849495'][i],fontFamily:'monospace',marginBottom:3}}>
                            {i+1}. {g}
                          </div>
                        ))}
                      </div>
                      <div style={{background:`${th.color}10`,border:`1px solid ${th.color}30`,borderRadius:10,padding:'10px 14px'}}>
                        <div style={{fontSize:10,color:'#f8fafc',lineHeight:1.6}}>{RS_EXAMPLES[rsIdx].desc}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop:16,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.25)',borderRadius:10,padding:'10px 14px'}}>
                    <div style={{fontSize:10,color:'#fbbf24',fontWeight:700,marginBottom:4}}>JEE Key Points</div>
                    <div style={{fontSize:10,color:'#849495',lineHeight:1.6}}>
                      • If priority 4 is in front: reverse R/S assignment<br/>
                      • Switching any TWO groups changes R↔S<br/>
                      • Switching any TWO groups TWICE restores configuration<br/>
                      • Enantiomers: ALL stereocentres inverted (R→S and S→R)
                    </div>
                  </div>
                </div>
              )}

              {concept==='ez' && (
                <div>
                  <h2 style={{fontSize:18,fontWeight:900,color:th.color,marginBottom:8}}>E/Z Isomerism (Geometric Isomerism)</h2>
                  <p style={{fontSize:11,color:'#849495',marginBottom:16}}>Arises from restricted rotation (double bond or ring). E = entgegen (opposite); Z = zusammen (together). Apply CIP priorities to each sp² carbon separately.</p>
                  <div style={{display:'flex',gap:10,marginBottom:14}}>
                    {EZ_EXAMPLES.map((ex,i)=>(
                      <button key={i} onClick={()=>setEzIdx(i)}
                        style={{padding:'5px 14px',borderRadius:20,border:`1px solid ${ezIdx===i?th.color:'rgba(255,255,255,0.1)'}`,background:ezIdx===i?`${th.color}20`:'transparent',color:ezIdx===i?th.color:'#849495',fontSize:10,cursor:'pointer'}}>
                        {ex.name}
                      </button>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
                    <div style={{background:'rgba(9,14,28,0.8)',borderRadius:14,padding:16,border:`1px solid ${th.color}30`}}>
                      <svg viewBox="0 0 230 200" width={230} height={200}>
                        <g dangerouslySetInnerHTML={{__html:EZ_EXAMPLES[ezIdx].svg}}/>
                      </svg>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontWeight:900,color:th.color,marginBottom:8}}>{EZ_EXAMPLES[ezIdx].name}</div>
                      <div style={{background:`${th.color}10`,border:`1px solid ${th.color}30`,borderRadius:10,padding:'10px 14px'}}>
                        <div style={{fontSize:10,color:'#f8fafc',whiteSpace:'pre-line',lineHeight:1.6}}>{EZ_EXAMPLES[ezIdx].desc}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {[
                      {title:'Conditions for E/Z',content:'• Restricted rotation (C=C, C=N, ring)\n• EACH doubly-bonded atom must have 2 different groups\n• CHCl=CHCl: E/Z possible. CH₂=CHCl: no (one C has 2 same groups)'},
                      {title:'Old cis/trans system',content:'• cis: same groups on same side (H atoms cis)\n• trans: same groups on opposite sides\n• Only valid when each C has H + one other group\n• CIP E/Z is universal — works for all cases'},
                    ].map(x=>(
                      <div key={x.title} style={{background:'rgba(26,31,47,0.8)',borderRadius:10,padding:'9px 12px',border:'1px solid rgba(255,255,255,0.07)'}}>
                        <div style={{fontSize:10,color:th.color,fontWeight:700,marginBottom:4}}>{x.title}</div>
                        <div style={{fontSize:9,color:'#849495',whiteSpace:'pre-line',lineHeight:1.5}}>{x.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {concept==='optical' && (
                <div>
                  <h2 style={{fontSize:18,fontWeight:900,color:th.color,marginBottom:8}}>Optical Isomers</h2>
                  <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
                    {OPTICAL_EXAMPLES.map((ex,i)=>(
                      <button key={i} onClick={()=>setOptIdx(i)}
                        style={{padding:'5px 14px',borderRadius:20,border:`1px solid ${optIdx===i?th.color:'rgba(255,255,255,0.1)'}`,background:optIdx===i?`${th.color}20`:'transparent',color:optIdx===i?th.color:'#849495',fontSize:10,cursor:'pointer'}}>
                        {ex.name.split('—')[0].trim()}
                      </button>
                    ))}
                  </div>
                  <div style={{background:`${th.color}10`,border:`1px solid ${th.color}30`,borderRadius:12,padding:'12px 16px',marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:700,color:th.color,marginBottom:6}}>{OPTICAL_EXAMPLES[optIdx].name}</div>
                    <div style={{fontSize:10,color:'#f8fafc',whiteSpace:'pre-line',lineHeight:1.7}}>{OPTICAL_EXAMPLES[optIdx].desc}</div>
                  </div>
                  <div style={{background:'rgba(26,31,47,0.8)',borderRadius:10,padding:'10px 14px',border:`1px solid ${th.color}20`,marginBottom:10}}>
                    <div style={{fontSize:10,color:th.color,fontWeight:700,marginBottom:4}}>Stereoisomers: {OPTICAL_EXAMPLES[optIdx].structures[0]}</div>
                    {OPTICAL_EXAMPLES[optIdx].structures[1] && <div style={{fontSize:10,color:'#849495',marginBottom:4}}>↔ Mirror image: {OPTICAL_EXAMPLES[optIdx].structures[1]}</div>}
                    <div style={{fontSize:10,color:'#849495',marginTop:6,paddingTop:6,borderTop:'1px solid rgba(255,255,255,0.07)'}}>{OPTICAL_EXAMPLES[optIdx].rule}</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[
                      {title:'Plane-polarised light',content:'Normal light: all planes. Polarised: one plane.\n(+) or d: rotates clockwise (dextrorotatory)\n(−) or l: rotates anti-clockwise (levorotatory)\nMagnitude ∝ concentration and path length'},
                      {title:'Racemic mixture',content:'50:50 enantiomers. Optically inactive because rotations cancel exactly.\nCannot be separated by ordinary physical means.\nResolution needed: form diastereomeric salts, chiral HPLC, enzymatic resolution'},
                      {title:'Specific rotation [α]',content:'[α] = α/(l × c)\nα = observed rotation (degrees)\nl = path length (dm)\nc = concentration (g/mL)\nEnantiomers: [α]D same magnitude, opposite sign'},
                    ].map(x=>(
                      <div key={x.title} style={{background:'rgba(9,14,28,0.7)',borderRadius:9,padding:'8px 10px',border:'1px solid rgba(255,255,255,0.06)'}}>
                        <div style={{fontSize:9,color:th.color,fontWeight:700,marginBottom:3}}>{x.title}</div>
                        <div style={{fontSize:8,color:'#849495',whiteSpace:'pre-line',lineHeight:1.5}}>{x.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {concept==='diastereomers' && (
                <div>
                  <h2 style={{fontSize:18,fontWeight:900,color:th.color,marginBottom:8}}>Diastereomers</h2>
                  <p style={{fontSize:11,color:'#849495',marginBottom:14}}>Stereoisomers that are NOT enantiomers. Same connectivity, but different configuration at one or more (not all) stereocentres. Have DIFFERENT physical and chemical properties.</p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                    {[
                      {title:'vs Enantiomers',content:'Enantiomers: mirror images, ALL centres inverted\nDiastereomers: NOT mirror images, some centres inverted\nEnantiomers: same mp, bp, solubility (differ only optically)\nDiastereomers: ALL physical properties differ → can be separated by distillation, chromatography, crystallisation'},
                      {title:'Counting stereoisomers',content:'n chiral centres → max 2ⁿ stereoisomers\n1 centre: 2 (R and S — enantiomers)\n2 centres: up to 4 (2 pairs of enantiomers, or fewer if meso)\n3 centres: up to 8\nReduce for meso: always check for internal plane of symmetry'},
                    ].map(x=>(
                      <div key={x.title} style={{background:'rgba(26,31,47,0.8)',borderRadius:10,padding:'10px 14px',border:`1px solid ${th.color}25`}}>
                        <div style={{fontSize:10,color:th.color,fontWeight:700,marginBottom:4}}>{x.title}</div>
                        <div style={{fontSize:9,color:'#849495',whiteSpace:'pre-line',lineHeight:1.5}}>{x.content}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:`${th.color}10`,border:`1px solid ${th.color}30`,borderRadius:12,padding:'12px 16px'}}>
                    <div style={{fontSize:12,color:th.color,fontWeight:700,marginBottom:6}}>Famous diastereomer pairs (JEE)</div>
                    {[
                      ['D-glucose and D-galactose','Epimers at C4 (diastereomers differing at ONE centre). Same at C1,2,3,5,6.'],
                      ['D-glucose and D-mannose','Epimers at C2.'],
                      ['D-glucose and D-fructose','Constitutional isomers (NOT stereoisomers) — different connectivity (aldose vs ketose).'],
                      ['(2R,3R) and (2R,3S)-tartaric acid','(2R,3S) is the MESO form → achiral. (2R,3R) and (2S,3S) are enantiomers.'],
                    ].map(([p,n])=>(
                      <div key={p} style={{marginBottom:8,paddingBottom:8,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                        <div style={{fontSize:11,fontFamily:'monospace',color:'#f8fafc',fontWeight:600}}>{p}</div>
                        <div style={{fontSize:9,color:'#849495',marginTop:2}}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {concept==='meso' && (
                <div>
                  <h2 style={{fontSize:18,fontWeight:900,color:th.color,marginBottom:8}}>Meso Compounds</h2>
                  <p style={{fontSize:11,color:'#849495',marginBottom:14}}>A meso compound has chiral centres but is ACHIRAL overall due to an internal plane of symmetry (or centre of symmetry). It is superimposable on its mirror image.</p>
                  <div style={{background:`${th.color}10`,border:`1px solid ${th.color}30`,borderRadius:12,padding:'14px 18px',marginBottom:14}}>
                    <div style={{fontSize:14,fontWeight:700,color:th.color,marginBottom:8}}>meso-Tartaric acid (2R,3S)</div>
                    <div style={{fontSize:11,color:'#f8fafc',whiteSpace:'pre-line',lineHeight:1.7,marginBottom:10}}>{MESO_EXAMPLES[0].desc}</div>
                    {/* Simple meso diagram */}
                    <svg viewBox="0 0 300 160" width="100%" height={120}>
                      <text x="150" y="20" textAnchor="middle" fill="#ec4899" fontSize={11} fontWeight={700}>meso-Tartaric Acid</text>
                      {/* Upper C */}
                      <circle cx="150" cy="55" r="12" fill="#ec4899" opacity={0.8}/>
                      <text x="150" y="59" textAnchor="middle" fill="white" fontSize={9} fontWeight={700}>C*R</text>
                      <text x="90" y="48" fill="#ef4444" fontSize={10}>OH</text>
                      <line x1="105" y1="52" x2="138" y2="53" stroke="#ef4444" strokeWidth={1.5}/>
                      <text x="200" y="48" fill="#06b6d4" fontSize={10}>COOH</text>
                      <line x1="163" y1="52" x2="196" y2="48" stroke="#06b6d4" strokeWidth={1.5}/>
                      {/* Middle bond */}
                      <line x1="150" y1="67" x2="150" y2="93" stroke="#f8fafc" strokeWidth={2}/>
                      {/* Mirror plane */}
                      <line x1="50" y1="80" x2="250" y2="80" stroke="#fbbf24" strokeWidth={1} strokeDasharray="6,3"/>
                      <text x="258" y="84" fill="#fbbf24" fontSize={9}>σ plane</text>
                      {/* Lower C */}
                      <circle cx="150" cy="105" r="12" fill="#ec4899" opacity={0.8}/>
                      <text x="150" y="109" textAnchor="middle" fill="white" fontSize={9} fontWeight={700}>C*S</text>
                      <text x="200" y="113" fill="#ef4444" fontSize={10}>OH</text>
                      <line x1="163" y1="107" x2="196" y2="111" stroke="#ef4444" strokeWidth={1.5}/>
                      <text x="75" y="113" fill="#06b6d4" fontSize={10}>COOH</text>
                      <line x1="105" y1="108" x2="138" y2="107" stroke="#06b6d4" strokeWidth={1.5}/>
                    </svg>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {[
                      {title:'Identifying meso compounds',content:'1. Identify all chiral centres\n2. Draw extended (zigzag) structure\n3. Look for internal mirror plane\n4. Confirm: molecule superimposable on mirror image\nShortcut: RSSR or SSRR patterns with symmetric structure'},
                      {title:'Meso vs Racemic',content:'Meso: SINGLE compound, optically inactive\nRacemic: MIXTURE of 2 enantiomers, optically inactive\nDifference: meso has different melting point, density etc.\nRacemic = two distinct molecules mixed; meso = one molecule\nMeso cannot be resolved; racemic can be resolved'},
                    ].map(x=>(
                      <div key={x.title} style={{background:'rgba(26,31,47,0.8)',borderRadius:10,padding:'10px 12px',border:`1px solid ${th.color}25`}}>
                        <div style={{fontSize:10,color:th.color,fontWeight:700,marginBottom:4}}>{x.title}</div>
                        <div style={{fontSize:9,color:'#849495',whiteSpace:'pre-line',lineHeight:1.5}}>{x.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {concept==='conformations' && (
                <div>
                  <h2 style={{fontSize:18,fontWeight:900,color:th.color,marginBottom:8}}>Conformational Analysis</h2>
                  <p style={{fontSize:11,color:'#849495',marginBottom:14}}>Conformations differ by rotation around σ bonds (NOT isomers — cannot be separated). Different energy levels due to torsional strain, steric strain, and angle strain.</p>
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {CONFORMATIONS.map((conf,i)=>(
                      <div key={i} style={{background:'rgba(26,31,47,0.85)',borderRadius:12,padding:'12px 16px',border:`1px solid ${th.color}25`}}>
                        <div style={{fontSize:13,fontWeight:700,color:th.color,marginBottom:6}}>{conf.name}</div>
                        <div style={{fontSize:10,color:'#f8fafc',whiteSpace:'pre-line',lineHeight:1.6,marginBottom:6}}>{conf.desc}</div>
                        <div style={{fontSize:10,color:'#fbbf24',fontFamily:'monospace'}}>{conf.antiGaucheDiff}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {[
                      {title:'Strain types',content:'Torsional (eclipsing) strain: H-H interactions when dihedral=0°\nSteric strain: bulky group repulsion\nAngle strain: deviation from ideal bond angles (Baeyer strain in small rings)'},
                      {title:'Ring strain order',content:'Cyclopropane: max strain (60° vs 109.5°)\nCyclobutane: large strain\nCyclopentane: nearly strainless (108°)\nCyclohexane: strainless (chair form, all 109.5°)\nLarger rings: nearly strainless'},
                      {title:'1,3-Diaxial interactions',content:'In chair cyclohexane: axial groups at 1 and 3 positions are close (2.5Å).\nLarge substituents STRONGLY prefer equatorial position.\ntert-Bu group: equatorial preference ≈ 23 kJ/mol\nCH₃: equatorial preference ≈ 7 kJ/mol'},
                    ].map(x=>(
                      <div key={x.title} style={{background:'rgba(9,14,28,0.7)',borderRadius:9,padding:'8px 10px',border:'1px solid rgba(255,255,255,0.06)'}}>
                        <div style={{fontSize:9,color:th.color,fontWeight:700,marginBottom:3}}>{x.title}</div>
                        <div style={{fontSize:8,color:'#849495',whiteSpace:'pre-line',lineHeight:1.5}}>{x.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
