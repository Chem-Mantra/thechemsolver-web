/** Planck's constant in eV·s, and the eV·nm product hc — using eV throughout (rather than joules)
 * keeps every number in this module classroom-sized (single digits, not 1e-19 scale), which is exactly
 * why introductory courses present the photoelectric effect in eV in the first place. */
export const H_EV_S = 4.135667696e-15
export const C_M_S = 2.99792458e8
/** hc in eV·nm — the famous "1239.84" shortcut: E(eV) = 1239.84 / λ(nm). */
export const HC_EV_NM = 1239.841984

export interface MetalWorkFunction {
  id: string
  label: string
  /** eV — commonly textbook-cited photoelectric work functions. */
  workFunctionEV: number
}

export const METALS: MetalWorkFunction[] = [
  { id: 'cesium', label: 'Cesium (Cs)', workFunctionEV: 2.1 },
  { id: 'potassium', label: 'Potassium (K)', workFunctionEV: 2.3 },
  { id: 'sodium', label: 'Sodium (Na)', workFunctionEV: 2.28 },
  { id: 'calcium', label: 'Calcium (Ca)', workFunctionEV: 2.9 },
  { id: 'aluminum', label: 'Aluminum (Al)', workFunctionEV: 4.08 },
  { id: 'zinc', label: 'Zinc (Zn)', workFunctionEV: 4.3 },
  { id: 'silver', label: 'Silver (Ag)', workFunctionEV: 4.26 },
  { id: 'copper', label: 'Copper (Cu)', workFunctionEV: 4.7 },
  { id: 'platinum', label: 'Platinum (Pt)', workFunctionEV: 6.35 },
]

export function metalById(id: string): MetalWorkFunction {
  const found = METALS.find((m) => m.id === id)
  if (!found) throw new Error(`Unknown metal id: ${id}`)
  return found
}
