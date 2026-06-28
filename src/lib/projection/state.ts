import { SubstituentKind } from '../nomenclature/editOps'

/** A slot with no assigned group defaults to plain hydrogen — `fillImplicitHydrogens` (already called
 * internally by `attachSubstituent`) fills it in automatically, exactly as the nomenclature editor's
 * own canvas does for any bond the student hasn't drawn yet. */
export type AssignedGroup = SubstituentKind | undefined

/** One sp3 carbon with no bonded neighbor center — all 4 bonds are assignable substituents, fixed to
 * `symmetricTetrahedralDirections()`'s order (geometry.ts). */
export interface OneCarbonState {
  mode: 'one-carbon'
  groups: [AssignedGroup, AssignedGroup, AssignedGroup, AssignedGroup]
}

/** Two bonded sp3 carbons. Each has 3 assignable substituents (the 4th bond is the C–C bond itself,
 * never assignable) plus one shared `dihedralRad`: carbon A's tripod is always built at azimuth
 * offset 0 (the fixed reference); carbon B's tripod is built at azimuth offset `dihedralRad` — varying
 * it is exactly "rotating around the C–C bond" (Newman/sawhorse's whole reason for existing). Rotating
 * the dihedral never changes either center's R/S (configuration is conformation-independent) — only
 * swapping which `AssignedGroup` sits in which array slot does that.
 */
export interface TwoCarbonState {
  mode: 'two-carbon'
  groupsA: [AssignedGroup, AssignedGroup, AssignedGroup]
  groupsB: [AssignedGroup, AssignedGroup, AssignedGroup]
  dihedralRad: number
}

export type ProjectionState = OneCarbonState | TwoCarbonState
