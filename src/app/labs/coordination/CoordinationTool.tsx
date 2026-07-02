'use client'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Coordination Compounds Simulator ──────────────────────────

const METALS = [
  { sym:'Ti³⁺', d:1, Z:22 }, { sym:'V³⁺',  d:2, Z:23 }, { sym:'Cr³⁺', d:3, Z:24 },
  { sym:'Mn³⁺', d:4, Z:25 }, { sym:'Fe³⁺',  d:5, Z:26 }, { sym:'Fe²⁺', d:6, Z:26 },
  { sym:'Co³⁺', d:6, Z:27 }, { sym:'Co²⁺',  d:7, Z:27 }, { sym:'Ni²⁺', d:8, Z:28 },
  { sym:'Cu²⁺', d:9, Z:29 }, { sym:'Zn²⁺',  d:10,Z:30 },
]

interface Ligand { name:string; sym:string; charge:number; denticity:number; fieldStrength:number; donorAtom:string; color:string }
const LIGANDS: Ligand[] = [
  { name:'Iodide',     sym:'I⁻',    charge:-1, denticity:1, fieldStrength:1, donorAtom:'I', color:'#a78bfa' },
  { name:'Bromide',    sym:'Br⁻',   charge:-1, denticity:1, fieldStrength:2, donorAtom:'Br',color:'#8b5cf6' },
  { name:'Chloride',   sym:'Cl⁻',   charge:-1, denticity:1, fieldStrength:3, donorAtom:'Cl',color:'#ef4444' },
  { name:'Fluoride',   sym:'F⁻',    charge:-1, denticity:1, fieldStrength:4, donorAtom:'F', color:'#f87171' },
  { name:'Water',      sym:'H₂O',   charge:0,  denticity:1, fieldStrength:5, donorAtom:'O', color:'#06b6d4' },
  { name:'Ammonia',    sym:'NH₃',   charge:0,  denticity:1, fieldStrength:7, donorAtom:'N', color:'#22c55e' },
  { name:'en',         sym:'en',    charge:0,  denticity:2, fieldStrength:8, donorAtom:'N,N',color:'#34d399' },
  { name:'Nitrite-N',  sym:'NO₂⁻',  charge:-1, denticity:1, fieldStrength:9, donorAtom:'N', color:'#fbbf24' },
  { name:'Cyanide',    sym:'CN⁻',   charge:-1, denticity:1, fieldStrength:11,donorAtom:'C', color:'#f97316' },
  { name:'CO',         sym:'CO',    charge:0,  denticity:1, fieldStrength:12,donorAtom:'C', color:'#ec4899' },
  { name:'EDTA',       sym:'EDTA⁴⁻',charge:-4, denticity:6, fieldStrength:8, donorAtom:'N,O',color:'#06b6d4' },
  { name:'oxalate',    sym:'ox²⁻',  charge:-2, denticity:2, fieldStrength:6, donorAtom:'O,O',color:'#a78bfa' },
]

const CFSE: Record<number,{hs:string;ls:string;hsU:number;lsU:number}> = {
  0:{hs:'0',ls:'0',hsU:0,lsU:0},1:{hs:'-0.4',ls:'-0.4',hsU:1,lsU:1},
  2:{hs:'-0.8',ls:'-0.8',hsU:2,lsU:2},3:{hs:'-1.2',ls:'-1.2',hsU:3,lsU:3},
  4:{hs:'-0.6',ls:'-1.6',hsU:4,lsU:2},5:{hs:'0',ls:'-2.0',hsU:5,lsU:1},
  6:{hs:'-0.4',ls:'-2.4',hsU:4,lsU:0},7:{hs:'-0.8',ls:'-1.8',hsU:3,lsU:1},
  8:{hs:'-1.2',ls:'-1.2',hsU:2,lsU:2},9:{hs:'-0.6',ls:'-0.6',hsU:1,lsU:1},
  10:{hs:'0',ls:'0',hsU:0,lsU:0},
}

function getSlots(d:number, ls:boolean): number[] {
  const s=[0,0,0,0,0]; let e=d
  if(ls){
    for(let i=0;i<3&&e>0;i++){s[i]++;e--}
    for(let i=0;i<3&&e>0;i++){s[i]++;e--}
    for(let i=3;i<5&&e>0;i++){s[i]++;e--}
    for(let i=3;i<5&&e>0;i++){s[i]++;e--}
  } else {
    for(let i=0;i<5&&e>0;i++){s[i]++;e--}
    for(let i=0;i<5&&e>0;i++){s[i]++;e--}
  }
  return s
}

const ISOMERS = {
  ionisation:[
    {a:'[Co(NH₃)₅Br]SO₄',b:'[Co(NH₃)₅SO₄]Br',note:'Br vs SO₄ inside sphere. AgNO₃ test: first gives AgBr↓, second no precipitate immediately.'},
    {a:'[Pt(NH₃)₄Cl₂]Br₂',b:'[Pt(NH₃)₄Br₂]Cl₂',note:'Different ions in outer sphere. 2 Br⁻ vs 2 Cl⁻ free in solution.'},
  ],
  hydrate:[
    {a:'[Cr(H₂O)₆]Cl₃  violet',b:'[Cr(H₂O)₅Cl]Cl₂·H₂O  blue-green',note:'Famous hydrate isomers of CrCl₃·6H₂O. Different colour, conductivity, and Cl⁻ precipitated by AgNO₃.'},
    {a:'[Cr(H₂O)₄Cl₂]Cl·2H₂O  dark green',b:'',note:'Third isomer. Only 1 Cl⁻ free per formula unit.'},
  ],
  linkage:[
    {a:'[Co(NH₃)₅-NO₂]²⁺  yellow (nitro, N-bonded)',b:'[Co(NH₃)₅-ONO]²⁺  red (nitrito, O-bonded)',note:'Ambidentate NO₂⁻: N-bonded more stable (nitro), O-bonded less stable (nitrito). Light or heat converts red→yellow.'},
    {a:'[Co(NH₃)₅-SCN]²⁺  (thiocyanato-S)',b:'[Co(NH₃)₅-NCS]²⁺  (isothiocyanato-N)',note:'SCN⁻ is ambidentate. Soft metals prefer S; hard metals prefer N.'},
  ],
  coordination:[
    {a:'[Pt(NH₃)₄][PtCl₄]  (Magnus green salt)',b:'[Pt(NH₃)₃Cl][Pt(NH₃)Cl₃]',note:'Same empirical formula Pt(NH₃)₂Cl₂ but two different metal centres with different ligand distributions.'},
  ],
  geometric:[
    {a:'cis-[Pt(NH₃)₂Cl₂]  cisplatin (anticancer!)',b:'trans-[Pt(NH₃)₂Cl₂]  transplatin (inactive)',note:'cis: same groups adjacent. ONLY cisplatin is pharmacologically active — it cross-links DNA. A classic JEE example.'},
    {a:'cis-[Co(en)₂Cl₂]⁺  violet',b:'trans-[Co(en)₂Cl₂]⁺  green',note:'en is bidentate — forces cis-like arrangement. trans has both Cl 180° apart.'},
    {a:'fac-[Co(NH₃)₃Cl₃]  facial (3 same on one triangular face)',b:'mer-[Co(NH₃)₃Cl₃]  meridional (3 same in a plane)',note:'Octahedral MA₃B₃: fac and mer are distinct isomers. fac has C₃ symmetry, mer has no C₃.'},
  ],
  optical:[
    {a:'Δ-[Co(en)₃]³⁺  (right-handed, dextro, +)',b:'Λ-[Co(en)₃]³⁺  (left-handed, levo, −)',note:'Non-superimposable mirror images. Rotate plane-polarised light oppositely. [Co(en)₃]³⁺ has no plane of symmetry → optically active.'},
    {a:'Δ-cis-[Co(en)₂Cl₂]⁺  optically active',b:'trans-[Co(en)₂Cl₂]⁺  NOT optically active (has σh)',note:'Only cis isomer is optically active. trans has a plane of symmetry ⊥ to the molecular axis → achiral.'},
  ],
}

function GeomSVG({ cn, color, lig }: { cn:number; color:string; lig:string }) {
  const L = lig.length > 4 ? 'L' : lig
  const M = { cx:100, cy:100 }
  const positions6 = [[100,28],[100,172],[172,100],[28,100],[148,55],[52,145]]
  const positions4_sq = [[100,30],[100,170],[30,100],[170,100]]
  const positions4_tet = [[60,55],[140,55],[60,145],[140,145]]
  const positions2 = [[25,100],[175,100]]
  const pos = cn===6?positions6 : cn===4?(color==='#ec4899'?positions4_sq:positions4_tet) : positions2
  const n = Math.min(cn, pos.length)
  return (
    <svg viewBox="0 0 200 200" width={170} height={170}>
      {pos.slice(0,n).map(([lx,ly],i) => (
        <g key={i}>
          <line x1={M.cx} y1={M.cy} x2={lx} y2={ly} stroke={color} strokeWidth={1.5} opacity={0.6} strokeDasharray={i>=4?'4,2':undefined}/>
          <circle cx={lx} cy={ly} r={13} fill={color} opacity={0.25} stroke={color} strokeWidth={1}/>
          <text x={lx} y={ly+4} textAnchor="middle" fill={color} fontSize={9} fontWeight={700}>{L}</text>
        </g>
      ))}
      <circle cx={M.cx} cy={M.cy} r={17} fill={color} opacity={0.85}/>
      <text x={M.cx} y={M.cy+4} textAnchor="middle" fill="white" fontSize={10} fontWeight={700}>M</text>
      <text x={100} y={196} textAnchor="middle" fill="#849495" fontSize={8}>
        {cn===6?'Octahedral':cn===4?(color==='#ec4899'?'Square Planar':'Tetrahedral'):'Linear'}
      </text>
    </svg>
  )
}

function OrbDiag({ d, ls, color }: { d:number; ls:boolean; color:string }) {
  const s = getSlots(d, ls)
  const sc = ls ? '#06b6d4' : '#ef4444'
  const draw = (e:number, x:number, y:number) => (
    <g key={`${x}${y}`}>
      <line x1={x-20} y1={y} x2={x+20} y2={y} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5}/>
      {e>=1&&<text x={x-7} y={y-2} fill="#f8fafc" fontSize={14}>↑</text>}
      {e>=2&&<text x={x+4}  y={y-2} fill={sc}     fontSize={14}>↓</text>}
    </g>
  )
  return (
    <svg viewBox="0 0 280 160" width="100%" height={140}>
      {/* eg */}
      {[3,4].map((si,i) => draw(s[si], 80+i*90, 35))}
      <text x={4} y={39} fill="#ef4444" fontSize={8}>eg +0.6Δ</text>
      {/* t2g */}
      {[0,1,2].map((si,i) => draw(s[si], 50+i*72, 115))}
      <text x={4} y={119} fill="#06b6d4" fontSize={8}>t2g −0.4Δ</text>
      <line x1={258} y1={35} x2={258} y2={115} stroke="rgba(251,191,36,0.5)" strokeWidth={1} strokeDasharray="3,2"/>
      <text x={265} y={78} fill="#fbbf24" fontSize={9}>Δo</text>
    </svg>
  )
}

export default function CoordinationSim() {
  const [metalIdx, setMetalIdx] = useState(6)
  const [lcounts, setLcounts] = useState<Record<number,number>>({ 5:6 }) // Co³⁺ + 6NH₃
  const [isoTab, setIsoTab] = useState<keyof typeof ISOMERS>('geometric')

  const metal = METALS[metalIdx]
  const totalCN = Object.values(lcounts).reduce((s,c)=>s+c,0)
  const avgField = Object.entries(lcounts).reduce((s,[i,c])=>s+(LIGANDS[+i]?.fieldStrength??0)*c,0)/Math.max(1,totalCN)
  const isLowSpin = avgField >= 6.5 && totalCN === 6 && metal.d >= 4 && metal.d <= 7
  const cfse = CFSE[metal.d] ?? CFSE[0]
  const unpaired = isLowSpin ? cfse.lsU : cfse.hsU
  const mu = Math.sqrt(unpaired*(unpaired+2))
  const metalCharge = +(metal.sym.match(/(\d+)[⁺]/)?.[1]??2)
  const ligCharge = Object.entries(lcounts).reduce((s,[i,c])=>s+(LIGANDS[+i]?.charge??0)*c,0)
  const cplxCharge = metalCharge + ligCharge
  const mainLigIdx = +(Object.entries(lcounts).sort((a,b)=>b[1]-a[1])[0]?.[0]??5)
  const mainLig = LIGANDS[mainLigIdx]
  const geomName = totalCN===6?'Octahedral':totalCN===4?(isLowSpin&&metal.d===8?'Square Planar':'Tetrahedral'):totalCN===2?'Linear':'—'
  const hybName = totalCN===6?(isLowSpin?'d²sp³ (inner)':'sp³d² (outer)'):totalCN===4?(metal.d===8&&isLowSpin?'dsp²':'sp³'):'sp'

  const add = (i:number) => { if(totalCN>=8)return; setLcounts(p=>({...p,[i]:(p[i]??0)+1})) }
  const rem = (i:number) => setLcounts(p=>{ const n={...p}; if((n[i]??0)>0)n[i]--; if(!n[i])delete n[i]; return n })

  // EAN
  const metalE = metal.Z - metalCharge
  const ligDonate = Object.entries(lcounts).reduce((s,[i,c])=>s+(LIGANDS[+i]?.denticity??1)*c*2,0)
  const ean = metalE + ligDonate
  const eanNoble = [36,54,86].includes(ean)

  // Build name parts for formula
  const formulaParts = LIGANDS.map((l,i)=>lcounts[i]?`${l.sym}×${lcounts[i]}`:'').filter(Boolean).join(' ')
  const chargeStr = cplxCharge===0?'':cplxCharge>0?`${cplxCharge}+`:`${Math.abs(cplxCharge)}−`
  const formula = `[${metal.sym.replace(/[⁺²³]/g,'')}(${formulaParts||'…'})]${chargeStr}`

  const thC = mainLig.color

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',flexShrink:0}}>
        <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <strong style={{fontSize:14}}>Coordination Chemistry — Build Complex · Geometry · Isomerism</strong>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left builder */}
        <div style={{width:215,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',overflowY:'auto',padding:10}}>
          <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8}}>Central Metal Ion</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginBottom:12}}>
            {METALS.map((m,i)=>(
              <button key={i} onClick={()=>setMetalIdx(i)}
                style={{padding:'5px 4px',borderRadius:7,border:`1px solid ${metalIdx===i?'#06b6d4':'rgba(255,255,255,0.08)'}`,background:metalIdx===i?'rgba(6,182,212,0.2)':'transparent',color:metalIdx===i?'#06b6d4':'#849495',fontSize:10,cursor:'pointer',fontWeight:metalIdx===i?700:400,fontFamily:'monospace'}}>
                <div>{m.sym}</div><div style={{fontSize:8,opacity:0.7}}>d{m.d}</div>
              </button>
            ))}
          </div>
          <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:5}}>Ligands  (CN={totalCN}/8)</div>
          <div style={{fontSize:8,color:'#849495',marginBottom:8}}>← weak ···················· strong →</div>
          {LIGANDS.map((l,i)=>(
            <div key={i} style={{display:'flex',gap:4,alignItems:'center',marginBottom:5}}>
              <div style={{width:44,fontSize:9,color:l.color,fontFamily:'monospace',fontWeight:700}}>{l.sym}</div>
              <div style={{width:12,fontSize:7,color:'#849495',textAlign:'center'}}>{l.denticity}D</div>
              <div style={{flex:1,height:2,background:'rgba(255,255,255,0.05)',borderRadius:1}}>
                <div style={{height:'100%',width:`${l.fieldStrength*8}%`,background:l.color,borderRadius:1}}/>
              </div>
              <button onClick={()=>rem(i)} style={{width:18,height:18,borderRadius:3,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#849495',fontSize:13,cursor:'pointer',lineHeight:'16px'}}>−</button>
              <div style={{width:14,textAlign:'center',fontSize:10,color:l.color,fontWeight:700}}>{lcounts[i]??0}</div>
              <button onClick={()=>add(i)} style={{width:18,height:18,borderRadius:3,border:`1px solid ${l.color}50`,background:`${l.color}18`,color:l.color,fontSize:13,cursor:'pointer',lineHeight:'16px'}}>+</button>
            </div>
          ))}
          <button onClick={()=>setLcounts({})} style={{width:'100%',marginTop:8,padding:'5px',borderRadius:8,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:'#849495',fontSize:10,cursor:'pointer'}}>Clear</button>
        </div>

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',padding:12,gap:10}}>
          {/* Formula bar */}
          <div style={{background:`${thC}10`,border:`1px solid ${thC}40`,borderRadius:12,padding:'8px 14px',flexShrink:0}}>
            <div style={{fontSize:20,fontWeight:900,fontFamily:'monospace',color:thC}}>{formula}</div>
            <div style={{display:'flex',gap:12,marginTop:5,flexWrap:'wrap'}}>
              {[
                {label:'Geometry',val:geomName,color:thC},
                {label:'Hybridization',val:hybName,color:'#a78bfa'},
                {label:'Charge',val:cplxCharge===0?'0':cplxCharge>0?`+${cplxCharge}`:`${cplxCharge}`,color:'#fbbf24'},
                {label:'Spin',val:isLowSpin?'Low Spin':'High Spin',color:isLowSpin?'#06b6d4':'#ef4444'},
                {label:'CFSE',val:`${isLowSpin?cfse.ls:cfse.hs}Δo`,color:'#34d399'},
                {label:'Unpaired e⁻',val:String(unpaired),color:unpaired>0?'#f97316':'#22c55e'},
                {label:'μ (BM)',val:mu.toFixed(2),color:'#ec4899'},
                {label:'EAN',val:String(ean),color:eanNoble?'#22c55e':'#849495'},
              ].map(x=>(
                <div key={x.label} style={{textAlign:'center'}}>
                  <div style={{fontSize:8,color:'#849495'}}>{x.label}</div>
                  <div style={{fontSize:11,fontWeight:700,fontFamily:'monospace',color:x.color}}>{x.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Geometry + orbital diagram */}
          <div style={{display:'flex',gap:10,flexShrink:0}}>
            <div style={{background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 12px',display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{fontSize:9,color:'#849495',marginBottom:4}}>3D Geometry</div>
              {totalCN>0
                ? <GeomSVG cn={totalCN} color={thC} lig={mainLig.sym}/>
                : <div style={{width:170,height:170,display:'flex',alignItems:'center',justifyContent:'center',color:'#3a4060',fontSize:11}}>Add ligands</div>
              }
            </div>
            <div style={{flex:1,background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 12px'}}>
              <div style={{fontSize:9,color:'#849495',marginBottom:2}}>d-Orbital Splitting — d{metal.d} {isLowSpin?'Low Spin':'High Spin'}</div>
              <OrbDiag d={metal.d} ls={isLowSpin} color={thC}/>
              <div style={{display:'flex',gap:12,fontSize:9,color:'#849495',marginTop:4}}>
                <span>t2g: [{[0,1,2].map(i=>getSlots(metal.d,isLowSpin)[i]).join(',')}]</span>
                <span>eg: [{[3,4].map(i=>getSlots(metal.d,isLowSpin)[i]).join(',')}]</span>
                <span style={{color:isLowSpin?'#06b6d4':'#ef4444'}}>{isLowSpin?'Strong field → pair first':'Weak field → Hund\'s rule'}</span>
              </div>
            </div>
            <div style={{minWidth:135,background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 12px'}}>
              <div style={{fontSize:9,color:'#849495',marginBottom:6}}>EAN / 18-electron</div>
              {[{label:'Metal e⁻',val:metalE},{label:'Ligand donate',val:`+${ligDonate}`},{label:'Total (EAN)',val:ean}].map(x=>(
                <div key={x.label} style={{display:'flex',justifyContent:'space-between',fontSize:9,marginBottom:5,padding:'3px 6px',borderRadius:5,background:'rgba(255,255,255,0.03)'}}>
                  <span style={{color:'#849495'}}>{x.label}</span>
                  <span style={{color:'#f8fafc',fontFamily:'monospace',fontWeight:700}}>{x.val}</span>
                </div>
              ))}
              <div style={{fontSize:8,padding:'5px 7px',borderRadius:7,background:eanNoble?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.08)',border:`1px solid ${eanNoble?'#22c55e':'#ef4444'}40`,color:eanNoble?'#22c55e':'#ef4444',fontWeight:700}}>
                {eanNoble?`✓ Noble gas (${ean})`:`Not 36/54/86`}
              </div>
              <div style={{fontSize:7,color:'#849495',marginTop:5,lineHeight:1.4}}>CO complexes obey 18e: Ni(CO)₄ (36), Fe(CO)₅ (36), Cr(CO)₆ (36)</div>
            </div>
          </div>

          {/* Isomerism */}
          <div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column',background:'rgba(9,14,28,0.6)',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.07)',flexShrink:0,overflowX:'auto'}}>
              <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',padding:'6px 10px',whiteSpace:'nowrap',flexShrink:0}}>Isomerism:</div>
              {([['ionisation','Ionisation'],['hydrate','Hydrate'],['linkage','Linkage'],['coordination','Coordination'],['geometric','Geometric'],['optical','Optical']] as [keyof typeof ISOMERS,string][]).map(([k,l])=>(
                <button key={k} onClick={()=>setIsoTab(k)}
                  style={{padding:'6px 10px',border:'none',borderBottom:`2px solid ${isoTab===k?'#06b6d4':'transparent'}`,background:'transparent',color:isoTab===k?'#06b6d4':'#849495',fontSize:10,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{flex:1,overflowY:'auto',padding:10}}>
              <div style={{marginBottom:8,fontSize:10,color:'#849495'}}>
                {isoTab==='ionisation'&&'Counter ions swap: ions inside vs outside coordination sphere. AgNO₃ test distinguishes.'}
                {isoTab==='hydrate'&&'Water inside vs outside coordination sphere. Different colour, conductivity, and H₂O lost on heating.'}
                {isoTab==='linkage'&&'Ambidentate ligands (NO₂⁻, SCN⁻, CN⁻) bind via different donor atoms to the same metal.'}
                {isoTab==='coordination'&&'Two metal centres in same compound have different ligand distributions. Same empirical formula.'}
                {isoTab==='geometric'&&'Same bonds but different spatial arrangement (cis/trans, fac/mer). NOT interconvertible without bond breaking.'}
                {isoTab==='optical'&&'Non-superimposable mirror images (enantiomers). Rotate plane-polarised light oppositely. Only when no plane of symmetry.'}
              </div>
              {ISOMERS[isoTab].map((p,i)=>(
                <div key={i} style={{background:'rgba(26,31,47,0.9)',borderRadius:10,padding:'10px 14px',marginBottom:8,border:`1px solid rgba(6,182,212,0.15)`}}>
                  <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'center',marginBottom:4}}>
                    <div style={{fontFamily:'monospace',fontSize:11,color:'#06b6d4',fontWeight:700}}>{p.a}</div>
                    {p.b&&<><div style={{color:'#849495'}}>⇌</div><div style={{fontFamily:'monospace',fontSize:11,color:'#ec4899',fontWeight:700}}>{p.b}</div></>}
                  </div>
                  <div style={{fontSize:10,color:'#849495',lineHeight:1.5}}>{p.note}</div>
                </div>
              ))}
              {isoTab==='optical'&&(
                <div style={{padding:'8px 12px',borderRadius:9,background:'rgba(251,191,36,0.08)',border:'1px solid rgba(251,191,36,0.25)'}}>
                  <div style={{fontSize:10,color:'#fbbf24',fontWeight:700,marginBottom:3}}>Conditions for optical activity</div>
                  <div style={{fontSize:9,color:'#849495',lineHeight:1.5}}>
                    No σ plane of symmetry in the complex<br/>
                    Octahedral: [M(en)₃]³⁺, cis-[M(en)₂X₂]ⁿ⁺<br/>
                    trans-[M(en)₂X₂]ⁿ⁺ is NOT optically active (σh plane exists)<br/>
                    Δ = clockwise (propeller right); Λ = anticlockwise
                  </div>
                </div>
              )}
              {isoTab==='geometric'&&(
                <div style={{padding:'8px 12px',borderRadius:9,background:'rgba(6,182,212,0.06)',border:'1px solid rgba(6,182,212,0.2)',marginTop:6}}>
                  <div style={{fontSize:10,color:'#06b6d4',fontWeight:700,marginBottom:3}}>When does geometric isomerism arise?</div>
                  <div style={{fontSize:9,color:'#849495',lineHeight:1.5}}>
                    Square planar: MA₂B₂, MABCD, MA₂BC types<br/>
                    Octahedral: MA₄B₂, MA₃B₃, MA₂B₂C₂ types<br/>
                    Tetrahedral: MA₂B₂ does NOT show geometric isomerism<br/>
                    cis = same side; trans = opposite sides
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right theory */}
        <div style={{width:180,flexShrink:0,borderLeft:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',padding:12,overflowY:'auto',fontSize:9}}>
          <div style={{color:thC,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>Key Concepts</div>
          {[
            {title:"Werner's Theory",content:"Primary valency = ox. state (ionisable)\nSecondary valency = CN (non-ionisable)\nSecondary must always be satisfied",color:'#06b6d4'},
            {title:'Chelate Effect',content:'Bidentate/polydentate ligands: more stable than equivalent monodentate\nReason: +ΔS (entropy) on releasing multiple H₂O\nEDTA: log K ≈ 18; NH₃: log K ≈ 4',color:'#22c55e'},
            {title:'Spectrochemical Series',content:'Weak: I⁻<Br⁻<Cl⁻<F⁻<OH⁻<H₂O<NH₃<en<NO₂⁻<CN⁻<CO :Strong\nStrong field → Low spin, large CFSE',color:'#a78bfa'},
            {title:'IUPAC Naming',content:'1. Cation before anion\n2. Ligands alphabetically\n3. Metal name last (ox. state)\n4. Anionic complex: metal+ate\nEx: potassium hexacyanoferrate(III)',color:'#fbbf24'},
            {title:'Trans Effect',content:'Ligands that weaken the bond trans to themselves:\nHigh: CO > CN⁻ > NO > Cl⁻\nLow: OH⁻ < NH₃\nUsed to synthesise cis/trans Pt²⁺ complexes',color:'#f97316'},
            {title:'Stability of Complexes',content:'log K increases with:\n• Higher charge on metal\n• Smaller metal ion (higher charge density)\n• More donation by ligand\n• Chelate effect (bidentate > monodentate)',color:'#ec4899'},
          ].map(x=>(
            <div key={x.title} style={{marginBottom:10,padding:'7px 9px',background:`${x.color}08`,border:`1px solid ${x.color}25`,borderRadius:9}}>
              <div style={{color:x.color,fontWeight:700,marginBottom:3}}>{x.title}</div>
              <div style={{color:'#849495',whiteSpace:'pre-line',lineHeight:1.5}}>{x.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
