import { Multiplicity, NmrMolecule, ProtonGroup } from './types'

const MULTIPLICITY_BY_NEIGHBOR_COUNT: Multiplicity[] = ['singlet', 'doublet', 'triplet', 'quartet', 'quintet', 'sextet', 'septet']

/** The n+1 rule: a proton with n non-equivalent neighboring H's shows n+1 peaks. Neighbor counts at or
 * beyond the labeled range (7+, including the COMPLEX_NEIGHBORS sentinel for aromatic/vinyl systems)
 * fall back to the generic 'multiplet' label rather than naming a specific (and likely wrong) peak count. */
export function multiplicityFromNeighbors(neighborCount: number): Multiplicity {
  return MULTIPLICITY_BY_NEIGHBOR_COUNT[neighborCount] ?? 'multiplet'
}

export function peakCount(neighborCount: number): number {
  return neighborCount + 1
}

export interface PredictedSignal extends ProtonGroup {
  multiplicity: Multiplicity
  peakCount: number
}

/** Applies the n+1 rule to every proton group in a molecule and returns the signals sorted by
 * decreasing chemical shift — the conventional left-to-right (downfield-to-upfield) reading order of
 * an NMR spectrum. */
export function predictSpectrum(molecule: NmrMolecule): PredictedSignal[] {
  return molecule.groups
    .map((g) => ({ ...g, multiplicity: multiplicityFromNeighbors(g.neighborCount), peakCount: peakCount(g.neighborCount) }))
    .sort((a, b) => b.shiftPpm - a.shiftPpm)
}
