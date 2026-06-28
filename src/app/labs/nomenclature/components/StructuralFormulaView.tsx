'use client'
import { Fragment } from 'react'
import { MoleculeGraph } from '@/lib/nomenclature/model'
import { buildChainStructuralFormula, buildRingStructuralFormula, buildPolycyclicStructuralFormula } from '@/lib/nomenclature/structuralFormula'

export interface StructuralFormulaViewProps {
  graph: MoleculeGraph
  chainAtomIds?: string[]
  parentKind?: 'ring' | 'chain'
  ringSubstituent?: { ringAtomIds: string[]; label: string }
}

/** Renders digit runs that follow a letter as <sub>, e.g. "CH3" -> CH₃, leaving locant-style "2,2-" text alone. */
function renderWithSubscripts(text: string) {
  const tokens = text.split(/([A-Za-z)])(\d+)/g)
  const nodes: React.ReactNode[] = []
  let i = 0
  while (i < tokens.length) {
    if (i + 2 < tokens.length && /\d+/.test(tokens[i + 2])) {
      nodes.push(tokens[i], tokens[i + 1])
      // fontSize kept at the surrounding text's own size (overriding the browser's default <sub>
      // shrink) — this view's whole multi-row layout (structuralFormula.ts) is computed in plain
      // monospace CHARACTER columns, so a narrower glyph here would throw every "|"/"‖" connector and
      // branch label below/above it out of alignment with the atom it actually points at.
      nodes.push(
        <sub key={i} style={{ fontSize: '1em' }}>
          {tokens[i + 2]}
        </sub>
      )
      i += 3
    } else {
      nodes.push(tokens[i])
      i += 1
    }
  }
  return nodes.map((n, idx) => <Fragment key={idx}>{n}</Fragment>)
}

export default function StructuralFormulaView({ graph, chainAtomIds, parentKind, ringSubstituent }: StructuralFormulaViewProps) {
  const hasAtoms = Object.keys(graph.atoms).length > 0
  let formula = ''
  if (hasAtoms && graph.rings.length === 2 && chainAtomIds && parentKind === 'ring') {
    const shared = graph.rings[1].atomIds.filter((id) => graph.rings[0].atomIds.includes(id))
    const kind = shared.length === 1 ? 'spiro' : 'fused'
    formula = buildPolycyclicStructuralFormula(graph, graph.rings[0], graph.rings[1], chainAtomIds, kind)
  } else if (hasAtoms && graph.rings.length === 1 && chainAtomIds && parentKind !== 'chain') {
    formula = buildRingStructuralFormula(graph, graph.rings[0], chainAtomIds)
  } else if (hasAtoms && chainAtomIds) {
    const ringLabel = ringSubstituent ? { ringAtomIds: new Set(ringSubstituent.ringAtomIds), label: ringSubstituent.label } : undefined
    formula = buildChainStructuralFormula(graph, chainAtomIds, ringLabel)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0712', padding: 24 }}>
      {formula ? (
        // textAlign is deliberately LEFT (the browser default for a div), not centered: every row here
        // is built by structuralFormula.ts as plain monospace CHARACTER columns, so "|"/"‖" connectors
        // and branch labels line up with their atom only if every row shares the exact same left edge.
        // Centering each row independently (its previous state) broke that shared coordinate system —
        // a short row like "OCH3" would center itself in the middle of the block while a much longer
        // main-chain row centered itself too, so the two no longer agreed on which column was "atom 1".
        // The OUTER flex container's justify-content:center still centers the whole block as one unit.
        <div style={{ fontSize: 22, fontFamily: 'ui-monospace,Menlo,monospace', color: '#f8fafc', lineHeight: 1.5, whiteSpace: 'pre' }}>
          {formula.split('\n').map((line, i) => <div key={i}>{renderWithSubscripts(line)}</div>)}
        </div>
      ) : (
        <div style={{ fontSize: 14, color: '#475569', textAlign: 'center' }}>
          {hasAtoms ? 'Fix the structure to see its formula' : 'Click on the right to start drawing — the formula appears here'}
        </div>
      )}
    </div>
  )
}
