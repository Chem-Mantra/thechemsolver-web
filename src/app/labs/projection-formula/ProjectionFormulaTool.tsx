'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import * as THREE from 'three'
import { nameMolecule } from '@/lib/nomenclature/nameMolecule'
import { SubstituentKind } from '@/lib/nomenclature/editOps'
import { toMoleculeGraph, axisCenterRanks } from '@/lib/projection/toMoleculeGraph'
import {
  fischerLayoutForCenter,
  fischerLadderLayout,
  rotateFischerCross,
  rotateLadderCross,
  apparentRSForCross,
  FischerRotationDeg,
  LadderRotationStep,
  FischerPos,
} from '@/lib/projection/fischerLayout'
import { fischerSnapQuaternion } from '@/lib/projection/fischerSnap'
import { assignRS } from '@/lib/nomenclature/stereo'
import { mesoVerdict, hasExchangeSymmetry } from '@/lib/projection/mesoCheck'
import { newmanLayoutFor } from '@/lib/projection/newmanLayout'
import { sawhorseLayoutFor } from '@/lib/projection/sawhorseLayout'
import { symmetricTetrahedralDirections, tripodDirections } from '@/lib/projection/geometry'
import { AssignedGroup, ProjectionState } from '@/lib/projection/state'
import NamingPanel from '../nomenclature/components/NamingPanel'
import Scene3D, { Center3D, InterCenterBond } from './components/Scene3D'
import FischerSvg from './components/FischerSvg'
import NewmanSvg from './components/NewmanSvg'
import SawhorseSvg from './components/SawhorseSvg'
import { PALETTE_GROUPS } from './components/groupPalette'
import PracticeQuiz from './components/PracticeQuiz'
import CarbohydrateFischer from './components/CarbohydrateFischer'

type Groups4 = [AssignedGroup, AssignedGroup, AssignedGroup, AssignedGroup]
type Groups3 = [AssignedGroup, AssignedGroup, AssignedGroup]
type Mode = 'one-carbon' | 'two-carbon'
type SelectedSlot = { center: 0 | 1; slot: number } | null
type FischerView = 'off' | 'A' | 'B'
type CipView = 'off' | 'A' | 'B'

/** Resolves one ranked substituent's real 3D bond direction: a real slot looks it up in this center's
 * own satellite directions (`slotIndex` is already relative to that array, see `toMoleculeGraph.ts`'s
 * `externalSlotIndex` doc comment); `null` means this rank entry IS the inter-carbon bond itself
 * (2-carbon mode only), whose direction is the bond axis already known to the caller. */
function dirForRankEntry(r: { slotIndex: number | null }, satelliteDirs: THREE.Vector3[], backboneDir: THREE.Vector3): THREE.Vector3 {
  return r.slotIndex !== null ? satelliteDirs[r.slotIndex] : backboneDir
}

const BOND_VISUAL_LENGTH = 1.6

export default function ProjectionFormulaPage() {
  const [mode, setMode] = useState<Mode>('one-carbon')
  const [groupsOne, setGroupsOne] = useState<Groups4>([undefined, undefined, undefined, undefined])
  const [groupsA, setGroupsA] = useState<Groups3>([undefined, undefined, undefined])
  const [groupsB, setGroupsB] = useState<Groups3>([undefined, undefined, undefined])
  const [dihedralDeg, setDihedralDeg] = useState(60)
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot>(null)
  const [fischerView, setFischerView] = useState<FischerView>('off')
  const [cipView, setCipView] = useState<CipView>('off')
  const [showCip, setShowCip] = useState(false)
  const [fischerRotation, setFischerRotation] = useState<FischerRotationDeg>(0)
  const [ladderRotationStep, setLadderRotationStep] = useState<LadderRotationStep>(0)
  const [quizMode, setQuizMode] = useState(false)
  const [sugarMode, setSugarMode] = useState(false)
  const [highlightOn, setHighlightOn] = useState(false)
  const [numberingOn, setNumberingOn] = useState(false)
  const [practiceMode, setPracticeMode] = useState(false)

  const state: ProjectionState = useMemo(() => {
    if (mode === 'one-carbon') return { mode: 'one-carbon', groups: groupsOne }
    return { mode: 'two-carbon', groupsA, groupsB, dihedralRad: (dihedralDeg * Math.PI) / 180 }
  }, [mode, groupsOne, groupsA, groupsB, dihedralDeg])

  const { graph, centerInfo } = useMemo(() => toMoleculeGraph(state), [state])
  const result = useMemo(() => nameMolecule(graph), [graph])

  // The "meso trap": only meaningful when both carbons carry the SAME substituent set (a real
  // structural symmetry, e.g. tartaric-acid-style) — students who only look at "2 stereocenters
  // exist" miss that (R,S)/(S,R) on such a backbone is a single achiral compound, not 2 enantiomers.
  const mesoInfo = useMemo(() => {
    if (mode !== 'two-carbon' || !centerInfo[0] || !centerInfo[1]) return null
    if (!hasExchangeSymmetry(groupsA, groupsB)) return null
    const rsA = assignRS(graph, centerInfo[0].centerId)
    const rsB = assignRS(graph, centerInfo[1].centerId)
    if (!rsA || !rsB) return null
    return mesoVerdict(groupsA, groupsB, rsA, rsB)
  }, [mode, groupsA, groupsB, graph, centerInfo])

  const fischerSingle = useMemo(
    () => (mode === 'one-carbon' && centerInfo[0] ? fischerLayoutForCenter(graph, centerInfo[0]) : null),
    [mode, graph, centerInfo]
  )
  const fischerLadder = useMemo(
    () => (mode === 'two-carbon' && centerInfo[0] && centerInfo[1] ? fischerLadderLayout(graph, centerInfo[0], centerInfo[1]) : null),
    [mode, graph, centerInfo]
  )

  // The ROTATED drawing — what's actually rendered in the Fischer panel and what the direct-read/flip
  // status message below describes. `fischerSingle`/`fischerLadder` themselves stay the canonical,
  // always-true-to-the-real-configuration versions other features (CIP arrow, 3D snap) rely on.
  // 1-carbon: `rotateFischerCross` simulates physically rotating the whole page (all 4 positions free).
  // 2-carbon: `rotateLadderCross` instead spins only each carbon's 3 peripheral substituents around its
  // own fixed backbone slot — rotating the WHOLE ladder page isn't physically meaningful for a connected
  // chain (see `rotateLadderCross`'s doc comment), so this is a deliberately different operation.
  const rotatedSingle = useMemo(() => (fischerSingle ? rotateFischerCross(fischerSingle, fischerRotation) : null), [fischerSingle, fischerRotation])
  const rotatedLadder = useMemo(
    () =>
      fischerLadder
        ? {
            crossA: rotateLadderCross(fischerLadder.crossA, fischerLadder.topIsA ? 'bottom' : 'top', ladderRotationStep),
            crossB: rotateLadderCross(fischerLadder.crossB, fischerLadder.topIsA ? 'top' : 'bottom', ladderRotationStep),
            topIsA: fischerLadder.topIsA,
          }
        : null,
    [fischerLadder, ladderRotationStep]
  )

  // True configuration is just `apparentRSForCross` of the UNROTATED cross (guaranteed correct by
  // construction); comparing it to the ROTATED cross's apparent reading is exactly the "does this
  // rotation angle still read correctly" check the rotate-Fischer-drawing feature exists to teach.
  const rotationReadStatus: { trueRS: 'R' | 'S'; apparentRS: 'R' | 'S'; matches: boolean }[] = []
  if (mode === 'one-carbon' && fischerSingle && rotatedSingle) {
    rotationReadStatus.push({ trueRS: apparentRSForCross(fischerSingle), apparentRS: apparentRSForCross(rotatedSingle), matches: apparentRSForCross(fischerSingle) === apparentRSForCross(rotatedSingle) })
  } else if (mode === 'two-carbon' && fischerLadder && rotatedLadder) {
    rotationReadStatus.push({ trueRS: apparentRSForCross(fischerLadder.crossA), apparentRS: apparentRSForCross(rotatedLadder.crossA), matches: apparentRSForCross(fischerLadder.crossA) === apparentRSForCross(rotatedLadder.crossA) })
    rotationReadStatus.push({ trueRS: apparentRSForCross(fischerLadder.crossB), apparentRS: apparentRSForCross(rotatedLadder.crossB), matches: apparentRSForCross(fischerLadder.crossB) === apparentRSForCross(rotatedLadder.crossB) })
  }

  // Real IUPAC locants for carbon A/B (not the arbitrary internal 0/1 index) — used by "Show numbering".
  const locantA = centerInfo[0] ? (result.chainAtomIds?.indexOf(centerInfo[0].centerId) ?? -1) + 1 || null : null
  const locantB = centerInfo[1] ? (result.chainAtomIds?.indexOf(centerInfo[1].centerId) ?? -1) + 1 || null : null

  const axisRanksA = useMemo(() => axisCenterRanks(centerInfo[0], 3), [centerInfo])
  const axisRanksB = useMemo(() => axisCenterRanks(centerInfo[1], 3), [centerInfo])

  const newman = useMemo(() => {
    if (mode !== 'two-carbon') return null
    return newmanLayoutFor(
      groupsA.map((g) => g ?? 'H'),
      groupsB.map((g) => g ?? 'H'),
      dihedralDeg,
      { frontRanks: axisRanksA.slotRanks, backRanks: axisRanksB.slotRanks, frontAxisRank: axisRanksA.axisRank, backAxisRank: axisRanksB.axisRank }
    )
  }, [mode, groupsA, groupsB, dihedralDeg, axisRanksA, axisRanksB])

  const sawhorse = useMemo(() => {
    if (mode !== 'two-carbon') return null
    return sawhorseLayoutFor(
      groupsA.map((g) => g ?? 'H'),
      groupsB.map((g) => g ?? 'H'),
      dihedralDeg,
      { frontRanks: axisRanksA.slotRanks, backRanks: axisRanksB.slotRanks, frontAxisRank: axisRanksA.axisRank, backAxisRank: axisRanksB.axisRank }
    )
  }, [mode, groupsA, groupsB, dihedralDeg, axisRanksA, axisRanksB])

  function switchMode(next: Mode) {
    setMode(next)
    setSelectedSlot(null)
    setFischerView('off')
    setCipView('off')
    setFischerRotation(0)
    setLadderRotationStep(0)
  }

  function handleSlotClick(center: number, slot: number) {
    const clicked: SelectedSlot = { center: center as 0 | 1, slot }
    if (selectedSlot === null) {
      setSelectedSlot(clicked)
      return
    }
    if (selectedSlot.center !== clicked.center) {
      setSelectedSlot(clicked) // swapping only makes sense within the same stereocenter
      return
    }
    if (selectedSlot.slot === clicked.slot) {
      setSelectedSlot(null)
      return
    }
    if (mode === 'one-carbon') {
      setGroupsOne((g) => {
        const next = [...g] as Groups4
        ;[next[selectedSlot.slot], next[clicked.slot]] = [next[clicked.slot], next[selectedSlot.slot]]
        return next
      })
    } else if (clicked.center === 0) {
      setGroupsA((g) => {
        const next = [...g] as Groups3
        ;[next[selectedSlot.slot], next[clicked.slot]] = [next[clicked.slot], next[selectedSlot.slot]]
        return next
      })
    } else {
      setGroupsB((g) => {
        const next = [...g] as Groups3
        ;[next[selectedSlot.slot], next[clicked.slot]] = [next[clicked.slot], next[selectedSlot.slot]]
        return next
      })
    }
    setSelectedSlot(null)
  }

  function handlePaletteClick(kind: SubstituentKind) {
    if (selectedSlot === null) return
    if (mode === 'one-carbon') {
      setGroupsOne((g) => {
        const next = [...g] as Groups4
        next[selectedSlot.slot] = kind
        return next
      })
    } else if (selectedSlot.center === 0) {
      setGroupsA((g) => {
        const next = [...g] as Groups3
        next[selectedSlot.slot] = kind
        return next
      })
    } else {
      setGroupsB((g) => {
        const next = [...g] as Groups3
        next[selectedSlot.slot] = kind
        return next
      })
    }
    setSelectedSlot(null)
  }

  const centers: Center3D[] = []
  const bonds: InterCenterBond[] = []
  let moleculeQuaternion: THREE.Quaternion | null = null
  // A fixed 2D corner legend (not 3D-anchored text) listing which REAL substituent groups are
  // currently horizontal vs vertical in the active Fischer-match snap — the backbone-holding position
  // is skipped (it's not a free substituent, see `rotateLadderCross`), so only ever 2-3 names appear
  // per axis. Anchored to screen space rather than to the bond tip in 3D so it can never overlap a
  // group's own label or clip at the panel edge regardless of viewing angle.
  function legendFor(cross: NonNullable<typeof fischerSingle>): { horizontal: string[]; vertical: string[] } {
    const vertical = (['top', 'bottom'] as FischerPos[]).filter((p) => cross[p].slotIndex !== null).map((p) => cross[p].label || 'H')
    const horizontal = (['left', 'right'] as FischerPos[]).filter((p) => cross[p].slotIndex !== null).map((p) => cross[p].label || 'H')
    return { horizontal, vertical }
  }
  let axisLegend: { horizontal: string[]; vertical: string[] } | null = null
  if (mode === 'one-carbon') {
    const directions = symmetricTetrahedralDirections()
    const ranked = centerInfo[0]?.ranked ?? []
    const rankBySlot: Record<number, 1 | 2 | 3 | 4> = {}
    ranked.forEach((r, idx) => { if (r.slotIndex !== null) rankBySlot[r.slotIndex] = (idx + 1) as 1 | 2 | 3 | 4 })
    const cipRankDirs = ranked.length === 4 ? (ranked.map((r) => dirForRankEntry(r, directions, directions[0])) as [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3]) : undefined
    centers.push({
      position: new THREE.Vector3(0, 0, 0),
      label: 'C',
      slots: directions.map((direction, i) => ({ direction, label: groupsOne[i] ?? '', selected: selectedSlot?.center === 0 && selectedSlot.slot === i, rank: rankBySlot[i] })),
      cipRankDirs,
      numberLabel: numberingOn ? `C${locantA ?? 1}` : undefined,
    })
    if (fischerView === 'A' && fischerSingle) {
      moleculeQuaternion = fischerSnapQuaternion(fischerSingle, (slotIndex) => (slotIndex !== null ? directions[slotIndex] : undefined))
      axisLegend = legendFor(fischerSingle)
    } else if (cipView === 'A' && cipRankDirs) {
      moleculeQuaternion = new THREE.Quaternion().setFromUnitVectors(cipRankDirs[3].clone().normalize(), new THREE.Vector3(0, 0, -1))
    }
  } else {
    const bondAxis = new THREE.Vector3(1, 0, 0)
    const posA = new THREE.Vector3(0, 0, 0)
    const posB = bondAxis.clone().multiplyScalar(BOND_VISUAL_LENGTH)
    bonds.push({ from: posA, to: posB })
    const dirsA = tripodDirections(bondAxis, 0)
    const dirsB = tripodDirections(bondAxis.clone().negate(), (dihedralDeg * Math.PI) / 180)
    const rankedA = centerInfo[0]?.ranked ?? []
    const rankedB = centerInfo[1]?.ranked ?? []
    const rankBySlotA: Record<number, 1 | 2 | 3 | 4> = {}
    rankedA.forEach((r, idx) => { if (r.slotIndex !== null) rankBySlotA[r.slotIndex] = (idx + 1) as 1 | 2 | 3 | 4 })
    const rankBySlotB: Record<number, 1 | 2 | 3 | 4> = {}
    rankedB.forEach((r, idx) => { if (r.slotIndex !== null) rankBySlotB[r.slotIndex] = (idx + 1) as 1 | 2 | 3 | 4 })
    const cipRankDirsA = rankedA.length === 4 ? (rankedA.map((r) => dirForRankEntry(r, dirsA, bondAxis)) as [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3]) : undefined
    const cipRankDirsB = rankedB.length === 4 ? (rankedB.map((r) => dirForRankEntry(r, dirsB, bondAxis.clone().negate())) as [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3]) : undefined
    centers.push({
      position: posA,
      label: 'C',
      slots: dirsA.map((direction, i) => ({ direction, label: groupsA[i] ?? '', selected: selectedSlot?.center === 0 && selectedSlot.slot === i, rank: rankBySlotA[i] })),
      cipRankDirs: cipRankDirsA,
      numberLabel: numberingOn ? `C${locantA ?? 1}` : undefined,
    })
    centers.push({
      position: posB,
      label: 'C',
      slots: dirsB.map((direction, i) => ({ direction, label: groupsB[i] ?? '', selected: selectedSlot?.center === 1 && selectedSlot.slot === i, rank: rankBySlotB[i] })),
      cipRankDirs: cipRankDirsB,
      numberLabel: numberingOn ? `C${locantB ?? 2}` : undefined,
    })
    if (fischerView === 'A' && fischerLadder) {
      moleculeQuaternion = fischerSnapQuaternion(fischerLadder.crossA, (slotIndex) => (slotIndex === null ? bondAxis : dirsA[slotIndex]))
      axisLegend = legendFor(fischerLadder.crossA)
    } else if (fischerView === 'B' && fischerLadder) {
      moleculeQuaternion = fischerSnapQuaternion(fischerLadder.crossB, (slotIndex) => (slotIndex === null ? bondAxis.clone().negate() : dirsB[slotIndex]))
      axisLegend = legendFor(fischerLadder.crossB)
    } else if (cipView === 'A' && cipRankDirsA) {
      moleculeQuaternion = new THREE.Quaternion().setFromUnitVectors(cipRankDirsA[3].clone().normalize(), new THREE.Vector3(0, 0, -1))
    } else if (cipView === 'B' && cipRankDirsB) {
      moleculeQuaternion = new THREE.Quaternion().setFromUnitVectors(cipRankDirsB[3].clone().normalize(), new THREE.Vector3(0, 0, -1))
    }
  }
  const highlightBackbone = highlightOn && mode === 'two-carbon'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#08020d', color: '#f8fafc', fontFamily: 'system-ui,sans-serif', overflow: 'hidden' }}>
      <div style={{ height: 46, background: 'rgba(26,31,47,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', flexShrink: 0 }}>
        <Link href="/labs" style={{ color: '#849495', textDecoration: 'none', fontSize: 13 }}>← Labs</Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <strong style={{ fontSize: 14 }}>Organic Projection Formula — wedge-dash, Fischer, sawhorse &amp; Newman, side by side</strong>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setSugarMode((v) => !v)}
          style={{
            padding: '6px 12px',
            borderRadius: 7,
            border: `1px solid ${sugarMode ? '#22c55e80' : 'rgba(255,255,255,0.15)'}`,
            background: sugarMode ? '#22c55e20' : 'rgba(255,255,255,0.04)',
            color: sugarMode ? '#22c55e' : '#cbd5e1',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {sugarMode ? '✕ Exit carbohydrates' : 'Carbohydrates: D/L sugar Fischer'}
        </button>
        <button
          onClick={() => setQuizMode((v) => !v)}
          style={{
            padding: '6px 12px',
            borderRadius: 7,
            border: `1px solid ${quizMode ? '#f9731680' : 'rgba(255,255,255,0.15)'}`,
            background: quizMode ? '#f9731620' : 'rgba(255,255,255,0.04)',
            color: quizMode ? '#f97316' : '#cbd5e1',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {quizMode ? '✕ Exit practice' : 'Practice: match wedge-dash ↔ Fischer'}
        </button>
      </div>

      {sugarMode ? (
        <CarbohydrateFischer />
      ) : quizMode ? (
        <PracticeQuiz />
      ) : (
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', overflowY: 'auto', padding: 12 }}>
          <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Carbon centers</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <ModeButton active={mode === 'one-carbon'} onClick={() => switchMode('one-carbon')}>1 carbon</ModeButton>
            <ModeButton active={mode === 'two-carbon'} onClick={() => switchMode('two-carbon')}>2 carbons</ModeButton>
          </div>

          {mode === 'two-carbon' && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                Dihedral (rotate around C–C)
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                step={5}
                value={dihedralDeg}
                onChange={(e) => setDihedralDeg(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>{dihedralDeg}°</div>
              <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginTop: 4 }}>
                Changes conformation (sawhorse/Newman) only — R/S never changes from this.
              </div>
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              View 3D as Fischer
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <ModeButton active={fischerView === 'off'} onClick={() => { setFischerView('off'); setCipView('off') }}>Free rotate</ModeButton>
              {mode === 'one-carbon' ? (
                <ModeButton active={fischerView === 'A'} onClick={() => { setFischerView('A'); setCipView('off') }}>Show Fischer angle</ModeButton>
              ) : (
                <>
                  <ModeButton active={fischerView === 'A'} onClick={() => { setFischerView('A'); setCipView('off') }}>Match A</ModeButton>
                  <ModeButton active={fischerView === 'B'} onClick={() => { setFischerView('B'); setCipView('off') }}>Match B</ModeButton>
                </>
              )}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginTop: 4 }}>
              {mode === 'one-carbon'
                ? 'Rotates the 3D model to the exact pose its Fischer cross represents and LOCKS the camera there. Click "Free rotate" to unlock.'
                : "Only ONE carbon's Fischer angle can be matched at a time — the shared C–C bond points opposite ways from each end, so both centers can't be \"vertical = away\" in a single rigid view at once. That's a real limit of Fischer's flat convention, not a bug. While matched, the camera locks; click \"Free rotate\" to unlock."}
            </div>
            {axisLegend && (
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  fontSize: 11,
                  lineHeight: 1.6,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div>
                  <strong style={{ color: '#fbbf24' }}>HORIZONTAL</strong> <span style={{ color: '#64748b' }}>(toward you):</span>{' '}
                  <span style={{ color: '#e2e8f0' }}>{axisLegend.horizontal.join(', ') || '—'}</span>
                </div>
                <div>
                  <strong style={{ color: '#60a5fa' }}>VERTICAL</strong> <span style={{ color: '#64748b' }}>(away):</span>{' '}
                  <span style={{ color: '#e2e8f0' }}>{axisLegend.vertical.join(', ') || '—'}</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Show CIP ranking
            </div>
            <ModeButton active={showCip} onClick={() => setShowCip((v) => !v)}>
              {showCip ? 'Hide rank 1→2→3 arrow' : 'Show rank 1→2→3 arrow'}
            </ModeButton>
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginTop: 4, marginBottom: 8 }}>
              Colors each group by CIP priority (red=1, orange=2, yellow=3, gray=4 — lowest) and draws the
              rank1→rank2→rank3 sweep. In the 3D panel, view from the side opposite rank 4 to read it. In the
              Fischer cross, it only reads directly if rank 4 sits on a vertical bond — horizontal means flip.
            </div>
            {showCip && (
              <>
                <div style={{ display: 'flex', gap: 6 }}>
                  {mode === 'one-carbon' ? (
                    <ModeButton active={cipView === 'A'} onClick={() => { setCipView(cipView === 'A' ? 'off' : 'A'); setFischerView('off') }}>View from rank-4 side</ModeButton>
                  ) : (
                    <>
                      <ModeButton active={cipView === 'A'} onClick={() => { setCipView(cipView === 'A' ? 'off' : 'A'); setFischerView('off') }}>A's rank-4 side</ModeButton>
                      <ModeButton active={cipView === 'B'} onClick={() => { setCipView(cipView === 'B' ? 'off' : 'B'); setFischerView('off') }}>B's rank-4 side</ModeButton>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginTop: 4 }}>
                  Rotates the 3D model so rank 4 points straight away from you — the real CIP viewing angle.
                  Trace the purple arrow's sweep (rank 1→2→3) and compare it to the R/S printed below: that
                  sweep direction is exactly what the descriptor encodes, from this exact angle.
                </div>
              </>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              Rotate Fischer drawing
            </div>
            {mode === 'one-carbon' ? (
              <>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {([0, 90, 180, 270] as FischerRotationDeg[]).map((deg) => (
                    <ModeButton key={deg} active={fischerRotation === deg} onClick={() => setFischerRotation(deg)}>{deg}°</ModeButton>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginTop: 4 }}>
                  Spins the DRAWING itself (like turning the paper) — the molecule never moves. Reading the
                  fixed "horizontal=toward, vertical=away" rule off a 90°/270°-rotated drawing gives the WRONG
                  letter; 180° (or back to 0°) still reads correctly.
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {([0, 1, 2] as LadderRotationStep[]).map((step) => (
                    <ModeButton key={step} active={ladderRotationStep === step} onClick={() => setLadderRotationStep(step)}>{step * 120}°</ModeButton>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.5, marginTop: 4 }}>
                  Rotating the WHOLE ladder page isn't physically meaningful here — the C–C bond can't go
                  horizontal independently of the chain (it's a real bond to the next carbon, not a free
                  substituent). So this instead spins each carbon's 3 OTHER groups around its fixed backbone
                  slot, 120° at a time. That's always an even permutation, so unlike the 1-carbon case, it can
                  NEVER produce a misread — try it and watch the configuration stay correct every time.
                </div>
              </>
            )}
            {((mode === 'one-carbon' && fischerRotation !== 0) || (mode === 'two-carbon' && ladderRotationStep !== 0)) && rotationReadStatus.length > 0 && (
              <div
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 6,
                  fontSize: 11,
                  lineHeight: 1.5,
                  background: rotationReadStatus[0].matches ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.14)',
                  border: `1px solid ${rotationReadStatus[0].matches ? '#22c55e' : '#ef4444'}`,
                  color: rotationReadStatus[0].matches ? '#86efac' : '#fca5a5',
                }}
              >
                {rotationReadStatus.length === 1
                  ? rotationReadStatus[0].matches
                    ? `Reading this rotated drawing directly still gives ${rotationReadStatus[0].apparentRS} — matches the true configuration. 180° rotation always reads correctly.`
                    : `Reading this rotated drawing directly gives ${rotationReadStatus[0].apparentRS} — but the TRUE configuration is still ${rotationReadStatus[0].trueRS}. The molecule hasn't moved; only the paper has. 90°/270° rotation always misreads.`
                  : rotationReadStatus.map((s, i) => (
                      <div key={i}>
                        {i === 0 ? 'A' : 'B'}: reads {s.apparentRS} — still correct (spinning substituents around the fixed backbone never misreads).
                      </div>
                    ))}
              </div>
            )}
          </div>

          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
            {selectedSlot === null
              ? 'Click an empty (or filled) bond end in the 3D view, then pick a group below — or click two filled ends on the SAME carbon to swap them.'
              : 'Pick a group to assign to the selected bond, or click another bond end on the same carbon to swap them.'}
          </div>
          {PALETTE_GROUPS.map((g) => (
            <div key={g.label} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 9, color: '#f97316', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{g.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {g.items.map((item) => (
                  <button
                    key={item.kind}
                    onClick={() => handlePaletteClick(item.kind)}
                    disabled={selectedSlot === null}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 7,
                      border: `1px solid ${item.color}50`,
                      background: `${item.color}18`,
                      color: item.color,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: selectedSlot === null ? 'default' : 'pointer',
                      opacity: selectedSlot === null ? 0.4 : 1,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', flex: 1, overflow: 'hidden' }}>
            <Panel title={fischerView !== 'off' ? '3D wedge-dash (locked)' : '3D wedge-dash (drag to rotate)'}>
              <Scene3D
                centers={centers}
                bonds={bonds}
                onSlotClick={handleSlotClick}
                moleculeQuaternion={moleculeQuaternion}
                resetToken={`${fischerView}|${cipView}`}
                showCip={showCip}
                highlightBackbone={highlightBackbone}
                enableOrbit={fischerView === 'off'}
              />
            </Panel>
            <Panel title="Fischer projection">
              <FischerSvg
                single={rotatedSingle}
                ladder={rotatedLadder}
                selectedSlot={selectedSlot}
                onEntryClick={handleSlotClick}
                showCip={showCip}
                numberingOn={numberingOn}
                locantA={locantA}
                locantB={locantB}
              />
            </Panel>
            <Panel title="Sawhorse projection">
              <SawhorseSvg layout={sawhorse} showCip={showCip} />
            </Panel>
            <Panel title="Newman projection">
              <NewmanSvg layout={newman} showCip={showCip} />
            </Panel>
          </div>

          {mesoInfo && mesoInfo.kind !== 'not-applicable' && (
            <div
              style={{
                margin: '0 16px',
                marginTop: 8,
                padding: 10,
                borderRadius: 8,
                fontSize: 12,
                lineHeight: 1.5,
                background: mesoInfo.kind === 'meso' ? 'rgba(168,85,247,0.12)' : 'rgba(59,130,246,0.1)',
                border: `1px solid ${mesoInfo.kind === 'meso' ? '#a855f7' : '#3b82f6'}`,
                color: mesoInfo.kind === 'meso' ? '#d8b4fe' : '#93c5fd',
              }}
            >
              {mesoInfo.kind === 'meso' ? (
                <>
                  <strong>Meso compound — the "meso trap":</strong> both carbons carry the SAME substituents, and this
                  is the (R,S)/(S,R) combination — an internal mirror plane makes this ONE achiral molecule, not 2
                  enantiomers, even though both carbons are real stereocenters. Try swapping a group on either carbon
                  to see it become a genuine chiral pair below.
                </>
              ) : (
                <>
                  <strong>Chiral pair (R,R)/(S,S):</strong> both carbons carry the same substituents, but this combination
                  has NO internal mirror symmetry — its mirror image (swap to the opposite R,R↔S,S combination) is a
                  genuinely different, non-superimposable molecule: a real enantiomer, unlike the meso case above.
                </>
              )}
            </div>
          )}

          <NamingPanel
            result={result}
            highlightOn={highlightOn}
            numberingOn={numberingOn}
            onToggleHighlight={() => setHighlightOn((v) => !v)}
            onToggleNumbering={() => setNumberingOn((v) => !v)}
            practiceMode={practiceMode}
            onTogglePracticeMode={() => setPracticeMode((v) => !v)}
            compact
          />
        </div>
      </div>
      )}
    </div>
  )
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '7px 8px',
        borderRadius: 7,
        border: `1px solid ${active ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
        background: active ? '#f9731620' : 'rgba(255,255,255,0.03)',
        color: active ? '#f97316' : '#94a3b8',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRight: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 8, left: 10, zIndex: 1, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', pointerEvents: 'none' }}>
        {title}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  )
}
