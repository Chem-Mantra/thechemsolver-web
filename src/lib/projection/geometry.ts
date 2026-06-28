// Pure 3D geometry for the Organic Projection Formula lab. No React/Three.js scene code here —
// just vector math, reusing THREE.Vector3 as the vector type (already a project dependency, see
// src/app/labs/vsepr/page.tsx) rather than hand-rolling cross/dot/normalize again.
import * as THREE from 'three'

/** The angle between any two bonds of a regular tetrahedron: arccos(-1/3) ≈ 109.47°. */
export const TETRAHEDRAL_ANGLE = Math.acos(-1 / 3)

/** 4 unit vectors at the tetrahedral angle from one another, CH4-style (cube-corner construction —
 * same convention the VSEPR lab's CH4 entry uses). Used for the 1-carbon (no privileged bond axis)
 * case, where there's no "the other carbon is over there" direction to build the tripod from. */
export function symmetricTetrahedralDirections(): THREE.Vector3[] {
  return [
    new THREE.Vector3(1, 1, 1).normalize(),
    new THREE.Vector3(1, -1, -1).normalize(),
    new THREE.Vector3(-1, 1, -1).normalize(),
    new THREE.Vector3(-1, -1, 1).normalize(),
  ]
}

/** A unit vector perpendicular to `axis`, picked deterministically (same axis always gives the same
 * perpendicular) so two different calls can be compared meaningfully — needed as the azimuth-zero
 * reference for `tripodDirections` below. */
function deterministicPerpendicular(axis: THREE.Vector3): THREE.Vector3 {
  const helper = Math.abs(axis.y) < 0.99 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)
  return helper.clone().cross(axis).normalize()
}

/**
 * The 3 substituent directions for a carbon whose 4th bond runs along `axis` (unit vector, pointing
 * FROM this carbon TOWARD its bonded neighbor) — each at the tetrahedral angle from `axis`, spaced
 * 120° apart azimuthally around it, with `azimuthOffset` (radians) rotating the whole tripod about
 * `axis` from a fixed reference. For the bonded-neighbor carbon, `azimuthOffset` IS the dihedral
 * angle: holding one carbon's tripod fixed at offset 0 and varying the other's offset is exactly
 * "rotating around the C–C bond," which is what Newman/sawhorse projections exist to show.
 */
export function tripodDirections(axis: THREE.Vector3, azimuthOffset: number): THREE.Vector3[] {
  const ax = axis.clone().normalize()
  const perp0 = deterministicPerpendicular(ax)
  const cosA = Math.cos(TETRAHEDRAL_ANGLE)
  const sinA = Math.sin(TETRAHEDRAL_ANGLE)
  const directions: THREE.Vector3[] = []
  for (let k = 0; k < 3; k++) {
    const azimuth = azimuthOffset + (k * 2 * Math.PI) / 3
    const perp = perp0.clone().applyAxisAngle(ax, azimuth)
    directions.push(ax.clone().multiplyScalar(cosA).add(perp.multiplyScalar(sinA)).normalize())
  }
  return directions
}

/** Signed volume of the parallelepiped spanned by a, b, c — the scalar triple product a·(b×c).
 * Sign flips under any single swap of two vectors, which is exactly the geometric definition of
 * chirality: used both as the ground-truth check for `toMoleculeGraph`'s 2D conversion and directly
 * inside it. */
export function signedVolume(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): number {
  return a.dot(b.clone().cross(c))
}

/**
 * The unique PURE rotation (no reflection — always det=+1, so it never flips chirality, same
 * non-negotiable as everything else in this lab) that sends `srcA`→(direction of)`dstA` exactly, and
 * sends the component of `srcB` perpendicular to `srcA` to align with the component of `dstB`
 * perpendicular to `dstA` — i.e. it fully pins down a 3D orientation from 2 reference directions,
 * the same way `THREE.Quaternion.setFromUnitVectors` pins one down from a single pair. Used by the
 * "show as Fischer" 3D camera-snap feature: align one real bond direction with Fischer's target
 * "vertical = away from viewer" axis and another with "horizontal = toward viewer", and the OTHER two
 * tetrahedral bonds land wherever a real rigid rotation puts them (not necessarily exactly on
 * Fischer's own simplified target points, since a real ~109.5° tetrahedron can't be force-fit onto
 * Fischer's non-tetrahedral target points — same reason Fischer projections are a schematic
 * convention, not a literal single 3D pose, for more than one stereocenter at a time).
 *
 * Built via two orthonormal bases (Gram-Schmidt on each pair) and `R = F · E⁻¹`, where E/F have the
 * basis vectors as columns — standard "rotation between two frames" construction, verified directly
 * (not just derived by hand) in geometry.test.ts.
 */
export function rotationAligningPairs(srcA: THREE.Vector3, srcB: THREE.Vector3, dstA: THREE.Vector3, dstB: THREE.Vector3): THREE.Quaternion {
  const basis = (a: THREE.Vector3, b: THREE.Vector3) => {
    const e1 = a.clone().normalize()
    const e2 = b.clone().sub(e1.clone().multiplyScalar(b.dot(e1))).normalize()
    const e3 = e1.clone().cross(e2)
    return new THREE.Matrix4().makeBasis(e1, e2, e3)
  }
  const E = basis(srcA, srcB)
  const F = basis(dstA, dstB)
  const R = F.multiply(E.invert())
  return new THREE.Quaternion().setFromRotationMatrix(R)
}
