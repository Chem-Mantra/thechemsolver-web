// Chain-length roots and multiplying prefixes. Extending past 20 carbons is just
// adding rows here — architecture supports it, V1 only needs up to ~12 in practice.

export const CHAIN_ROOTS: Record<number, string> = {
  1: 'meth',
  2: 'eth',
  3: 'prop',
  4: 'but',
  5: 'pent',
  6: 'hex',
  7: 'hept',
  8: 'oct',
  9: 'non',
  10: 'dec',
  11: 'undec',
  12: 'dodec',
  13: 'tridec',
  14: 'tetradec',
  15: 'pentadec',
  16: 'hexadec',
  17: 'heptadec',
  18: 'octadec',
  19: 'nonadec',
  20: 'icos',
}

// Multiplying prefixes for repeated identical substituents (di-, tri-, ...).
export const MULTIPLYING_PREFIXES: Record<number, string> = {
  1: '',
  2: 'di',
  3: 'tri',
  4: 'tetra',
  5: 'penta',
  6: 'hexa',
  7: 'hepta',
  8: 'octa',
  9: 'nona',
  10: 'deca',
}

export function chainRoot(length: number): string {
  const root = CHAIN_ROOTS[length]
  if (!root) throw new Error(`No chain root known for length ${length} (extend CHAIN_ROOTS in roots.ts)`)
  return root
}
