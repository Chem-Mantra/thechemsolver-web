'use client'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Hydrocarbon Reactivity ─────────────────────────────────────

type HCType = 'alkanes'|'alkenes'|'alkynes'|'aromatic'|'comparison'

const TYPES: {id:HCType;name:string;color:string}[] = [
  {id:'alkanes',   name:'Alkanes (Saturated)',    color:'#849495'},
  {id:'alkenes',   name:'Alkenes (Unsaturated)',   color:'#22c55e'},
  {id:'alkynes',   name:'Alkynes (Triple Bond)',   color:'#fbbf24'},
  {id:'aromatic',  name:'Aromatic (Benzene)',      color:'#ec4899'},
  {id:'comparison',name:'Reactivity Comparison',  color:'#06b6d4'},
]

const CONTENT: Record<HCType, {
  reactions: {name:string;reagent:string;product:string;mechanism:string;conditions:string;note:string;color:string}[]
  properties: {label:string;value:string}[]
  keyFacts: string[]
}> = {
  alkanes: {
    reactions:[
      {name:'Free Radical Halogenation',reagent:'Cl₂/Br₂, hν (or heat)',product:'RX + HX',mechanism:'Free radical chain',conditions:'UV light or 300-400°C',note:'Initiation: X₂ → 2X• (hν). Propagation: X• + RH → HX + R•; R• + X₂ → RX + X•. Termination: radical coupling. Selectivity: Br > Cl (Br is more selective → more stable radical preferred).',color:'#f97316'},
      {name:'Combustion',reagent:'O₂ (excess)',product:'CO₂ + H₂O',mechanism:'Radical chain oxidation',conditions:'High temp, ignition',note:'Complete combustion. Incomplete: CO formed if O₂ limited. Enthalpy of combustion increases by ~658 kJ/mol per CH₂ added.',color:'#ef4444'},
      {name:'Cracking',reagent:'High temp (thermal) or Al₂O₃/SiO₂ (catalytic)',product:'Shorter alkanes + alkenes',mechanism:'Radical (thermal) or carbocation (catalytic)',conditions:'500-800°C thermal; 500°C catalytic',note:'Industrial process to convert large alkanes to useful smaller fractions. Catalytic cracking gives more branched products (better octane rating).',color:'#fbbf24'},
    ],
    properties:[
      {label:'Hybridization',value:'sp³ (tetrahedral, 109.5°)'},
      {label:'Reactivity',value:'Low — no π bond, no lone pairs, no δ+ carbon'},
      {label:'Physical state',value:'C1-C4 gas, C5-C17 liquid, C18+ solid (at 25°C)'},
      {label:'Solubility',value:'Insoluble in water, soluble in non-polar solvents'},
      {label:'Boiling point',value:'Increases with chain length; branching decreases bp (less surface area)'},
    ],
    keyFacts:[
      'Selectivity of halogenation: F₂ >> Cl₂ > Br₂ >> I₂. F₂ too reactive (non-selective), I₂ too slow (thermodynamically unfavourable)',
      'Stability of radicals: 3° > 2° > 1° > methyl (hyperconjugation and induction)',
      'Chlorination of methane gives mixture: CH₃Cl, CH₂Cl₂, CHCl₃, CCl₄',
      'Bromine selectivity: 97% tert-bromide from isobutane (vs 64% tert-chloride)',
      'Wurtz reaction: 2RX + 2Na → R-R + 2NaX (C-C bond formation from two alkyl halides)',
    ],
  },
  alkenes: {
    reactions:[
      {name:'Electrophilic Addition — HX (Markovnikov)',reagent:'HBr, HCl, HI',product:'Alkyl halide',mechanism:'Via carbocation',conditions:'RT, no peroxide',note:'H adds to less-substituted C (more H\'s) → more stable 3° carbocation on other C → X attacks. Regioselectivity: Markovnikov. Rearrangements possible.',color:'#06b6d4'},
      {name:'Anti-Markovnikov (HBr/ROOR)',reagent:'HBr + peroxide (ROOR)',product:'Anti-Markovnikov bromide',mechanism:'Free radical addition',conditions:'ROOR initiator or hν',note:'Peroxide generates Br• radical. Br• adds to less hindered C → more stable secondary radical → H abstraction. ONLY HBr (not HCl or HI — thermodynamics).',color:'#a78bfa'},
      {name:'Hydration (addition of H₂O)',reagent:'H₂O + H₂SO₄ (cat.)',product:'Alcohol (Markovnikov)',mechanism:'Via carbocation',conditions:'H₂SO₄, heat',note:'Markovnikov addition of water. OH goes to more substituted C. Alternative: oxymercuration-demercuration (Markovnikov, no rearrangement) or hydroboration-oxidation (anti-Markovnikov, syn addition).',color:'#22c55e'},
      {name:'Halogenation (X₂)',reagent:'Cl₂ or Br₂ (in CCl₄)',product:'Vicinal dihalide',mechanism:'Via bromonium ion',conditions:'Dark, CCl₄ solvent (not water)',note:'Cyclic bromonium ion intermediate → anti addition of X⁻. Br₂/CCl₄ is TEST for unsaturation (decolourises instantly). Anti-addition = trans product (stereospecific).',color:'#ec4899'},
      {name:'Ozonolysis',reagent:'O₃, then Zn/H₂O or H₂O₂',product:'Aldehydes/ketones (reductive) or acids (oxidative)',mechanism:'[3+2] cycloaddition',conditions:'−78°C (O₃), then workup',note:'Reductive (Zn/H₂O): RCHO + R\'CHO. Oxidative (H₂O₂): RCOOH. Used to LOCATE double bond in unknown structure. =CH₂ → HCHO (formaldehyde).',color:'#f97316'},
    ],
    properties:[
      {label:'Hybridization',value:'sp² (planar, 120°) — π bond perpendicular'},
      {label:'Reactivity',value:'High — π electrons available for electrophile attack'},
      {label:'Physical',value:'Similar to alkanes but slightly higher bp (π bond interaction)'},
      {label:'Acidic H',value:'Vinylic H: pKa ≈ 44. Not easily removed.'},
    ],
    keyFacts:[
      'Markovnikov addition: H to more-H carbon. Carbocation stability drives regioselectivity.',
      'Anti addition: Br₂, Cl₂, peracids (epoxidation). Bromonium ion → trans-dihalide.',
      'Syn addition: H₂/Pd (hydrogenation), BH₃ (hydroboration). Both groups add to same face.',
      'Hydroboration-oxidation: anti-Markovnikov, syn-addition, no rearrangement (BH₃·THF, then H₂O₂/NaOH)',
      'Diels-Alder: conjugated diene + dienophile → cyclohexene (syn, stereospecific, [4+2])',
    ],
  },
  alkynes: {
    reactions:[
      {name:'Addition of H₂',reagent:'H₂ + Pd/C → Lindlar\'s cat.',product:'cis-Alkene (Lindlar) or trans (Na/NH₃)',mechanism:'Syn addition (Lindlar), anti (Birch)',conditions:'Lindlar: Pd/BaSO₄/quinoline. Birch: Na/liquid NH₃',note:'Lindlar\'s: syn addition → cis-alkene. Birch reduction (Na/liquid NH₃): radical anion mechanism → trans-alkene. Excellent stereocontrol.',color:'#22c55e'},
      {name:'Addition of HX',reagent:'HBr, HCl (2 equiv)',product:'Vinyl halide → gem-dihalide',mechanism:'Electrophilic addition',conditions:'1 equiv HX → vinyl halide; 2 equiv → gem-dihalide',note:'First addition: Markovnikov → vinyl halide (halogenoalkene). Second addition: again Markovnikov → gem-dihalide (both halogens on same C).',color:'#06b6d4'},
      {name:'Hydration',reagent:'H₂O + H₂SO₄, HgSO₄ cat.',product:'Ketone (Markovnikov)',mechanism:'Via vinyl cation/enol',conditions:'Dilute H₂SO₄, HgSO₄, 60°C',note:'Enol formed initially (Markovnikov OH addition) → tautomerizes to ketone. Acetylene + H₂O → acetaldehyde. Propyne + H₂O → propanone (not propanal).',color:'#fbbf24'},
      {name:'Terminal alkyne acidity',reagent:'NaNH₂, KOH, AgNO₃, Cu₂Cl₂',product:'Metal acetylides',mechanism:'Deprotonation',conditions:'Liquid NH₃ (NaNH₂)',note:'Terminal alkynes (RC≡CH): pKa ≈ 25 (acidic! vs alkene 44, alkane 50). sp carbon holds electron pair tightly. Silver acetylide (from AgNO₃/NH₃): explosive, TEST for terminal alkyne.',color:'#ec4899'},
    ],
    properties:[
      {label:'Hybridization',value:'sp (linear, 180°) — 2 π bonds perpendicular'},
      {label:'Acidity order',value:'HC≡CH (pKa 25) > H₂C=CH₂ (44) > CH₄ (50)'},
      {label:'Bond length',value:'C≡C: 1.20 Å < C=C: 1.34 Å < C-C: 1.54 Å'},
      {label:'Bond energy',value:'C≡C: 839 kJ/mol > C=C: 614 > C-C: 347 kJ/mol'},
    ],
    keyFacts:[
      'Acidic terminal alkyne H can be used for C-C bond formation: RC≡CH + NaNH₂ → RC≡CNa → alkylation',
      'Carbanion stability (base strength reversed): sp³ < sp² < sp. sp is most stable carbanion.',
      'Lindlar\'s catalyst = Pd/BaSO₄ + quinoline (poison to stop at alkene stage)',
      'Acetylene is raw material for: vinyl chloride, acrylonitrile, vinyl acetate (industrial)',
    ],
  },
  aromatic: {
    reactions:[
      {name:'Halogenation (EAS)',reagent:'Cl₂/FeCl₃ or Br₂/FeBr₃',product:'ArX',mechanism:'EAS via Wheland intermediate',conditions:'Anhydrous Lewis acid catalyst',note:'Lewis acid activates halogen → electrophile (Br-FeBr₃ complex). Wheland intermediate (arenium ion) → proton loss restores aromaticity. o/p ratio depends on substituents.',color:'#ec4899'},
      {name:'Nitration',reagent:'HNO₃ + H₂SO₄ (conc., mixed acid)',product:'ArNO₂',mechanism:'EAS via NO₂⁺ (nitronium)',conditions:'50°C (mono), higher T for di/tri-nitration',note:'H₂SO₄ activates HNO₃: HNO₃ + H₂SO₄ → NO₂⁺ + HSO₄⁻. NO₂⁺ is the electrophile. TNT: three nitrations of toluene.',color:'#f97316'},
      {name:'Friedel-Crafts Alkylation',reagent:'R-X + AlCl₃',product:'Ar-R',mechanism:'EAS via carbocation',conditions:'Anhydrous AlCl₃, RT',note:'AlCl₃ generates R⁺ (or R-Al complex). Limitations: rearrangements (R⁺ can rearrange to more stable), polyalkylation (product more reactive than benzene), cannot use with strongly deactivated rings (NO₂, SO₃H groups).',color:'#a78bfa'},
      {name:'Friedel-Crafts Acylation',reagent:'RCOX + AlCl₃ (>1 equiv)',product:'Ar-COR (ketone)',mechanism:'EAS via acylium ion',conditions:'Anhydrous, 1.1+ equiv AlCl₃',note:'Acylium ion (RCO⁺) = stable, no rearrangement. Product ketone complexes with AlCl₃ — use >1 equiv. C=O deactivates ring → mono-acylation only. Used in Haworth synthesis (naphthalene).',color:'#fbbf24'},
      {name:'Sulphonation',reagent:'H₂SO₄ (fuming, oleum)',product:'ArSO₃H (sulphonic acid)',mechanism:'EAS via SO₃',conditions:'Hot fuming H₂SO₄',note:'REVERSIBLE — desulphonation occurs with steam. Used as blocking group: sulphonate, EAS elsewhere, desulphonate. Sulphonic acid is o/p director by resonance donation of -SO₃H... actually m director (EW via induction). Actually wait: -SO₃H is m director.',color:'#34d399'},
    ],
    properties:[
      {label:'Hybridization',value:'sp² — all ring carbons planar (ring = perfect hexagon)'},
      {label:'Hückel\'s rule',value:'Aromaticity: (4n+2) π electrons in cyclic, planar, conjugated system. Benzene: 6π (n=1)'},
      {label:'Bond length',value:'All C-C equal: 1.40 Å (between single 1.54 and double 1.34 Å)'},
      {label:'Reactivity',value:'Prefers SUBSTITUTION (not addition) to maintain aromaticity'},
    ],
    keyFacts:[
      'o/p directors (activate): −NH₂, −OH, −OCH₃, −CH₃, −X (halogens: deactivate but o/p via lone pairs)',
      'm directors (deactivate): −NO₂, −CN, −COOH, −CHO, −SO₃H, −CF₃ (all EW by induction+resonance)',
      'Rate of EAS: alkylbenzene > benzene > halobenzene > nitrobenzene',
      'Birch reduction: benzene + Na/liquid NH₃/ROH → 1,4-cyclohexadiene (partial reduction)',
      'Nucleophilic aromatic substitution (SNAr): needs EW groups ortho/para to leaving group (not EAS)',
    ],
  },
  comparison: {
    reactions:[
      {name:'Bromine Water Test',reagent:'Br₂(aq)',product:'Decolourise (unsaturated) or no change (alkane)',mechanism:'Addition vs no reaction',conditions:'Room temp, dark',note:'Alkenes: instant decolourisation (electrophilic addition). Alkynes: decolourisation (slower). Alkanes: NO reaction. Benzene: NO reaction with Br₂(aq) without catalyst.',color:'#ec4899'},
      {name:'KMnO₄ Test (Baeyer\'s test)',reagent:'KMnO₄ (dil., neutral/cold)',product:'Diol (alkene, purple→colourless) or no change',mechanism:'Cis-dihydroxylation',conditions:'Cold, dilute, neutral',note:'Alkenes: decolourises cold dilute KMnO₄ → cis-diol + brown MnO₂. Aromatic ring: stable, NO reaction with cold KMnO₄. Alkane: no reaction.',color:'#a78bfa'},
      {name:'Hot, conc. KMnO₄',reagent:'KMnO₄ (hot, conc., acid)',product:'Carboxylic acids/CO₂ (alkene/alkyne) or benzoic acid (alkylbenzene)',mechanism:'Oxidative cleavage',conditions:'Hot, conc., H₂SO₄',note:'Alkenes cleave: R₁CH=CHR₂ → R₁COOH + R₂COOH. =CH₂ → CO₂. Benzene ring: survives (stable). Alkyl side chain: oxidized to COOH at the benzylic position → benzoic acid from toluene.',color:'#f97316'},
    ],
    properties:[
      {label:'Reactivity order',value:'Alkyne (terminal) > Alkene > Benzene > Alkane'},
      {label:'Addition vs Substitution',value:'Alkane: substitution only. Alkene/alkyne: addition preferred. Benzene: substitution (EAS) to maintain aromaticity.'},
      {label:'Acidic H order',value:'HC≡CH (pKa 25) << vinyl (44) << alkyl (50)'},
      {label:'Radical stability',value:'Allylic ≈ Benzylic >> 3° > 2° > 1° > methyl'},
    ],
    keyFacts:[
      'Lucas test for alcohols: ZnCl₂/HCl. 3° → instant turbidity. 2° → turbidity in 5 min. 1° → no turbidity (cold).',
      'Tollens test (AgNO₃/NH₃): silver mirror → aldehyde. No reaction → ketone.',
      'Fehling/Benedict: blue → brick red ppt → aldehydes (but not benzaldehyde). Reduces Cu²⁺.',
      'Iodoform test (I₂/NaOH): yellow CHI₃ ppt → CH₃CO- group or CH₃CH(OH)- group.',
      'Hinsberg test: primary + ArSO₂Cl → solid (soluble in NaOH). 2°: solid (insoluble). 3°: no reaction.',
    ],
  },
}

export default function HydrocarbonReactivity() {
  const [type, setType] = useState<HCType>('alkenes')
  const content = CONTENT[type]
  const th = TYPES.find(t=>t.id===type)!

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',flexShrink:0}}>
        <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
        <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
        <strong style={{fontSize:14}}>Hydrocarbon Reactivity — Alkanes, Alkenes, Alkynes, Benzene</strong>
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <div style={{width:175,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',padding:10,overflowY:'auto'}}>
          {TYPES.map(t=>(
            <button key={t.id} onClick={()=>setType(t.id)}
              style={{display:'block',width:'100%',textAlign:'left',padding:'9px 10px',borderRadius:9,marginBottom:5,border:`1px solid ${type===t.id?t.color+'60':'rgba(255,255,255,0.06)'}`,background:type===t.id?t.color+'14':'rgba(255,255,255,0.02)',color:type===t.id?t.color:'#849495',fontSize:10,cursor:'pointer',fontWeight:type===t.id?700:400}}>
              {t.name}
            </button>
          ))}
        </div>
        <div style={{flex:1,overflowY:'auto',padding:14,display:'flex',flexDirection:'column',gap:10}}>
          <div style={{background:`${th.color}0e`,border:`1px solid ${th.color}30`,borderRadius:12,padding:'8px 14px'}}>
            <div style={{fontSize:16,fontWeight:900,color:th.color,marginBottom:6}}>{th.name}</div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {content.properties.map(p=>(
                <div key={p.label} style={{background:'rgba(0,0,0,0.2)',borderRadius:8,padding:'5px 10px',minWidth:150}}>
                  <div style={{fontSize:8,color:th.color,fontWeight:700}}>{p.label}</div>
                  <div style={{fontSize:9,color:'#f8fafc',marginTop:1}}>{p.value}</div>
                </div>
              ))}
            </div>
          </div>
          {content.reactions.map((r,i)=>(
            <div key={i} style={{background:`${r.color}0a`,border:`1px solid ${r.color}30`,borderRadius:12,padding:'10px 14px'}}>
              <div style={{display:'flex',gap:10,alignItems:'baseline',marginBottom:4,flexWrap:'wrap'}}>
                <div style={{fontSize:12,fontWeight:700,color:r.color}}>{r.name}</div>
                <div style={{fontFamily:'monospace',fontSize:10,color:'#849495'}}>{r.reagent}</div>
                <div style={{fontSize:10,color:'#849495'}}>→</div>
                <div style={{fontFamily:'monospace',fontSize:10,color:'#f8fafc',fontWeight:700}}>{r.product}</div>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:6}}>
                <span style={{fontSize:9,padding:'2px 8px',borderRadius:20,background:`${r.color}20`,color:r.color,fontWeight:700}}>{r.mechanism}</span>
                <span style={{fontSize:9,color:'#849495'}}>{r.conditions}</span>
              </div>
              <div style={{fontSize:10,color:'#849495',lineHeight:1.6,borderLeft:`2px solid ${r.color}50`,paddingLeft:10}}>{r.note}</div>
            </div>
          ))}
          <div style={{background:'rgba(251,191,36,0.06)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:12,padding:'10px 14px'}}>
            <div style={{fontSize:10,color:'#fbbf24',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>JEE Key Facts</div>
            {content.keyFacts.map((f,i)=>(
              <div key={i} style={{fontSize:10,color:'#849495',marginBottom:5,lineHeight:1.5}}>• {f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
