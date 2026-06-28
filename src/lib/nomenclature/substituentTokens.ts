import { MULTIPLYING_PREFIXES } from './roots'

// Used instead of di-/tri-/tetra- when the substituent itself carries an internal locant (e.g.
// "2-chloroethyl") — "1,2-di-2-chloroethyl" would be ambiguous about which locants belong to which
// level, so Blue Book P-16.3.4 multiplies a composite/enclosed substituent name with bis-/tris-/
// tetrakis- instead.
const BIS_PREFIXES: Record<number, string> = { 2: 'bis', 3: 'tris', 4: 'tetrakis' }

/**
 * Builds one substituent token (e.g. "4-methyl", "2-(2-chloroethyl)") from a substituent name and the
 * locant(s) it appears at. Enclosing parentheses (Blue Book P-16.3.3) are only needed to keep an OUTER
 * locant digit from running together with the substituent's OWN internal locant(s) — when there's no
 * leading locant at all (a single occurrence with `omitSoleLocant`, e.g. "prop-1-en-1-ylcyclopentane"
 * or "phenylmethanol"), there's nothing for it to collide with, so no parens are added. A name that's
 * already enclosed (e.g. a ring-as-substituent descriptor that wrapped itself, like
 * "(3,5-difluorophenyl)") is detected and never double-wrapped. Repeating a parenthesized substituent
 * uses bis-/tris-/tetrakis- instead of di-/tri-/tetra-, since "1,2-di(2-chloroethyl)" would be
 * ambiguous about which locants belong to which level.
 */
export function buildSubstituentToken(name: string, locants: number[], omitSoleLocant = false): string {
  const sorted = [...locants].sort((a, b) => a - b)
  if (omitSoleLocant && sorted.length === 1) return name
  const alreadyWrapped = name.startsWith('(') && name.endsWith(')')
  const needsWrap = !alreadyWrapped && name.includes('-')
  const word = needsWrap ? `(${name})` : name
  const prefixes = alreadyWrapped || needsWrap ? BIS_PREFIXES : MULTIPLYING_PREFIXES
  const mult = sorted.length > 1 ? prefixes[sorted.length] ?? '' : ''
  return `${sorted.join(',')}-${mult}${word}`
}
