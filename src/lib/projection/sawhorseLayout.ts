// Sawhorse projection: a fixed oblique view — front carbon lower-left, back carbon upper-right,
// joined by the C–C bond drawn on the diagonal. Each carbon's 3 substituents fan out from it at fixed
// screen angles, with the back carbon's fan rotated by the live dihedral — unlike Fischer (which is
// configuration-only), this DOES depict conformation, same as Newman.
export interface SawhorseSlot {
  label: string
  angleDeg: number // measured clockwise from straight up, around that carbon's own position
  /** This slot's CIP priority (1 = highest) among ALL 4 of its carbon's substituents — the 4th is the
   * C–C bond itself (drawn as the diagonal trunk line, not a fan arm), so any one of 1-4 may be
   * missing here. `undefined` when that carbon isn't a real stereocenter. */
  rank?: 1 | 2 | 3 | 4
}

export interface SawhorseLayout {
  front: SawhorseSlot[]
  back: SawhorseSlot[]
  /** CIP rank of the front/back carbon's C–C bond (the trunk itself) — `undefined` if not a real
   * stereocenter. */
  frontAxisRank?: 1 | 2 | 3 | 4
  backAxisRank?: 1 | 2 | 3 | 4
}

// The diagonal C–C bond direction in SawhorseSvg.tsx's fixed layout (frontC=(75,145), backC=(145,75);
// SVG y increases downward) points at 45° in the "clockwise from straight up" convention used here —
// front→back is 45°, so back→front is 225°. Kept as a named constant rather than re-derived from the
// view component's coordinates (this file has no view-layer dependency) — if those positions ever
// change, update this to match.
const BOND_ANGLE_FRONT_TO_BACK_DEG = 45

/** 3 angles evenly spaced 120° apart, centered on the direction OPPOSITE `trunkAngleDeg` — i.e. a
 * symmetric tripod that avoids the bond direction itself (the bug this replaced: hand-picked angles
 * that weren't actually 120° apart, so one arm ended up nearly collinear with the C–C bond). */
function evenTripodAwayFrom(trunkAngleDeg: number): [number, number, number] {
  const away = trunkAngleDeg + 180
  return [away - 120, away, away + 120]
}

const FRONT_BASE_ANGLES = evenTripodAwayFrom(BOND_ANGLE_FRONT_TO_BACK_DEG)
const BACK_BASE_ANGLES = evenTripodAwayFrom(BOND_ANGLE_FRONT_TO_BACK_DEG + 180)

export interface SawhorseRankInput {
  frontRanks?: (1 | 2 | 3 | 4 | undefined)[]
  backRanks?: (1 | 2 | 3 | 4 | undefined)[]
  frontAxisRank?: 1 | 2 | 3 | 4
  backAxisRank?: 1 | 2 | 3 | 4
}

export function sawhorseLayoutFor(frontLabels: string[], backLabels: string[], dihedralDeg: number, ranks?: SawhorseRankInput): SawhorseLayout {
  return {
    front: frontLabels.map((label, i) => ({ label, angleDeg: FRONT_BASE_ANGLES[i], rank: ranks?.frontRanks?.[i] })),
    back: backLabels.map((label, i) => ({ label, angleDeg: BACK_BASE_ANGLES[i] + dihedralDeg, rank: ranks?.backRanks?.[i] })),
    frontAxisRank: ranks?.frontAxisRank,
    backAxisRank: ranks?.backAxisRank,
  }
}
