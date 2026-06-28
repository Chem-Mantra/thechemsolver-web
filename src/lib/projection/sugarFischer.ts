// D/L logic for the classic vertical aldose Fischer projection (CHO at top, CH2OH at bottom, an OH/H
// pair on every carbon in between). D/L is a DIFFERENT, OLDER labeling system than CIP's R/S — it's
// not computed from CIP priority at all. By Rosanoff's 1906 convention (which is still how it's
// taught and used today): draw the chain vertically with CHO on top, look at the stereocenter closest
// to the BOTTOM (CH2OH) end — OH drawn on the right = D, OH drawn on the left = L. Every other
// stereocenter in the chain is irrelevant to the D/L call itself (it matters for telling which named
// sugar this is, e.g. D-glucose vs D-galactose, but NOT for whether it's D or L at all) — this is
// itself a common student trap research flags: assuming D/L summarizes the WHOLE molecule's
// configuration the way a single R/S descriptor pair does, rather than being keyed to one specific
// reference carbon.
export type ChainLength = 3 | 4 | 5 | 6

/** One entry per INTERIOR stereocenter (C2 through C(n-1) — there are length-2 of them: 1 for
 * glyceraldehyde, up to 4 for an aldohexose). `true` = OH drawn on the right, `false` = OH on the
 * left at that carbon. Index 0 is C2 (just below the CHO), the LAST index is C(n-1) (just above the
 * CH2OH) — the one D/L is actually keyed to. */
export type OhRight = boolean[]

export function interiorCarbonCount(length: ChainLength): number {
  return length - 2
}

export function defaultOhRight(length: ChainLength): OhRight {
  return new Array(interiorCarbonCount(length)).fill(true)
}

/** The D/L call: purely "which side is OH on at the LAST interior carbon" — nothing else about the
 * chain matters for this specific question. */
export function dlForConfig(ohRight: OhRight): 'D' | 'L' {
  return ohRight[ohRight.length - 1] ? 'D' : 'L'
}
