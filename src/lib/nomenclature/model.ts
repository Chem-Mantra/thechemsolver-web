// Pure data model for the nomenclature engine. No UI awareness, no naming logic.
// See RULES.md for the IUPAC sources this whole module tree implements.

export type ElementSymbol = 'C' | 'H' | 'O' | 'N' | 'F' | 'Cl' | 'Br' | 'I'

export interface AtomNode {
  id: string
  element: ElementSymbol
  x: number
  y: number
  implicitHCount: number
  ringIds: string[]
}

export interface Bond {
  id: string
  a: string
  b: string
  order: 1 | 2 | 3
  inRing: boolean
  /** Stereo wedge/hash notation (only ever set on a single bond) — `fromAtomId` is the NARROW end
   * (the stereocenter itself), `direction` is 'up' (wedge, substituent toward the viewer) or 'down'
   * (hash, substituent away from the viewer). The bond's OTHER endpoint is the substituent being
   * lifted out of/pushed behind the plane. Every other bond at a stereocenter is implicitly in-plane —
   * this engine only ever needs one explicit wedge/hash per stereocenter to fully pin down its
   * configuration (the standard simple skeletal-formula convention), never two. */
  wedge?: { fromAtomId: string; direction: 'up' | 'down' }
}

export interface Ring {
  id: string
  atomIds: string[] // ordered cycle
  aromatic: boolean
}

export interface MoleculeGraph {
  atoms: Record<string, AtomNode>
  bonds: Record<string, Bond>
  rings: Ring[]
}

export function createEmptyGraph(): MoleculeGraph {
  return { atoms: {}, bonds: {}, rings: [] }
}

let idCounter = 0
export function nextId(prefix: string): string {
  idCounter += 1
  return `${prefix}${idCounter}`
}

export function addAtom(graph: MoleculeGraph, element: ElementSymbol, x: number, y: number): AtomNode {
  const atom: AtomNode = { id: nextId('a'), element, x, y, implicitHCount: 0, ringIds: [] }
  graph.atoms[atom.id] = atom
  return atom
}

/** Removes an atom and every bond touching it (and drops any ring that referenced it — V1 rings are always whole, never partially erased). */
export function removeAtom(graph: MoleculeGraph, atomId: string): void {
  for (const bond of Object.values(graph.bonds)) {
    if (bond.a === atomId || bond.b === atomId) delete graph.bonds[bond.id]
  }
  delete graph.atoms[atomId]
  graph.rings = graph.rings.filter((ring) => !ring.atomIds.includes(atomId))
}

export function removeBond(graph: MoleculeGraph, bondId: string): void {
  delete graph.bonds[bondId]
}

export function addBond(graph: MoleculeGraph, a: string, b: string, order: 1 | 2 | 3 = 1): Bond {
  const bond: Bond = { id: nextId('b'), a, b, order, inRing: false }
  graph.bonds[bond.id] = bond
  return bond
}

export function bondsOf(graph: MoleculeGraph, atomId: string): Bond[] {
  return Object.values(graph.bonds).filter((bond) => bond.a === atomId || bond.b === atomId)
}

export function neighbors(graph: MoleculeGraph, atomId: string): { atom: AtomNode; bond: Bond }[] {
  return bondsOf(graph, atomId).map((bond) => {
    const otherId = bond.a === atomId ? bond.b : bond.a
    return { atom: graph.atoms[otherId], bond }
  })
}

export function neighborIds(graph: MoleculeGraph, atomId: string): string[] {
  return neighbors(graph, atomId).map((n) => n.atom.id)
}

export function bondOrderSum(graph: MoleculeGraph, atomId: string): number {
  return bondsOf(graph, atomId).reduce((sum, bond) => sum + bond.order, 0)
}

export function bondBetween(graph: MoleculeGraph, a: string, b: string): Bond | undefined {
  return Object.values(graph.bonds).find(
    (bond) => (bond.a === a && bond.b === b) || (bond.a === b && bond.b === a)
  )
}

export function carbonAtoms(graph: MoleculeGraph): AtomNode[] {
  return Object.values(graph.atoms).filter((atom) => atom.element === 'C')
}

/** Copies out just `atomIds` and the bonds entirely between them, dropping everything else (and any
 * rings, which only ever apply to the full original molecule) — used wherever a piece of a molecule
 * needs to be re-analyzed in isolation as if it were its own complete molecule. */
export function extractSubgraph(graph: MoleculeGraph, atomIds: Set<string>): MoleculeGraph {
  const atoms: Record<string, AtomNode> = {}
  for (const id of atomIds) atoms[id] = { ...graph.atoms[id] }
  const bonds: Record<string, Bond> = {}
  for (const bond of Object.values(graph.bonds)) {
    if (atomIds.has(bond.a) && atomIds.has(bond.b)) bonds[bond.id] = { ...bond }
  }
  return { atoms, bonds, rings: [] }
}

export function atomDegree(graph: MoleculeGraph, atomId: string): number {
  return bondsOf(graph, atomId).length
}

/** All connected atom ids reachable from `startId`, restricted to ids passing `filter`. */
export function connectedComponent(
  graph: MoleculeGraph,
  startId: string,
  filter: (atom: AtomNode) => boolean = () => true
): Set<string> {
  const seen = new Set<string>([startId])
  const stack = [startId]
  while (stack.length) {
    const current = stack.pop()!
    for (const { atom } of neighbors(graph, current)) {
      if (!seen.has(atom.id) && filter(atom)) {
        seen.add(atom.id)
        stack.push(atom.id)
      }
    }
  }
  return seen
}

export function cloneGraph(graph: MoleculeGraph): MoleculeGraph {
  return JSON.parse(JSON.stringify(graph))
}
