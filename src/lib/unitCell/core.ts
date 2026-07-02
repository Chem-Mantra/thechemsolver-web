import { AVOGADRO, CellType, cellTypeInfo } from './constants'

/** Edge length a from atomic radius r, derived from where atoms touch in each structure: along the
 * cell edge for SC (a=2r), along the body diagonal for BCC (4r = a√3), along the face diagonal for FCC
 * (4r = a√2). Same units in, same units out (pm in, pm out is the typical use). */
export function edgeLengthFromRadius(type: CellType, radius: number): number {
  switch (type) {
    case 'simple-cubic': return 2 * radius
    case 'bcc': return (4 * radius) / Math.sqrt(3)
    case 'fcc': return 2 * Math.sqrt(2) * radius
  }
}

/** Inverse of edgeLengthFromRadius. */
export function radiusFromEdgeLength(type: CellType, edgeLength: number): number {
  switch (type) {
    case 'simple-cubic': return edgeLength / 2
    case 'bcc': return (edgeLength * Math.sqrt(3)) / 4
    case 'fcc': return edgeLength / (2 * Math.sqrt(2))
  }
}

/** Fraction of the unit cell's volume actually occupied by atoms (treated as touching hard spheres) —
 * a pure geometric constant for each structure, independent of the element: π/6 (SC) ≈ 52.4%, π√3/8
 * (BCC) ≈ 68.0%, π√2/6 (FCC) ≈ 74.0%. FCC and hexagonal close-packed share this same 74.0% maximum —
 * both are close-packed structures, just stacked differently (ABCABC vs ABAB). */
export function packingEfficiency(type: CellType): number {
  switch (type) {
    case 'simple-cubic': return Math.PI / 6
    case 'bcc': return (Math.PI * Math.sqrt(3)) / 8
    case 'fcc': return (Math.PI * Math.sqrt(2)) / 6
  }
}

/** ρ = Z·M / (NA·a³) — Z atoms per cell, M molar mass (g/mol), a edge length in pm (converted to cm
 * internally: 1 pm = 1e-10 cm), returns density in g/cm³. */
export function densityGCm3(type: CellType, edgeLengthPm: number, molarMassGMol: number): number {
  const Z = cellTypeInfo(type).atomsPerCell
  const aCm = edgeLengthPm * 1e-10
  return (Z * molarMassGMol) / (AVOGADRO * Math.pow(aCm, 3))
}

export interface DensityDerivation {
  formula: string
  substitution: string
  result: string
}

export function densityDerivation(type: CellType, edgeLengthPm: number, molarMassGMol: number): DensityDerivation {
  const Z = cellTypeInfo(type).atomsPerCell
  const aCm = edgeLengthPm * 1e-10
  const rho = densityGCm3(type, edgeLengthPm, molarMassGMol)
  return {
    formula: 'ρ = Z · M / (Nₐ · a³)',
    substitution: `ρ = (${Z} × ${molarMassGMol}) / (6.022×10²³ × (${aCm.toExponential(3)} cm)³)`,
    result: `ρ = ${rho.toFixed(3)} g/cm³`,
  }
}
