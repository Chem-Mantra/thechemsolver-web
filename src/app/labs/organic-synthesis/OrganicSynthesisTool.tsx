'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Organic Synthesis Multi-step Pathways ──────────────────────

interface SynthStep {
  reagent: string; conditions: string
  from: string; to: string
  mechanism: string; note: string; color: string
}

interface Synthesis {
  id: string; title: string; color: string
  target: string; startingMaterial: string
  category: string; difficulty: string
  steps: SynthStep[]
  keyPoints: string[]
}

const SYNTHESES: Synthesis[] = [
  {
    id:'aniline', title:'Benzene → Aniline', color:'#06b6d4',
    target:'Aniline (C₆H₅NH₂)', startingMaterial:'Benzene',
    category:'Aromatic', difficulty:'JEE Advanced',
    steps:[
      {from:'C₆H₆', to:'C₆H₅NO₂', reagent:'HNO₃ + H₂SO₄ (conc.)', conditions:'50°C, controlled', mechanism:'EAS — Nitration', note:'H₂SO₄ activates HNO₃ → NO₂⁺ (nitronium ion). Strong electrophile attacks ring.', color:'#ef4444'},
      {from:'C₆H₅NO₂', to:'C₆H₅NH₂', reagent:'Fe/HCl or Sn/HCl', conditions:'Heat, then NaOH', mechanism:'Reduction of nitro group', note:'Fe/HCl: Fe reduces nitrobenzene. Intermediate nitroso (ArNO) and hydroxylamine (ArNHOH). Finally aniline.', color:'#22c55e'},
    ],
    keyPoints:[
      'Nitration: EAS via NO₂⁺. Rate-determining step = Wheland intermediate formation',
      'NH₂ group of aniline activates ring strongly → o/p director',
      'Cannot nitrate aniline directly in HNO₃/H₂SO₄ (oxidizes NH₂ to NO₂)',
      'Acetylation of aniline first (protection), then nitrate, then hydrolyse',
    ],
  },
  {
    id:'phenol', title:'Benzene → Phenol', color:'#22c55e',
    target:'Phenol (C₆H₅OH)', startingMaterial:'Benzene',
    category:'Aromatic', difficulty:'JEE Advanced',
    steps:[
      {from:'C₆H₆', to:'C₆H₅Cl', reagent:'Cl₂/FeCl₃', conditions:'Room temp, anhydrous', mechanism:'EAS — Halogenation', note:'FeCl₃ is Lewis acid catalyst. Generates Cl⁺ equivalent (Cl-FeCl₃ complex).', color:'#ec4899'},
      {from:'C₆H₅Cl', to:'C₆H₅ONa', reagent:'NaOH (aq.)', conditions:'300°C, 300 atm (Dow process)', mechanism:'Nucleophilic aromatic substitution', note:'Very harsh conditions needed — ring deactivated by Cl toward nucleophilic attack. SNAr mechanism via Meisenheimer complex.', color:'#f97316'},
      {from:'C₆H₅ONa', to:'C₆H₅OH', reagent:'HCl (dil.)', conditions:'Room temp', mechanism:'Acid-base', note:'Sodium phenoxide is salt of weak acid. Acid liberates phenol.', color:'#fbbf24'},
    ],
    keyPoints:[
      'Industrial method: Cumene process (benzene + propene → cumene → phenol + acetone)',
      'Phenol is much more acidic than aliphatic alcohols (pKa = 9.98 vs 16 for EtOH)',
      'Phenol undergoes Kolbe reaction (CO₂, NaOH, 125°C, 5 atm) → salicylic acid',
      'Phenol coupling with diazonium salt → azo dyes',
    ],
  },
  {
    id:'aldol_synth', title:'Synthesis using Aldol Condensation', color:'#f97316',
    target:'α,β-Unsaturated ketone (enone)', startingMaterial:'Two carbonyl compounds',
    category:'Carbonyl Chemistry', difficulty:'JEE Advanced',
    steps:[
      {from:'CH₃CHO (×2)', to:'CH₃CH(OH)CH₂CHO', reagent:'NaOH (dilute, cold)', conditions:'Room temp, 0–10°C', mechanism:'Aldol Addition', note:'Base forms enolate of one aldehyde. Enolate attacks carbonyl of second molecule. New C–C bond formed! β-hydroxy aldehyde (aldol product).', color:'#f97316'},
      {from:'CH₃CH(OH)CH₂CHO', to:'CH₃CH=CHCHO', reagent:'NaOH (conc.) or heat', conditions:'Heat, 100°C', mechanism:'Aldol Condensation (−H₂O)', note:'Dehydration of β-OH group. E1cb mechanism via enolate intermediate. Gives conjugated enal (α,β-unsaturated aldehyde).', color:'#fbbf24'},
    ],
    keyPoints:[
      'Requires α-hydrogen (at least one substrate must have α-H)',
      'Cross-aldol: use pre-formed enolate + non-enolizable carbonyl (avoid mixtures)',
      'Intramolecular aldol: 1,5-diketones → cyclopentenones (Ring closure)',
      'Aldol product (β-OH carbonyl) is useful intermediate; condensation gives conjugated system',
    ],
  },
  {
    id:'grignard_synth', title:'Grignard Synthesis — 2° Alcohol', color:'#a78bfa',
    target:'Secondary alcohol (RCHOHR\')', startingMaterial:'Alkyl halide + Aldehyde',
    category:'Organometallic', difficulty:'JEE Advanced',
    steps:[
      {from:'R-X + Mg', to:'RMgX', reagent:'Mg metal', conditions:'Anhydrous ether (THF), inert atmosphere', mechanism:'Oxidative addition', note:'Magnesium inserts into C-X bond. MUST be anhydrous — RMgX instantly reacts with water. R-Br > R-Cl > R-I in practice (balance reactivity vs bond strength).', color:'#a78bfa'},
      {from:'RMgX + R\'CHO', to:'R-CH(OMgX)-R\'', reagent:'Aldehyde (R\'CHO)', conditions:'Anhydrous ether, 0°C→RT', mechanism:'Nucleophilic addition to C=O', note:'Grignard is carbanion (R⁻). Attacks electrophilic carbonyl C. Mg²⁺ chelates with O. New C-C bond!', color:'#34d399'},
      {from:'R-CH(OMgX)-R\'', to:'R-CH(OH)-R\'', reagent:'NH₄Cl(aq) then H₃O⁺', conditions:'Aqueous workup', mechanism:'Protonation of alkoxide', note:'Mg-O-C alkoxide protonated by water. Final product: 2° alcohol. Any protic species destroys Grignard!', color:'#06b6d4'},
    ],
    keyPoints:[
      'HCHO → 1° alcohol; RCHO → 2° alcohol; R₂C=O → 3° alcohol; CO₂ → carboxylic acid',
      'Ester + 2 equiv RMgX → 3° alcohol (same R group added twice)',
      'Reformatsky reaction: Zn instead of Mg, uses α-bromo ester, milder conditions',
      'Cannot use: RMgX with compounds having active H (OH, NH, COOH, SH groups)',
    ],
  },
  {
    id:'diazotisation', title:'Diazonium Salt Chemistry', color:'#ec4899',
    target:'Various substituted benzenes from aniline', startingMaterial:'Aniline',
    category:'Aromatic', difficulty:'JEE Advanced',
    steps:[
      {from:'ArNH₂', to:'ArN₂⁺Cl⁻', reagent:'NaNO₂ + HCl', conditions:'0–5°C (MUST be cold!)', mechanism:'Diazotisation', note:'NaNO₂ + HCl → HNO₂ (nitrous acid). HNO₂ + ArNH₂ → diazonium salt. MUST be at 0–5°C (diazonium decomposes > 5°C).', color:'#ec4899'},
      {from:'ArN₂⁺', to:'ArOH + ArCl + ArBr + ArCN + ArF + Ar-Ar', reagent:'Various (Sandmeyer/other)', conditions:'See notes', mechanism:'Nucleophilic/radical substitution', note:'Sandmeyer: CuCl → ArCl; CuBr → ArBr; CuCN → ArCN. Balz-Schiemann: BF₄⁻ → ArF (dry, heat). Phenol: H₂O, H⁺, heat. Gomberg: Ar-Ar (biphenyl).', color:'#f97316'},
    ],
    keyPoints:[
      'Diazonium salt synthesis is KEY — allows introduction of Cl, Br, CN, F, OH, NO₂ at specific positions',
      'Sandmeyer reaction uses CuX (Cu(I)) — radical mechanism',
      'Coupling reaction: ArN₂⁺ + phenol/aniline (in basic medium) → azo dye (–N=N– linkage)',
      'Fluorine intro: Balz-Schiemann reaction (diazonium tetrafluoroborate → ArF + N₂ + BF₃)',
    ],
  },
]

export default function OrganicSynthesis() {
  const [synthId, setSynthId] = useState('aniline')
  const [stepIdx, setStepIdx] = useState(0)

  const synth = SYNTHESES.find(s=>s.id===synthId)!
  const step = synth.steps[stepIdx]

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',flexShrink:0}}>
        <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <strong style={{fontSize:14}}>Organic Synthesis — Multi-step Pathways with Mechanism</strong>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Left: synthesis list */}
        <div style={{width:200,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',overflowY:'auto',padding:10}}>
          <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:8}}>Synthesis Routes</div>
          {SYNTHESES.map(s=>(
            <button key={s.id} onClick={()=>{setSynthId(s.id);setStepIdx(0)}}
              style={{display:'block',width:'100%',textAlign:'left',padding:'8px 10px',borderRadius:9,marginBottom:5,border:`1px solid ${synthId===s.id?s.color+'60':'rgba(255,255,255,0.06)'}`,background:synthId===s.id?s.color+'12':'rgba(255,255,255,0.02)',color:synthId===s.id?s.color:'#849495',fontSize:10,cursor:'pointer'}}>
              <div style={{fontWeight:700}}>{s.title}</div>
              <div style={{fontSize:8,opacity:0.7}}>{s.category} · {s.difficulty}</div>
            </button>
          ))}
          <div style={{marginTop:12,borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:10}}>
            <div style={{fontSize:9,color:'#f97316',fontWeight:700,textTransform:'uppercase',marginBottom:6}}>Retrosynthesis</div>
            {['Target → disconnect bonds → synthons','Synthon = theoretical fragment (acyl cation, enolate)','Synthon → synthetic equivalent (real reagent)','Work backwards from target to available starting materials','Priority: disconnect at functional groups, use reliable reactions'].map((r,i)=>(
              <div key={i} style={{fontSize:8,color:'#849495',marginBottom:3,lineHeight:1.4}}>• {r}</div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',padding:12,gap:10}}>
          {/* Target info */}
          <div style={{background:`${synth.color}0e`,border:`1px solid ${synth.color}35`,borderRadius:12,padding:'8px 14px',flexShrink:0}}>
            <div style={{fontSize:15,fontWeight:900,color:synth.color}}>{synth.title}</div>
            <div style={{fontSize:10,color:'#849495'}}>Start: <strong style={{color:'#f8fafc'}}>{synth.startingMaterial}</strong> · Target: <strong style={{color:synth.color}}>{synth.target}</strong> · {synth.steps.length} steps</div>
          </div>

          {/* Full pathway arrow */}
          <div style={{background:'rgba(9,14,28,0.8)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'10px 14px',flexShrink:0,overflowX:'auto'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,minWidth:'max-content'}}>
              <div style={{padding:'5px 12px',borderRadius:20,background:`${synth.color}20`,border:`1px solid ${synth.color}50`,color:synth.color,fontSize:11,fontFamily:'monospace',fontWeight:700}}>{synth.startingMaterial}</div>
              {synth.steps.map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                    <div style={{fontSize:8,color:s.color,fontFamily:'monospace',whiteSpace:'nowrap'}}>{s.reagent}</div>
                    <div style={{fontSize:18,color:s.color}}>→</div>
                    <div style={{fontSize:8,color:'#849495',whiteSpace:'nowrap'}}>{s.conditions}</div>
                  </div>
                  <button onClick={()=>setStepIdx(i)}
                    style={{padding:'5px 12px',borderRadius:20,background:stepIdx===i?`${s.color}30`:`${s.color}10`,border:`1px solid ${s.color}${stepIdx===i?'80':'30'}`,color:s.color,fontSize:11,fontFamily:'monospace',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>
                    {s.to}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Step detail */}
          <AnimatePresence mode="wait">
            <motion.div key={`${synthId}-${stepIdx}`} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.2}}
              style={{background:`${step.color}0e`,border:`1px solid ${step.color}35`,borderRadius:14,padding:'12px 16px',flexShrink:0}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start',flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:13,fontWeight:700,color:step.color,marginBottom:4}}>Step {stepIdx+1}: {step.mechanism}</div>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8,fontFamily:'monospace',fontSize:12}}>
                    <span style={{color:'#849495'}}>{step.from}</span>
                    <span style={{fontSize:18,color:step.color}}>→</span>
                    <span style={{color:'#f8fafc',fontWeight:700}}>{step.to}</span>
                  </div>
                  <div style={{fontSize:10,color:'#f8fafc',marginBottom:4}}>
                    <strong style={{color:step.color}}>Reagent:</strong> {step.reagent}
                  </div>
                  <div style={{fontSize:10,color:'#849495',marginBottom:8}}>
                    <strong style={{color:'#fbbf24'}}>Conditions:</strong> {step.conditions}
                  </div>
                  <div style={{background:'rgba(0,0,0,0.3)',borderRadius:9,padding:'8px 12px',fontSize:10,color:'#f8fafc',lineHeight:1.6,borderLeft:`3px solid ${step.color}`}}>
                    {step.note}
                  </div>
                </div>
                <div style={{display:'flex',gap:5}}>
                  {synth.steps.map((_,i)=>(
                    <button key={i} onClick={()=>setStepIdx(i)}
                      style={{width:30,height:30,borderRadius:'50%',border:`2px solid ${i===stepIdx?synth.color:'rgba(255,255,255,0.15)'}`,background:i===stepIdx?synth.color:'transparent',color:i===stepIdx?'#fff':'#849495',fontSize:11,fontWeight:700,cursor:'pointer'}}>
                      {i+1}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Key points */}
          <div style={{flex:1,minHeight:0,background:'rgba(9,14,28,0.6)',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)',padding:'10px 14px',overflowY:'auto'}}>
            <div style={{fontSize:9,color:synth.color,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>JEE Key Points for {synth.title}</div>
            {synth.keyPoints.map((p,i)=>(
              <div key={i} style={{fontSize:10,color:'#849495',marginBottom:6,padding:'6px 10px',background:'rgba(26,31,47,0.8)',borderRadius:8,lineHeight:1.5}}>• {p}</div>
            ))}
            <div style={{marginTop:12,borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:10}}>
              <div style={{fontSize:9,color:'#fbbf24',fontWeight:700,marginBottom:6}}>General Synthesis Strategies for JEE</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                {[
                  {title:'Functional group interconversion',content:'OH → X → CN → COOH → ester → alcohol (chain)'},
                  {title:'C-C bond forming reactions',content:'Aldol, Grignard, Reformatsky, Diels-Alder, Wittig'},
                  {title:'Aromatic substitution order',content:'EAS before adding electron-withdrawing groups. Protect NH₂ as amide before nitration.'},
                  {title:'Retrosynthetic symbols',content:'⇒ means "comes from". Disconnection at weakest/most accessible bond.'},
                ].map(x=>(
                  <div key={x.title} style={{background:'rgba(26,31,47,0.7)',borderRadius:8,padding:'6px 9px',border:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{fontSize:9,color:'#fbbf24',fontWeight:700,marginBottom:2}}>{x.title}</div>
                    <div style={{fontSize:8,color:'#849495'}}>{x.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
