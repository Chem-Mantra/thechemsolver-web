// Newman projection: pure 2D polar trig, no projection math needed — front carbon's 3 bonds are
// drawn as a Y from the center, back carbon's 3 bonds as a Y from the rim of a circle (the front
// carbon hides directly behind it), offset by the live dihedral angle. This is the one panel that's
// MEANT to change continuously as the dihedral slider moves — that's the whole reason it exists.
export interface NewmanSlot {
  label: string
  angleDeg: number // measured clockwise from straight up (screen convention)
  /** This slot's CIP priority (1 = highest) among ALL 4 of its carbon's substituents. The 4th
   * substituent — the bond to the other carbon — is the axis itself, drawn as the trunk/rim line
   * rather than an arm, so any one rank 1-4 may be missing from a carbon's 3 visible arms.
   * `undefined` when that carbon isn't a real stereocenter (no priority order to show). */
  rank?: 1 | 2 | 3 | 4
}

export interface NewmanLayout {
  front: NewmanSlot[]
  back: NewmanSlot[]
  /** CIP rank of the front carbon's bond to the back carbon (the axis) — `undefined` if not a real
   * stereocenter. Surfaced so the UI can flag whether the rank1→2→3 sweep among the 3 visible arms is
   * being read from the "textbook" side (axis = rank 4, the conventional Newman-projection sightline)
   * or needs the same kind of correction Fischer's panel already calls out. */
  frontAxisRank?: 1 | 2 | 3 | 4
  backAxisRank?: 1 | 2 | 3 | 4
}

// One arm straight up (0°), the other two splayed 120° apart below it — the standard upright "Y" a
// Newman projection is drawn with. The previous [90,210,330] was ALSO a valid evenly-spaced tripod
// (still 120° apart pairwise) but with no arm aligned to vertical/horizontal, it read as a generically
// tilted triangle of lines rather than a recognizable Y.
const FRONT_BASE_ANGLES = [0, 120, 240]

export interface NewmanRankInput {
  frontRanks?: (1 | 2 | 3 | 4 | undefined)[]
  backRanks?: (1 | 2 | 3 | 4 | undefined)[]
  frontAxisRank?: 1 | 2 | 3 | 4
  backAxisRank?: 1 | 2 | 3 | 4
}

export function newmanLayoutFor(frontLabels: string[], backLabels: string[], dihedralDeg: number, ranks?: NewmanRankInput): NewmanLayout {
  return {
    front: frontLabels.map((label, i) => ({ label, angleDeg: FRONT_BASE_ANGLES[i], rank: ranks?.frontRanks?.[i] })),
    back: backLabels.map((label, i) => ({ label, angleDeg: FRONT_BASE_ANGLES[i] + dihedralDeg, rank: ranks?.backRanks?.[i] })),
    frontAxisRank: ranks?.frontAxisRank,
    backAxisRank: ranks?.backAxisRank,
  }
}
