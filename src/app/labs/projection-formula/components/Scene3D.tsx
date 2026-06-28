'use client'
import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { GROUP_COLOR, RANK_COLOR } from './groupPalette'

const BOND_VISUAL_LENGTH = 1.6

function Bond3D({ direction, color = '#94a3b8' }: { direction: THREE.Vector3; color?: string }) {
  const end = direction.clone().multiplyScalar(BOND_VISUAL_LENGTH)
  const mid = end.clone().multiplyScalar(0.5)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
  return (
    <mesh position={mid.toArray()} quaternion={q}>
      <cylinderGeometry args={[0.06, 0.06, BOND_VISUAL_LENGTH, 8]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
    </mesh>
  )
}

export interface Slot3D {
  direction: THREE.Vector3
  label: string // empty string = unassigned slot
  selected: boolean
  /** This substituent's CIP priority (1 = highest), when known — used by the "Show CIP ranking"
   * overlay to recolor the sphere/bond by rank instead of by element/group. */
  rank?: 1 | 2 | 3 | 4
}

export interface Center3D {
  position: THREE.Vector3
  label: string
  slots: Slot3D[]
  /** Rank1→rank2→rank3→rank4 real bond directions (from this center), in CIP order — including the
   * inter-carbon bond direction when THAT is the ranked substituent (2-carbon mode only, since the
   * backbone bond isn't a `Slot3D`). Drives the "Show CIP ranking" arc/arrow. */
  cipRankDirs?: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3]
  /** "C1"/"C2"-style locant badge shown above this center when the naming panel's "Show numbering" is
   * on — undefined renders nothing, so this lab's 3D view stays exactly as before when numbering is off. */
  numberLabel?: string
}

export interface InterCenterBond {
  from: THREE.Vector3
  to: THREE.Vector3
}

function SlotEnd({ center, slot, onClick, showCip }: { center: THREE.Vector3; slot: Slot3D; onClick: () => void; showCip: boolean }) {
  const pos = center.clone().add(slot.direction.clone().multiplyScalar(BOND_VISUAL_LENGTH))
  const color = showCip && slot.rank ? RANK_COLOR[slot.rank - 1] : slot.label ? GROUP_COLOR[slot.label] ?? '#94a3b8' : '#475569'
  return (
    <group position={pos.toArray()}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick() }}>
        <sphereGeometry args={[0.34, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={slot.selected ? '#f97316' : color}
          emissiveIntensity={slot.selected ? 0.9 : 0.3}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      <Html center distanceFactor={7}>
        <div
          onClick={onClick}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'white',
            textShadow: '0 0 4px black',
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            padding: '2px 6px',
            borderRadius: 6,
            background: slot.selected ? 'rgba(249,115,22,0.35)' : 'transparent',
            border: slot.selected ? '1px solid #f97316' : 'none',
          }}
        >
          {slot.label || '+'}
        </div>
      </Html>
    </group>
  )
}

function CenterToCenterBond({ from, to, highlighted }: InterCenterBond & { highlighted?: boolean }) {
  const dir = to.clone().sub(from)
  const len = dir.length()
  const mid = from.clone().add(dir.clone().multiplyScalar(0.5))
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return (
    <mesh position={mid.toArray()} quaternion={q}>
      <cylinderGeometry args={[highlighted ? 0.12 : 0.08, highlighted ? 0.12 : 0.08, len, 8]} />
      <meshStandardMaterial
        color={highlighted ? '#f97316' : '#cbd5e1'}
        emissive={highlighted ? '#f97316' : undefined}
        emissiveIntensity={highlighted ? 0.6 : 0}
        metalness={0.2}
        roughness={0.4}
      />
    </mesh>
  )
}

function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  const angle = a.angleTo(b)
  if (angle < 1e-6) return a.clone()
  const sinAngle = Math.sin(angle)
  const wa = Math.sin((1 - t) * angle) / sinAngle
  const wb = Math.sin(t * angle) / sinAngle
  return a.clone().multiplyScalar(wa).add(b.clone().multiplyScalar(wb))
}

/** The rank1→rank2→rank3 sweep, drawn as a great-circle arc (via spherical interpolation between the
 * real bond directions, so it visually hugs the tetrahedron rather than cutting through its center)
 * with an arrowhead at the rank-3 end — the 3D counterpart of the Fischer panel's curved CIP arrow. */
function CipArc3D({ center, cipRankDirs }: { center: THREE.Vector3; cipRankDirs: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3] }) {
  const radius = BOND_VISUAL_LENGTH * 0.82
  const [d1, d2, d3] = cipRankDirs.map((d) => d.clone().normalize())
  const segPoints = (a: THREE.Vector3, b: THREE.Vector3, n = 14) =>
    Array.from({ length: n + 1 }, (_, i) => slerp(a, b, i / n).multiplyScalar(radius).add(center))
  const points = [...segPoints(d1, d2), ...segPoints(d2, d3).slice(1)]
  const tip = points[points.length - 1]
  const prev = points[points.length - 2]
  const tangent = tip.clone().sub(prev).normalize()
  const arrowQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
  return (
    <group>
      <Line points={points.map((p) => p.toArray())} color="#a855f7" lineWidth={2.5} />
      <mesh position={tip.toArray()} quaternion={arrowQ}>
        <coneGeometry args={[0.09, 0.22, 12]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function Scene({
  centers,
  bonds,
  onSlotClick,
  moleculeQuaternion,
  pivot,
  showCip,
  highlightBackbone,
}: {
  centers: Center3D[]
  bonds: InterCenterBond[]
  onSlotClick: (centerIndex: number, slotIndex: number) => void
  moleculeQuaternion: THREE.Quaternion
  pivot: THREE.Vector3
  showCip: boolean
  highlightBackbone: boolean
}) {
  const content = (
    <>
      {bonds.map((b, i) => (
        <CenterToCenterBond key={i} from={b.from} to={b.to} highlighted={highlightBackbone} />
      ))}
      {centers.map((center, ci) => (
        <group key={ci}>
          <mesh position={center.position.toArray()}>
            <sphereGeometry args={[0.4, 24, 24]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.35} metalness={0.3} roughness={0.3} />
          </mesh>
          {center.numberLabel && (
            <Html position={center.position.clone().add(new THREE.Vector3(0, -0.62, 0)).toArray()} center distanceFactor={7}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', textShadow: '0 0 4px black', whiteSpace: 'nowrap' }}>
                {center.numberLabel}
              </div>
            </Html>
          )}
          {center.slots.map((slot, si) => (
            <group key={si}>
              <group position={center.position.toArray()}>
                <Bond3D direction={slot.direction} color={showCip && slot.rank ? RANK_COLOR[slot.rank - 1] : undefined} />
              </group>
              <SlotEnd center={center.position} slot={slot} onClick={() => onSlotClick(ci, si)} showCip={showCip} />
            </group>
          ))}
          {showCip && center.cipRankDirs && <CipArc3D center={center.position} cipRankDirs={center.cipRankDirs} />}
        </group>
      ))}
    </>
  )
  // Rotate around the molecule's own pivot (e.g. the midpoint between 2 carbons), not the world
  // origin — rotating about the origin would swing a carbon that's offset from it (and everything
  // attached to it) through a wide arc, pushing it out of frame even though the molecule's own size
  // never changed. Translate pivot→origin, rotate, translate back.
  return (
    <group position={pivot.toArray()}>
      <group quaternion={moleculeQuaternion}>
        <group position={pivot.clone().negate().toArray()}>{content}</group>
      </group>
    </group>
  )
}

/** Resets OrbitControls (camera back to its default look-at-origin position) every time `resetToken`
 * changes — used so toggling "show as Fischer" always starts from a known camera angle, since the
 * snap rotation is only meaningful relative to the default view. Must live INSIDE the Canvas (it uses
 * useThree-free drei ref access via a plain effect, no r3f hooks needed beyond the ref itself). */
function CameraResetter({ controlsRef, resetToken }: { controlsRef: React.RefObject<OrbitControlsImpl | null>; resetToken: string | number }) {
  useEffect(() => {
    controlsRef.current?.reset()
  }, [resetToken])
  return null
}

export default function Scene3D({
  centers,
  bonds = [],
  onSlotClick,
  moleculeQuaternion,
  resetToken = 0,
  showCip = false,
  highlightBackbone = false,
  enableOrbit = true,
}: {
  centers: Center3D[]
  bonds?: InterCenterBond[]
  onSlotClick: (centerIndex: number, slotIndex: number) => void
  moleculeQuaternion?: THREE.Quaternion | null
  resetToken?: string | number
  showCip?: boolean
  highlightBackbone?: boolean
  /** False while a Fischer-match snap is active, so the pose a corner legend describes can't be
   * dragged out from under it — the "static" half of the wedge-dash → Fischer teaching flow. */
  enableOrbit?: boolean
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const pivot = centers.length
    ? centers.reduce((acc, c) => acc.add(c.position), new THREE.Vector3()).multiplyScalar(1 / centers.length)
    : new THREE.Vector3()
  // 2-carbon mode spans noticeably more space than 1-carbon (the inter-carbon bond plus both
  // centers' own tetrahedral arms) — pull the default camera back further so a snapped Fischer pose
  // (which can orient that longer axis across the screen rather than into depth) still fits in frame
  // without the student having to immediately scroll-zoom out just to see the whole molecule.
  const cameraZ = centers.length > 1 ? 8.5 : 6
  return (
    <Canvas camera={{ position: [0, 0, cameraZ], fov: 45 }} gl={{ antialias: true, alpha: true }} style={{ background: 'radial-gradient(ellipse at center, #130818 0%, #08020d 100%)' }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00dbe7" />
      <pointLight position={[-5, -5, 5]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#f97316" />
      <Suspense fallback={null}>
        <Scene
          centers={centers}
          bonds={bonds}
          onSlotClick={onSlotClick}
          moleculeQuaternion={moleculeQuaternion ?? new THREE.Quaternion()}
          pivot={pivot}
          showCip={showCip}
          highlightBackbone={highlightBackbone}
        />
      </Suspense>
      <CameraResetter controlsRef={controlsRef} resetToken={resetToken} />
      <OrbitControls ref={controlsRef} enableRotate={enableOrbit} enableZoom enablePan={false} />
    </Canvas>
  )
}
