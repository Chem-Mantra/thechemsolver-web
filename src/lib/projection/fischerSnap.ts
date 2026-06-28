// Computes the 3D rotation that puts the WHOLE molecule into the exact pose a given Fischer cross
// represents — for the "show this carbon's Fischer angle" button on the 3D wedge-dash panel, so
// students can see directly that Fischer's "horizontal = toward you, vertical = away" convention IS a
// specific, fixed 3D orientation, not whatever angle they happen to be looking from.
import * as THREE from 'three'
import { rotationAligningPairs } from './geometry'
import { FischerCross } from './fischerLayout'

// Three.js convention here: camera sits on +Z looking toward -Z, Y is screen-up. So "away from
// viewer" = -Z, "toward viewer" = +Z. These intentionally have the opposite Y-sign from
// fischerLayout.ts's FISCHER_POINT (that file's 2D model uses y-DOWN, matching the rest of the
// nomenclature codebase) — same convention, different coordinate system.
const TARGET_DOWN_AWAY = new THREE.Vector3(0, -1, -1)
const TARGET_RIGHT_TOWARD = new THREE.Vector3(1, 0, 1)

/**
 * `dirForSlot` looks up the real 3D bond direction for a given Fischer slotIndex (`null` = the
 * inter-carbon bond, 2-carbon mode only). Aligns whichever direction is at this cross's 'bottom' with
 * "vertical, away" and whichever is at 'right' with "horizontal, toward" — see
 * `rotationAligningPairs`'s own doc comment for why the OTHER two bonds land wherever a real rigid
 * rotation puts them rather than exactly on Fischer's own (non-tetrahedral) target points.
 *
 * For a 2-carbon molecule this can only ever match ONE of the two stereocenters' Fischer crosses at a
 * time — the inter-carbon bond, viewed from each end, is the exact same physical bond pointing in
 * opposite directions, so no single rigid rotation can put BOTH ends' "vertical" bonds at "away"
 * simultaneously (the well-known reason Fischer projections of a multi-carbon chain are a per-center
 * schematic convention, not a literal achievable 3D pose for the whole molecule at once).
 */
export function fischerSnapQuaternion(cross: FischerCross, dirForSlot: (slotIndex: number | null) => THREE.Vector3 | undefined): THREE.Quaternion | null {
  const dirBottom = dirForSlot(cross.bottom.slotIndex)
  const dirRight = dirForSlot(cross.right.slotIndex)
  if (!dirBottom || !dirRight) return null
  return rotationAligningPairs(dirBottom, dirRight, TARGET_DOWN_AWAY, TARGET_RIGHT_TOWARD)
}
