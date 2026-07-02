'use client'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { SUBSHELLS, sumArr } from '../subshells'

// ── Bohr Model ────────────────────────────────────────────────────────────
// Classic planetary-style view: nucleus at the center, one ring per occupied
// PRINCIPAL shell (n) — electrons are grouped by shell only here, not by
// subshell, matching the traditional Bohr picture and the reference video.
// As electrons fill in the 2D builder, balls join the matching ring and
// orbit continuously. A fixed, slightly elevated camera gives the rings
// their characteristic tilted-ellipse look (the video uses the same fixed
// angle rather than rotating).

const RING_COLORS = ['#e2e8f0', '#22d3ee', '#f472b6', '#4ade80', '#fbbf24', '#a78bfa', '#fb7185']
const ringRadius = (n: number) => 0.85 + (n - 1) * 0.62
const ringColor = (n: number) => RING_COLORS[(n - 1) % RING_COLORS.length]

function circlePoints(radius: number, segments = 96): [number, number, number][] {
  const pts: [number, number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius])
  }
  return pts
}

function Ring({ n }: { n: number }) {
  const radius = ringRadius(n)
  const color = ringColor(n)
  const pts = useMemo(() => circlePoints(radius), [radius])
  return (
    <>
      <Line points={pts} color={color} transparent opacity={0.9} lineWidth={1.4} />
      <Line points={pts} color={color} transparent opacity={0.18} lineWidth={5} />
    </>
  )
}

function Electron({ n, idx, count }: { n: number; idx: number; count: number }) {
  const ref = useRef<THREE.Group>(null!)
  const radius = ringRadius(n)
  const color = ringColor(n)
  const phase = (idx / count) * Math.PI * 2
  const speed = 0.55 / Math.sqrt(n) // inner shells revolve faster, like the reference

  useFrame(state => {
    const t = state.clock.elapsedTime * speed + phase
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius)
  })

  return (
    <group ref={ref}>
      {/* soft glow halo */}
      <mesh>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Nucleus({ z }: { z: number }) {
  const radius = Math.min(0.42, 0.2 + Math.cbrt(z) * 0.05)
  return (
    <mesh>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.1} roughness={0.3} />
    </mesh>
  )
}

function CameraRig({ outerRadius }: { outerRadius: number }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera
    const aspect = size.width / Math.max(1, size.height)
    const vFov = (persp.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
    const limitingFov = Math.min(vFov, hFov)
    const distance = (outerRadius * 1.25) / Math.sin(limitingFov / 2)
    camera.position.set(0, distance * 0.62, distance * 0.82)
    camera.lookAt(0, 0, 0)
    persp.near = Math.max(0.01, distance / 100)
    persp.far = distance * 10
    persp.updateProjectionMatrix()
  }, [outerRadius, camera, size])
  return null
}

export default function BohrModel({ filled }: { filled: Record<string, number[]> }) {
  const shellCounts = useMemo(() => {
    const counts: Record<number, number> = {}
    for (const s of SUBSHELLS) {
      const c = sumArr(filled[s.label] ?? [])
      if (c > 0) counts[s.n] = (counts[s.n] ?? 0) + c
    }
    return counts
  }, [filled])

  const shells = Object.keys(shellCounts).map(Number).sort((a, b) => a - b)
  const z = shells.reduce((sum, n) => sum + shellCounts[n], 0)
  const outerRadius = shells.length > 0 ? ringRadius(shells[shells.length - 1]) : 1.5

  return (
    <Canvas camera={{ position: [0, 4, 6], fov: 42 }} gl={{ antialias: true }}>
      <color attach="background" args={['#05070d']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 6, 4]} intensity={1} />
      <CameraRig outerRadius={outerRadius} />
      <Nucleus z={z} />
      {shells.map(n => (
        <group key={n}>
          <Ring n={n} />
          {Array.from({ length: shellCounts[n] }, (_, idx) => (
            <Electron key={idx} n={n} idx={idx} count={shellCounts[n]} />
          ))}
        </group>
      ))}
      <OrbitControls enableDamping dampingFactor={0.08} minDistance={1.5} maxDistance={outerRadius * 8} autoRotate={false} />
    </Canvas>
  )
}
