'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

// ── All pH calculation scenarios ──────────────────────────────

interface Scenario {
  name: string
  formula: string[]
  derivation: string
  pH: number
  color: string
  notes?: string[]
}

function solve(type: string, c1: number, c2: number, ka: number, kb: number, salt: boolean): Scenario {
  const pKa = -Math.log10(ka), pKb = -Math.log10(kb)
  const Kw = 1e-14

  switch (type) {
    // ── Pure solutions ─────────────────────────────────────────
    case 'strong-acid': return {
      name: 'Strong Acid (SA)', color: '#ef4444',
      formula: ['pH = −log[H⁺] = −log C', `pH = −log(${c1.toFixed(3)}) = ${(-Math.log10(c1)).toFixed(2)}`],
      derivation: 'SA fully dissociates: HA → H⁺ + A⁻\n[H⁺] = C',
      pH: Math.max(0, -Math.log10(c1)),
      notes: ['Valid when C >> Kw½ (i.e., C >> 10⁻⁷)', 'Ignore contribution of water']
    }

    case 'weak-acid': {
      const x = (-ka + Math.sqrt(ka*ka + 4*ka*c1))/2
      return {
        name: 'Weak Acid (WA)', color: '#f97316',
        formula: [
          '[H⁺] = √(Ka · C)',
          'pH = ½pKa − ½logC',
          `pH = ½(${pKa.toFixed(2)}) − ½log(${c1.toFixed(3)})`,
          `pH = ${(-Math.log10(x)).toFixed(2)}`,
          'OR exact: [H⁺]² + Ka[H⁺] − Ka·C = 0',
        ],
        derivation: 'HA ⇌ H⁺ + A⁻\nKa = x²/(C-x) ≈ x²/C\n[H⁺] = x = √(Ka·C)',
        pH: Math.max(0, Math.min(14, -Math.log10(x))),
        notes: [`α = √(Ka/C) = ${(Math.sqrt(ka/c1)*100).toFixed(2)}% dissociation`, 'Approximation valid when α < 5%']
      }
    }

    case 'strong-base': return {
      name: 'Strong Base (SB)', color: '#3b82f6',
      formula: ['pOH = −log[OH⁻] = −log C', 'pH = 14 − pOH = 14 + log C', `pH = 14 + log(${c1.toFixed(3)}) = ${(14+Math.log10(c1)).toFixed(2)}`],
      derivation: 'MOH → M⁺ + OH⁻\n[OH⁻] = C\npOH = −logC\npH = 14 − pOH',
      pH: Math.max(0, Math.min(14, 14 + Math.log10(c1))),
      notes: ['pH + pOH = 14 at 25°C (pKw = 14)']
    }

    case 'weak-base': {
      const x = (-kb + Math.sqrt(kb*kb + 4*kb*c1))/2
      return {
        name: 'Weak Base (WB)', color: '#8b5cf6',
        formula: [
          '[OH⁻] = √(Kb · C)',
          'pOH = ½pKb − ½logC',
          'pH = 14 − pOH = 14 − ½pKb + ½logC',
          `pH = ${(14+Math.log10(x)).toFixed(2)}`,
        ],
        derivation: 'B + H₂O ⇌ BH⁺ + OH⁻\nKb = x²/(C-x) ≈ x²/C',
        pH: Math.max(0, Math.min(14, 14 + Math.log10(x))),
        notes: [`pKa(conjugate) + pKb = 14`, `pKa of BH⁺ = 14 − ${pKb.toFixed(2)} = ${(14-pKb).toFixed(2)}`]
      }
    }

    case 'buffer-wa': {
      const ph = pKa + Math.log10(c2 / c1)
      return {
        name: 'Buffer: WA + Conjugate Base (A⁻)', color: '#22c55e',
        formula: [
          'pH = pKa + log([A⁻]/[HA])',
          `pH = ${pKa.toFixed(2)} + log(${c2.toFixed(2)}/${c1.toFixed(2)})`,
          `pH = ${pKa.toFixed(2)} + ${Math.log10(c2/c1).toFixed(2)}`,
          `pH = ${ph.toFixed(2)} ← Henderson-Hasselbalch`,
        ],
        derivation: 'Henderson-Hasselbalch equation:\nDerived from Ka = [H⁺][A⁻]/[HA]',
        pH: Math.max(0, Math.min(14, ph)),
        notes: ['Max buffer capacity when [A⁻] = [HA] → pH = pKa', `Effective range: pKa ± 1 = ${(pKa-1).toFixed(1)}–${(pKa+1).toFixed(1)}`]
      }
    }

    case 'buffer-wb': {
      const pKaConj = 14 - pKb
      const ph = pKaConj + Math.log10(c2 / c1)
      return {
        name: 'Buffer: WB + Conjugate Acid (BH⁺)', color: '#06b6d4',
        formula: [
          'pKa(BH⁺) = pKw − pKb = 14 − pKb',
          `pKa(BH⁺) = 14 − ${pKb.toFixed(2)} = ${pKaConj.toFixed(2)}`,
          'pH = pKa(BH⁺) + log([B]/[BH⁺])',
          `pH = ${pKaConj.toFixed(2)} + log(${c1.toFixed(2)}/${c2.toFixed(2)}) = ${ph.toFixed(2)}`,
        ],
        derivation: 'BH⁺ ⇌ B + H⁺\nKa(BH⁺) = Kw/Kb',
        pH: Math.max(0, Math.min(14, ph)),
        notes: ['pKa + pKb = 14 always at 25°C']
      }
    }

    // ── Mixtures ───────────────────────────────────────────────
    case 'sa-sb': {
      // c1 = conc of SA, c2 = conc of SB (equal volumes assumed, use moles)
      const diff = c1 - c2
      let pH: number, formula: string[], derivation: string, notes: string[]
      if (Math.abs(diff) < 1e-6) {
        pH = 7
        formula = ['[H⁺] = [OH⁻]', 'pH = 7 (neutral — complete neutralization)']
        derivation = 'SA + SB: Complete neutralization\nmoles acid = moles base → neutral salt → pH = 7'
        notes = ['e.g., NaCl, KNO₃ — neutral salts → pH = 7', 'Both ions do not hydrolyse']
      } else if (diff > 0) {
        pH = Math.max(0, -Math.log10(diff))
        formula = ['[H⁺]excess = nSA − nSB (per unit volume)', `pH = −log([H⁺]excess) = −log(${diff.toFixed(3)}) = ${pH.toFixed(2)}`]
        derivation = `Excess strong acid = ${diff.toFixed(3)} M\npH = −log(excess [H⁺])`
        notes = ['Excess SA determines pH', `Remaining: ${diff.toFixed(3)} M H⁺`]
      } else {
        pH = Math.min(14, 14 + Math.log10(-diff))
        formula = ['[OH⁻]excess = nSB − nSA (per unit volume)', `pH = 14 + log([OH⁻]excess) = ${pH.toFixed(2)}`]
        derivation = `Excess strong base = ${(-diff).toFixed(3)} M\npH = 14 + log(excess [OH⁻])`
        notes = ['Excess SB determines pH', `Remaining: ${(-diff).toFixed(3)} M OH⁻`]
      }
      return { name: 'Strong Acid + Strong Base (SA + SB)', color: '#f43f5e', formula, derivation, pH, notes }
    }

    case 'wa-sb': {
      // WA (c1 mol) + SB (c2 mol) — 3 scenarios
      const excess = c1 - c2
      let pH: number, formula: string[], derivation: string, notes: string[]
      if (Math.abs(excess) < c1 * 0.01) {
        // Equivalence point — salt of weak acid (basic salt)
        pH = Math.min(14, 7 + 0.5*pKa + 0.5*Math.log10(c1/2))
        formula = [
          'At equivalence: complete conversion to A⁻ (conjugate base)',
          'A⁻ hydrolyses: A⁻ + H₂O ⇌ HA + OH⁻',
          'pH = 7 + ½pKa + ½log C',
          `pH = 7 + ½(${pKa.toFixed(2)}) + ½log(${(c1/2).toFixed(3)}) = ${pH.toFixed(2)}`,
          '(pH > 7 always for salt of WA + SB)',
        ]
        derivation = `[OH⁻] = √(Kw/Ka · Csalt) = √(Kb_A⁻ · C)\nKh = Kw/Ka = ${(Kw/ka).toExponential(2)}`
        notes = ['Basic salt: e.g., CH₃COONa', `pH = 7 + ½(${pKa.toFixed(2)}) = ${(7+pKa/2).toFixed(2)} when C=1M`]
      } else if (excess > 0) {
        // Buffer region: excess WA acts as buffer with A⁻ formed
        pH = pKa + Math.log10(c2 / excess)
        formula = [
          'Excess WA + all SB converted to A⁻',
          'Buffer formed! Use Henderson-Hasselbalch:',
          'pH = pKa + log([A⁻]/[HA])',
          `pH = ${pKa.toFixed(2)} + log(${c2.toFixed(3)}/${excess.toFixed(3)}) = ${pH.toFixed(2)}`,
          `[HA]remaining = ${excess.toFixed(3)} M, [A⁻]formed = ${c2.toFixed(3)} M`,
        ]
        derivation = `When nWA > nSB: excess WA forms buffer\nHA + OH⁻ → A⁻ + H₂O (complete)\nBuffer: [HA] = ${excess.toFixed(3)}, [A⁻] = ${c2.toFixed(3)}`
        notes = ['Half-neutralization: nSB = ½nWA → pH = pKa', 'Buffer range: pKa ± 1']
      } else {
        // Excess SB
        pH = Math.min(14, 14 + Math.log10(-excess))
        formula = [
          'WA completely consumed by SB, excess SB remains',
          '[OH⁻]excess = nSB − nWA (per unit volume)',
          `pH = 14 + log(${(-excess).toFixed(3)}) = ${pH.toFixed(2)}`,
        ]
        derivation = `nSB > nWA: all WA consumed, excess OH⁻ dominates`
        notes = ['Excess SB overwhelms the buffer system']
      }
      return { name: 'Weak Acid + Strong Base (WA + SB)', color: '#f97316', formula, derivation, pH, notes }
    }

    case 'sa-wb': {
      // SA (c1 mol) + WB (c2 mol)
      const excess = c1 - c2
      const pKaConj = 14 - pKb
      let pH: number, formula: string[], derivation: string, notes: string[]
      if (Math.abs(excess) < c1 * 0.01) {
        // Equivalence point — salt of weak base (acidic salt)
        pH = Math.max(0, 7 - 0.5*pKb + 0.5*Math.log10(c1/2))
        formula = [
          'At equivalence: complete conversion to BH⁺ (conj acid of WB)',
          'BH⁺ hydrolyses: BH⁺ + H₂O ⇌ B + H₃O⁺',
          'pH = 7 − ½pKb + ½logC',
          `pH = 7 − ½(${pKb.toFixed(2)}) + ½log(${(c1/2).toFixed(3)}) = ${pH.toFixed(2)}`,
          '(pH < 7 always for salt of WB + SA)',
        ]
        derivation = `BH⁺ acts as weak acid: Ka(BH⁺) = Kw/Kb = ${(Kw/kb).toExponential(2)}\n[H⁺] = √(Ka(BH⁺) · C)`
        notes = ['Acidic salt: e.g., NH₄Cl', `pKa(BH⁺) = 14 − pKb = ${pKaConj.toFixed(2)}`]
      } else if (excess > 0) {
        // Excess SA
        pH = Math.max(0, -Math.log10(excess))
        formula = [
          'WB completely consumed, excess SA remains',
          '[H⁺]excess = nSA − nWB (per unit volume)',
          `pH = −log(${excess.toFixed(3)}) = ${pH.toFixed(2)}`,
        ]
        derivation = `nSA > nWB: excess H⁺ from SA dominates\nAll B + H⁺ → BH⁺ (complete)`
        notes = ['Excess strong acid determines pH', `pKaconj = ${pKaConj.toFixed(2)}`]
      } else {
        // Buffer: excess WB + BH⁺ formed
        const bRemaining = -excess
        pH = pKaConj + Math.log10(bRemaining / c1)
        formula = [
          'Excess WB forms buffer with BH⁺:',
          'pH = pKa(BH⁺) + log([B]/[BH⁺])',
          `pKa(BH⁺) = 14 − pKb = 14 − ${pKb.toFixed(2)} = ${pKaConj.toFixed(2)}`,
          `pH = ${pKaConj.toFixed(2)} + log(${bRemaining.toFixed(3)}/${c1.toFixed(3)}) = ${pH.toFixed(2)}`,
        ]
        derivation = `nWB > nSA: excess WB + BH⁺ form buffer\n[B]remaining = ${bRemaining.toFixed(3)}, [BH⁺]formed = ${c1.toFixed(3)}`
        notes = ['Buffer range: pKa(BH⁺) ± 1', `Half-neut: nSA = ½nWB → pH = pKa(BH⁺) = ${pKaConj.toFixed(2)}`]
      }
      return { name: 'Strong Acid + Weak Base (SA + WB)', color: '#06b6d4', formula, derivation, pH, notes }
    }

    case 'wa-wb': {
      // Both weak
      const ph = 7 + 0.5*(pKa - pKb)
      return {
        name: 'Weak Acid + Weak Base (WA + WB)', color: '#a78bfa',
        formula: [
          'pH = 7 + ½(pKa − pKb)',
          `pH = 7 + ½(${pKa.toFixed(2)} − ${pKb.toFixed(2)})`,
          `pH = 7 + ½(${(pKa-pKb).toFixed(2)}) = ${ph.toFixed(2)}`,
          'If Ka > Kb: acidic | Ka < Kb: basic | Ka = Kb: pH = 7',
        ],
        derivation: 'Exact: [H⁺] = √(Ka·Kw/Kb)\nApproximate: pH = 7 + ½(pKa − pKb)\nValid when Ka, Kb << 1',
        pH: Math.max(0, Math.min(14, ph)),
        notes: [
          `Ka/Kb = ${(ka/kb).toExponential(2)} → ${ka > kb ? 'Acidic solution' : ka < kb ? 'Basic solution' : 'Neutral'}`,
          'Independent of concentration (approximately)',
          'Example: NH₄CN, CH₃COONH₄'
        ]
      }
    }

    case 'acidic-salt': {
      // Salt of WB + SA: e.g., NH₄Cl → NH₄⁺ hydrolyses
      const pH = Math.max(0, 7 - 0.5*pKb + 0.5*Math.log10(c1))
      return {
        name: 'Acidic Salt (from WB + SA: e.g., NH₄Cl)', color: '#fb923c',
        formula: [
          'BH⁺ + H₂O ⇌ B + H₃O⁺',
          'Kh = Ka(BH⁺) = Kw/Kb',
          '[H⁺] = √(Kh · C) = √(Kw·C/Kb)',
          'pH = 7 − ½pKb + ½logC',
          `pH = 7 − ½(${pKb.toFixed(2)}) + ½log(${c1.toFixed(3)}) = ${pH.toFixed(2)}`,
          '(Always pH < 7)',
        ],
        derivation: `Kh = Kw/Kb = ${(Kw/kb).toExponential(2)}\n[H⁺] = √(${(Kw/kb).toExponential(2)} × ${c1.toFixed(3)}) = ${Math.pow(10,-pH).toExponential(2)} M`,
        pH,
        notes: ['Degree of hydrolysis: h = √(Kh/C)', 'More dilute → more hydrolysis → more acidic']
      }
    }

    case 'basic-salt': {
      // Salt of WA + SB: e.g., CH₃COONa → CH₃COO⁻ hydrolyses
      const pH = Math.min(14, 7 + 0.5*pKa + 0.5*Math.log10(c1))
      return {
        name: 'Basic Salt (from WA + SB: e.g., CH₃COONa)', color: '#34d399',
        formula: [
          'A⁻ + H₂O ⇌ HA + OH⁻',
          'Kh = Kb(A⁻) = Kw/Ka',
          '[OH⁻] = √(Kh · C) = √(Kw·C/Ka)',
          'pH = 7 + ½pKa + ½logC',
          `pH = 7 + ½(${pKa.toFixed(2)}) + ½log(${c1.toFixed(3)}) = ${pH.toFixed(2)}`,
          '(Always pH > 7)',
        ],
        derivation: `Kh = Kw/Ka = ${(Kw/ka).toExponential(2)}\n[OH⁻] = √(${(Kw/ka).toExponential(2)} × ${c1.toFixed(3)}) = ${Math.pow(10,-(14-pH)).toExponential(2)} M`,
        pH,
        notes: ['Degree of hydrolysis h = √(Kh/C)', 'Less concentrated → more basic']
      }
    }

    case 'neutral-salt': return {
      name: 'Neutral Salt (SA + SB: e.g., NaCl, KNO₃)', color: '#94a3b8',
      formula: ['Neither ion hydrolyses', 'pH = 7 (at 25°C)'],
      derivation: 'Na⁺, K⁺, Cl⁻, NO₃⁻ — from strong acid/base\nDo not react with water',
      pH: 7,
      notes: ['Salt of SA + SB always gives pH = 7', 'Anion from SA: doesn\'t hydrolyse', 'Cation from SB: doesn\'t hydrolyse']
    }

    case 'wa-wb-salt': {
      // Salt of WA + WB (e.g., NH₄CH₃COO — ammonium acetate)
      const ph = 7 + 0.5*(pKa - pKb)
      return {
        name: 'Salt of WA + WB (e.g., CH₃COONH₄)', color: '#c084fc',
        formula: [
          'Both ions hydrolyse simultaneously',
          'pH = 7 + ½(pKa − pKb)',
          `pH = 7 + ½(${pKa.toFixed(2)} − ${pKb.toFixed(2)}) = ${ph.toFixed(2)}`,
          'Independent of salt concentration!',
        ],
        derivation: '[H⁺] = √(Ka·Kw/Kb)\nThis simplifies to pH = 7 + ½(pKa − pKb)',
        pH: Math.max(0, Math.min(14, ph)),
        notes: ['pH independent of concentration', `If pKa = pKb: pH = 7 exactly`, `pKa=${pKa.toFixed(2)}, pKb=${pKb.toFixed(2)} → ${pKa>pKb?'acidic':'basic'}`]
      }
    }

    default: return { name: '—', formula: ['pH = 7'], derivation: '', pH: 7, color: '#849495' }
  }
}

function buildTitCurve(aC: number, aV: number, bC: number, ka: number, strong: boolean) {
  const molesA = aC * aV / 1000
  return Array.from({ length: 101 }, (_, i) => {
    const vol = (aV * 2.5 * i) / 100
    const molesB = bC * vol / 1000
    const totV = (aV + vol) / 1000
    const diff = molesA - molesB
    let pH = 7
    if (strong) {
      if (Math.abs(diff) < 1e-10) pH = 7
      else if (diff > 0) pH = -Math.log10(diff / totV)
      else pH = 14 + Math.log10(-diff / totV)
    } else {
      const pKa = -Math.log10(ka)
      if (i === 0) { const x = (-ka + Math.sqrt(ka*ka+4*ka*aC))/2; pH = -Math.log10(Math.max(x,1e-14)) }
      else if (diff > molesA * 0.01) pH = pKa + Math.log10(molesB / diff)
      else if (Math.abs(diff) <= molesA * 0.01) pH = 7 + 0.5*pKa + 0.5*Math.log10(aC/2)
      else pH = 14 + Math.log10(-diff / totV)
    }
    return { vol: Math.round(vol*10)/10, pH: Math.max(0.1, Math.min(13.9, pH)) }
  })
}

function phColor(pH: number) {
  if (pH < 3) return '#ef4444'; if (pH < 5) return '#f97316'
  if (pH < 6) return '#eab308'; if (pH < 7) return '#84cc16'
  if (pH < 7.5) return '#22c55e'; if (pH < 9) return '#06b6d4'
  if (pH < 11) return '#3b82f6'; return '#8b5cf6'
}

// ── Beaker animation ──────────────────────────────────────────
function Beaker({ pH, running }: { pH: number; running: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef<number>(0)
  const pts = useRef<{ x:number; y:number; vx:number; vy:number; t:string }[]>([])
  useEffect(() => {
    const nH = Math.round(Math.max(0,7-pH)*2.5), nOH = Math.round(Math.max(0,pH-7)*2.5)
    pts.current = [
      ...Array.from({length:Math.min(nH,10)},()=>({x:20+Math.random()*160,y:60+Math.random()*130,vx:(Math.random()-.5)*1.4,vy:(Math.random()-.5)*1.4,t:'H'})),
      ...Array.from({length:Math.min(nOH,10)},()=>({x:20+Math.random()*160,y:60+Math.random()*130,vx:(Math.random()-.5)*1.4,vy:(Math.random()-.5)*1.4,t:'OH'})),
      ...Array.from({length:8},()=>({x:20+Math.random()*160,y:60+Math.random()*130,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,t:'W'})),
    ]
  }, [pH])
  useEffect(() => {
    const cv = ref.current; if (!cv) return
    const ctx = cv.getContext('2d')!
    const W = cv.width, H = cv.height
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      const a = 0.1+Math.abs(pH-7)*0.02
      ctx.fillStyle = pH<7?`rgba(239,68,68,${a})`:pH>7?`rgba(59,130,246,${a})`:`rgba(34,197,94,${a})`
      ctx.fillRect(8,52,W-16,H-60)
      ctx.strokeStyle='rgba(0,219,231,0.45)'; ctx.lineWidth=2
      ctx.beginPath(); ctx.moveTo(8,8); ctx.lineTo(8,H-8); ctx.lineTo(W-8,H-8); ctx.lineTo(W-8,8); ctx.stroke()
      pts.current.forEach(p=>{
        if(running){p.x+=p.vx;p.y+=p.vy;if(p.x<14||p.x>W-14)p.vx*=-1;if(p.y<55||p.y>H-14)p.vy*=-1}
        if(p.t==='W'){ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='rgba(34,197,94,0.4)';ctx.fill();return}
        ctx.beginPath();ctx.arc(p.x,p.y,9,0,Math.PI*2)
        ctx.fillStyle=p.t==='H'?'rgba(239,68,68,0.88)':'rgba(59,130,246,0.88)';ctx.fill()
        ctx.font='bold 8px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle'
        ctx.fillText(p.t==='H'?'H⁺':'OH⁻',p.x,p.y)
      })
      ctx.font='bold 15px sans-serif';ctx.fillStyle=phColor(pH);ctx.textAlign='center';ctx.textBaseline='top'
      ctx.fillText(`pH ${pH.toFixed(2)}`,W/2,14)
      raf.current = requestAnimationFrame(draw)
    }
    raf.current = requestAnimationFrame(draw)
    return ()=>cancelAnimationFrame(raf.current)
  }, [pH, running])
  return <canvas ref={ref} width={200} height={210} style={{background:'rgba(14,19,34,0.9)',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)'}} />
}

// ── Main Simulator ─────────────────────────────────────────────
const MIXTURE_GROUPS = [
  { group: 'Pure Solutions', items: [
    { id:'strong-acid', label:'Strong Acid (SA)', eg:'HCl, HNO₃' },
    { id:'weak-acid',   label:'Weak Acid (WA)',   eg:'CH₃COOH, HF' },
    { id:'strong-base', label:'Strong Base (SB)', eg:'NaOH, KOH' },
    { id:'weak-base',   label:'Weak Base (WB)',   eg:'NH₃, CH₃NH₂' },
  ]},
  { group: 'Buffers', items: [
    { id:'buffer-wa', label:'Buffer: WA + Conjugate Base', eg:'CH₃COOH + CH₃COONa' },
    { id:'buffer-wb', label:'Buffer: WB + Conjugate Acid', eg:'NH₃ + NH₄Cl' },
  ]},
  { group: 'Acid-Base Mixtures', items: [
    { id:'sa-sb', label:'SA + SB',          eg:'HCl + NaOH (3 cases)' },
    { id:'wa-sb', label:'WA + SB',          eg:'CH₃COOH + NaOH (3 cases)' },
    { id:'sa-wb', label:'SA + WB',          eg:'HCl + NH₃ (3 cases)' },
    { id:'wa-wb', label:'WA + WB',          eg:'CH₃COOH + NH₃' },
  ]},
  { group: 'Salt Solutions', items: [
    { id:'acidic-salt',  label:'Acidic Salt (WB + SA)',   eg:'NH₄Cl → pH < 7' },
    { id:'basic-salt',   label:'Basic Salt (WA + SB)',    eg:'CH₃COONa → pH > 7' },
    { id:'neutral-salt', label:'Neutral Salt (SA + SB)',  eg:'NaCl → pH = 7' },
    { id:'wa-wb-salt',   label:'Salt of WA + WB',         eg:'CH₃COONH₄' },
  ]},
]

const NEEDS_TWO = ['buffer-wa','buffer-wb','sa-sb','wa-sb','sa-wb','wa-wb']
const NEEDS_KA  = ['weak-acid','buffer-wa','wa-sb','wa-wb','basic-salt','wa-wb-salt']
const NEEDS_KB  = ['weak-base','buffer-wb','sa-wb','wa-wb','acidic-salt','wa-wb-salt']
const HAS_TIT   = ['strong-acid','weak-acid','sa-sb','wa-sb','sa-wb']

export default function PHSim() {
  const [type,    setType]    = useState('weak-acid')
  const [c1,      setC1]      = useState(0.1)
  const [c2,      setC2]      = useState(0.1)
  const [logKa,   setLogKa]   = useState(-4.74)
  const [logKb,   setLogKb]   = useState(-4.74)
  const [aVol,    setAVol]    = useState(25)
  const [bConc,   setBConc]   = useState(0.1)
  const [volAdd,  setVolAdd]  = useState(0)
  const [playing, setPlaying] = useState(true)
  const [autoT,   setAutoT]   = useState(false)
  const timer = useRef<ReturnType<typeof setInterval>>()

  const ka = Math.pow(10, logKa), kb = Math.pow(10, logKb)
  const scenario = solve(type, c1, c2, ka, kb, false)
  const pH = scenario.pH
  const curve = HAS_TIT.includes(type) ? buildTitCurve(c1, aVol, bConc, ka, type==='strong-acid'||type==='sa-sb') : []
  const eqVol = (c1 * aVol) / bConc

  // Titration pH
  const titPH = (() => {
    if (!HAS_TIT.includes(type) || volAdd === 0) return pH
    return curve.reduce((p,c)=>Math.abs(c.vol-volAdd)<Math.abs(p.vol-volAdd)?c:p).pH
  })()
  const displayPH = titPH

  useEffect(() => {
    clearInterval(timer.current)
    if (!autoT) return
    timer.current = setInterval(()=>{
      setVolAdd(v=>{if(v>=aVol*2.4){setAutoT(false);return 0}return Math.round((v+0.5)*10)/10})
    }, 60)
    return ()=>clearInterval(timer.current)
  },[autoT, aVol])

  const col = phColor(displayPH)

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:'#08020d',color:'#f8fafc',fontFamily:'system-ui,sans-serif',overflow:'hidden'}}>

      {/* Header */}
      <div style={{height:46,background:'rgba(26,31,47,0.95)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Link href="/labs" style={{color:'#849495',textDecoration:'none',fontSize:13}}>← Labs</Link>
          <span style={{color:'rgba(255,255,255,0.2)'}}>|</span>
          <strong style={{fontSize:14}}>Ionic Equilibrium &amp; pH Simulator</strong>
          <span style={{background:'rgba(0,219,231,0.12)',border:'1px solid rgba(0,219,231,0.4)',color:'#00dbe7',padding:'1px 8px',borderRadius:20,fontSize:10,fontWeight:700}}>LIVE</span>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setPlaying(p=>!p)} style={{padding:'4px 12px',borderRadius:8,border:`1px solid ${playing?'rgba(0,219,231,0.4)':'rgba(255,255,255,0.15)'}`,background:playing?'rgba(0,219,231,0.1)':'transparent',color:playing?'#00dbe7':'#849495',fontSize:12,fontWeight:700,cursor:'pointer'}}>
            {playing?'⏸ Pause':'▶ Play'}
          </button>
          <button onClick={()=>{setC1(0.1);setC2(0.1);setLogKa(-4.74);setVolAdd(0);setAutoT(false)}} style={{padding:'4px 12px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#849495',fontSize:12,cursor:'pointer'}}>Reset</button>
        </div>
      </div>

      {/* Body */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>

        {/* Controls */}
        <div style={{width:230,flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',background:'rgba(9,14,28,0.6)',overflowY:'auto',padding:10,display:'flex',flexDirection:'column',gap:10}}>

          {MIXTURE_GROUPS.map(({group,items})=>(
            <div key={group}>
              <div style={{fontSize:9,color:'#849495',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:5,marginTop:4}}>{group}</div>
              {items.map(({id,label,eg})=>(
                <button key={id} onClick={()=>{setType(id);setVolAdd(0);setAutoT(false)}}
                  style={{display:'block',width:'100%',textAlign:'left',padding:'5px 8px',borderRadius:6,marginBottom:2,border:`1px solid ${type===id?(scenario.color+'60'):'transparent'}`,background:type===id?(scenario.color+'15'):'rgba(255,255,255,0.02)',color:type===id?scenario.color:'#849495',fontSize:11,fontWeight:type===id?700:400,cursor:'pointer'}}>
                  <span style={{display:'block'}}>{label}</span>
                  <span style={{fontSize:9,opacity:0.6}}>{eg}</span>
                </button>
              ))}
            </div>
          ))}

          {/* Concentration 1 */}
          <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:8}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontSize:9,color:'#00dbe7',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>{NEEDS_TWO.includes(type)?'Component 1 [C₁]':'Concentration [C]'}</span>
              <span style={{fontSize:11,fontFamily:'monospace',color:'#00dbe7',fontWeight:700}}>{c1.toFixed(3)} M</span>
            </div>
            <input type="range" min="0.001" max="2" step="0.001" value={c1} onChange={e=>setC1(+e.target.value)} style={{width:'100%'}} />
          </div>

          {/* Concentration 2 */}
          {NEEDS_TWO.includes(type) && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{fontSize:9,color:'#8b5cf6',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Component 2 [C₂]</span>
                <span style={{fontSize:11,fontFamily:'monospace',color:'#8b5cf6',fontWeight:700}}>{c2.toFixed(3)} M</span>
              </div>
              <input type="range" min="0.001" max="2" step="0.001" value={c2} onChange={e=>setC2(+e.target.value)} style={{width:'100%'}} />
              <div style={{fontSize:9,color:'#849495',marginTop:2}}>
                {c1>c2?`C₁ excess: ${(c1-c2).toFixed(3)} M`:c2>c1?`C₂ excess: ${(c2-c1).toFixed(3)} M`:'Equal concentrations'}
              </div>
            </div>
          )}

          {/* Ka */}
          {NEEDS_KA.includes(type) && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{fontSize:9,color:'#00dbe7',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Ka (acid)</span>
                <span style={{fontSize:10,fontFamily:'monospace',color:'#00dbe7'}}>10^{logKa.toFixed(1)} pKa={(-logKa).toFixed(2)}</span>
              </div>
              <input type="range" min="-14" max="-1" step="0.05" value={logKa} onChange={e=>setLogKa(+e.target.value)} style={{width:'100%'}} />
              <div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:4}}>
                {[{l:'HF',v:-3.17},{l:'CH₃COOH',v:-4.74},{l:'H₂CO₃',v:-6.37},{l:'HCN',v:-9.21}].map(({l,v})=>(
                  <button key={l} onClick={()=>setLogKa(v)} style={{padding:'2px 5px',borderRadius:4,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.03)',color:'#849495',fontSize:9,cursor:'pointer'}}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {/* Kb */}
          {NEEDS_KB.includes(type) && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                <span style={{fontSize:9,color:'#8b5cf6',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em'}}>Kb (base)</span>
                <span style={{fontSize:10,fontFamily:'monospace',color:'#8b5cf6'}}>10^{logKb.toFixed(1)} pKb={(-logKb).toFixed(2)}</span>
              </div>
              <input type="range" min="-14" max="-1" step="0.05" value={logKb} onChange={e=>setLogKb(+e.target.value)} style={{width:'100%'}} />
              <div style={{display:'flex',flexWrap:'wrap',gap:3,marginTop:4}}>
                {[{l:'NH₃',v:-4.74},{l:'CH₃NH₂',v:-3.36},{l:'C₅H₅N',v:-8.77}].map(({l,v})=>(
                  <button key={l} onClick={()=>setLogKb(v)} style={{padding:'2px 5px',borderRadius:4,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.03)',color:'#849495',fontSize:9,cursor:'pointer'}}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {/* Titration */}
          {HAS_TIT.includes(type) && (
            <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:8}}>
              <div style={{fontSize:9,color:'#a78bfa',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:6}}>Titration</div>
              {[
                {label:'Acid vol',val:aVol,min:5,max:50,step:1,set:(v:number)=>{setAVol(v);setVolAdd(0)},unit:'mL'},
                {label:'Base conc',val:bConc,min:0.01,max:1,step:0.01,set:setBConc,unit:'M'},
                {label:'Base added',val:volAdd,min:0,max:aVol*2.4,step:0.5,set:(v:number)=>{setVolAdd(v);setAutoT(false)},unit:'mL'},
              ].map(({label,val,min,max,step,set,unit})=>(
                <div key={label} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <span style={{fontSize:10,color:'#849495'}}>{label}</span>
                    <span style={{fontSize:10,fontFamily:'monospace',color:'#a78bfa',fontWeight:700}}>{Number(val).toFixed(val<10?2:0)} {unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(+e.target.value)} style={{width:'100%'}} />
                </div>
              ))}
              <div style={{display:'flex',gap:5}}>
                <button onClick={()=>{if(!autoT)setVolAdd(0);setAutoT(a=>!a)}} style={{flex:1,padding:'6px 0',borderRadius:7,border:`1px solid ${autoT?'rgba(167,139,250,0.5)':'rgba(255,255,255,0.15)'}`,background:autoT?'rgba(167,139,250,0.15)':'transparent',color:autoT?'#a78bfa':'#849495',fontSize:10,fontWeight:700,cursor:'pointer'}}>
                  {autoT?'⏸ Stop':'▶ Auto-Titrate'}
                </button>
                <button onClick={()=>{setVolAdd(0);setAutoT(false)}} style={{padding:'6px 10px',borderRadius:7,border:'1px solid rgba(255,255,255,0.12)',background:'transparent',color:'#849495',fontSize:12,cursor:'pointer'}}>⟳</button>
              </div>
            </div>
          )}
        </div>

        {/* Center */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

          {/* pH formula box — PROMINENT */}
          <AnimatePresence mode="wait">
            <motion.div key={type} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
              style={{background:`${scenario.color}12`,borderBottom:`2px solid ${scenario.color}40`,padding:'10px 16px',flexShrink:0}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{fontSize:10,color:scenario.color,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>
                    📐 pH Formula — {scenario.name}
                  </div>
                  {scenario.formula.map((f,i)=>(
                    <div key={i} style={{fontFamily:'monospace',fontSize:i===0?14:12,color:i===0?scenario.color:'#f8fafc',fontWeight:i===0?700:400,marginBottom:2,background:i===0?`${scenario.color}18`:'transparent',padding:i===0?'3px 8px':'0 8px',borderRadius:5,display:'inline-block',marginRight:6}}>
                      {f}
                    </div>
                  ))}
                </div>
                {scenario.notes && (
                  <div style={{fontSize:10,color:'#849495',lineHeight:1.5,minWidth:140}}>
                    {scenario.notes.map((n,i)=><div key={i}>• {n}</div>)}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* pH + Beaker + Values */}
          <div style={{display:'flex',padding:'10px 14px',gap:12,borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>

            {/* Big pH */}
            <div style={{background:'rgba(26,31,47,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'10px 14px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minWidth:130}}>
              <div style={{fontSize:9,color:'#849495',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:3}}>pH</div>
              <motion.div key={displayPH.toFixed(2)} style={{fontSize:52,fontWeight:900,color:col,lineHeight:1,marginBottom:4}} animate={{scale:[1.06,1]}} transition={{duration:0.15}}>
                {displayPH.toFixed(2)}
              </motion.div>
              <div style={{fontSize:11,color:col,fontWeight:700}}>{displayPH<6.5?'🔴 Acidic':displayPH>7.5?'🔵 Basic':'🟢 Neutral'}</div>
              <div style={{width:'100%',marginTop:8}}>
                <div style={{height:8,borderRadius:4,background:'linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#06b6d4,#3b82f6,#8b5cf6)',position:'relative'}}>
                  <div style={{position:'absolute',top:-2,width:4,height:12,background:'#fff',borderRadius:2,transform:'translateX(-50%)',left:`${Math.min(97,(displayPH/14)*100)}%`,transition:'left 0.15s',boxShadow:'0 0 6px rgba(255,255,255,0.8)'}} />
                </div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:8,color:'#849495',marginTop:1}}><span>0</span><span>7</span><span>14</span></div>
              </div>
            </div>

            {/* Beaker */}
            <div style={{background:'rgba(26,31,47,0.6)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'8px 10px',display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div style={{fontSize:9,color:'#849495',textTransform:'uppercase',letterSpacing:'0.1em'}}>Solution</div>
              <Beaker pH={displayPH} running={playing} />
              <div style={{display:'flex',gap:8,fontSize:9,color:'#849495'}}><span>🔴 H⁺</span><span>🔵 OH⁻</span><span>🟢 H₂O</span></div>
            </div>

            {/* Values */}
            <div style={{flex:1,background:'rgba(26,31,47,0.6)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:12,padding:'10px 12px',overflowY:'auto'}}>
              <div style={{fontSize:9,color:'#849495',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Live Values</div>
              {[
                {l:'[H⁺]',  v:Math.pow(10,-displayPH).toExponential(2)+' M', c:'#ef4444'},
                {l:'[OH⁻]', v:Math.pow(10,-(14-displayPH)).toExponential(2)+' M', c:'#3b82f6'},
                {l:'pOH',   v:(14-displayPH).toFixed(2), c:'#8b5cf6'},
                ...(NEEDS_KA.includes(type)?[{l:'pKa', v:(-logKa).toFixed(2), c:'#00dbe7'}]:[]),
                ...(NEEDS_KB.includes(type)?[{l:'pKb', v:(-logKb).toFixed(2), c:'#8b5cf6'}]:[]),
                ...(['weak-acid'].includes(type)?[{l:'% dissoc', v:(Math.pow(10,-displayPH)/c1*100).toFixed(2)+'%', c:'#f97316'}]:[]),
                ...(['wa-sb','wa-wb'].includes(type)&&c1!==c2?[{l:'Excess', v:`${Math.abs(c1-c2).toFixed(3)} M`, c:'#f97316'}]:[]),
              ].map(({l,v,c})=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'4px 0',fontSize:11}}>
                  <span style={{color:'#849495'}}>{l}</span>
                  <span style={{fontFamily:'monospace',fontWeight:700,color:c}}>{v}</span>
                </div>
              ))}
              {/* Derivation */}
              <div style={{marginTop:8,fontSize:9,color:'#849495',fontFamily:'monospace',lineHeight:1.5,whiteSpace:'pre-line'}}>
                {scenario.derivation}
              </div>
            </div>
          </div>

          {/* Titration curve */}
          {HAS_TIT.includes(type) && curve.length > 0 && (
            <div style={{flex:1,padding:'10px 14px',display:'flex',flexDirection:'column',minHeight:0}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6,flexWrap:'wrap',gap:4}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:'#f8fafc'}}>Titration Curve</div>
                  <div style={{fontSize:10,color:'#849495'}}>Drag "Base added" or click Auto-Titrate</div>
                </div>
                <div style={{fontSize:10,textAlign:'right'}}>
                  <div style={{color:'#a78bfa'}}>Equiv: {eqVol.toFixed(1)} mL</div>
                  {!['strong-acid','sa-sb'].includes(type)&&<div style={{color:'#00dbe7'}}>Half-eq: {(eqVol/2).toFixed(1)} mL → pH=pKa</div>}
                </div>
              </div>
              <div style={{flex:1,minHeight:160}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={curve} margin={{top:5,right:20,left:5,bottom:18}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="vol" stroke="#849495" tick={{fontSize:9}} label={{value:'mL base',position:'insideBottom',offset:-10,fill:'#849495',fontSize:9}} />
                    <YAxis domain={[0,14]} stroke="#849495" tick={{fontSize:9}} label={{value:'pH',angle:-90,position:'insideLeft',fill:'#849495',fontSize:9}} />
                    <Tooltip contentStyle={{background:'#130818',border:'1px solid rgba(0,219,231,0.3)',borderRadius:8,fontSize:11}} formatter={(v:number)=>[v.toFixed(2),'pH']} labelFormatter={v=>`${v} mL`} />
                    <ReferenceLine y={7} stroke="rgba(34,197,94,0.25)" strokeDasharray="4 4" />
                    <ReferenceLine x={eqVol} stroke="rgba(167,139,250,0.6)" strokeDasharray="4 4" />
                    {!['strong-acid','sa-sb'].includes(type)&&<ReferenceLine x={eqVol/2} stroke="rgba(0,219,231,0.4)" strokeDasharray="2 4" />}
                    <ReferenceLine x={volAdd} stroke="rgba(255,255,255,0.85)" strokeWidth={2} />
                    <Line type="monotone" dataKey="pH" stroke="#00dbe7" strokeWidth={2.5} dot={false} activeDot={{r:4,fill:'#00dbe7'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
