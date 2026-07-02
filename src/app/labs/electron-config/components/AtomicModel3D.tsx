'use client'
import { useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SUBSHELLS, sumArr } from '../subshells'

// ── 3D Atomic Model ──────────────────────────────────────────────────────
// Mirrors the 2D click/drag builder live: every filled orbital slot lights
// up the matching lobe here. Styled after the classic "translucent orbitals"
// reference visualization (quimica3d-style): warm coral s/p lobes, cyan d
// lobes, bold RGB reference arrows, light studio backdrop. s = procedural
// glow sphere (nested, denser when paired). p/d lobes = Blender-modeled
// metaball meshes (see tools/blender/generate_orbital_meshes.py) reused via
// rotation — one dumbbell asset covers px/py/pz, one cloverleaf asset
// covers dxy/dxz/dyz/dx2-y2. f is intentionally a simplified glow-spike
// shape (see project decision: full f-orbital lobe accuracy out of scope).

const P_ASSET = '/models/orbitals/p_dumbbell.glb'
const D_CLOVER_ASSET = '/models/orbitals/d_cloverleaf.glb'
const D_Z2_ASSET = '/models/orbitals/d_z2.glb'

useGLTF.preload(P_ASSET)
useGLTF.preload(D_CLOVER_ASSET)
useGLTF.preload(D_Z2_ASSET)

const BG_COLOR = '#f4ede0'

type OrbType = 's' | 'p' | 'd' | 'f'

// Each orbital TYPE has a base hue, but — critically — each individual
// orbital WITHIN a subshell (px vs py vs pz, dxy vs dyz, ...) gets its own
// hue offset too. Relying on dim/bright + position alone wasn't enough:
// two same-colored lobes on different axes could still read as "one lobe
// changed" depending on camera angle/overlap. A per-orbital hue makes every
// individual orbital identifiable by color alone, with lightness/saturation
// still carrying the separate dim (single e-) vs bright (paired) signal.
const TYPE_BASE_HUE: Record<OrbType, number> = { s: 8, p: 262, d: 188, f: 36 }
const TYPE_HUE_SPREAD: Record<OrbType, number> = { s: 0, p: 60, d: 80, f: 100 }

function orbitalColor(type: OrbType, idx: number, total: number, paired: boolean): string {
  const spread = TYPE_HUE_SPREAD[type]
  const t = total > 1 ? idx / (total - 1) - 0.5 : 0
  const hue = TYPE_BASE_HUE[type] + t * spread
  const sat = paired ? 74 : 46
  const light = paired ? 54 : 27
  return `hsl(${hue.toFixed(1)}, ${sat}%, ${light}%)`
}

const shellRadius = (n: number) => 1.0 + (n - 1) * 0.85

// s-shells nest deeply (up to 7 concentric), so they stay a bit more
// translucent so inner shells stay visible; p/d/f lobes are sparse and read
// better more opaque. Bright is deliberately capped well under 1.0 opacity —
// a fully-paired d-subshell has 5 overlapping lobes, and if "bright" were
// near-opaque that stack would black out everything behind it.
function shellMaterialProps(count: number, type: OrbType, idx = 0, total = 1) {
  const color = orbitalColor(type, idx, total, count >= 2)
  return {
    color,
    transparent: true,
    opacity: count >= 2 ? 0.5 : 0.32,
    emissive: color,
    emissiveIntensity: count >= 2 ? 0.7 : 0.18,
    roughness: 0.15,
    metalness: 0.05,
    depthWrite: false,
  }
}
function lobeMaterialProps(count: number, type: OrbType, idx = 0, total = 1) {
  const color = orbitalColor(type, idx, total, count >= 2)
  return {
    color,
    transparent: true,
    opacity: count >= 2 ? 0.78 : 0.62,
    emissive: color,
    emissiveIntensity: count >= 2 ? 0.85 : 0.22,
    roughness: 0.12,
    metalness: 0.05,
    depthWrite: false,
  }
}

// Every lobe gets a thin dark rim (classic inverted-hull outline: a
// back-face-only, slightly larger duplicate behind the real mesh) so its
// silhouette stays crisp and separable even when it overlaps another
// same-colored lobe from the same subshell — this is what makes "a second
// dumbbell on a new axis" read as an unmistakably distinct object instead
// of blending into the first one.
function Outlined({ geometry, materialProps, scale }: { geometry: THREE.BufferGeometry; materialProps: Record<string, unknown>; scale: [number, number, number] }) {
  const outlineScale: [number, number, number] = [scale[0] * 1.045, scale[1] * 1.045, scale[2] * 1.045]
  return (
    <>
      <mesh geometry={geometry} scale={outlineScale}>
        <meshBasicMaterial color="#2b2018" side={THREE.BackSide} transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry} scale={scale}>
        <meshStandardMaterial {...materialProps} />
      </mesh>
    </>
  )
}

function quaternionAligning(from: THREE.Vector3, to: THREE.Vector3) {
  return new THREE.Quaternion().setFromUnitVectors(from.clone().normalize(), to.clone().normalize())
}

function quaternionFromXY(targetX: THREE.Vector3, targetY: THREE.Vector3) {
  const x = targetX.clone().normalize()
  const z = new THREE.Vector3().crossVectors(x, targetY).normalize()
  const y = new THREE.Vector3().crossVectors(z, x).normalize()
  const m = new THREE.Matrix4().makeBasis(x, y, z)
  return new THREE.Quaternion().setFromRotationMatrix(m)
}

// ── Bold reference axes: a full line through the origin in both directions
// (so all 8 octants read clearly while rotating), with one arrowhead marking
// the positive end of each axis — matching the reference's look.
function Arrow({ direction, length, color }: { direction: THREE.Vector3; length: number; color: string }) {
  const quat = quaternionAligning(new THREE.Vector3(0, 1, 0), direction)
  const headLen = length * 0.14
  return (
    <group quaternion={quat}>
      <mesh>
        <cylinderGeometry args={[length * 0.016, length * 0.016, length * 2, 14]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      <mesh position={[0, length + headLen / 2, 0]}>
        <coneGeometry args={[length * 0.05, headLen, 18]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
    </group>
  )
}

function AxesGuides({ extent }: { extent: number }) {
  return (
    <>
      <Arrow direction={new THREE.Vector3(1, 0, 0)} length={extent} color="#dc2626" />
      <Arrow direction={new THREE.Vector3(0, 1, 0)} length={extent} color="#2563eb" />
      <Arrow direction={new THREE.Vector3(0, 0, 1)} length={extent} color="#16a34a" />
    </>
  )
}

// ── s orbital: plain procedural glow sphere, nested by shell ───────────
function SOrbital({ count }: { count: number }) {
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 48, 48), [])
  if (count <= 0) return null
  return <Outlined geometry={geometry} materialProps={shellMaterialProps(count, 's')} scale={[1, 1, 1]} />
}

// ── p orbitals: one dumbbell asset, oriented along x/y/z per orbital idx ─
const P_AXES: THREE.Vector3[] = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]

function POrbitalSet({ n, counts }: { n: number; counts: number[] }) {
  const { scene } = useGLTF(P_ASSET)
  const geometry = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    scene.traverse(o => { if (!geo && (o as THREE.Mesh).isMesh) geo = (o as THREE.Mesh).geometry })
    return geo
  }, [scene])
  if (!geometry) return null
  const size = shellRadius(n) * 0.97
  return (
    <>
      {counts.map((c, idx) => {
        if (c <= 0) return null
        const quat = quaternionAligning(new THREE.Vector3(0, 1, 0), P_AXES[idx])
        return (
          <group key={idx} quaternion={quat}>
            <Outlined geometry={geometry} materialProps={lobeMaterialProps(c, 'p', idx, counts.length)} scale={[size, size, size]} />
          </group>
        )
      })}
    </>
  )
}

// ── d orbitals: one cloverleaf asset (dxy/dxz/dyz/dx2-y2) + one dz2 asset ─
function cloverleafDirPair(plane: 'xy' | 'xz' | 'yz', diagonal: boolean): [THREE.Vector3, THREE.Vector3] {
  const offset = diagonal ? Math.PI / 4 : 0
  const toVec = (a: number) => {
    const u = Math.cos(a), v = Math.sin(a)
    if (plane === 'xy') return new THREE.Vector3(u, v, 0)
    if (plane === 'xz') return new THREE.Vector3(u, 0, v)
    return new THREE.Vector3(0, u, v)
  }
  return [toVec(offset), toVec(offset + Math.PI / 2)]
}

const D_CLOVER_PAIRS: Array<[THREE.Vector3, THREE.Vector3]> = [
  cloverleafDirPair('xy', true),  // idx0: dxy
  cloverleafDirPair('xz', true),  // idx1: dxz
  cloverleafDirPair('yz', true),  // idx2: dyz
  cloverleafDirPair('xy', false), // idx3: dx2-y2
]

function DOrbitalSet({ n, counts }: { n: number; counts: number[] }) {
  const clover = useGLTF(D_CLOVER_ASSET)
  const z2 = useGLTF(D_Z2_ASSET)
  const cloverGeo = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    clover.scene.traverse(o => { if (!geo && (o as THREE.Mesh).isMesh) geo = (o as THREE.Mesh).geometry })
    return geo
  }, [clover.scene])
  const z2Geo = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    z2.scene.traverse(o => { if (!geo && (o as THREE.Mesh).isMesh) geo = (o as THREE.Mesh).geometry })
    return geo
  }, [z2.scene])
  if (!cloverGeo || !z2Geo) return null

  const size = shellRadius(n) * 1.45
  return (
    <>
      {counts.map((c, idx) => {
        if (c <= 0) return null
        if (idx === 4) {
          return (
            <Outlined key={idx} geometry={z2Geo} materialProps={lobeMaterialProps(c, 'd', idx, counts.length)} scale={[size, size, size]} />
          )
        }
        const [tx, ty] = D_CLOVER_PAIRS[idx]
        const quat = quaternionFromXY(tx, ty)
        return (
          <group key={idx} quaternion={quat}>
            <Outlined geometry={cloverGeo} materialProps={lobeMaterialProps(c, 'd', idx, counts.length)} scale={[size, size, size]} />
          </group>
        )
      })}
    </>
  )
}

// ── f orbitals: simplified glow spikes (not true 7-lobe geometry) ──────
function fibonacciSphere(count: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r))
  }
  return pts
}
const F_DIRECTIONS = fibonacciSphere(7)

function FOrbitalSet({ n, counts }: { n: number; counts: number[] }) {
  const geometry = useMemo(() => new THREE.ConeGeometry(1, 1, 12), [])
  const distance = shellRadius(n) * 1.55
  return (
    <>
      {counts.map((c, idx) => {
        if (c <= 0) return null
        const dir = F_DIRECTIONS[idx]
        const quat = quaternionAligning(new THREE.Vector3(0, 1, 0), dir)
        const pos = dir.clone().multiplyScalar(distance * 0.55)
        const len = distance * 0.7
        return (
          <group key={idx} position={pos} quaternion={quat}>
            <Outlined geometry={geometry} materialProps={lobeMaterialProps(c, 'f', idx, counts.length)} scale={[distance * 0.22, len, distance * 0.22]} />
          </group>
        )
      })}
    </>
  )
}

function Nucleus() {
  return (
    <mesh>
      <sphereGeometry args={[0.16, 24, 24]} />
      <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.1} roughness={0.2} />
    </mesh>
  )
}

// Fits a sphere of `radius` inside the canvas regardless of its current
// aspect ratio — uses whichever of horizontal/vertical FOV is more
// constraining, so a wide-but-short (or narrow-but-tall) panel never lets
// the largest shell (the biggest s-orbital sphere) clip outside the view.
function CameraRig({ radius }: { radius: number }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera
    const aspect = size.width / Math.max(1, size.height)
    const vFov = (persp.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
    const limitingFov = Math.min(vFov, hFov)
    const distance = (radius * 1.35) / Math.sin(limitingFov / 2)
    const dir = new THREE.Vector3(0.95, 0.65, 0.95).normalize()
    camera.position.copy(dir.multiplyScalar(distance))
    camera.lookAt(0, 0, 0)
    persp.near = Math.max(0.01, distance / 100)
    persp.far = distance * 10
    persp.updateProjectionMatrix()
  }, [radius, camera, size])
  return null
}

export default function AtomicModel3D({ filled }: { filled: Record<string, number[]> }) {
  const occupied = SUBSHELLS.filter(s => sumArr(filled[s.label]) > 0)
  const maxN = occupied.reduce((m, s) => Math.max(m, s.n), 1)
  // The s-sphere has radius shellRadius(n), but d/f lobes actually reach
  // further (their tip distance is ~1.45x / ~1.6x shellRadius(n)) — fit the
  // camera to the largest possible shape at this n, not just the sphere.
  const objectRadius = shellRadius(maxN) * 1.6
  const axisExtent = objectRadius * 1.15 + 1

  return (
    <Canvas camera={{ position: [objectRadius * 2, objectRadius * 1.4, objectRadius * 2], fov: 45 }} gl={{ antialias: true }}>
      <color attach="background" args={[BG_COLOR]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 8]} intensity={1.1} />
      <pointLight position={[-8, 4, -6]} intensity={0.35} color="#ffffff" />
      <CameraRig radius={objectRadius} />
      <AxesGuides extent={axisExtent} />
      <Nucleus />
      {occupied.map(s => {
        const counts = filled[s.label]
        const scale = shellRadius(s.n)
        if (s.l === 's') return (
          <group key={s.label} scale={[scale, scale, scale]}>
            <SOrbital count={counts[0]} />
          </group>
        )
        if (s.l === 'p') return <POrbitalSet key={s.label} n={s.n} counts={counts} />
        if (s.l === 'd') return <DOrbitalSet key={s.label} n={s.n} counts={counts} />
        return <FOrbitalSet key={s.label} n={s.n} counts={counts} />
      })}
      <OrbitControls autoRotate autoRotateSpeed={0.6} enableDamping dampingFactor={0.08} minDistance={1.5} maxDistance={objectRadius * 6} />
    </Canvas>
  )
}
