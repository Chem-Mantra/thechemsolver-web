'use client'
import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

// ── VSEPR database with corrected lone pair 3D positions ───────
interface MoleculeData {
  formula: string; name: string; centralAtom: string
  bondPairs: number; lonePairs: number; hybridization: string
  electronGeometry: string   // all pairs geometry
  geometry: string           // molecular shape only
  bondAngle: string; example: string; color: string
  atoms: Array<{ pos: [number, number, number]; label: string; color: string; r: number }>
  bonds: Array<{ a: number; b: number; order?: number }>
  lonePairPositions?: Array<[number, number, number]>
  // π orbital clouds: each entry = one unhybridised p orbital on one atom
  // axis = direction perpendicular to σ framework; lobes drawn ±axis from center
  piOrbitals?: Array<{ center: [number,number,number]; axis: [number,number,number]; color: string; label: string }>
  note?: string
}

const MOLECULES: Record<string, MoleculeData> = {
  BeCl2: {
    formula: 'BeCl₂', name: 'Beryllium Chloride', centralAtom: 'Be',
    bondPairs: 2, lonePairs: 0, hybridization: 'sp',
    electronGeometry: 'Linear', geometry: 'Linear', bondAngle: '180°',
    example: 'BeCl₂, CO₂, HCN', color: '#4ade80',
    atoms: [
      { pos: [0, 0, 0], label: 'Be', color: '#4ade80', r: 0.35 },
      { pos: [-1.8, 0, 0], label: 'Cl', color: '#22c55e', r: 0.45 },
      { pos: [1.8, 0, 0], label: 'Cl', color: '#22c55e', r: 0.45 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }],
    note: 'sp — no lone pairs → perfect linear. Electron and molecular geometry identical.',
  },
  BF3: {
    formula: 'BF₃', name: 'Boron Trifluoride', centralAtom: 'B',
    bondPairs: 3, lonePairs: 0, hybridization: 'sp²',
    electronGeometry: 'Trigonal Planar', geometry: 'Trigonal Planar', bondAngle: '120°',
    example: 'BF₃, SO₃, AlCl₃', color: '#f97316',
    atoms: [
      { pos: [0, 0, 0], label: 'B', color: '#f97316', r: 0.3 },
      { pos: [0, 1.5, 0], label: 'F', color: '#22c55e', r: 0.4 },
      { pos: [-1.3, -0.75, 0], label: 'F', color: '#22c55e', r: 0.4 },
      { pos: [1.3, -0.75, 0], label: 'F', color: '#22c55e', r: 0.4 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }],
    note: 'sp² — 3 bonds, 0 LP → trigonal planar. B has empty p orbital: Lewis acid. Back-bonding with F.',
  },
  CH4: {
    formula: 'CH₄', name: 'Methane', centralAtom: 'C',
    bondPairs: 4, lonePairs: 0, hybridization: 'sp³',
    electronGeometry: 'Tetrahedral', geometry: 'Tetrahedral', bondAngle: '109.5°',
    example: 'CH₄, CCl₄, SiH₄, NH₄⁺', color: '#06b6d4',
    atoms: [
      { pos: [0, 0, 0], label: 'C', color: '#06b6d4', r: 0.38 },
      { pos: [0.9, 0.9, 0.9], label: 'H', color: '#f8fafc', r: 0.25 },
      { pos: [-0.9, -0.9, 0.9], label: 'H', color: '#f8fafc', r: 0.25 },
      { pos: [-0.9, 0.9, -0.9], label: 'H', color: '#f8fafc', r: 0.25 },
      { pos: [0.9, -0.9, -0.9], label: 'H', color: '#f8fafc', r: 0.25 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }],
    note: 'Perfect tetrahedral: 4 equal bond pairs → all 109.5°. Electron = Molecular geometry.',
  },
  NH3: {
    formula: 'NH₃', name: 'Ammonia', centralAtom: 'N',
    bondPairs: 3, lonePairs: 1, hybridization: 'sp³',
    electronGeometry: 'Tetrahedral', geometry: 'Trigonal Pyramidal', bondAngle: '107°',
    example: 'NH₃, PCl₃, NF₃, AsCl₃', color: '#8b5cf6',
    atoms: [
      { pos: [0, 0, 0], label: 'N', color: '#8b5cf6', r: 0.38 },
      { pos: [1.0, -0.4, 0.6], label: 'H', color: '#f8fafc', r: 0.25 },
      { pos: [-1.0, -0.4, 0.6], label: 'H', color: '#f8fafc', r: 0.25 },
      { pos: [0, -0.4, -1.1], label: 'H', color: '#f8fafc', r: 0.25 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }],
    lonePairPositions: [[0, 0.92, 0]],
    note: '1 LP pushes bond pairs down → 107° < 109.5°. Electron geometry = tetrahedral, shape = pyramidal.',
  },
  H2O: {
    formula: 'H₂O', name: 'Water', centralAtom: 'O',
    bondPairs: 2, lonePairs: 2, hybridization: 'sp³',
    electronGeometry: 'Tetrahedral', geometry: 'V-shaped (Bent)', bondAngle: '104.5°',
    example: 'H₂O, H₂S, OF₂, SCl₂', color: '#3b82f6',
    atoms: [
      { pos: [0, 0, 0], label: 'O', color: '#3b82f6', r: 0.42 },
      { pos: [0.96, -0.56, 0], label: 'H', color: '#f8fafc', r: 0.25 },
      { pos: [-0.96, -0.56, 0], label: 'H', color: '#f8fafc', r: 0.25 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }],
    lonePairPositions: [[0.55, 0.7, 0.55], [-0.55, 0.7, -0.55]],
    note: '2 LP repulsion strongest → 104.5° << 109.5°. Electron = tetrahedral, SHAPE = bent/V-shaped.',
  },
  PCl5: {
    formula: 'PCl₅', name: 'Phosphorus Pentachloride', centralAtom: 'P',
    bondPairs: 5, lonePairs: 0, hybridization: 'sp³d',
    electronGeometry: 'Trigonal Bipyramidal', geometry: 'Trigonal Bipyramidal', bondAngle: '90°, 120°',
    example: 'PCl₅, PF₅, AsF₅, SbCl₅', color: '#f59e0b',
    atoms: [
      { pos: [0, 0, 0], label: 'P', color: '#f59e0b', r: 0.5 },
      { pos: [0, 1.7, 0], label: 'Cl', color: '#22c55e', r: 0.45 },
      { pos: [0, -1.7, 0], label: 'Cl', color: '#22c55e', r: 0.45 },
      { pos: [1.5, 0, 0], label: 'Cl', color: '#22c55e', r: 0.45 },
      { pos: [-0.75, 0, 1.3], label: 'Cl', color: '#22c55e', r: 0.45 },
      { pos: [-0.75, 0, -1.3], label: 'Cl', color: '#22c55e', r: 0.45 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 }],
    note: 'Axial bonds (90°) more strained than equatorial (120°). Axial bonds slightly longer.',
  },
  SF4: {
    formula: 'SF₄', name: 'Sulfur Tetrafluoride', centralAtom: 'S',
    bondPairs: 4, lonePairs: 1, hybridization: 'sp³d',
    electronGeometry: 'Trigonal Bipyramidal', geometry: 'See-saw', bondAngle: '89°, 117°',
    example: 'SF₄, XeO₂F₂, IF₄⁺', color: '#fbbf24',
    atoms: [
      { pos: [0, 0, 0], label: 'S', color: '#fbbf24', r: 0.48 },
      { pos: [0, 1.7, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, -1.7, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [1.55, 0.2, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [-0.8, 0.2, 1.35], label: 'F', color: '#22c55e', r: 0.38 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }],
    lonePairPositions: [[-0.8, 0, -1.4]],
    note: 'LP occupies equatorial position (less strain). Shape = see-saw. Angles compressed by LP.',
  },
  ClF3: {
    formula: 'ClF₃', name: 'Chlorine Trifluoride', centralAtom: 'Cl',
    bondPairs: 3, lonePairs: 2, hybridization: 'sp³d',
    electronGeometry: 'Trigonal Bipyramidal', geometry: 'T-shaped', bondAngle: '87.5°',
    example: 'ClF₃, BrF₃', color: '#a78bfa',
    atoms: [
      { pos: [0, 0, 0], label: 'Cl', color: '#a78bfa', r: 0.48 },
      { pos: [0, 1.68, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, -1.68, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [1.6, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }],
    lonePairPositions: [[-0.8, 0, 1.4], [-0.8, 0, -1.4]],
    note: '5 e-pairs (TBP base): 2 LP in equatorial positions (min. repulsion) → T-shape, angles < 90°.',
  },
  XeF2: {
    formula: 'XeF₂', name: 'Xenon Difluoride', centralAtom: 'Xe',
    bondPairs: 2, lonePairs: 3, hybridization: 'sp³d',
    electronGeometry: 'Trigonal Bipyramidal', geometry: 'Linear', bondAngle: '180°',
    example: 'XeF₂, I₃⁻, [ICl₂]⁻', color: '#67e8f9',
    atoms: [
      { pos: [0, 0, 0], label: 'Xe', color: '#67e8f9', r: 0.55 },
      { pos: [0, 1.8, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, -1.8, 0], label: 'F', color: '#22c55e', r: 0.38 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }],
    lonePairPositions: [[1.5, 0, 0], [-0.75, 0, 1.3], [-0.75, 0, -1.3]],
    note: '5 pairs (TBP): 3 LP all equatorial → bonds go axial → LINEAR despite 3 lone pairs on Xe!',
  },
  SF6: {
    formula: 'SF₆', name: 'Sulfur Hexafluoride', centralAtom: 'S',
    bondPairs: 6, lonePairs: 0, hybridization: 'sp³d²',
    electronGeometry: 'Octahedral', geometry: 'Octahedral', bondAngle: '90°',
    example: 'SF₆, [Fe(CN)₆]³⁻, SeF₆', color: '#ec4899',
    atoms: [
      { pos: [0, 0, 0], label: 'S', color: '#ec4899', r: 0.5 },
      { pos: [1.7, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [-1.7, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 1.7, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, -1.7, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 0, 1.7], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 0, -1.7], label: 'F', color: '#22c55e', r: 0.38 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 0, b: 6 }],
    note: 'Perfect octahedral: all 6 positions equivalent. All angles 90°. Electron = Molecular geometry.',
  },
  BrF5: {
    formula: 'BrF₅', name: 'Bromine Pentafluoride', centralAtom: 'Br',
    bondPairs: 5, lonePairs: 1, hybridization: 'sp³d²',
    electronGeometry: 'Octahedral', geometry: 'Square Pyramidal', bondAngle: '84.8°',
    example: 'BrF₅, XeOF₄, IF₅', color: '#f97316',
    atoms: [
      { pos: [0, 0, 0], label: 'Br', color: '#f97316', r: 0.52 },
      { pos: [1.7, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [-1.7, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 0, 1.7], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 0, -1.7], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 1.6, 0], label: 'F', color: '#22c55e', r: 0.38 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 }],
    lonePairPositions: [[0, -1.55, 0]],
    note: '6 e-pairs (oct.): 1 LP below → pushes 4 equatorial F down → square pyramidal, angles < 90°.',
  },
  XeF4: {
    formula: 'XeF₄', name: 'Xenon Tetrafluoride', centralAtom: 'Xe',
    bondPairs: 4, lonePairs: 2, hybridization: 'sp³d²',
    electronGeometry: 'Octahedral', geometry: 'Square Planar', bondAngle: '90°',
    example: 'XeF₄, [ICl₄]⁻, [PtCl₄]²⁻', color: '#06b6d4',
    atoms: [
      { pos: [0, 0, 0], label: 'Xe', color: '#06b6d4', r: 0.55 },
      { pos: [1.7, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [-1.7, 0, 0], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 0, 1.7], label: 'F', color: '#22c55e', r: 0.38 },
      { pos: [0, 0, -1.7], label: 'F', color: '#22c55e', r: 0.38 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }],
    lonePairPositions: [[0, 1.55, 0], [0, -1.55, 0]],
    note: '6 e-pairs (oct.): 2 LP trans (top/bottom) → 4 bonds in plane → square planar shape!',
  },
  IF7: {
    formula: 'IF₇', name: 'Iodine Heptafluoride', centralAtom: 'I',
    bondPairs: 7, lonePairs: 0, hybridization: 'sp³d³',
    electronGeometry: 'Pentagonal Bipyramidal', geometry: 'Pentagonal Bipyramidal', bondAngle: '72°, 90°',
    example: 'IF₇, [ReF₇], UF₇', color: '#34d399',
    atoms: [
      { pos: [0, 0, 0], label: 'I', color: '#34d399', r: 0.55 },
      // 5 equatorial (pentagonal): 72° apart in xz plane
      { pos: [1.82, 0, 0], label: 'F', color: '#22c55e', r: 0.35 },
      { pos: [0.563, 0, 1.73], label: 'F', color: '#22c55e', r: 0.35 },
      { pos: [-1.47, 0, 1.07], label: 'F', color: '#22c55e', r: 0.35 },
      { pos: [-1.47, 0, -1.07], label: 'F', color: '#22c55e', r: 0.35 },
      { pos: [0.563, 0, -1.73], label: 'F', color: '#22c55e', r: 0.35 },
      // 2 axial
      { pos: [0, 1.8, 0], label: 'F', color: '#22c55e', r: 0.35 },
      { pos: [0, -1.8, 0], label: 'F', color: '#22c55e', r: 0.35 },
    ],
    bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 0, b: 6 }, { a: 0, b: 7 }],
    note: 'sp³d³ — 7 bond pairs, no LP. Pentagonal equatorial ring (72°) + 2 axial (90° to equatorial). Rare geometry!',
  },
  CO2: {
    formula: 'CO₂', name: 'Carbon Dioxide', centralAtom: 'C',
    bondPairs: 2, lonePairs: 0, hybridization: 'sp',
    electronGeometry: 'Linear', geometry: 'Linear', bondAngle: '180°',
    example: 'CO₂, CS₂, HCN, N₃⁻', color: '#34d399',
    atoms: [
      { pos: [0, 0, 0], label: 'C', color: '#34d399', r: 0.35 },
      { pos: [-1.7, 0, 0], label: 'O', color: '#ef4444', r: 0.42 },
      { pos: [1.7, 0, 0], label: 'O', color: '#ef4444', r: 0.42 },
    ],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2, order: 2 }],
    note: 'sp hybrid. Two double bonds. O lone pairs on terminal atoms don\'t affect shape of molecule.',
  },
  C2H4: {
    formula: 'C₂H₄', name: 'Ethene (Ethylene)', centralAtom: 'C',
    bondPairs: 3, lonePairs: 0, hybridization: 'sp²',
    electronGeometry: 'Trigonal Planar', geometry: 'Trigonal Planar', bondAngle: '120°',
    example: 'C₂H₄, benzene (each C), all alkenes', color: '#a78bfa',
    atoms: [
      { pos: [-0.65, 0, 0], label: 'C', color: '#a78bfa', r: 0.35 },
      { pos: [0.65, 0, 0], label: 'C', color: '#a78bfa', r: 0.35 },
      { pos: [-1.2, 0.95, 0], label: 'H', color: '#f8fafc', r: 0.22 },
      { pos: [-1.2, -0.95, 0], label: 'H', color: '#f8fafc', r: 0.22 },
      { pos: [1.2, 0.95, 0], label: 'H', color: '#f8fafc', r: 0.22 },
      { pos: [1.2, -0.95, 0], label: 'H', color: '#f8fafc', r: 0.22 },
    ],
    bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 1, b: 4 }, { a: 1, b: 5 }],
    // Molecule lies in xy-plane → unhybridised 2p on each C points along z-axis
    piOrbitals: [
      { center: [-0.65, 0, 0], axis: [0, 0, 1], color: '#a78bfa', label: '2pz (C1)' },
      { center: [ 0.65, 0, 0], axis: [0, 0, 1], color: '#ec4899', label: '2pz (C2)' },
    ],
    note: 'sp² each C: 3 sp² orbitals form σ framework (in plane); 1 unhybridised 2p_z per C points OUT of plane → sideways overlap = π bond. Rigid! No rotation around C=C.',
  },
  C2H2: {
    formula: 'C₂H₂', name: 'Ethyne (Acetylene)', centralAtom: 'C',
    bondPairs: 2, lonePairs: 0, hybridization: 'sp',
    electronGeometry: 'Linear', geometry: 'Linear', bondAngle: '180°',
    example: 'C₂H₂, HCN, N₂ (triple bond)', color: '#fbbf24',
    atoms: [
      { pos: [-0.6, 0, 0], label: 'C', color: '#fbbf24', r: 0.32 },
      { pos: [0.6, 0, 0], label: 'C', color: '#fbbf24', r: 0.32 },
      { pos: [-1.8, 0, 0], label: 'H', color: '#f8fafc', r: 0.22 },
      { pos: [1.8, 0, 0], label: 'H', color: '#f8fafc', r: 0.22 },
    ],
    bonds: [{ a: 0, b: 1, order: 3 }, { a: 0, b: 2 }, { a: 1, b: 3 }],
    // sp: 2 unhybridised p orbitals per C → 2 perpendicular π bonds
    // π₁: 2p_y orbitals (axis Y) → π bond in xz plane view
    // π₂: 2p_z orbitals (axis Z) → π bond in xy plane view
    piOrbitals: [
      { center: [-0.6, 0, 0], axis: [0, 1, 0], color: '#fbbf24', label: '2py (C1) — π₁' },
      { center: [ 0.6, 0, 0], axis: [0, 1, 0], color: '#f97316', label: '2py (C2) — π₁' },
      { center: [-0.6, 0, 0], axis: [0, 0, 1], color: '#06b6d4', label: '2pz (C1) — π₂' },
      { center: [ 0.6, 0, 0], axis: [0, 0, 1], color: '#34d399', label: '2pz (C2) — π₂' },
    ],
    note: 'sp each C: 2 sp orbitals form σ bonds (H–C≡C–H); 2 unhybridised p orbitals (2p_y and 2p_z) per C → TWO perpendicular π bonds shown above. Triple bond = 1σ + 2π.',
  },
}

// ── 3D components ──────────────────────────────────────────────
function Bond3D({ start, end, color = '#94a3b8', radius = 0.06, isDouble = false, isTriple = false }:
  { start: [number,number,number]; end: [number,number,number]; color?: string; radius?: number; isDouble?: boolean; isTriple?: boolean }) {
  const v1 = new THREE.Vector3(...start), v2 = new THREE.Vector3(...end)
  const dir = v2.clone().sub(v1)
  const len = dir.length()
  const mid = v1.clone().add(dir.clone().multiplyScalar(0.5))
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())

  if (!isDouble && !isTriple) {
    return (
      <mesh position={mid.toArray() as [number,number,number]} quaternion={q}>
        <cylinderGeometry args={[radius, radius, len, 8]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </mesh>
    )
  }
  // Double bond: 2 cylinders side by side
  const perp = new THREE.Vector3(1, 0, 0).cross(dir.clone().normalize()).normalize()
  const offsets = isTriple ? [-0.09, 0, 0.09] : [-0.07, 0.07]
  return (
    <group>
      {offsets.map((off, i) => {
        const offset = perp.clone().multiplyScalar(off)
        const pos = mid.clone().add(offset).toArray() as [number,number,number]
        return (
          <mesh key={i} position={pos} quaternion={q}>
            <cylinderGeometry args={[0.045, 0.045, len, 8]} />
            <meshStandardMaterial color={i === 0 ? '#fbbf24' : color} metalness={0.2} roughness={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

// ── π orbital lobe (one unhybridised p orbital = two lobes) ───
// Drawn as two flattened ellipsoids pointing ±axis from center
function PiOrbitalCloud({ center, axis, color }: {
  center: [number,number,number]
  axis: [number,number,number]
  color: string
}) {
  const ref1 = useRef<THREE.Mesh>(null)
  const ref2 = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const op = 0.28 + Math.sin(clock.getElapsedTime() * 1.8) * 0.12
    if (ref1.current) (ref1.current.material as THREE.MeshStandardMaterial).opacity = op
    if (ref2.current) (ref2.current.material as THREE.MeshStandardMaterial).opacity = op
  })

  const ax = new THREE.Vector3(...axis).normalize()
  // Quaternion to rotate Y-axis → axis direction (lobes elongated along Y before rotation)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), ax)
  // Lobe centres: 0.52 units above and below center along axis
  const p1 = new THREE.Vector3(...center).addScaledVector(ax, 0.52).toArray() as [number,number,number]
  const p2 = new THREE.Vector3(...center).addScaledVector(ax, -0.52).toArray() as [number,number,number]

  const mat = { transparent: true as const, depthWrite: false, emissive: color, emissiveIntensity: 0.55 }

  return (
    <group>
      {/* Lobe 1 (positive phase) */}
      <mesh ref={ref1} position={p1} quaternion={q} scale={[0.75, 0.52, 0.75]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={color} {...mat} opacity={0.32} />
      </mesh>
      {/* Lobe 2 (negative phase — slightly different shade) */}
      <mesh ref={ref2} position={p2} quaternion={q} scale={[0.75, 0.52, 0.75]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshStandardMaterial color={color} {...mat} opacity={0.22} />
      </mesh>
      {/* Thin node plane indicator (ring at center) */}
      <mesh position={center} quaternion={q}>
        <torusGeometry args={[0.32, 0.015, 8, 32]} />
        <meshStandardMaterial color={color} opacity={0.5} transparent />
      </mesh>
    </group>
  )
}

function LonePair3D({ position, pulsing = true }: { position: [number,number,number]; pulsing?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current && pulsing) {
      const m = meshRef.current.material as THREE.MeshStandardMaterial
      m.opacity = 0.35 + Math.sin(clock.getElapsedTime() * 2.5) * 0.18
    }
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.38, 16, 16]} />
      <meshStandardMaterial color="#fbbf24" transparent opacity={0.5} emissive="#fbbf24" emissiveIntensity={0.5} />
    </mesh>
  )
}

function MoleculeScene({ mol, showLP, autoRot }: { mol: MoleculeData; showLP: boolean; autoRot: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current && autoRot) groupRef.current.rotation.y += delta * 0.4
  })

  return (
    <group ref={groupRef}>
      {/* Bonds */}
      {mol.bonds.map((b, i) => (
        <Bond3D key={i}
          start={mol.atoms[b.a].pos} end={mol.atoms[b.b].pos}
          color={b.order === 2 ? '#fbbf24' : b.order === 3 ? '#f97316' : '#94a3b8'}
          isDouble={b.order === 2}
          isTriple={b.order === 3}
        />
      ))}

      {/* Atoms */}
      {mol.atoms.map((atom, i) => (
        <group key={i} position={atom.pos}>
          <mesh>
            <sphereGeometry args={[atom.r, 24, 24]} />
            <meshStandardMaterial color={atom.color} emissive={atom.color} emissiveIntensity={0.35} metalness={0.3} roughness={0.3} />
          </mesh>
          <Html center distanceFactor={7}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'white', textShadow: '0 0 4px black', pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}>
              {atom.label}
            </div>
          </Html>
        </group>
      ))}

      {/* Lone pairs */}
      {showLP && mol.lonePairPositions?.map((pos, i) => (
        <LonePair3D key={i} position={pos} />
      ))}

      {/* π orbital lobes — always shown for sp/sp² molecules */}
      {mol.piOrbitals?.map((pi, i) => (
        <PiOrbitalCloud key={i} center={pi.center} axis={pi.axis} color={pi.color} />
      ))}
    </group>
  )
}

// ── Main ───────────────────────────────────────────────────────
const VSEPR_RULES = [
  'Count ALL e⁻ pairs around central atom (bonds + LPs)',
  'LP-LP repulsion > LP-BP repulsion > BP-BP repulsion',
  'SHAPE name uses only bond positions (LP invisible in shape)',
  'Electron geometry ≠ Molecular shape when LPs present',
  'LPs prefer equatorial in TBP (least 90° conflicts)',
  'LPs trans to each other in Oct. (minimum repulsion)',
]

export default function VsesrSim() {
  const [selected, setSelected] = useState('CH4')
  const [showLP, setShowLP] = useState(true)
  const [autoRot, setAutoRot] = useState(true)
  const mol = MOLECULES[selected]

  const hasLP = (mol.lonePairPositions?.length ?? 0) > 0
  const electronGeometryDifferent = mol.electronGeometry !== mol.geometry

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <strong style={{ fontSize: 14 }}>VSEPR & Hybridization — 3D Molecular Geometry</strong>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowLP(l => !l)}
            style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${hasLP ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`, background: showLP && hasLP ? 'rgba(251,191,36,0.12)' : 'transparent', color: hasLP ? (showLP ? '#fbbf24' : '#849495') : '#3a3a3a', fontSize: 11, cursor: hasLP ? 'pointer' : 'default' }}>
            {showLP ? '🟡 Hide LP' : '🟡 Show LP'}
          </button>
          <button onClick={() => setAutoRot(r => !r)}
            style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(0,219,231,0.3)', background: autoRot ? 'rgba(0,219,231,0.1)' : 'transparent', color: autoRot ? '#00dbe7' : '#849495', fontSize: 11, cursor: 'pointer' }}>
            {autoRot ? '⏸ Freeze' : '▶ Rotate'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Molecule selector */}
        <div style={{ width: 185, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 10 }}>
          <div style={{ fontSize: 9, color: '#00dbe7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Molecules</div>
          {Object.entries(MOLECULES).map(([key, m]) => (
            <button key={key} onClick={() => setSelected(key)}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, marginBottom: 4, border: `1px solid ${selected === key ? m.color + '60' : 'transparent'}`, background: selected === key ? m.color + '18' : 'rgba(255,255,255,0.02)', color: selected === key ? m.color : '#849495', fontSize: 10, cursor: 'pointer' }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 13 }}>{m.formula}</span>
              <span style={{ fontSize: 8, opacity: 0.7 }}>{m.geometry} · {m.hybridization}</span>
              {m.lonePairs > 0 && <span style={{ fontSize: 8, color: '#fbbf24' }}> · {m.lonePairs} LP</span>}
            </button>
          ))}
          <div style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
            <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>VSEPR Rules</div>
            {VSEPR_RULES.map((r, i) => (
              <div key={i} style={{ fontSize: 8, color: '#849495', marginBottom: 3, lineHeight: 1.4 }}>• {r}</div>
            ))}
          </div>
        </div>

        {/* 3D + Info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Info banner */}
          <AnimatePresence mode="wait">
            <motion.div key={selected} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={{ background: `${mol.color}10`, borderBottom: `2px solid ${mol.color}40`, padding: '10px 14px', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: mol.color, fontFamily: 'monospace' }}>{mol.formula}</div>
                  <div style={{ fontSize: 11, color: '#849495' }}>{mol.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: mol.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Hybridization</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: mol.color, background: `${mol.color}20`, padding: '2px 10px', borderRadius: 6, display: 'inline-block' }}>{mol.hybridization}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: mol.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Electron Pair Geometry</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{mol.electronGeometry}</div>
                  {electronGeometryDifferent && (
                    <div style={{ fontSize: 9, color: '#849495', marginTop: 1 }}>(includes LP positions)</div>
                  )}
                </div>
                {electronGeometryDifferent && (
                  <div>
                    <div style={{ fontSize: 8, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Molecular Shape ≠</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>{mol.geometry}</div>
                    <div style={{ fontSize: 9, color: '#849495', marginTop: 1 }}>(bond pairs only)</div>
                  </div>
                )}
                {!electronGeometryDifferent && (
                  <div>
                    <div style={{ fontSize: 8, color: mol.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Molecular Shape</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: mol.color }}>{mol.geometry}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 8, color: mol.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>e⁻ Pairs</div>
                  <div style={{ fontSize: 11, color: '#f8fafc' }}>BP: <strong style={{ color: '#06b6d4' }}>{mol.bondPairs}</strong> · LP: <strong style={{ color: '#fbbf24' }}>{mol.lonePairs}</strong> · Total: <strong style={{ color: mol.color }}>{mol.bondPairs + mol.lonePairs}</strong></div>
                  <div style={{ fontSize: 11, color: '#849495' }}>Bond angle: <strong style={{ color: mol.color }}>{mol.bondAngle}</strong></div>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 8, color: mol.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>Key Insight</div>
                  <div style={{ fontSize: 10, color: '#849495', lineHeight: 1.45 }}>{mol.note}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3D viewport */}
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}
              style={{ background: 'radial-gradient(ellipse at center, #130818 0%, #08020d 100%)' }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1.2} color="#00dbe7" />
              <pointLight position={[-5, -5, 5]} intensity={0.6} color="#8b5cf6" />
              <pointLight position={[0, 5, -5]} intensity={0.4} color="#f97316" />
              <Suspense fallback={null}>
                <MoleculeScene mol={mol} showLP={showLP} autoRot={autoRot} />
              </Suspense>
              <OrbitControls enableZoom autoRotate={false} enablePan={false} />
            </Canvas>

            {/* LP warning */}
            {!hasLP && (
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(9,14,28,0.8)', borderRadius: 8, padding: '4px 10px', fontSize: 9, color: '#3a4060' }}>
                No lone pairs on this molecule
              </div>
            )}

            <div style={{ position: 'absolute', bottom: 10, right: 12, fontSize: 9, color: '#849495', textAlign: 'right', pointerEvents: 'none' }}>
              <div>Drag to rotate · Scroll to zoom</div>
              <div style={{ color: '#fbbf24' }}>🟡 = Lone pair (pulsing)</div>
              {mol.piOrbitals && (
                <>
                  <div style={{ color: '#a78bfa', marginTop: 3 }}>💜 = unhybridised p orbital (π)</div>
                  <div style={{ color: '#849495', fontSize: 8 }}>each lobe = one phase of ψ</div>
                  <div style={{ color: '#849495', fontSize: 8 }}>torus ring = nodal plane</div>
                  {mol.formula === 'C₂H₂' && (
                    <>
                      <div style={{ color: '#fbbf24', fontSize: 8, marginTop: 2 }}>🟡 = π₁ (2py pair)</div>
                      <div style={{ color: '#06b6d4', fontSize: 8 }}>🔵 = π₂ (2pz pair) ⊥ to π₁</div>
                    </>
                  )}
                </>
              )}
            </div>

            <div style={{ position: 'absolute', bottom: 10, left: 12, background: 'rgba(14,19,34,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '7px 11px', fontSize: 10, fontFamily: 'monospace' }}>
              <div style={{ color: '#849495', marginBottom: 2 }}>Hybridization:</div>
              <div style={{ color: mol.color }}>
                {mol.bondPairs + mol.lonePairs} e⁻ pairs → {mol.hybridization}
              </div>
              <div style={{ color: '#849495', fontSize: 8, marginTop: 2 }}>
                {mol.hybridization === 'sp' ? '2 pairs → linear 180°' :
                 mol.hybridization === 'sp²' ? '3 pairs → trigonal planar 120°' :
                 mol.hybridization === 'sp³' ? '4 pairs → tetrahedral 109.5°' :
                 mol.hybridization === 'sp³d' ? '5 pairs → TBP (90°,120°)' :
                 mol.hybridization === 'sp³d²' ? '6 pairs → octahedral 90°' :
                 '7 pairs → pent. bipyramidal (72°,90°)'}
              </div>
            </div>
          </div>

          {/* Bottom comparison bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '6px 12px', background: 'rgba(9,14,28,0.5)', flexShrink: 0, overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: 5, minWidth: 700 }}>
              {Object.entries(MOLECULES).map(([key, m]) => (
                <button key={key} onClick={() => setSelected(key)}
                  style={{ flexShrink: 0, padding: '4px 7px', borderRadius: 6, border: `1px solid ${selected === key ? m.color + '70' : 'rgba(255,255,255,0.07)'}`, background: selected === key ? m.color + '18' : 'transparent', cursor: 'pointer', textAlign: 'center', minWidth: 52 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: selected === key ? m.color : '#849495', fontFamily: 'monospace' }}>{m.formula}</div>
                  <div style={{ fontSize: 7, color: '#849495' }}>{m.hybridization}</div>
                  <div style={{ fontSize: 7, color: m.lonePairs > 0 ? '#fbbf24' : '#849495' }}>{m.lonePairs > 0 ? `${m.lonePairs}LP` : m.bondAngle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
