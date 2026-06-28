import { MoleculeGraph } from './model'

/** Molecular formula in Hill notation: C first, H second, then remaining elements alphabetically. */
export function computeFormula(graph: MoleculeGraph): string {
  const counts: Record<string, number> = {}
  for (const atom of Object.values(graph.atoms)) {
    counts[atom.element] = (counts[atom.element] ?? 0) + 1
    if (atom.implicitHCount > 0) counts.H = (counts.H ?? 0) + atom.implicitHCount
  }

  const order = ['C', 'H', ...Object.keys(counts).filter((e) => e !== 'C' && e !== 'H').sort()]
  return order
    .filter((el) => counts[el] > 0)
    .map((el) => `${el}${counts[el] > 1 ? counts[el] : ''}`)
    .join('')
}
