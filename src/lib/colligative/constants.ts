export const R_L_ATM = 0.082057 // L·atm/(mol·K) — same gas constant as src/lib/gasLaws

export interface Solvent {
  id: string
  label: string
  normalBoilingPointC: number
  normalFreezingPointC: number
  /** °C·kg/mol — molal boiling point elevation constant. */
  Kb: number
  /** °C·kg/mol — molal freezing point depression constant. */
  Kf: number
}

/** Commonly textbook-cited ebullioscopic/cryoscopic constants. Camphor's huge Kf (vs water's 1.86) is
 * the classic reason it's used for molar-mass-by-freezing-point-depression experiments — a small amount
 * of solute produces an easily measurable depression. */
export const SOLVENTS: Solvent[] = [
  { id: 'water', label: 'Water (H₂O)', normalBoilingPointC: 100, normalFreezingPointC: 0, Kb: 0.512, Kf: 1.86 },
  { id: 'benzene', label: 'Benzene (C₆H₆)', normalBoilingPointC: 80.1, normalFreezingPointC: 5.5, Kb: 2.53, Kf: 4.9 },
  { id: 'chloroform', label: 'Chloroform (CHCl₃)', normalBoilingPointC: 61.2, normalFreezingPointC: -63.5, Kb: 3.63, Kf: 4.68 },
  { id: 'cyclohexane', label: 'Cyclohexane (C₆H₁₂)', normalBoilingPointC: 80.7, normalFreezingPointC: 6.5, Kb: 2.79, Kf: 20.2 },
  { id: 'aceticAcid', label: 'Acetic acid (CH₃COOH)', normalBoilingPointC: 118.1, normalFreezingPointC: 16.6, Kb: 3.07, Kf: 3.9 },
  { id: 'camphor', label: 'Camphor (C₁₀H₁₆O)', normalBoilingPointC: 207.4, normalFreezingPointC: 178.8, Kb: 5.95, Kf: 37.7 },
]

export function solventById(id: string): Solvent {
  const found = SOLVENTS.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown solvent id: ${id}`)
  return found
}

export interface SoluteVantHoff {
  id: string
  label: string
  /** Ideal van't Hoff factor — the number of particles 1 formula unit dissociates into. Real i is
   * usually slightly lower than this at finite concentration due to ion pairing — flagged as a caveat
   * in the UI rather than modeled here. */
  i: number
}

export const SOLUTES: SoluteVantHoff[] = [
  { id: 'nonelectrolyte', label: 'Nonelectrolyte (sugar, urea, ethylene glycol...)', i: 1 },
  { id: 'nacl', label: 'NaCl, KCl, or other 1:1 salt', i: 2 },
  { id: 'cacl2', label: 'CaCl₂, MgCl₂, or other 1:2 salt', i: 3 },
  { id: 'al2so43', label: 'Al₂(SO₄)₃ or other 2:3 salt', i: 5 },
]

export function soluteById(id: string): SoluteVantHoff {
  const found = SOLUTES.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown solute id: ${id}`)
  return found
}
