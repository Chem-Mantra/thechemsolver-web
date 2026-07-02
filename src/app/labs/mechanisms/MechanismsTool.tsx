'use client'
import Link from 'next/link'
import { useState, useRef, useCallback, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ─────────────────────────────────────────────────────
interface Atom3D { id:string; label:string; pos:[number,number,number]; color:string; charge?:string; r?:number }
interface Bond3D { id:string; a:string; b:string; type:'single'|'double'|'triple'|'aromatic'; breaking?:boolean; forming?:boolean }
interface Arrow { id:string; from:string; to:string; curve:number; color?:string }
interface MechStep { title:string; description:string; atoms:Atom3D[]; bonds:Bond3D[]; arrows:Arrow[]; highlight?:string; note?:string }
interface Reaction {
  id:string; name:string; category:string; subcategory:string
  substrate:string; reagent:string; product:string
  conditions:string[]; notes:string[]; exceptions?:string[]; jeePoints:string[]
  steps:MechStep[]
}

const C = { C:'#606060',H:'#d0d0d0',O:'#ef4444',N:'#3b82f6',Br:'#b45309',Cl:'#16a34a',F:'#06b6d4',S:'#fbbf24',Mg:'#8b5cf6',Ar:'#8b5cf6',arrow:'#dc2626',form:'#16a34a' }
const hex = (x:number,y:number,r=1.5,i=0):[number,number,number] => [x+r*Math.cos(Math.PI/2+i*Math.PI/3),y+r*Math.sin(Math.PI/2+i*Math.PI/3),0]

// ─── REACTION DATA ──────────────────────────────────────────────
const REACTIONS:Reaction[] = [
// ══ ELECTROPHILIC ADDITION ══
{
  id:'ear-hbr-markov', name:'HBr + Propene — Markovnikov',
  category:'addition', subcategory:'ear',
  substrate:'Propene (CH₂=CH-CH₃)', reagent:'HBr (no peroxide)',
  product:'2-Bromopropane',
  conditions:['No peroxide','Room temp, polar solvent (CHCl₃)','Ionic mechanism'],
  notes:['H adds to CH₂= end (more H) → carbocation on more substituted C','Markovnikov: H to more hydrogen-bearing carbon','Rearrangements possible (2° → 3° shift)'],
  exceptions:['With ROOR peroxide → anti-Markovnikov (free radical, HBr only, not HCl/HI)'],
  jeePoints:['Carbocation stability: 3° > 2° > 1° > methyl','Rate = k[HBr][alkene]','Only HBr gives anti-Markovnikov with peroxide'],
  steps:[
    { title:'π attack on H⁺ → 3° carbocation',
      description:'The C=C π electrons attack H of HBr. H bonds to the less substituted CH₂ end (Markovnikov). Br⁻ departs. More stable secondary/tertiary carbocation forms on the other carbon.',
      atoms:[
        {id:'c1',label:'CH₂=',pos:[-1.2,0,0],color:C.C,r:0.4},{id:'c2',label:'=CH',pos:[0.4,0,0],color:C.C,r:0.4},
        {id:'c3',label:'CH₃',pos:[1.7,-0.8,0],color:C.C,r:0.35},{id:'h',label:'H',pos:[-2.6,0.8,0],color:C.H,r:0.28},
        {id:'br',label:'Br',pos:[-3.8,0.8,0],color:C.Br,r:0.5},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'double'},{id:'b2',a:'c2',b:'c3',type:'single'},{id:'b3',a:'h',b:'br',type:'single',breaking:true}],
      arrows:[{id:'a1',from:'c1',to:'h',curve:0.45,color:C.arrow},{id:'a2',from:'h',to:'br',curve:0.3,color:C.arrow}],
      highlight:'π electrons attack H⁺ → H goes to CH₂ end → carbocation on CH (more stable)',
    },
    { title:'Carbocation + Br⁻ → product',
      description:'Br⁻ nucleophile attacks the secondary carbocation. 2-bromopropane (Markovnikov product) forms.',
      atoms:[
        {id:'c1',label:'CH₃',pos:[-1.4,0,0],color:C.C,r:0.35},{id:'c2',label:'CH⁺',pos:[0,0,0],color:'#f97316',r:0.42,charge:'+'},
        {id:'c3',label:'CH₃',pos:[1.4,-0.8,0],color:C.C,r:0.35},{id:'br',label:'Br⁻',pos:[0,2.0,0],color:C.Br,r:0.5,charge:'−'},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'single'},{id:'b2',a:'c2',b:'c3',type:'single'}],
      arrows:[{id:'a1',from:'br',to:'c2',curve:-0.4,color:C.form}],
      highlight:'Br⁻ attacks carbocation → 2-bromopropane. Markovnikov product: Br on more substituted C.',
    },
  ],
},
{
  id:'ear-br2-anti', name:'Br₂ + Ethene — Anti Addition (Bromonium)',
  category:'addition', subcategory:'ear',
  substrate:'Ethene (CH₂=CH₂)', reagent:'Br₂ (CCl₄, dark)',
  product:'1,2-Dibromoethane (anti)',
  conditions:['CCl₄ solvent (anhydrous)','Dark (no radical)','Decolourises Br₂/CCl₄ immediately (test for unsaturation)'],
  notes:['Cyclic bromonium ion → only back-face attack → anti addition','In water: bromohydrin (OH anti to Br)','Chlorination similar; I₂ too slow'],
  jeePoints:['Anti addition → trans product from cyclic alkene (stereospecific)','Bromonium ion ≠ free carbocation (symmetrical bridge)','Br₂/CCl₄ test: instant decolourisation = unsaturation present'],
  steps:[
    { title:'π electrons attack Br₂ → bromonium ion',
      description:'C=C π electrons attack the nearer Br of Br₂. Br-Br bond breaks. A cyclic bromonium ion bridges both carbons from one face. Br⁻ departs.',
      atoms:[
        {id:'c1',label:'CH₂',pos:[-0.7,0,0],color:C.C,r:0.4},{id:'c2',label:'CH₂',pos:[0.7,0,0],color:C.C,r:0.4},
        {id:'br1',label:'Br',pos:[0,2.0,0],color:C.Br,r:0.5},{id:'br2',label:'Br',pos:[1.5,2.0,0],color:C.Br,r:0.5},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'double'},{id:'b2',a:'br1',b:'br2',type:'single',breaking:true}],
      arrows:[{id:'a1',from:'c1',to:'br1',curve:0.45,color:C.arrow},{id:'a2',from:'br1',to:'br2',curve:0.3,color:C.arrow}],
      highlight:'π electrons → attack Br → Br-Br breaks → cyclic bromonium ion on one face',
    },
    { title:'Bromonium ion — Br⁻ back-face attack (anti)',
      description:'Cyclic bromonium ion: Br bridges top face. Br⁻ can ONLY attack from bottom (back) face (SN2-like). Anti addition → trans product for cyclic substrates.',
      atoms:[
        {id:'c1',label:'C',pos:[-0.7,0,0],color:'#f97316',r:0.4,charge:'δ+'},{id:'c2',label:'C',pos:[0.7,0,0],color:'#f97316',r:0.4,charge:'δ+'},
        {id:'brb',label:'Br⁺',pos:[0,1.2,0],color:C.Br,r:0.5,charge:'+'},{id:'brn',label:'Br⁻',pos:[0,-2.2,0],color:C.Br,r:0.5,charge:'−'},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'single'},{id:'b2',a:'c1',b:'brb',type:'single'},{id:'b3',a:'c2',b:'brb',type:'single'}],
      arrows:[{id:'a1',from:'brn',to:'c1',curve:0.4,color:C.form}],
      highlight:'Bromonium blocks top face → Br⁻ MUST attack bottom → anti addition → trans dihalide',
    },
  ],
},
{
  id:'ear-h2o-propene', name:'H₂O + Propene (Acid-Catalysed Hydration)',
  category:'addition', subcategory:'ear',
  substrate:'Propene', reagent:'H₂O / H₂SO₄ cat.',
  product:'2-Propanol (Markovnikov)',
  conditions:['Dilute H₂SO₄ catalyst','Heat (100-150°C)','Markovnikov: OH goes to more substituted C'],
  notes:['Same carbocation mechanism as HBr addition','Alternative: oxymercuration-demercuration (Markovnikov, no rearrangement)','Hydroboration-oxidation: anti-Markovnikov, syn addition'],
  jeePoints:['OH adds to more substituted C (Markovnikov)','Rearrangements possible via carbocation','Competing with dehydration (equilibrium) — control by T and concentration'],
  steps:[
    { title:'H⁺ protonates alkene → carbocation',
      description:'H⁺ (from H₂SO₄) protonates the less substituted end of propene. More stable secondary carbocation forms on C2.',
      atoms:[
        {id:'c1',label:'CH₂=',pos:[-1.2,0,0],color:C.C,r:0.4},{id:'c2',label:'=CH',pos:[0.4,0,0],color:C.C,r:0.4},
        {id:'c3',label:'CH₃',pos:[1.7,-0.8,0],color:C.C,r:0.35},{id:'hp',label:'H⁺',pos:[-2.5,0.8,0],color:C.H,r:0.25,charge:'+'},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'double'},{id:'b2',a:'c2',b:'c3',type:'single'}],
      arrows:[{id:'a1',from:'c1',to:'hp',curve:0.4,color:C.arrow}],
      highlight:'π electrons attack H⁺ → carbocation on C2 (more stable secondary)',
    },
    { title:'Water attacks carbocation → oxonium → alcohol',
      description:'Water (nucleophile) attacks the carbocation. Oxonium ion forms. Loss of H⁺ gives 2-propanol. H⁺ is regenerated (catalytic).',
      atoms:[
        {id:'c1',label:'CH₃',pos:[-1.4,0,0],color:C.C,r:0.35},{id:'c2',label:'C⁺',pos:[0,0,0],color:'#f97316',r:0.42,charge:'+'},
        {id:'c3',label:'CH₃',pos:[1.4,-0.8,0],color:C.C,r:0.35},{id:'w',label:'H₂O',pos:[0,1.8,0],color:C.O,r:0.4},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'single'},{id:'b2',a:'c2',b:'c3',type:'single'}],
      arrows:[{id:'a1',from:'w',to:'c2',curve:-0.35,color:C.form}],
      highlight:'H₂O attacks cation → oxonium ion → −H⁺ → 2-propanol. H⁺ is regenerated (catalyst).',
    },
  ],
},
// ══ NUCLEOPHILIC ADDITION ══
{
  id:'nar-grignard', name:'Grignard + Aldehyde → 2° Alcohol',
  category:'addition', subcategory:'nar',
  substrate:'Acetaldehyde (CH₃CHO)', reagent:'CH₃MgBr (anhydrous ether)',
  product:'2-Propanol',
  conditions:['Anhydrous THF or Et₂O (MUST — water destroys Grignard)','Add aldehyde to Grignard at 0°C','Then aqueous NH₄Cl workup'],
  notes:['RMgX: C has δ− (carbanion character) — strong nucleophile','HCHO → 1° alcohol; RCHO → 2°; R₂C=O → 3°; CO₂ → RCOOH','Cannot use if molecule has OH, NH, COOH, SH groups'],
  jeePoints:['C-Mg bond is polar: C is δ−, Mg is δ+','Grignard is stronger nucleophile than CN⁻, OH⁻','Ester + 2 RMgX → 3° alcohol (both R groups added)','Reformatsky reaction: Zn instead of Mg, milder conditions'],
  steps:[
    { title:'Grignard: C has carbanion character',
      description:'In RMgX, the C-Mg bond is polar. Carbon bears δ− character — it acts as a carbanion. This makes it a powerful nucleophile for carbonyl addition.',
      atoms:[
        {id:'c',label:'CH₃',pos:[-1.5,0,0],color:'#06b6d4',r:0.42,charge:'δ−'},
        {id:'mg',label:'Mg',pos:[0,0,0],color:C.Mg,r:0.45,charge:'δ+'},
        {id:'br',label:'Br',pos:[1.5,0,0],color:C.Br,r:0.45},
      ],
      bonds:[{id:'b1',a:'c',b:'mg',type:'single'},{id:'b2',a:'mg',b:'br',type:'single'}],
      arrows:[],
      highlight:'C-Mg: δ−C—Mg^δ+. The CH₃ group acts as CH₃⁻ (carbanion) — very strong nucleophile.',
    },
    { title:'C-C bond formation: carbanion attacks C=O',
      description:'The CH₃ group attacks the electrophilic carbonyl carbon. π electrons shift to O. New C-C bond forms. Magnesium coordinates with oxygen stabilising the alkoxide.',
      atoms:[
        {id:'rmg',label:'CH₃⁻',pos:[-2.5,0,0],color:'#06b6d4',r:0.4,charge:'−'},
        {id:'c',label:'C=O',pos:[0,0,0],color:'#f97316',r:0.42},
        {id:'o',label:'O⁻',pos:[0,1.5,0],color:C.O,r:0.4,charge:'−'},
        {id:'m2',label:'CH₃',pos:[1.4,-0.7,0],color:C.C,r:0.35},
        {id:'h',label:'H',pos:[-0.9,-0.9,0],color:C.H,r:0.28},
      ],
      bonds:[{id:'b1',a:'c',b:'o',type:'double'},{id:'b2',a:'c',b:'m2',type:'single'},{id:'b3',a:'c',b:'h',type:'single'},{id:'b4',a:'rmg',b:'c',type:'single',forming:true}],
      arrows:[{id:'a1',from:'rmg',to:'c',curve:0.35,color:C.form},{id:'a2',from:'c',to:'o',curve:0.4,color:C.arrow}],
      highlight:'⚡ New C-C bond! Carbanion attacks C=O. π electrons → O⁻ (alkoxide). C skeleton grows.',
    },
    { title:'Aqueous workup → alcohol',
      description:'NH₄Cl(aq) protonates the O⁻ alkoxide. Mg salts wash out. 2-propanol product. Note: ANY protic source (H₂O, ROH, NH, COOH) destroys Grignard before it can react.',
      atoms:[
        {id:'c1',label:'CH₃',pos:[-1.5,0,0],color:C.C,r:0.35},{id:'cc',label:'CH',pos:[0,0,0],color:C.C,r:0.4},
        {id:'oh',label:'OH',pos:[0,1.4,0],color:C.O,r:0.38},{id:'c2',label:'CH₃',pos:[1.4,-0.7,0],color:C.C,r:0.35},
      ],
      bonds:[{id:'b1',a:'c1',b:'cc',type:'single'},{id:'b2',a:'cc',b:'oh',type:'single',forming:true},{id:'b3',a:'cc',b:'c2',type:'single'}],
      arrows:[],
      highlight:'✓ 2-propanol (2° alcohol). NH₄Cl(aq) protonates O⁻. Pure alcohol after workup.',
    },
  ],
},
{
  id:'nar-nabh4', name:'NaBH₄ Reduction of Ketone',
  category:'addition', subcategory:'nar',
  substrate:'Acetone (CH₃COCH₃)', reagent:'NaBH₄ / EtOH',
  product:'2-Propanol',
  conditions:['NaBH₄ in EtOH or H₂O','Room temperature','MILD — does NOT reduce esters, acids, amides'],
  notes:['H⁻ (hydride) delivered from B to electrophilic carbonyl C','LiAlH₄ reduces ALL carbonyls (esters, acids, amides, nitriles) — requires dry THF','NaBH₄: safe in water/alcohol, selective for C=O only'],
  jeePoints:['NaBH₄: C=O (aldehyde/ketone) → alcohol only','LiAlH₄: RCOOH→1°OH, RCOOR\'→1°OH+R\'OH, RCONR₂→RCH₂NR₂, RCN→RCH₂NH₂','Clemmensen (Zn-Hg/HCl): C=O → CH₂ (acidic)','Wolff-Kishner (N₂H₄/KOH): C=O → CH₂ (basic)'],
  steps:[
    { title:'H⁻ from BH₄⁻ attacks carbonyl C',
      description:'BH₄⁻ delivers a hydride (H⁻, a nucleophile) to the electrophilic carbonyl carbon. The C=O π electrons shift to O. Alkoxide forms. Protonation by EtOH gives alcohol.',
      atoms:[
        {id:'bh4',label:'BH₄⁻',pos:[-2.5,0.8,0],color:C.C,r:0.42,charge:'−'},
        {id:'c',label:'C',pos:[0,0,0],color:'#f97316',r:0.42},
        {id:'o',label:'O',pos:[0,1.5,0],color:C.O,r:0.42},
        {id:'m1',label:'CH₃',pos:[-1.4,-0.7,0],color:C.C,r:0.35},{id:'m2',label:'CH₃',pos:[1.4,-0.7,0],color:C.C,r:0.35},
      ],
      bonds:[{id:'b1',a:'c',b:'o',type:'double'},{id:'b2',a:'c',b:'m1',type:'single'},{id:'b3',a:'c',b:'m2',type:'single'}],
      arrows:[{id:'a1',from:'bh4',to:'c',curve:0.4,color:C.form},{id:'a2',from:'c',to:'o',curve:0.4,color:C.arrow}],
      highlight:'H⁻ (nucleophile) attacks C=O. C=O π → O⁻. Then EtOH protonates → alcohol.',
    },
  ],
},
// ══ FREE RADICAL SUBSTITUTION ══
{
  id:'frs-methane-cl2', name:'CH₄ + Cl₂ — Free Radical Chain',
  category:'substitution', subcategory:'frs',
  substrate:'Methane (CH₄)', reagent:'Cl₂ + hν or 300°C',
  product:'CH₃Cl (+HCl), then CH₂Cl₂, CHCl₃, CCl₄',
  conditions:['UV light or 300-400°C for initiation','Gas phase or inert solvent','Dark = no reaction'],
  notes:['Chain reaction: each Cl• starts ~10,000 cycles','Selectivity: Br >> Cl (Br is more selective — more stable radical preferred)','F₂: uncontrollable; I₂: endothermic (too slow)'],
  jeePoints:['Radical stability: 3° > 2° > 1° > methyl (hyperconjugation)','Termination: two radicals combine','Br₂ selectivity: 97% 3° from isobutane; Cl₂ only 64%','NBS: bromination specifically at allylic/benzylic positions'],
  steps:[
    { title:'Initiation — Cl₂ homolysis',
      description:'UV photon (or heat) breaks the Cl-Cl bond homolytically. Each Cl atom gets one electron. Two Cl• radicals form.',
      atoms:[{id:'cl1',label:'Cl•',pos:[-1.1,0,0],color:C.Cl,r:0.45},{id:'cl2',label:'Cl•',pos:[1.1,0,0],color:C.Cl,r:0.45},{id:'hv',label:'hν',pos:[0,1.6,0],color:'#fbbf24',r:0.3}],
      bonds:[{id:'b1',a:'cl1',b:'cl2',type:'single',breaking:true}],
      arrows:[{id:'a1',from:'cl1',to:'hv',curve:0.5,color:'#fbbf24'},{id:'a2',from:'cl2',to:'hv',curve:-0.5,color:'#fbbf24'}],
      highlight:'Cl₂ + hν → 2 Cl• (homolysis: one electron to each). Chain-starting radicals.',
    },
    { title:'Propagation 1 — Cl• abstracts H from CH₄',
      description:'Cl• takes H from methane (H-Cl formed, CH₃• radical). Slightly exothermic (ΔH ≈ −5 kJ/mol). This step is rate-determining for selectivity.',
      atoms:[
        {id:'cl',label:'Cl•',pos:[-2.5,0.5,0],color:C.Cl,r:0.45},{id:'h',label:'H',pos:[-1.0,0.5,0],color:C.H,r:0.28},
        {id:'c',label:'CH₃•',pos:[0.5,0,0],color:'#f97316',r:0.42},
      ],
      bonds:[{id:'b1',a:'h',b:'c',type:'single',breaking:true}],
      arrows:[{id:'a1',from:'cl',to:'h',curve:0.4,color:C.arrow},{id:'a2',from:'h',to:'c',curve:0.35,color:C.arrow}],
      highlight:'Cl• + CH₄ → HCl + CH₃• (methyl radical). ΔH ≈ −5 kJ/mol. Rate-determining step.',
    },
    { title:'Propagation 2 — CH₃• attacks Cl₂',
      description:'Methyl radical takes Cl from Cl₂. CH₃Cl product forms. New Cl• restarts the chain. ~10,000 cycles per initiation event.',
      atoms:[
        {id:'c',label:'CH₃•',pos:[-1.5,0,0],color:'#f97316',r:0.42},{id:'cl1',label:'Cl',pos:[0.5,0.5,0],color:C.Cl,r:0.45},
        {id:'cl2',label:'Cl•',pos:[1.8,0.5,0],color:C.Cl,r:0.45},
      ],
      bonds:[{id:'b1',a:'cl1',b:'cl2',type:'single',breaking:true},{id:'b2',a:'c',b:'cl1',type:'single',forming:true}],
      arrows:[{id:'a1',from:'c',to:'cl1',curve:0.4,color:C.form},{id:'a2',from:'cl1',to:'cl2',curve:0.3,color:C.arrow}],
      highlight:'CH₃• + Cl₂ → CH₃Cl + Cl• (chain continues). ΔH ≈ −101 kJ/mol. Very exothermic.',
      note:'Termination: Cl•+Cl•→Cl₂; CH₃•+Cl•→CH₃Cl; CH₃•+CH₃•→C₂H₆',
    },
  ],
},
// ══ EAS ══
{
  id:'eas-nitration', name:'Benzene Nitration (EAS)',
  category:'substitution', subcategory:'eas',
  substrate:'Benzene', reagent:'HNO₃ + H₂SO₄ (mixed acid)',
  product:'Nitrobenzene',
  conditions:['Conc. HNO₃ + conc. H₂SO₄','50°C (mono); higher T → di/trinitro','H₂SO₄ is catalyst — regenerated'],
  notes:['NO₂⁺ (nitronium ion) is the actual electrophile','Rate-determining: Wheland intermediate formation (not H loss)','TNT: 3 nitrations of toluene'],
  exceptions:['Activated rings (aniline, phenol): react faster, need milder conditions','NH₂ must be acetylated before nitration (protects from oxidation)'],
  jeePoints:['o/p directors: −NH₂,−OH,−OCH₃,−CH₃,−X (activate except X)','m directors: −NO₂,−COOH,−CHO,−CN,−SO₃H (all deactivate)','Rate: toluene > benzene > chlorobenzene > nitrobenzene'],
  steps:[
    { title:'Generate NO₂⁺ (nitronium ion)',
      description:'H₂SO₄ protonates HNO₃. The protonated form loses H₂O → NO₂⁺. This is the electrophile.',
      atoms:[{id:'n',label:'NO₂⁺',pos:[0,0,0],color:'#ef4444',r:0.45,charge:'+'},{id:'h2o',label:'H₂O',pos:[2,0,0],color:C.O,r:0.35},{id:'hso',label:'HSO₄⁻',pos:[-2,0,0],color:C.S,r:0.4}],
      bonds:[],arrows:[],
      highlight:'HNO₃ + H₂SO₄ → NO₂⁺ + H₂O + HSO₄⁻. Nitronium ion is the electrophile.',
    },
    { title:'NO₂⁺ attacks benzene → Wheland intermediate',
      description:'NO₂⁺ attacks one ring carbon. π electrons flow into ring. One sp³ carbon formed. Wheland intermediate (arenium ion) — ring loses aromaticity. Positive charge delocalized on 3 carbons.',
      atoms:[
        {id:'c1',label:'C',pos:hex(0,0,1.5,0),color:'#f97316',r:0.38,charge:'+'},
        {id:'c2',label:'C',pos:hex(0,0,1.5,1),color:'#f97316',r:0.38},{id:'c3',label:'C',pos:hex(0,0,1.5,2),color:'#f97316',r:0.38},
        {id:'c4',label:'C',pos:hex(0,0,1.5,3),color:'#f97316',r:0.38},{id:'c5',label:'C',pos:hex(0,0,1.5,4),color:'#f97316',r:0.38},
        {id:'c6',label:'C',pos:hex(0,0,1.5,5),color:'#f97316',r:0.38},
        {id:'no2',label:'NO₂',pos:[0,3.2,0],color:C.N,r:0.4},{id:'hx',label:'H',pos:[0,2.0,0],color:C.H,r:0.28},
      ],
      bonds:[
        {id:'b1',a:'c1',b:'c2',type:'single'},{id:'b2',a:'c2',b:'c3',type:'double'},{id:'b3',a:'c3',b:'c4',type:'single'},
        {id:'b4',a:'c4',b:'c5',type:'double'},{id:'b5',a:'c5',b:'c6',type:'single'},{id:'b6',a:'c6',b:'c1',type:'single'},
        {id:'b7',a:'c1',b:'no2',type:'single',forming:true},{id:'b8',a:'c1',b:'hx',type:'single'},
      ],
      arrows:[{id:'a1',from:'no2',to:'c1',curve:-0.4,color:C.form}],
      highlight:'Wheland intermediate: ring NOT aromatic (one sp³ C). + charge delocalized on 3 carbons.',
    },
    { title:'Proton loss → re-aromatization',
      description:'Base (HSO₄⁻) removes H from the sp³ carbon. π system restored. Aromaticity regained — this is the driving force of EAS. H₂SO₄ regenerated.',
      atoms:[
        {id:'c1',label:'C',pos:hex(0,0,1.5,0),color:C.C,r:0.38},{id:'c2',label:'C',pos:hex(0,0,1.5,1),color:C.C,r:0.38},
        {id:'c3',label:'C',pos:hex(0,0,1.5,2),color:C.C,r:0.38},{id:'c4',label:'C',pos:hex(0,0,1.5,3),color:C.C,r:0.38},
        {id:'c5',label:'C',pos:hex(0,0,1.5,4),color:C.C,r:0.38},{id:'c6',label:'C',pos:hex(0,0,1.5,5),color:C.C,r:0.38},
        {id:'no2',label:'NO₂',pos:[0,2.8,0],color:C.N,r:0.4},
      ],
      bonds:[
        {id:'b1',a:'c1',b:'c2',type:'aromatic'},{id:'b2',a:'c2',b:'c3',type:'aromatic'},{id:'b3',a:'c3',b:'c4',type:'aromatic'},
        {id:'b4',a:'c4',b:'c5',type:'aromatic'},{id:'b5',a:'c5',b:'c6',type:'aromatic'},{id:'b6',a:'c6',b:'c1',type:'aromatic'},
        {id:'b7',a:'c1',b:'no2',type:'single'},
      ],
      arrows:[],
      highlight:'✓ Aromaticity restored — driving force. Net: H replaced by NO₂. H₂SO₄ regenerated (catalyst).',
    },
  ],
},
// ══ SN2 ══
{
  id:'sn2', name:'SN2: CH₃Br + OH⁻ — Backside Attack',
  category:'substitution', subcategory:'sn2',
  substrate:'Bromomethane (CH₃Br)', reagent:'NaOH (aq) or KOH',
  product:'Methanol + Br⁻',
  conditions:['Strong nucleophile (OH⁻, CN⁻, I⁻)','Primary substrate (no steric block)','Polar aprotic solvent (DMSO, acetone) for best rate'],
  notes:['One concerted step — no intermediate','Backside attack: Nu at 180° opposite to LG','Inversion of configuration (Walden inversion) at chiral centres'],
  jeePoints:['Rate = k[OH⁻][CH₃Br] — bimolecular','Reactivity: CH₃X > 1° > 2° >> 3°','Polar aprotic stabilises Nu⁻ (faster SN2); protic solvates Nu⁻ (slower)'],
  steps:[
    { title:'Concerted backside attack — inversion',
      description:'OH⁻ attacks the carbon from 180° opposite to Br (backside). Bond C-O forms simultaneously as C-Br breaks. Transition state: pentacoordinate C with both bonds partial. If chiral: configuration inverts (Walden).',
      atoms:[
        {id:'oh',label:'HO⁻',pos:[-2.5,0,0],color:C.O,r:0.4,charge:'−'},{id:'c',label:'CH₃',pos:[0,0,0],color:'#f97316',r:0.4},
        {id:'br',label:'Br',pos:[2.2,0,0],color:C.Br,r:0.5},
      ],
      bonds:[{id:'b1',a:'c',b:'br',type:'single',breaking:true},{id:'b2',a:'oh',b:'c',type:'single',forming:true}],
      arrows:[{id:'a1',from:'oh',to:'c',curve:0.3,color:C.form},{id:'a2',from:'c',to:'br',curve:0.3,color:C.arrow}],
      highlight:'⚡ CONCERTED: OH⁻ attacks 180° to Br. [HO···CH₃···Br]⁻ transition state. Inversion at chiral C.',
    },
  ],
},
// ══ SN1 ══
{
  id:'sn1', name:'SN1: t-BuBr + H₂O — Ionisation + Racemisation',
  category:'substitution', subcategory:'sn1',
  substrate:'(CH₃)₃CBr (tert-butyl bromide)', reagent:'H₂O (polar protic)',
  product:'(CH₃)₃COH + HBr (racemic if chiral)',
  conditions:['Weak nucleophile (H₂O, ROH)','Tertiary substrate','Polar protic solvent (H₂O, EtOH) — stabilises carbocation'],
  notes:['Two steps: ionisation (slow, RDS) → Nu attack (fast)','Rate = k[(CH₃)₃CBr] — unimolecular','Racemisation at chiral centres'],
  jeePoints:['Rate depends on carbocation stability only','Rearrangements (hydride/methyl shift) possible during ionisation','SN1 favoured: 3° substrate, weak Nu, polar protic solvent, heat'],
  steps:[
    { title:'Step 1 — Ionisation (slow, RDS)',
      description:'C-Br bond breaks heterolytically. Br takes both electrons. 3° carbocation forms — most stable type. Rate depends only on substrate concentration.',
      atoms:[
        {id:'c',label:'C⁺',pos:[0,0,0],color:'#f97316',r:0.45,charge:'+'},
        {id:'m1',label:'CH₃',pos:[-1.3,1.0,0],color:C.C,r:0.35},{id:'m2',label:'CH₃',pos:[1.3,1.0,0],color:C.C,r:0.35},
        {id:'m3',label:'CH₃',pos:[0,-1.4,0],color:C.C,r:0.35},{id:'br',label:'Br⁻',pos:[3.0,0,0],color:C.Br,r:0.5,charge:'−'},
      ],
      bonds:[{id:'b1',a:'c',b:'m1',type:'single'},{id:'b2',a:'c',b:'m2',type:'single'},{id:'b3',a:'c',b:'m3',type:'single'},{id:'b4',a:'c',b:'br',type:'single',breaking:true}],
      arrows:[{id:'a1',from:'c',to:'br',curve:0.35,color:C.arrow}],
      highlight:'SLOW: C-Br → 3° carbocation + Br⁻. Rate = k[t-BuBr]. ONLY substrate in rate law.',
    },
    { title:'Step 2 — Water attacks from BOTH faces',
      description:'Planar sp² carbocation: water can attack from both faces equally. If the compound is chiral, equal amounts of R and S products form → racemisation.',
      atoms:[
        {id:'c',label:'C⁺',pos:[0,0,0],color:'#f97316',r:0.45,charge:'+'},
        {id:'m1',label:'CH₃',pos:[-1.3,1.0,0],color:C.C,r:0.35},{id:'m2',label:'CH₃',pos:[1.3,1.0,0],color:C.C,r:0.35},
        {id:'m3',label:'CH₃',pos:[0,-1.4,0],color:C.C,r:0.35},
        {id:'w1',label:'H₂O',pos:[-2.2,0,0],color:C.O,r:0.38},{id:'w2',label:'H₂O',pos:[2.2,0,0],color:C.O,r:0.38},
      ],
      bonds:[{id:'b1',a:'c',b:'m1',type:'single'},{id:'b2',a:'c',b:'m2',type:'single'},{id:'b3',a:'c',b:'m3',type:'single'}],
      arrows:[{id:'a1',from:'w1',to:'c',curve:0.4,color:C.form},{id:'a2',from:'w2',to:'c',curve:-0.4,color:C.form}],
      highlight:'Planar cation: attack from both faces → RACEMISATION (50% R + 50% S). Then −H⁺ → t-BuOH.',
    },
  ],
},
// ══ E2 ══
{
  id:'e2', name:'E2: 2-Bromobutane + KOH/EtOH (Zaitsev)',
  category:'elimination', subcategory:'e2',
  substrate:'2-Bromobutane', reagent:'KOH / EtOH, heat',
  product:'But-2-ene (major, Zaitsev) + But-1-ene (minor)',
  conditions:['Strong base (KOH, NaOEt)','Heat (favours E over SN2)','Anti-periplanar H and Br required'],
  notes:['One step — concerted (base abstracts β-H while π bond forms and LG leaves)','Zaitsev: more substituted alkene (more stable) is major product','Hofmann: less substituted with bulky base (KOBu-t)'],
  jeePoints:['Rate = k[base][RBr] — bimolecular','Anti-periplanar geometry required (trans diaxial in rings)','E2 vs SN2: higher T, bulky base → E2; lower T, good Nu, 1° → SN2','Cyclic: only trans-diaxial elimination possible'],
  steps:[
    { title:'E2 — All 3 bonds change simultaneously',
      description:'OEt⁻ (base) abstracts the anti-periplanar β-H. Simultaneously: β-C-H breaks, Cβ=Cα π bond forms, Cα-Br breaks. One concerted step. All four curly arrows show concurrent electron flow.',
      atoms:[
        {id:'base',label:'EtO⁻',pos:[-2.8,1.5,0],color:C.O,r:0.4,charge:'−'},{id:'hb',label:'Hβ',pos:[-1.2,1.2,0],color:C.H,r:0.28},
        {id:'cb',label:'Cβ',pos:[-0.2,0,0],color:'#06b6d4',r:0.4},{id:'ca',label:'Cα',pos:[1.4,0,0],color:'#06b6d4',r:0.4},
        {id:'br',label:'Br',pos:[2.7,-0.8,0],color:C.Br,r:0.5},
        {id:'m1',label:'CH₃',pos:[-1.5,-0.8,0],color:C.C,r:0.35},{id:'m2',label:'CH₃',pos:[2.4,0.9,0],color:C.C,r:0.35},
      ],
      bonds:[
        {id:'b1',a:'cb',b:'ca',type:'single'},{id:'b2',a:'ca',b:'br',type:'single',breaking:true},
        {id:'b3',a:'cb',b:'hb',type:'single',breaking:true},{id:'b4',a:'cb',b:'m1',type:'single'},{id:'b5',a:'ca',b:'m2',type:'single'},
      ],
      arrows:[
        {id:'a1',from:'base',to:'hb',curve:0.4,color:C.arrow},{id:'a2',from:'hb',to:'cb',curve:0.35,color:C.arrow},
        {id:'a3',from:'cb',to:'ca',curve:0.3,color:C.form},{id:'a4',from:'ca',to:'br',curve:-0.35,color:C.arrow},
      ],
      highlight:'Anti-periplanar Hβ and Br. All 3 bonds change at once. 4 arrows = 4 simultaneous electron movements.',
    },
  ],
},
// ══ OXIDATION ══
{
  id:'oxid-pcc', name:'PCC: 1° Alcohol → Aldehyde (Stops Here)',
  category:'oxidation', subcategory:'oxid',
  substrate:'1-Propanol (RCH₂OH)', reagent:'PCC / CH₂Cl₂',
  product:'Propanal (RCHO) — stops at aldehyde',
  conditions:['PCC = pyridinium chlorochromate (CrO₃·py·HCl)','Anhydrous CH₂Cl₂','Room temperature'],
  notes:['PCC stops at aldehyde (1° → CHO, not further to COOH)','Jones reagent (CrO₃/H₂SO₄): 1° → COOH, 2° → ketone','Swern (oxalyl chloride/DMSO): 1° → CHO (very mild)','3° alcohol: no reaction (no α-H on C-OH)'],
  jeePoints:['PCC: 1°→CHO, 2°→C=O, 3°→no reaction','K₂Cr₂O₇/H₂SO₄: 1°→COOH, 2°→C=O','MnO₂: only allylic/benzylic alcohol → carbonyl','KMnO₄/cold/neutral: alkene → cis-diol (Baeyer test)'],
  steps:[
    { title:'PCC: chromate ester formation then E2-like elimination',
      description:'Cr(VI) of PCC forms a chromate ester with the alcohol O-H. Then pyridine base abstracts the α-H. Concerted E2-like step: C=O forms, Cr(IV) departs. Aldehyde cannot easily form another ester → stops here.',
      atoms:[
        {id:'r',label:'CH₂CH₃',pos:[-2.0,0,0],color:C.C,r:0.4},{id:'c',label:'CH₂',pos:[-0.5,0,0],color:'#f97316',r:0.4},
        {id:'o',label:'O',pos:[1.0,0.8,0],color:C.O,r:0.38},{id:'cr',label:'CrO₃',pos:[2.2,0.8,0],color:'#f97316',r:0.42},
        {id:'h',label:'H',pos:[-0.5,-1.2,0],color:C.H,r:0.28},{id:'py',label:'Py',pos:[-2.0,-1.2,0],color:C.N,r:0.35},
      ],
      bonds:[{id:'b1',a:'r',b:'c',type:'single'},{id:'b2',a:'c',b:'o',type:'single'},{id:'b3',a:'o',b:'cr',type:'single'},{id:'b4',a:'c',b:'h',type:'single',breaking:true}],
      arrows:[
        {id:'a1',from:'py',to:'h',curve:0.4,color:C.arrow},{id:'a2',from:'h',to:'c',curve:0.3,color:C.arrow},
        {id:'a3',from:'c',to:'o',curve:0.35,color:C.form},{id:'a4',from:'o',to:'cr',curve:0.3,color:C.arrow},
      ],
      highlight:'Pyridine abstracts α-H. C=O forms as Cr(IV) departs. Aldehyde product — cannot form second chromate ester easily.',
    },
  ],
},
// ══ REDUCTION ══
{
  id:'red-lialh4', name:'LiAlH₄: Ester → 1° Alcohol',
  category:'reduction', subcategory:'red',
  substrate:'Ethyl acetate (CH₃COOEt)', reagent:'LiAlH₄ / dry THF then H₃O⁺',
  product:'2 × Ethanol (1° alcohol)',
  conditions:['Anhydrous THF (MUST — LiAlH₄ reacts violently with water)','0°C → RT','Aqueous workup: H₃O⁺ or NH₄Cl(aq)'],
  notes:['LiAlH₄ reduces ALL C=O groups: acid, ester, amide, nitrile, aldehyde, ketone','Ester: gives 2 alcohols (1 from acyl part, 1 from alkoxy part)','NaBH₄ cannot reduce esters (too mild)'],
  jeePoints:['LiAlH₄: RCOOH→RCH₂OH, RCOOR\'→RCH₂OH+R\'OH, RCONH₂→RCH₂NH₂, RCN→RCH₂NH₂','NaBH₄: only aldehyde/ketone → alcohol','Cannot use LiAlH₄ for selective reduction when both C=O and C=C present — use NaBH₄'],
  steps:[
    { title:'H⁻ attacks ester carbonyl → tetrahedral intermediate',
      description:'LiAlH₄ delivers H⁻ to the electrophilic ester C=O. Tetrahedral alkoxide intermediate forms. The OR\' group is a leaving group (unlike for ketones).',
      atoms:[
        {id:'lah',label:'AlH₄⁻',pos:[-2.8,0.8,0],color:C.C,r:0.42,charge:'−'},
        {id:'c',label:'C',pos:[0,0,0],color:'#f97316',r:0.42},{id:'o1',label:'O⁻',pos:[0,1.5,0],color:C.O,r:0.4,charge:'−'},
        {id:'me',label:'CH₃',pos:[-1.4,-0.7,0],color:C.C,r:0.35},{id:'oe',label:'OEt',pos:[1.4,-0.7,0],color:C.O,r:0.4},
      ],
      bonds:[{id:'b1',a:'c',b:'o1',type:'double'},{id:'b2',a:'c',b:'me',type:'single'},{id:'b3',a:'c',b:'oe',type:'single'}],
      arrows:[{id:'a1',from:'lah',to:'c',curve:0.4,color:C.form},{id:'a2',from:'c',to:'o1',curve:0.4,color:C.arrow}],
      highlight:'H⁻ attacks ester C. Tetrahedral intermediate — O⁻ forms. EtO⁻ will leave next.',
    },
    { title:'OEt⁻ departs → aldehyde → second H⁻ addition',
      description:'EtO⁻ (leaving group) departs. An aldehyde forms. Immediately a second H⁻ from LiAlH₄ attacks the aldehyde. Final workup with H₃O⁺ gives two equivalents of ethanol.',
      atoms:[
        {id:'c',label:'CH₂OH',pos:[0,0,0],color:C.C,r:0.42},{id:'me',label:'CH₃',pos:[-1.5,0,0],color:C.C,r:0.35},
        {id:'etoh',label:'EtOH',pos:[2.5,0.5,0],color:C.O,r:0.4},
      ],
      bonds:[{id:'b1',a:'me',b:'c',type:'single'}],arrows:[],
      highlight:'✓ Two alcohols from one ester: CH₃CH₂OH (from acyl) + EtOH (from alkoxy). H₃O⁺ workup.',
    },
  ],
},
// ══ REARRANGEMENT ══
{
  id:'rearr-hydride', name:'1,2-Hydride Shift: 2° → 3° Cation',
  category:'rearrangement', subcategory:'rearr',
  substrate:'2-Methylbutyl cation (2°)', reagent:'(Occurs in SN1/E1)',
  product:'2-Methylbut-2-yl cation (3°)',
  conditions:['Only in carbocation intermediates (SN1, E1, EAS protonation)','Driving force: thermodynamic stability (2° → 3°)','Occurs in <10⁻¹² seconds (very fast)'],
  notes:['H migrates WITH its bonding electron pair to adjacent + carbon','1,2-shift: only to adjacent (α) carbon','Wagner-Meerwein: alkyl or aryl shifts (same mechanism)','Ring expansion/contraction: cyclopentyl ↔ cyclohexyl by C-C migration'],
  jeePoints:['Rearrangements ONLY in SN1/E1 (NOT SN2/E2 — no cation formed)','Neopentyl + HX: 1° cation rearranges immediately to 3°','Pinacol rearrangement: 1,2-diol + H⁺ → ketone with methyl shift','Beckmann: oxime → amide with aryl/alkyl migration'],
  steps:[
    { title:'1,2-Hydride Shift: H migrates with electrons',
      description:'In the 2° carbocation, the adjacent C-H bond migrates to the positively charged carbon (taking both electrons). The + charge moves to the carbon that lost the H. Result: more stable 3° carbocation.',
      atoms:[
        {id:'c1',label:'CH₃',pos:[-1.4,0.8,0],color:C.C,r:0.35},{id:'c2',label:'C⁺',pos:[0,0,0],color:'#f97316',r:0.42,charge:'+'},
        {id:'c3',label:'CH',pos:[1.5,0,0],color:C.C,r:0.4},{id:'h',label:'H',pos:[2.3,1.0,0],color:C.H,r:0.28},
        {id:'c4',label:'CH₃',pos:[2.3,-0.8,0],color:C.C,r:0.35},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'single'},{id:'b2',a:'c2',b:'c3',type:'single'},{id:'b3',a:'c3',b:'h',type:'single',breaking:true},{id:'b4',a:'c3',b:'c4',type:'single'}],
      arrows:[{id:'a1',from:'h',to:'c2',curve:0.5,color:C.arrow}],
      highlight:'H migrates WITH its bonding electrons to adjacent C⁺ → + charge moves to new position → more stable 3° cation',
    },
  ],
},
// ══ NAMED REACTIONS ══
{
  id:'named-aldol', name:'Aldol Condensation',
  category:'named', subcategory:'named',
  substrate:'Acetaldehyde (2 mol, has α-H)', reagent:'NaOH (dilute) → then heat',
  product:'Crotonaldehyde (but-2-enal)',
  conditions:['Step 1: dilute NaOH, 0-10°C (aldol addition)','Step 2: conc. NaOH or heat → dehydration','α-H required on at least one carbonyl compound'],
  notes:['Enolate of CH₃CHO attacks C=O of second molecule → β-hydroxy aldehyde','Heat → −H₂O → α,β-unsaturated carbonyl (conjugated enal)','Cross-aldol: preformed enolate + non-enolizable carbonyl','Intramolecular: 1,5-diketone → cyclopentenone'],
  jeePoints:['α-H essential (pKa ≈ 17-20) — cannot do Aldol without it','Aldol product = β-OH carbonyl; condensation = α,β-unsaturated carbonyl','Mixed Aldol requires LDA (kinetic enolate) to avoid scrambling','Retro-aldol: reverse in acid; Claisen condensation: analogous for esters'],
  steps:[
    { title:'Enolate formation (base abstracts α-H)',
      description:'OH⁻ abstracts the α-hydrogen (acidic, pKa ≈ 17 due to adjacent C=O). Enolate forms — negative charge delocalized onto both C and O by resonance.',
      atoms:[
        {id:'oh',label:'OH⁻',pos:[-3.0,1.2,0],color:C.O,r:0.4,charge:'−'},{id:'ha',label:'Hα',pos:[-1.5,1.0,0],color:C.H,r:0.28},
        {id:'ca',label:'CH₂',pos:[-0.5,0,0],color:'#06b6d4',r:0.4,charge:'−'},{id:'co',label:'CHO',pos:[1.2,0,0],color:'#f97316',r:0.42},
      ],
      bonds:[{id:'b1',a:'ca',b:'co',type:'single'},{id:'b2',a:'ca',b:'ha',type:'single',breaking:true}],
      arrows:[{id:'a1',from:'oh',to:'ha',curve:0.4,color:C.arrow},{id:'a2',from:'ha',to:'ca',curve:0.35,color:C.arrow},{id:'a3',from:'ca',to:'co',curve:0.3,color:C.form}],
      highlight:'α-H removed by OH⁻ → resonance-stabilised enolate. pKa ≈ 17 (acidic due to C=O adjacent).',
    },
    { title:'Enolate attacks second aldehyde — C-C bond!',
      description:'Enolate carbon attacks the electrophilic C=O of a second acetaldehyde molecule. New C-C bond forms. β-alkoxide intermediate. This is the key bond-forming step.',
      atoms:[
        {id:'c1',label:'CH₂⁻',pos:[-2.2,0,0],color:'#06b6d4',r:0.4,charge:'−'},{id:'co1',label:'CHO',pos:[-0.9,0,0],color:C.C,r:0.35},
        {id:'c2',label:'CH₃C',pos:[1.5,0,0],color:'#f97316',r:0.4},{id:'o2',label:'O⁻',pos:[2.5,1.0,0],color:C.O,r:0.38,charge:'−'},
      ],
      bonds:[{id:'b1',a:'c1',b:'co1',type:'single'},{id:'b2',a:'c2',b:'o2',type:'double'},{id:'b3',a:'c1',b:'c2',type:'single',forming:true}],
      arrows:[{id:'a1',from:'c1',to:'c2',curve:0.4,color:C.form},{id:'a2',from:'c2',to:'o2',curve:0.35,color:C.arrow}],
      highlight:'⚡ NEW C-C BOND! Carbon skeleton grows. β-alkoxide intermediate formed.',
    },
    { title:'Dehydration → conjugated product (condensation)',
      description:'Heat causes E1cb dehydration of the β-OH aldehyde. Product: crotonaldehyde (α,β-unsaturated aldehyde) — conjugated, thermodynamically stable.',
      atoms:[
        {id:'c1',label:'CH₃',pos:[-2,0,0],color:C.C,r:0.35},{id:'c2',label:'CH=',pos:[-0.5,0,0],color:'#06b6d4',r:0.4},
        {id:'c3',label:'=CH',pos:[1.0,0,0],color:'#06b6d4',r:0.4},{id:'c4',label:'CHO',pos:[2.3,0,0],color:'#f97316',r:0.4},
      ],
      bonds:[{id:'b1',a:'c1',b:'c2',type:'single'},{id:'b2',a:'c2',b:'c3',type:'double',forming:true},{id:'b3',a:'c3',b:'c4',type:'single'}],
      arrows:[],
      highlight:'✓ Crotonaldehyde: conjugated α,β-unsaturated carbonyl. Thermodynamically stable. −H₂O drives equilibrium.',
    },
  ],
},
{
  id:'named-cannizzaro', name:'Cannizzaro Reaction (No α-H)',
  category:'named', subcategory:'named',
  substrate:'Benzaldehyde (no α-H) × 2', reagent:'Conc. NaOH (50%)',
  product:'Benzoic acid + Benzyl alcohol (1:1)',
  conditions:['Conc. NaOH required','Non-enolizable aldehydes only (HCHO, PhCHO, (CH₃)₃CCHO)','If α-H present → Aldol instead!'],
  notes:['Disproportionation: one aldehyde oxidised (→ acid), another reduced (→ alcohol)','Hydride transfer is key step (not radical)','Cross-Cannizzaro: HCHO always oxidised (sacrificial reductant)'],
  jeePoints:['Only aldehydes WITHOUT α-H (HCHO, Ph-CHO, pivaldehyde)','Cross-Cannizzaro: HCHO + RCHO → RCOOH + CH₃OH','Hydride transfer distinguishes from Aldol (no C-C bond formation here)'],
  steps:[
    { title:'OH⁻ adds to aldehyde → tetrahedral intermediate',
      description:'OH⁻ attacks PhCHO carbonyl. Tetrahedral alkoxide intermediate with both -O⁻ and -OH. This H is the one that will transfer as hydride to second molecule.',
      atoms:[
        {id:'ph',label:'Ph',pos:[-2.5,0,0],color:C.Ar,r:0.45},{id:'c1',label:'CH',pos:[-1.0,0,0],color:'#f97316',r:0.4},
        {id:'o1',label:'O⁻',pos:[-1.0,1.5,0],color:C.O,r:0.4,charge:'−'},{id:'oh',label:'OH',pos:[0.5,0,0],color:C.O,r:0.38},
      ],
      bonds:[{id:'b1',a:'ph',b:'c1',type:'single'},{id:'b2',a:'c1',b:'o1',type:'single'},{id:'b3',a:'c1',b:'oh',type:'single',forming:true}],
      arrows:[{id:'a1',from:'oh',to:'c1',curve:0.4,color:C.form}],
      highlight:'OH⁻ adds to PhCHO → tetrahedral intermediate. C-H ready to transfer as hydride to second PhCHO.',
    },
    { title:'Hydride transfer → benzoate + benzyl alkoxide',
      description:'The C-H of the tetrahedral intermediate migrates as H⁻ (hydride) to the carbonyl carbon of a SECOND benzaldehyde. One becomes PhCOO⁻ (oxidised), the other becomes PhCH₂O⁻ (reduced).',
      atoms:[
        {id:'ph1',label:'Ph',pos:[-3.5,0,0],color:C.Ar,r:0.45},{id:'c1',label:'C',pos:[-2.2,0,0],color:'#f97316',r:0.4},
        {id:'o1',label:'O⁻',pos:[-2.2,1.4,0],color:C.O,r:0.38,charge:'−'},{id:'oh',label:'O',pos:[-1.2,-0.8,0],color:C.O,r:0.35},
        {id:'h',label:'H',pos:[-0.8,0.4,0],color:C.H,r:0.28},
        {id:'c2',label:'C=O',pos:[1.5,0,0],color:'#f97316',r:0.42},{id:'ph2',label:'Ph',pos:[3.0,0,0],color:C.Ar,r:0.45},
      ],
      bonds:[
        {id:'b1',a:'ph1',b:'c1',type:'single'},{id:'b2',a:'c1',b:'o1',type:'double'},
        {id:'b3',a:'c1',b:'oh',type:'single'},{id:'b4',a:'c1',b:'h',type:'single',breaking:true},
        {id:'b5',a:'c2',b:'ph2',type:'single'},{id:'b6',a:'h',b:'c2',type:'single',forming:true},
      ],
      arrows:[{id:'a1',from:'h',to:'c2',curve:0.5,color:C.arrow}],
      highlight:'⚡ Hydride (H⁻) transfers from first molecule to second. One oxidised → PhCOO⁻; other reduced → PhCH₂O⁻.',
    },
  ],
},
{
  id:'named-clemmensen', name:'Clemmensen Reduction (C=O → CH₂)',
  category:'named', subcategory:'named',
  substrate:'Aryl ketone (e.g., acetophenone)', reagent:'Zn-Hg amalgam + conc. HCl, reflux',
  product:'Ethylbenzene (C=O → CH₂)',
  conditions:['Zn-Hg in conc. HCl','Reflux (acidic)','Complement to Wolff-Kishner (basic conditions)'],
  notes:['Zn surface donates electrons to C=O via surface mechanism','Two-electron reduction then protonation by HCl','Selectivity: C=O reduced; isolated C=C survives','Used in Haworth synthesis of naphthalene'],
  jeePoints:['Clemmensen: C=O → CH₂ (acidic, Zn-Hg/HCl)','Wolff-Kishner: C=O → CH₂ (basic, N₂H₄/KOH, high T)','Choose Clemmensen when: acid-stable, base-labile groups present','Choose Wolff-Kishner when: base-stable, acid-labile groups present'],
  steps:[
    { title:'Zn surface: electrons to C=O → reduction',
      description:'At Zn surface: C=O receives electrons from Zn. Sequential protonation by HCl. Net: both C=O oxygens removed, two H atoms added → CH₂.',
      atoms:[
        {id:'zn',label:'Zn⁰',pos:[-2.0,-0.5,0],color:'#94a3b8',r:0.45},{id:'c',label:'C=O',pos:[0,0,0],color:'#f97316',r:0.42},
        {id:'r1',label:'Ph',pos:[1.6,0.6,0],color:C.Ar,r:0.45},{id:'r2',label:'CH₃',pos:[1.6,-0.6,0],color:C.C,r:0.35},
        {id:'hcl',label:'2HCl',pos:[0,2.0,0],color:C.Cl,r:0.4},
      ],
      bonds:[{id:'b1',a:'c',b:'r1',type:'single'},{id:'b2',a:'c',b:'r2',type:'single'},{id:'b3',a:'c',b:'zn',type:'single'}],
      arrows:[{id:'a1',from:'zn',to:'c',curve:0.4,color:C.form},{id:'a2',from:'hcl',to:'c',curve:-0.3,color:C.form}],
      highlight:'Zn donates 2e⁻ to C=O. 2H⁺ from HCl added. C=O → CH₂. Haworth synthesis: PhCO-chain → Ph-CH₂-chain.',
    },
  ],
},
{
  id:'named-sandmeyer', name:'Sandmeyer: ArNH₂ → ArX via Diazonium',
  category:'named', subcategory:'named',
  substrate:'Aniline (ArNH₂)', reagent:'NaNO₂/HCl (0-5°C) → CuX',
  product:'ArCl, ArBr, ArCN (Sandmeyer); ArF (Balz-Schiemann); ArOH (hydrolysis)',
  conditions:['Diazotisation: NaNO₂ + HCl at 0-5°C EXACTLY (diazonium decomposes > 5°C)','Sandmeyer: CuCl → ArCl; CuBr → ArBr; CuCN → ArCN','Balz-Schiemann: BF₄⁻ salt → heat → ArF + N₂ + BF₃'],
  notes:['Diazonium allows ANY substitution at position originally held by NH₂','NH₂ is o/p director in EAS; diazonium is o/p director by origin','Coupling: ArN₂⁺ + phenol/aniline → azo dye (−N=N−)'],
  jeePoints:['MUST be 0-5°C (ice bath) for diazotisation','Sandmeyer = radical mechanism via Cu(I) catalyst','Balz-Schiemann only way to get ArF (other methods fail)','Azo dyes: ArN₂⁺ + β-naphthol → orange dye (acid-base indicator)'],
  steps:[
    { title:'Diazotisation: ArNH₂ → ArN₂⁺',
      description:'HNO₂ (from NaNO₂ + HCl) reacts with aniline at 0-5°C. Diazonium salt forms. Must be cold — warmer → ArN₂⁺ + H₂O → ArOH + N₂ (hydrolysis, wasteful).',
      atoms:[
        {id:'ar',label:'Ar',pos:[-2,0,0],color:C.Ar,r:0.45},{id:'n',label:'N≡N⁺',pos:[0,0,0],color:C.N,r:0.45,charge:'+'},
        {id:'cl',label:'Cl⁻',pos:[2,0,0],color:C.Cl,r:0.4,charge:'−'},
      ],
      bonds:[{id:'b1',a:'ar',b:'n',type:'single'}],arrows:[],
      highlight:'ArNH₂ + HNO₂ → ArN₂⁺Cl⁻. Must be 0-5°C. N≡N⁺ = diazonium (linear). Reactive electrophile/radical precursor.',
    },
    { title:'Sandmeyer: Cu(I) radical substitution → ArX',
      description:'Cu(I) (CuCl or CuBr) reduces ArN₂⁺. Aryl radical Ar• forms as N₂ expelled. Ar• takes Cl from CuCl₂. ArCl product. Cu(I) regenerated catalytically.',
      atoms:[
        {id:'ar',label:'Ar•',pos:[-1.2,0,0],color:C.Ar,r:0.45},{id:'n2',label:'N₂↑',pos:[1.0,0.8,0],color:C.N,r:0.4},
        {id:'cu',label:'CuCl',pos:[-1.2,-1.8,0],color:'#f97316',r:0.4},{id:'cl',label:'Cl',pos:[0.5,-0.5,0],color:C.Cl,r:0.4},
      ],
      bonds:[{id:'b1',a:'ar',b:'n2',type:'single',breaking:true},{id:'b2',a:'ar',b:'cl',type:'single',forming:true}],
      arrows:[{id:'a1',from:'ar',to:'n2',curve:0.4,color:C.arrow},{id:'a2',from:'cu',to:'cl',curve:0.35,color:C.form}],
      highlight:'Ar• + CuCl₂ → ArCl + CuCl (catalytic). N₂ expelled (irreversible). Sandmeyer = radical mechanism.',
    },
  ],
},
{
  id:'named-gabriel', name:'Gabriel Synthesis: Pure 1° Amine',
  category:'named', subcategory:'named',
  substrate:'K-phthalimide + RX', reagent:'KOH → RX → N₂H₄ (hydrazinolysis)',
  product:'RNH₂ (primary amine, pure)',
  conditions:['Step 1: phthalimide + KOH → potassium salt (K-phthalimide)','Step 2: RX + K-phthalimide → N-alkylphthalimide (SN2)','Step 3: N₂H₄ (hydrazinolysis) → frees RNH₂'],
  notes:['Key advantage: ONLY primary amine (no 2°/3° contamination)','Phthalimide N: only one replaceable H → mono-alkylation only','Hinsberg test: ArSO₂Cl + 1°amine → solid/NaOH-soluble; 2°amine → solid/insoluble; 3° → no reaction'],
  jeePoints:['Gabriel: always gives 1° amine exclusively','Cannot make 2° or 3° amines by Gabriel','Delépine modification: HMTA instead of phthalimide','Hydrazinolysis (N₂H₄) cleaves phthalimide C-N bond specifically'],
  steps:[
    { title:'K-phthalimide (N nucleophile) + RX → SN2',
      description:'K-phthalimide (phthalimide anion, N nucleophile) attacks RX via SN2. N-alkylphthalimide forms. The N now has no more acidic H → no further alkylation possible.',
      atoms:[
        {id:'pt',label:'Phth-N⁻',pos:[-2.5,0,0],color:C.N,r:0.45,charge:'−'},{id:'r',label:'R',pos:[0.5,0,0],color:C.C,r:0.4},
        {id:'x',label:'X',pos:[1.8,0,0],color:C.Br,r:0.4},
      ],
      bonds:[{id:'b1',a:'r',b:'x',type:'single',breaking:true},{id:'b2',a:'pt',b:'r',type:'single',forming:true}],
      arrows:[{id:'a1',from:'pt',to:'r',curve:0.4,color:C.form},{id:'a2',from:'r',to:'x',curve:0.35,color:C.arrow}],
      highlight:'SN2: phthalimide N⁻ attacks R-X backside. Only 1 alkylation possible (N-H already used up).',
    },
    { title:'Hydrazinolysis → free RNH₂',
      description:'N₂H₄ (hydrazine) cleaves both phthalimide C-N bonds. Phthalhydrazide byproduct forms. Primary amine RNH₂ released — pure, no 2° or 3° contamination.',
      atoms:[
        {id:'rnh2',label:'RNH₂',pos:[0,0,0],color:C.N,r:0.45},{id:'phth',label:'PhthN₂H₂',pos:[2.5,0.5,0],color:C.C,r:0.5},
      ],
      bonds:[],arrows:[],
      highlight:'✓ RNH₂ (pure primary amine) + phthalhydrazide. Gabriel = guaranteed 1° amine synthesis.',
    },
  ],
},
] // end REACTIONS

// ─── Category tree ──────────────────────────────────────────────
const CATS = [
  { id:'addition',      label:'Addition Reactions', subs:[
    { id:'ear', label:'Electrophilic Addition' },
    { id:'nar', label:'Nucleophilic Addition'  },
  ]},
  { id:'substitution',  label:'Substitution Reactions', subs:[
    { id:'eas', label:'EAS (Aromatic)' },
    { id:'sn2', label:'SN2'            },
    { id:'sn1', label:'SN1'            },
    { id:'frs', label:'Free Radical Sub.' },
  ]},
  { id:'elimination',   label:'Elimination', subs:[{ id:'e2', label:'E2' }] },
  { id:'oxidation',     label:'Oxidation',   subs:[{ id:'oxid', label:'Oxidation agents' }] },
  { id:'reduction',     label:'Reduction',   subs:[{ id:'red', label:'Reducing agents'   }] },
  { id:'rearrangement', label:'Rearrangements', subs:[{ id:'rearr', label:'Carbocation shifts' }] },
  { id:'named',         label:'Named Reactions',  subs:[{ id:'named', label:'All JEE named rxns' }] },
]

// ─── Three.js components ────────────────────────────────────────
function AtomSphere({ atom }:{ atom:Atom3D }) {
  const r = atom.r ?? 0.38
  return (
    <group position={atom.pos}>
      <mesh>
        <sphereGeometry args={[r,20,20]}/>
        <meshStandardMaterial color={atom.color} emissive={atom.color} emissiveIntensity={0.25} roughness={0.35} metalness={0.1}/>
      </mesh>
      <Html center distanceFactor={6}>
        <div style={{fontFamily:'monospace',fontSize:11,fontWeight:900,color:'#fff',textShadow:'0 0 6px #000',pointerEvents:'none',whiteSpace:'nowrap'}}>
          {atom.label}{atom.charge&&<sup style={{fontSize:8}}>{atom.charge}</sup>}
        </div>
      </Html>
    </group>
  )
}

function BondStick({ bond, atoms }:{ bond:Bond3D; atoms:Atom3D[] }) {
  const a0=atoms.find(a=>a.id===bond.a), a1=atoms.find(a=>a.id===bond.b)
  if(!a0||!a1) return null
  const v1=new THREE.Vector3(...a0.pos), v2=new THREE.Vector3(...a1.pos)
  const dir=v2.clone().sub(v1), len=dir.length()
  const mid=v1.clone().add(dir.clone().multiplyScalar(0.5))
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize())
  const col=bond.forming?'#22c55e':bond.breaking?'#ef4444':'#94a3b8'
  const offsets=bond.type==='double'?[-0.08,0.08]:bond.type==='triple'?[-0.12,0,0.12]:[0]
  const perp=new THREE.Vector3(0,0,1).applyQuaternion(q).normalize()
  return (
    <group>
      {offsets.map((off,i)=>{
        const pos=mid.clone().add(perp.clone().multiplyScalar(off))
        return (
          <mesh key={i} position={pos.toArray() as [number,number,number]} quaternion={q}>
            <cylinderGeometry args={[0.05,0.05,len*0.82,8]}/>
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.15} transparent={!!bond.breaking} opacity={bond.breaking?0.5:1}/>
          </mesh>
        )
      })}
    </group>
  )
}

type P2D = Record<string,{x:number;y:number}>
function ProjTracker({ atoms, onUpdate }:{ atoms:Atom3D[]; onUpdate:(p:P2D)=>void }) {
  const { camera, size } = useThree()
  const last = useRef('')
  useFrame(()=>{
    const p:P2D={}
    atoms.forEach(a=>{ const v=new THREE.Vector3(...a.pos).project(camera); p[a.id]={x:(v.x*0.5+0.5)*size.width,y:(-v.y*0.5+0.5)*size.height} })
    const sig=atoms.map(a=>`${a.id}:${p[a.id].x.toFixed(0)},${p[a.id].y.toFixed(0)}`).join('|')
    if(sig!==last.current){last.current=sig;onUpdate(p)}
  })
  return null
}

// ─── SVG curly arrow (projected screen-space) ───────────────────
function CurlyArrow({ from, to, curve, color='#dc2626', id }:{ from:{x:number;y:number}; to:{x:number;y:number}; curve:number; color?:string; id:string }) {
  const dx=to.x-from.x, dy=to.y-from.y, len=Math.sqrt(dx*dx+dy*dy)
  if(len<8) return null
  const px=-dy/len, py=dx/len
  const sign=curve>0?1:-1
  const cx=(from.x+to.x)/2+px*len*Math.abs(curve)*sign
  const cy=(from.y+to.y)/2+py*len*Math.abs(curve)*sign
  // Shorten to 82% along bezier so arrowhead stops at atom edge
  const t=0.82
  const ex=from.x*(1-t)**2+cx*2*t*(1-t)+to.x*t*t
  const ey=from.y*(1-t)**2+cy*2*t*(1-t)+to.y*t*t
  const markId=`mk-${id}`
  return (
    <g>
      <defs>
        <marker id={markId} markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill={color}/>
        </marker>
      </defs>
      <path d={`M ${from.x.toFixed(1)} ${from.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`}
        fill="none" stroke={color} strokeWidth={2.8} markerEnd={`url(#${markId})`}
        strokeDasharray="300" strokeDashoffset="300"
        style={{animation:'drawA 0.7s ease-out forwards',animationDelay:'0.15s'}}/>
    </g>
  )
}

// ─── Mechanism viewer (3D + SVG overlay) ────────────────────────
function MechViewer({ step, stepKey }:{ step:MechStep; stepKey:string }) {
  const [proj, setProj] = useState<P2D>({})
  const W=560, H=330
  return (
    <div style={{position:'relative',width:W,height:H,borderRadius:14,overflow:'hidden',background:'radial-gradient(ellipse at 50% 40%,#130818 0%,#08020d 100%)'}}>
      <style>{`@keyframes drawA{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}`}</style>
      <Canvas camera={{position:[0,0,7],fov:45}} gl={{antialias:true,alpha:true}}>
        <ambientLight intensity={0.65}/>
        <pointLight position={[5,5,5]} intensity={1.0} color="#c8d8ff"/>
        <pointLight position={[-5,-3,3]} intensity={0.45} color="#ffd8b0"/>
        <Suspense fallback={null}>
          {step.atoms.map(a=><AtomSphere key={a.id} atom={a}/>)}
          {step.bonds.map(b=><BondStick key={b.id} bond={b} atoms={step.atoms}/>)}
          <ProjTracker atoms={step.atoms} onUpdate={setProj}/>
        </Suspense>
        <OrbitControls enableZoom autoRotate autoRotateSpeed={0.7} enablePan={false}/>
      </Canvas>
      <svg style={{position:'absolute',inset:0,pointerEvents:'none'}} width={W} height={H}>
        <AnimatePresence mode="wait">
          <motion.g key={stepKey} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.25}}>
            {step.arrows.map(arr=>{
              const f=proj[arr.from], t=proj[arr.to]
              if(!f||!t) return null
              return <CurlyArrow key={arr.id} from={f} to={t} curve={arr.curve} color={arr.color??C.arrow} id={`${stepKey}-${arr.id}`}/>
            })}
          </motion.g>
        </AnimatePresence>
      </svg>
      <div style={{position:'absolute',bottom:8,right:10,fontSize:9,color:'rgba(132,148,149,0.6)',pointerEvents:'none'}}>Drag · Scroll to zoom</div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────
export default function MechanismEngine() {
  const [openCat, setOpenCat] = useState<string|null>('addition')
  const [rxnId, setRxnId] = useState('ear-hbr-markov')
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval>>()

  const rxn = REACTIONS.find(r=>r.id===rxnId)!
  const step = rxn.steps[stepIdx]

  const next = useCallback(()=>{
    setStepIdx(i=>{ if(i>=rxn.steps.length-1){setPlaying(false);return i} return i+1 })
  },[rxn.steps.length])

  useEffect(()=>{
    clearInterval(timer.current)
    if(!playing) return
    timer.current=setInterval(next,2600)
    return ()=>clearInterval(timer.current)
  },[playing,next])

  const pick = (id:string)=>{ setRxnId(id); setStepIdx(0); setPlaying(false) }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>
      {/* top bar */}
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
          <span style={{color:'rgba(255,255,255,0.15)'}}>|</span>
          <strong style={{fontSize:13}}>Mechanism Engine — 3D Molecules · Screen-space Curly Arrows</strong>
        </div>
        <div style={{display:'flex',gap:6}}>
          <button onClick={()=>setStepIdx(i=>Math.max(0,i-1))} disabled={stepIdx===0}
            style={{padding:'4px 11px',borderRadius:7,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:stepIdx===0?'#333':'#849495',fontSize:12,cursor:stepIdx===0?'default':'pointer'}}>‹ Prev</button>
          <button onClick={()=>setPlaying(p=>!p)}
            style={{padding:'4px 12px',borderRadius:7,border:'1px solid rgba(220,38,38,0.4)',background:playing?'rgba(220,38,38,0.15)':'transparent',color:'#dc2626',fontSize:12,fontWeight:700,cursor:'pointer'}}>
            {playing?'⏸ Pause':'▶ Auto-play'}
          </button>
          <button onClick={next} disabled={stepIdx>=rxn.steps.length-1}
            style={{padding:'4px 11px',borderRadius:7,border:'1px solid rgba(255,255,255,0.1)',background:'transparent',color:stepIdx>=rxn.steps.length-1?'#333':'#849495',fontSize:12,cursor:stepIdx>=rxn.steps.length-1?'default':'pointer'}}>Next ›</button>
          <button onClick={()=>{setStepIdx(0);setPlaying(false)}} style={{padding:'4px 9px',borderRadius:7,border:'1px solid rgba(255,255,255,0.07)',background:'transparent',color:'#849495',fontSize:12,cursor:'pointer'}}>⟳</button>
        </div>
      </div>

      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* left nav */}
        <div style={{width:192,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.65)',overflowY:'auto',padding:'6px 0'}}>
          {CATS.map(cat=>(
            <div key={cat.id}>
              <button onClick={()=>setOpenCat(o=>o===cat.id?null:cat.id)}
                style={{display:'flex',justifyContent:'space-between',width:'100%',padding:'7px 12px',background:'transparent',border:'none',color:openCat===cat.id?'#f8fafc':'#849495',fontSize:9,fontWeight:700,cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.09em',textAlign:'left'}}>
                {cat.label}<span style={{opacity:0.5}}>{openCat===cat.id?'▾':'▸'}</span>
              </button>
              <AnimatePresence>
                {openCat===cat.id&&(
                  <motion.div key={cat.id} initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.16}} style={{overflow:'hidden'}}>
                    {cat.subs.map(sub=>(
                      <div key={sub.id}>
                        <div style={{padding:'3px 14px 2px',fontSize:8,color:'#4a5568',textTransform:'uppercase',letterSpacing:'0.1em'}}>{sub.label}</div>
                        {REACTIONS.filter(r=>r.subcategory===sub.id).map(r=>(
                          <button key={r.id} onClick={()=>pick(r.id)}
                            style={{display:'block',width:'100%',textAlign:'left',padding:'5px 18px',border:'none',background:rxnId===r.id?'rgba(220,38,38,0.1)':'transparent',color:rxnId===r.id?'#dc2626':'#849495',fontSize:9,cursor:'pointer',borderLeft:rxnId===r.id?'2px solid #dc2626':'2px solid transparent'}}>
                            {r.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* center */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',padding:'10px 12px',gap:8}}>
          {/* reaction header */}
          <div style={{background:'rgba(220,38,38,0.07)',border:'1px solid rgba(220,38,38,0.22)',borderRadius:11,padding:'7px 12px',flexShrink:0}}>
            <div style={{fontSize:14,fontWeight:900,color:'#dc2626'}}>{rxn.name}</div>
            <div style={{fontSize:10,color:'#849495',marginTop:1}}>{rxn.substrate} + {rxn.reagent} <span style={{color:'#f8fafc'}}>→</span> {rxn.product}</div>
          </div>
          {/* step pills */}
          <div style={{display:'flex',gap:5,flexShrink:0,flexWrap:'wrap'}}>
            {rxn.steps.map((s,i)=>(
              <button key={i} onClick={()=>{setStepIdx(i);setPlaying(false)}}
                style={{padding:'4px 11px',borderRadius:20,border:`1px solid ${i===stepIdx?'#dc2626':'rgba(255,255,255,0.09)'}`,background:i===stepIdx?'rgba(220,38,38,0.18)':'transparent',color:i===stepIdx?'#dc2626':i<stepIdx?'rgba(220,38,38,0.45)':'#849495',fontSize:9,cursor:'pointer',fontWeight:i===stepIdx?700:400}}>
                {i+1}. {s.title}
              </button>
            ))}
          </div>
          {/* 3D viewer */}
          <div style={{flexShrink:0}}>
            <AnimatePresence mode="wait">
              <motion.div key={`${rxnId}-${stepIdx}`} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:0.18}}>
                <MechViewer step={step} stepKey={`${rxnId}-${stepIdx}`}/>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* step description */}
          <div style={{background:'rgba(220,38,38,0.05)',border:'1px solid rgba(220,38,38,0.18)',borderRadius:11,padding:'9px 13px',flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:700,color:'#dc2626',marginBottom:4}}>{step.title}</div>
            <div style={{fontSize:11,color:'#f8fafc',lineHeight:1.65,marginBottom:step.highlight?6:0}}>{step.description}</div>
            {step.highlight&&<div style={{fontSize:11,color:'#fbbf24',background:'rgba(251,191,36,0.08)',borderLeft:'3px solid #fbbf24',padding:'5px 10px',borderRadius:'0 6px 6px 0'}}>{step.highlight}</div>}
            {step.note&&<div style={{fontSize:9,color:'#849495',marginTop:4,fontStyle:'italic'}}>{step.note}</div>}
          </div>
        </div>

        {/* right panel */}
        <div style={{width:215,flexShrink:0,borderLeft:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',overflowY:'auto',padding:11}}>
          {([
            {label:'Conditions',items:rxn.conditions,color:'#06b6d4'},
            {label:'Key Notes',items:rxn.notes,color:'#22c55e'},
            ...(rxn.exceptions?[{label:'Exceptions',items:rxn.exceptions,color:'#fbbf24'}]:[]),
            {label:'JEE Key Points',items:rxn.jeePoints,color:'#ec4899'},
          ] as {label:string;items:string[];color:string}[]).map(sec=>(
            <div key={sec.label} style={{marginBottom:11}}>
              <div style={{fontSize:9,color:sec.color,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:5}}>{sec.label}</div>
              {sec.items.map((item,i)=>(
                <div key={i} style={{fontSize:9,color:'#849495',marginBottom:4,padding:'4px 8px',background:`${sec.color}08`,borderRadius:6,lineHeight:1.5,borderLeft:`2px solid ${sec.color}30`}}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
