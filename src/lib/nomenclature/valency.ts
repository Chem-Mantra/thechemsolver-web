import { MoleculeGraph, bondOrderSum, cloneGraph, neighbors } from './model'

// Standard valences for the elements this V1 engine supports (RULES.md §5).
export const VALENCE: Record<string, number> = {
  C: 4,
  H: 1,
  O: 2,
  N: 3,
  F: 1,
  Cl: 1,
  Br: 1,
  I: 1,
}

export interface ValencyValidation {
  ok: boolean
  reason?: string
  atomId?: string
}

/** Recomputes implicitHCount = valence - (sum of heavy-atom bond orders) for every atom. */
export function fillImplicitHydrogens(graph: MoleculeGraph): MoleculeGraph {
  const next = cloneGraph(graph)
  for (const atom of Object.values(next.atoms)) {
    const used = bondOrderSum(next, atom.id)
    const valence = VALENCE[atom.element] ?? 0
    atom.implicitHCount = Math.max(0, valence - used)
  }
  return next
}

/**
 * Recognises the nitro group's N(=O)(=O)-C shape — the one chemically real pattern where bond-order
 * sum (5) legitimately exceeds N's plain covalent valence (3); the textbook depiction resolves this
 * with a formal +/- charge pair this engine doesn't model at all, so it's special-cased by shape
 * instead. No other over-valent nitrogen pattern is exempted.
 */
export function isNitroNitrogen(graph: MoleculeGraph, atomId: string): boolean {
  const atom = graph.atoms[atomId]
  if (!atom || atom.element !== 'N') return false
  const ns = neighbors(graph, atomId)
  if (ns.length !== 3) return false
  const carbonSingles = ns.filter((n) => n.atom.element === 'C' && n.bond.order === 1)
  const oxygenDoubles = ns.filter((n) => n.atom.element === 'O' && n.bond.order === 2)
  return carbonSingles.length === 1 && oxygenDoubles.length === 2
}

/** Rejects structures where an atom's bonds exceed its valence (over-valent / impossible). */
export function validateValency(graph: MoleculeGraph): ValencyValidation {
  for (const atom of Object.values(graph.atoms)) {
    const used = bondOrderSum(graph, atom.id)
    const valence = VALENCE[atom.element] ?? 0
    if (used > valence) {
      if (atom.element === 'N' && isNitroNitrogen(graph, atom.id)) continue
      return {
        ok: false,
        reason: `${atom.element} atom has bonds totalling ${used}, but valence is ${valence}`,
        atomId: atom.id,
      }
    }
  }
  return { ok: true }
}

/** How many more bond-order units an atom can still take on before exceeding its valence. */
export function freeValence(graph: MoleculeGraph, atomId: string): number {
  const atom = graph.atoms[atomId]
  if (!atom) return 0
  const valence = VALENCE[atom.element] ?? 0
  return Math.max(0, valence - bondOrderSum(graph, atomId))
}

/** Returns false if the graph has more than one connected component (V1 supports single molecules only). */
export function isSingleComponent(graph: MoleculeGraph): boolean {
  const ids = Object.keys(graph.atoms)
  if (ids.length === 0) return true
  const seen = new Set<string>([ids[0]])
  const stack = [ids[0]]
  while (stack.length) {
    const current = stack.pop()!
    for (const bond of Object.values(graph.bonds)) {
      const other = bond.a === current ? bond.b : bond.b === current ? bond.a : undefined
      if (other && !seen.has(other)) {
        seen.add(other)
        stack.push(other)
      }
    }
  }
  return seen.size === ids.length
}
