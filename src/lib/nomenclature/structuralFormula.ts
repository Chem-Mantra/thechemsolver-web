import { MoleculeGraph, neighbors, Ring, bondBetween } from './model'
import { isNitroNitrogen } from './valency'
import { RING_ROOT } from './ringNaming'

function formatGroup(graph: MoleculeGraph, atomId: string, cameFromId: string): string {
  const atom = graph.atoms[atomId]
  if (atom.element !== 'C') {
    if (atom.element === 'O' && atom.implicitHCount === 1) return 'OH'
    if (atom.element === 'N' && atom.implicitHCount === 2) return 'NH2'
    if (atom.element === 'N' && isNitroNitrogen(graph, atomId)) return 'NO2'
    if (atom.element === 'O' && atom.implicitHCount === 0) {
      // Plain ether/ester bridge oxygen — continue through to the far side instead of stopping at a
      // bare "O", so e.g. a methoxy branch shows "OCH3" rather than just "O".
      const far = neighbors(graph, atomId).find((n) => n.atom.id !== cameFromId)
      if (far) return `O${formatGroup(graph, far.atom.id, atomId)}`
    }
    return atom.element
  }

  const childIds = neighbors(graph, atomId)
    .map((n) => n.atom)
    .filter((a) => a.id !== cameFromId && a.element !== 'H')
    .map((a) => a.id)
  const hLabel = atom.implicitHCount > 0 ? `H${atom.implicitHCount > 1 ? atom.implicitHCount : ''}` : ''
  const base = `C${hLabel}`

  if (childIds.length === 0) return base
  if (childIds.length === 1) return `${base}${formatGroup(graph, childIds[0], atomId)}`

  const formatted = childIds.map((id) => formatGroup(graph, id, atomId))
  const counts = new Map<string, number>()
  for (const f of formatted) counts.set(f, (counts.get(f) ?? 0) + 1)
  const parts = Array.from(counts.entries()).map(([f, n]) => (n > 1 ? `(${f})${n}` : `(${f})`))
  return `${base}${parts.join('')}`
}

export interface RingSubstituentLabel {
  /** Every atom id belonging to the ring — when a branch leads here, emit `label` instead of
   * recursing with formatGroup, which has no cycle detection and would loop forever around a ring. */
  ringAtomIds: Set<string>
  label: string
}

function bondSymbol(order: number): string {
  return order === 2 ? '=' : order === 3 ? '#' : '-'
}

/** Finds the first start position >= `desiredStart` (clamped to >= 0) where `length` characters,
 * plus one space of clearance on each side, would land entirely on blank ground in `chars` — used so
 * a wide branch label never overwrites a neighboring one; it just gets pushed sideways instead. */
function findClearStart(chars: string[], desiredStart: number, length: number): number {
  let start = Math.max(0, desiredStart)
  for (;;) {
    let collision = false
    for (let i = -1; i <= length; i++) {
      const c = chars[start + i]
      if (c !== undefined && c !== ' ') {
        collision = true
        break
      }
    }
    if (!collision) return start
    start += 1
  }
}

/** Overlays `text` onto a growable character array, centered on `centerOffset` when there's room. */
function overlay(chars: string[], centerOffset: number, text: string, avoidCollisions: boolean) {
  const desiredStart = centerOffset - Math.floor(text.length / 2)
  const start = avoidCollisions ? findClearStart(chars, desiredStart, text.length) : Math.max(0, desiredStart)
  for (let i = 0; i < text.length; i++) {
    const pos = start + i
    while (chars.length <= pos) chars.push(' ')
    chars[pos] = text[i]
  }
}

/**
 * Open (fully expanded) structural formula along the engine's chosen parent chain — every bond is
 * shown explicitly (main-chain bonds horizontally with the correct -/=/# symbol, the first two
 * branches off each carbon stacked above/below with their own | or ‖ connector), the way a textbook
 * draws it, rather than a condensed/bracketed formula like "CH3-CH(CH3)-CH2-CH3". `chainAtomIds` is
 * the same locant-ordered list nameMolecule() returns — this never re-derives chain selection, it only
 * re-reads neighbors to describe branches off it. A third+ branch on the same carbon (rare — a chain
 * carbon only has 2 non-chain valence slots once both H's are gone) falls back to an inline
 * parenthesized tag so no information is silently dropped.
 */
export function buildChainStructuralFormula(
  graph: MoleculeGraph,
  chainAtomIds: string[],
  ringSubstituent?: RingSubstituentLabel
): string {
  const n = chainAtomIds.length
  const mainTexts: string[] = []
  const aboveLabel: string[] = []
  const aboveConnector: string[] = []
  const belowLabel: string[] = []
  const belowConnector: string[] = []

  chainAtomIds.forEach((atomId, idx) => {
    const atom = graph.atoms[atomId]
    const cameFrom = idx > 0 ? chainAtomIds[idx - 1] : undefined
    const nextChain = idx < n - 1 ? chainAtomIds[idx + 1] : undefined
    const exclude = new Set([cameFrom, nextChain].filter(Boolean) as string[])
    const branchNeighbors = neighbors(graph, atomId).filter((nb) => !exclude.has(nb.atom.id) && nb.atom.element !== 'H')
    const hLabel = atom.implicitHCount > 0 ? `H${atom.implicitHCount > 1 ? atom.implicitHCount : ''}` : ''

    const branchTexts = branchNeighbors.map(({ atom: branchAtom, bond }) => {
      const prefix = bond.order === 2 ? '=' : bond.order === 3 ? '#' : ''
      const label = ringSubstituent?.ringAtomIds.has(branchAtom.id) ? ringSubstituent.label : formatGroup(graph, branchAtom.id, atomId)
      // A drawn wedge/hash bond (the V15 stereo tool) used to be silently invisible here — the
      // connector was picked from bond.order alone, so a student's wedge bond rendered as a plain "|"
      // even though the live name correctly picked up the "(R)"/"(S)" it represents. Reuse the same
      // glyphs the tool palette itself uses (tools.ts) so the connection is recognizable.
      const connector = bond.wedge ? (bond.wedge.direction === 'up' ? '▲' : '⋮') : bond.order === 2 ? '‖' : '|'
      return { text: `${prefix}${label}`, connector }
    })

    let mainText = `C${hLabel}`
    if (branchTexts.length > 2) mainText += branchTexts.slice(2).map((b) => `(${b.text})`).join('')

    mainTexts.push(mainText)
    aboveLabel.push(branchTexts[0]?.text ?? '')
    aboveConnector.push(branchTexts[0]?.connector ?? '')
    belowLabel.push(branchTexts[1]?.text ?? '')
    belowConnector.push(branchTexts[1]?.connector ?? '')
  })

  const seps = chainAtomIds.slice(0, -1).map((id, idx) => bondSymbol(bondBetween(graph, id, chainAtomIds[idx + 1])?.order ?? 1))

  // The main row is built TIGHT (no padding) so the bond symbols between chain atoms always sit
  // directly against the atoms they connect — a wide branch label (e.g. "cyclohexyl") must never push
  // the main chain's own spacing apart, or the chain reads as visually disconnected even though it
  // isn't (this was a real bug: a long label on one atom stretched a shared column width, leaving a
  // big gap before the next "-" that looked like a missing bond).
  const startOffset: number[] = []
  let cursor = 0
  mainTexts.forEach((t, i) => {
    startOffset.push(cursor)
    cursor += t.length + (i < n - 1 ? seps[i].length : 0)
  })
  const centerOffset = mainTexts.map((t, i) => startOffset[i] + Math.floor(t.length / 2))
  const mainRow = mainTexts.map((t, i) => t + (i < n - 1 ? seps[i] : '')).join('')

  // Branch labels can collide with a neighboring atom's label (e.g. two wide labels on adjacent
  // atoms) — pushed sideways rather than overlapping, since silently overwriting one would lose
  // information. The thin "|"/"‖" connector underneath is kept centered on the real atom position
  // even if its label had to shift, so it still points at the right place.
  function buildOverlayRow(getText: (i: number) => string, avoidCollisions: boolean): string | null {
    if (!chainAtomIds.some((_, i) => getText(i) !== '')) return null
    const chars: string[] = []
    chainAtomIds.forEach((_, i) => {
      const text = getText(i)
      if (text) overlay(chars, centerOffset[i], text, avoidCollisions)
    })
    return chars.join('').replace(/\s+$/, '')
  }

  const rows: string[] = []
  const aboveLabelRow = buildOverlayRow((i) => aboveLabel[i], true)
  if (aboveLabelRow !== null) rows.push(aboveLabelRow)
  const aboveConnectorRow = buildOverlayRow((i) => aboveConnector[i], false)
  if (aboveConnectorRow !== null) rows.push(aboveConnectorRow)
  rows.push(mainRow)
  const belowConnectorRow = buildOverlayRow((i) => belowConnector[i], false)
  if (belowConnectorRow !== null) rows.push(belowConnectorRow)
  const belowLabelRow = buildOverlayRow((i) => belowLabel[i], true)
  if (belowLabelRow !== null) rows.push(belowLabelRow)

  return rows.join('\n')
}

/** "(wedge)"/"(hash)" suffix for a branch bond carrying the V15 stereo tool's wedge/hash mark — the
 * text-summary ring/polycyclic renderers have no connector glyph to repurpose like the chain renderer
 * does, so this is the only way they'd otherwise silently drop a drawn wedge/hash from their output. */
function wedgeSuffix(graph: MoleculeGraph, atomId: string, branchId: string): string {
  const bond = bondBetween(graph, atomId, branchId)
  if (!bond?.wedge) return ''
  return bond.wedge.direction === 'up' ? ' (wedge)' : ' (hash)'
}

/** Text fallback for rings — V1 doesn't attempt a 2D semi-structural ring depiction, just lists substituents by ring locant. */
export function buildRingStructuralFormula(graph: MoleculeGraph, ring: Ring, orderedAtomIds: string[]): string {
  const parts: string[] = []
  orderedAtomIds.forEach((atomId, idx) => {
    const branches = neighbors(graph, atomId)
      .map((n) => n.atom)
      .filter((a) => a.element !== 'H' && !ring.atomIds.includes(a.id))
    for (const branch of branches) parts.push(`${formatGroup(graph, branch.id, atomId)} at C${idx + 1}${wedgeSuffix(graph, atomId, branch.id)}`)
  })

  const n = orderedAtomIds.length
  let ringWord: string
  if (ring.aromatic && n === 6) {
    ringWord = 'Benzene ring'
  } else {
    const doubleCount = orderedAtomIds.reduce((count, atomId, i) => {
      const bond = bondBetween(graph, atomId, orderedAtomIds[(i + 1) % n])
      return count + (bond?.order === 2 ? 1 : 0)
    }, 0)
    const root = RING_ROOT[n] ?? `${n}-membered ring`
    const label = root.charAt(0).toUpperCase() + root.slice(1)
    ringWord = doubleCount === 0 ? `${label} ring` : doubleCount === 1 ? `${label.slice(0, -3)}ene ring` : `${label.slice(0, -3)}adiene ring`
  }
  return parts.length > 0 ? `${ringWord} — ${parts.join(', ')}` : `${ringWord} (unsubstituted)`
}

/** Text fallback for spiro/fused two-ring systems — same "list substituents by locant" approach as
 * buildRingStructuralFormula, just against both rings' combined atom set and a generic ring-word
 * (the precise von Baeyer descriptor is already in the IUPAC name itself, shown alongside this). */
export function buildPolycyclicStructuralFormula(
  graph: MoleculeGraph,
  ringA: Ring,
  ringB: Ring,
  orderedAtomIds: string[],
  kind: 'spiro' | 'fused'
): string {
  const ringSet = new Set([...ringA.atomIds, ...ringB.atomIds])
  const parts: string[] = []
  orderedAtomIds.forEach((atomId, idx) => {
    const branches = neighbors(graph, atomId)
      .map((n) => n.atom)
      .filter((a) => a.element !== 'H' && !ringSet.has(a.id))
    for (const branch of branches) parts.push(`${formatGroup(graph, branch.id, atomId)} at C${idx + 1}${wedgeSuffix(graph, atomId, branch.id)}`)
  })
  const ringWord = kind === 'spiro' ? 'Spiro ring system' : 'Fused (ortho) ring system'
  return parts.length > 0 ? `${ringWord} — ${parts.join(', ')}` : `${ringWord} (unsubstituted)`
}
