'use client'
import { useState } from 'react'
import * as THREE from 'three'
import { StatsMap, recordAnswer, aggregateAccuracy, weightedPick, weakestEntries } from '@/lib/projection/quizStats'
import { SubstituentKind } from '@/lib/nomenclature/editOps'
import { toMoleculeGraph } from '@/lib/projection/toMoleculeGraph'
import { fischerLayoutForCenter, rotateFischerCross, swapFischerPositions, FischerCross } from '@/lib/projection/fischerLayout'
import { symmetricTetrahedralDirections } from '@/lib/projection/geometry'
import { newmanLayoutFor, NewmanLayout } from '@/lib/projection/newmanLayout'
import { sawhorseLayoutFor, SawhorseLayout } from '@/lib/projection/sawhorseLayout'
import { AssignedGroup } from '@/lib/projection/state'
import { higherPriorityGroup, CIP_RANK_PAIRS, ROTATION_STATEMENTS } from '@/lib/projection/quizContent'
import Scene3D, { Center3D } from './Scene3D'
import FischerSvg from './FischerSvg'
import NewmanSvg from './NewmanSvg'
import SawhorseSvg from './SawhorseSvg'

type Groups4 = [AssignedGroup, AssignedGroup, AssignedGroup, AssignedGroup]
type Groups3 = [AssignedGroup, AssignedGroup, AssignedGroup]
type Direction = 'wedgeToFischer' | 'fischerToWedge'
type ConformerDirection = 'sawhorseToNewman' | 'newmanToSawhorse'

const POOL: SubstituentKind[] = ['F', 'Cl', 'Br', 'I', 'OH', 'NH2', 'CH3', 'C2H5']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function randomGroups4(): Groups4 {
  return shuffle(POOL).slice(0, 4) as Groups4
}

function randomGroups3(): Groups3 {
  return shuffle(POOL).slice(0, 3) as Groups3
}

// Dihedral angles whose mirror (-d) and one-staggered-position-over (+120) distractors are
// guaranteed distinct from each other and from the true angle itself (120 and 300 excluded: for
// those, -d and d+120 land on the exact same angle mod 360, which would silently make two of the 3
// Newman options visually identical — verified by direct calculation, not just inspection).
const DIHEDRAL_CHOICES = [30, 60, 90, 150, 210, 240, 270, 330]

function swapGroups(groups: Groups4, i: number, j: number): Groups4 {
  const next = [...groups] as Groups4
  ;[next[i], next[j]] = [next[j], next[i]]
  return next
}

interface VisualMatchQuestion {
  kind: 'visual-match'
  groups: Groups4
  direction: Direction
  promptCross: FischerCross
  fischerOptions?: FischerCross[]
  groupsOptions?: Groups4[]
  correctIndex: number
  /** One explanation per option, same order/indexing as `fischerOptions`/`groupsOptions` — written at
   * generation time (where we already know exactly which candidate is the true match vs. which kind
   * of distractor it is), not re-derived at render time. */
  optionExplanations: string[]
}

interface CipRankQuestion {
  kind: 'cip-rank'
  a: SubstituentKind
  b: SubstituentKind
  winner: SubstituentKind
  explanation: string
}

interface RotationConceptQuestion {
  kind: 'rotation-concept'
  statement: string
  isTrue: boolean
  explanation: string
}

interface NewmanMatchQuestion {
  kind: 'newman-match'
  direction: ConformerDirection
  labelsA: string[]
  labelsB: string[]
  trueDihedral: number
  promptSawhorse?: SawhorseLayout
  promptNewman?: NewmanLayout
  sawhorseOptions?: SawhorseLayout[]
  newmanOptions?: NewmanLayout[]
  correctIndex: number
  /** One explanation per option, same indexing as `newmanOptions`/`sawhorseOptions`. */
  optionExplanations: string[]
}

type Question = VisualMatchQuestion | CipRankQuestion | RotationConceptQuestion | NewmanMatchQuestion

function generateVisualMatchQuestion(): VisualMatchQuestion {
  const groups = randomGroups4()
  const { graph, centerInfo } = toMoleculeGraph({ mode: 'one-carbon', groups })
  const cross = fischerLayoutForCenter(graph, centerInfo[0])!
  const direction: Direction = Math.random() < 0.5 ? 'wedgeToFischer' : 'fischerToWedge'

  if (direction === 'wedgeToFischer') {
    const candidates = [cross, rotateFischerCross(cross, 90), swapFischerPositions(cross, 'top', 'bottom')]
    const candidateExplanations = [
      'This is the real Fischer projection of the 3D structure — built directly from it, with horizontal bonds toward you and vertical bonds away.',
      'This is the SAME molecule\'s Fischer cross, just rotated 90° on the page. Rotating a Fischer cross by 90° (or 270°) flips the apparent R/S reading even though the molecule itself never moved — that\'s exactly the misread this option is testing for.',
      'This swaps the top and bottom groups compared to the real cross. Swapping any 2 groups on a stereocenter inverts its configuration, so this is the genuine mirror image (the enantiomer) — a different molecule from the one shown.',
    ]
    const order = shuffle([0, 1, 2])
    return {
      kind: 'visual-match',
      groups,
      direction,
      promptCross: cross,
      fischerOptions: order.map((i) => candidates[i]),
      correctIndex: order.indexOf(0),
      optionExplanations: order.map((i) => candidateExplanations[i]),
    }
  }
  const candidates: Groups4[] = [groups, swapGroups(groups, 0, 1), swapGroups(groups, 2, 3)]
  const candidateExplanations = [
    'This 3D structure has exactly the same 4 groups in exactly the same tetrahedral positions as the Fischer projection — the real match.',
    'This swaps 2 of the 4 groups compared to the real molecule. Swapping any 2 groups on a stereocenter always inverts its configuration, so this is the mirror image (enantiomer), not the molecule shown.',
    'This swaps a DIFFERENT pair of groups compared to the real molecule — still just one swap, so still the mirror image, just reached a different way.',
  ]
  const order = shuffle([0, 1, 2])
  return {
    kind: 'visual-match',
    groups,
    direction,
    promptCross: cross,
    groupsOptions: order.map((i) => candidates[i]),
    correctIndex: order.indexOf(0),
    optionExplanations: order.map((i) => candidateExplanations[i]),
  }
}

function generateCipRankQuestion(): CipRankQuestion {
  const pair = CIP_RANK_PAIRS[Math.floor(Math.random() * CIP_RANK_PAIRS.length)]
  const [a, b] = Math.random() < 0.5 ? [pair.a, pair.b] : [pair.b, pair.a]
  return { kind: 'cip-rank', a, b, winner: higherPriorityGroup(pair.a, pair.b), explanation: pair.explanation }
}

function generateRotationConceptQuestion(): RotationConceptQuestion {
  const s = ROTATION_STATEMENTS[Math.floor(Math.random() * ROTATION_STATEMENTS.length)]
  return { kind: 'rotation-concept', statement: s.statement, isTrue: s.isTrue, explanation: s.explanation }
}

/** Distractors built from the SAME 2 conformational-reading mistakes regardless of which direction
 * the question runs: reading the dihedral sweep backwards (mirrored, -d) and landing one staggered
 * position over (+120°) — both real misreads of a conformer drawing, not arbitrary noise. */
function generateNewmanMatchQuestion(): NewmanMatchQuestion {
  const groupsA = randomGroups3()
  const groupsB = randomGroups3()
  const labelsA = groupsA.map((g) => g ?? 'H')
  const labelsB = groupsB.map((g) => g ?? 'H')
  const trueDihedral = DIHEDRAL_CHOICES[Math.floor(Math.random() * DIHEDRAL_CHOICES.length)]
  const candidates = [trueDihedral, -trueDihedral, trueDihedral + 120]
  const candidateExplanations = [
    `This is the real conformation — the back carbon's groups are rotated exactly ${trueDihedral}° from the front carbon's, matching the structure shown.`,
    `This reads the rotation BACKWARDS: it shows ${-trueDihedral}° instead of the true +${trueDihedral}°. Same staggered/eclipsed pattern at a glance, but the back carbon's groups are swept around the wrong way.`,
    `This is shifted to the NEXT staggered position over: ${trueDihedral + 120}° instead of the true ${trueDihedral}°. A common misread — it looks similar, but it's a different conformation entirely.`,
  ]
  const order = shuffle([0, 1, 2])
  const direction: ConformerDirection = Math.random() < 0.5 ? 'sawhorseToNewman' : 'newmanToSawhorse'

  if (direction === 'sawhorseToNewman') {
    return {
      kind: 'newman-match',
      direction,
      labelsA,
      labelsB,
      trueDihedral,
      promptSawhorse: sawhorseLayoutFor(labelsA, labelsB, trueDihedral),
      newmanOptions: order.map((i) => newmanLayoutFor(labelsA, labelsB, candidates[i])),
      correctIndex: order.indexOf(0),
      optionExplanations: order.map((i) => candidateExplanations[i]),
    }
  }
  return {
    kind: 'newman-match',
    direction,
    labelsA,
    labelsB,
    trueDihedral,
    promptNewman: newmanLayoutFor(labelsA, labelsB, trueDihedral),
    sawhorseOptions: order.map((i) => sawhorseLayoutFor(labelsA, labelsB, candidates[i])),
    correctIndex: order.indexOf(0),
    optionExplanations: order.map((i) => candidateExplanations[i]),
  }
}

const KIND_LIST = ['visual-match', 'cip-rank', 'rotation-concept', 'newman-match'] as const
const KIND_BASE_WEIGHT: Record<Question['kind'], number> = { 'visual-match': 0.4, 'cip-rank': 0.2, 'rotation-concept': 0.2, 'newman-match': 0.2 }

function generateQuestionOfKind(kind: Question['kind']): Question {
  if (kind === 'visual-match') return generateVisualMatchQuestion()
  if (kind === 'cip-rank') return generateCipRankQuestion()
  if (kind === 'rotation-concept') return generateRotationConceptQuestion()
  return generateNewmanMatchQuestion()
}

/** `stats`, when given, biases which question KIND comes next toward whatever the student is
 * weakest at overall (see quizStats.weightedPick) — the actual "spaced repetition" behavior. Falls
 * back to the plain base-rate distribution with no stats (first-ever session, or stats disabled). */
export function generateQuestion(stats?: StatsMap): Question {
  if (!stats) {
    const roll = Math.random()
    if (roll < 0.4) return generateVisualMatchQuestion()
    if (roll < 0.6) return generateCipRankQuestion()
    if (roll < 0.8) return generateRotationConceptQuestion()
    return generateNewmanMatchQuestion()
  }
  const kind = weightedPick(KIND_LIST, KIND_BASE_WEIGHT, (k) => aggregateAccuracy(stats, k))
  return generateQuestionOfKind(kind)
}

/** Stable per-question-instance tracking key. `cip-rank`/`rotation-concept` are drawn from small
 * fixed banks, so they're keyed down to the specific item (sorted a/b so the random presentation-order
 * swap doesn't split one pair's stats into two keys); `visual-match`/`newman-match` are procedurally
 * generated each time, so they're tracked at the direction level instead — the finest grain that's
 * still a stable, repeatable category. */
export function categoryKeyFor(q: Question): string {
  if (q.kind === 'visual-match') return `visual-match:${q.direction}`
  if (q.kind === 'cip-rank') return `cip-rank:${[q.a, q.b].sort().join('-')}`
  if (q.kind === 'rotation-concept') return `rotation-concept:${q.statement}`
  return `newman-match:${q.direction}`
}

function centerFromGroups(groups: Groups4): Center3D {
  const directions = symmetricTetrahedralDirections()
  return {
    position: new THREE.Vector3(0, 0, 0),
    label: 'C',
    slots: directions.map((direction, i) => ({ direction, label: groups[i] ?? '', selected: false })),
  }
}

const noop = () => {}

function OptionFrame({
  selected,
  isCorrect,
  answered,
  onClick,
  children,
}: {
  selected: boolean
  isCorrect: boolean
  answered: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const showCorrect = answered && isCorrect
  const showWrong = answered && selected && !isCorrect
  const border = showCorrect ? '#22c55e' : showWrong ? '#ef4444' : selected ? '#f97316' : 'rgba(255,255,255,0.12)'
  const bg = showCorrect ? 'rgba(34,197,94,0.08)' : showWrong ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)'
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        height: 220,
        border: `2px solid ${border}`,
        background: bg,
        borderRadius: 10,
        cursor: answered ? 'default' : 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
      {showCorrect && <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 18, color: '#22c55e' }}>✓</div>}
      {showWrong && <div style={{ position: 'absolute', top: 6, right: 8, fontSize: 18, color: '#ef4444' }}>✗</div>}
    </div>
  )
}

function ChoiceButton({
  label,
  selected,
  isCorrect,
  answered,
  onClick,
}: {
  label: string
  selected: boolean
  isCorrect: boolean
  answered: boolean
  onClick: () => void
}) {
  const showCorrect = answered && isCorrect
  const showWrong = answered && selected && !isCorrect
  const border = showCorrect ? '#22c55e' : showWrong ? '#ef4444' : selected ? '#f97316' : 'rgba(255,255,255,0.15)'
  const bg = showCorrect ? 'rgba(34,197,94,0.1)' : showWrong ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)'
  return (
    <button
      onClick={onClick}
      disabled={answered}
      style={{
        flex: 1,
        padding: '20px 16px',
        borderRadius: 10,
        border: `2px solid ${border}`,
        background: bg,
        color: '#f8fafc',
        fontSize: 16,
        fontWeight: 700,
        cursor: answered ? 'default' : 'pointer',
      }}
    >
      {label} {showCorrect && '✓'} {showWrong && '✗'}
    </button>
  )
}

/** Shared "why" block for the 2 option-grid question types (visual-match, newman-match): always
 * shows why the correct option is correct; ALSO shows why the student's own pick was wrong, when it
 * was, so a wrong answer teaches the specific misread it represents rather than just "nope, try
 * again." */
function AnswerExplanations({ explanations, selectedIndex, correctIndex }: { explanations: string[]; selectedIndex: number; correctIndex: number }) {
  return (
    <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {selectedIndex !== correctIndex && (
        <div style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.6 }}>
          <strong style={{ color: '#ef4444' }}>✗ Why your pick was wrong: </strong>
          {explanations[selectedIndex]}
        </div>
      )}
      <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>
        <strong style={{ color: '#22c55e' }}>✓ Why the marked option is correct: </strong>
        {explanations[correctIndex]}
      </div>
    </div>
  )
}

function VisualMatchUI({
  question,
  selectedIndex,
  answered,
  onSelect,
}: {
  question: VisualMatchQuestion
  selectedIndex: number | null
  answered: boolean
  onSelect: (i: number) => void
}) {
  const promptIsWedge = question.direction === 'wedgeToFischer'
  return (
    <>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
        {promptIsWedge
          ? 'One option is a 90°-rotated drawing of the SAME molecule (a classic misread); one is a genuine mirror image. Only one is the real Fischer projection of the structure on the left.'
          : 'Two options are mirror images (swapped substituents) of the real molecule. Only one truly matches the Fischer projection on the left — drag to rotate and check.'}
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 220, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
          {promptIsWedge ? (
            <Scene3D centers={[centerFromGroups(question.groups)]} onSlotClick={noop} />
          ) : (
            <FischerSvg single={question.promptCross} selectedSlot={null} onEntryClick={noop} />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, color: '#64748b' }}>→</div>
        <div style={{ display: 'flex', gap: 10, flex: 2 }}>
          {promptIsWedge
            ? question.fischerOptions!.map((cross, i) => (
                <OptionFrame key={i} selected={selectedIndex === i} isCorrect={i === question.correctIndex} answered={answered} onClick={() => onSelect(i)}>
                  <FischerSvg single={cross} selectedSlot={null} onEntryClick={noop} />
                </OptionFrame>
              ))
            : question.groupsOptions!.map((groups, i) => (
                <OptionFrame key={i} selected={selectedIndex === i} isCorrect={i === question.correctIndex} answered={answered} onClick={() => onSelect(i)}>
                  <Scene3D centers={[centerFromGroups(groups)]} onSlotClick={noop} />
                </OptionFrame>
              ))}
        </div>
      </div>
      {answered && selectedIndex !== null && <AnswerExplanations explanations={question.optionExplanations} selectedIndex={selectedIndex} correctIndex={question.correctIndex} />}
    </>
  )
}

function CipRankUI({
  question,
  selectedIndex,
  answered,
  onSelect,
}: {
  question: CipRankQuestion
  selectedIndex: number | null
  answered: boolean
  onSelect: (i: number) => void
}) {
  const options = [question.a, question.b]
  const correctIndex = options.indexOf(question.winner)
  return (
    <>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
        Which substituent has the HIGHER CIP priority (ranks first toward an R/S assignment)?
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {options.map((label, i) => (
          <ChoiceButton key={i} label={label} selected={selectedIndex === i} isCorrect={i === correctIndex} answered={answered} onClick={() => onSelect(i)} />
        ))}
      </div>
      {answered && selectedIndex !== null && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedIndex !== correctIndex && (
            <div style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong style={{ color: '#ef4444' }}>✗ {options[selectedIndex]} is NOT correct: </strong>
              it ranks LOWER than {question.winner} — see the reasoning below.
            </div>
          )}
          <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>
            <strong style={{ color: '#22c55e' }}>✓ {question.winner} has the higher priority: </strong>
            {question.explanation}
          </div>
        </div>
      )}
    </>
  )
}

function RotationConceptUI({
  question,
  selectedIndex,
  answered,
  onSelect,
}: {
  question: RotationConceptQuestion
  selectedIndex: number | null
  answered: boolean
  onSelect: (i: number) => void
}) {
  const correctIndex = question.isTrue ? 0 : 1
  return (
    <>
      <div style={{ fontSize: 15, color: '#f8fafc', marginBottom: 16, lineHeight: 1.6, fontWeight: 600 }}>"{question.statement}"</div>
      <div style={{ display: 'flex', gap: 16 }}>
        <ChoiceButton label="True" selected={selectedIndex === 0} isCorrect={correctIndex === 0} answered={answered} onClick={() => onSelect(0)} />
        <ChoiceButton label="False" selected={selectedIndex === 1} isCorrect={correctIndex === 1} answered={answered} onClick={() => onSelect(1)} />
      </div>
      {answered && selectedIndex !== null && (
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selectedIndex !== correctIndex && (
            <div style={{ fontSize: 12, color: '#fca5a5', lineHeight: 1.6 }}>
              <strong style={{ color: '#ef4444' }}>✗ {selectedIndex === 0 ? 'True' : 'False'} is NOT correct: </strong>
              the statement is actually {question.isTrue ? 'TRUE' : 'FALSE'} — see the reasoning below.
            </div>
          )}
          <div style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>
            <strong style={{ color: '#22c55e' }}>✓ The statement is {question.isTrue ? 'TRUE' : 'FALSE'}: </strong>
            {question.explanation}
          </div>
        </div>
      )}
    </>
  )
}

function NewmanMatchUI({
  question,
  selectedIndex,
  answered,
  onSelect,
}: {
  question: NewmanMatchQuestion
  selectedIndex: number | null
  answered: boolean
  onSelect: (i: number) => void
}) {
  const promptIsSawhorse = question.direction === 'sawhorseToNewman'
  return (
    <>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
        One option reads the rotation backwards (mirrored); one is shifted to the next staggered position over. Same conformation, same dihedral angle — only one option truly matches.
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 220, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
          {promptIsSawhorse ? <SawhorseSvg layout={question.promptSawhorse!} /> : <NewmanSvg layout={question.promptNewman!} />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 22, color: '#64748b' }}>→</div>
        <div style={{ display: 'flex', gap: 10, flex: 2 }}>
          {promptIsSawhorse
            ? question.newmanOptions!.map((layout, i) => (
                <OptionFrame key={i} selected={selectedIndex === i} isCorrect={i === question.correctIndex} answered={answered} onClick={() => onSelect(i)}>
                  <NewmanSvg layout={layout} />
                </OptionFrame>
              ))
            : question.sawhorseOptions!.map((layout, i) => (
                <OptionFrame key={i} selected={selectedIndex === i} isCorrect={i === question.correctIndex} answered={answered} onClick={() => onSelect(i)}>
                  <SawhorseSvg layout={layout} />
                </OptionFrame>
              ))}
        </div>
      </div>
      {answered && selectedIndex !== null && <AnswerExplanations explanations={question.optionExplanations} selectedIndex={selectedIndex} correctIndex={question.correctIndex} />}
    </>
  )
}

const QUESTION_TITLE: Record<Question['kind'], string> = {
  'visual-match': '',
  'cip-rank': 'CIP priority check',
  'rotation-concept': 'True or false — R/S vs. optical rotation',
  'newman-match': '',
}

const STATS_STORAGE_KEY = 'projectionFormulaQuizStats'

function loadStats(): StatsMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STATS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StatsMap) : {}
  } catch {
    return {}
  }
}

function saveStats(stats: StatsMap) {
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // localStorage unavailable (private browsing, quota) — practice still works, just unweighted next session
  }
}

const KIND_DISPLAY_NAME: Record<Question['kind'], string> = {
  'visual-match': 'Wedge-dash ↔ Fischer',
  'cip-rank': 'CIP priority',
  'rotation-concept': 'R/S vs. rotation',
  'newman-match': 'Sawhorse ↔ Newman',
}

function WeakAreasPanel({ stats, onReset }: { stats: StatsMap; onReset: () => void }) {
  const weakest = weakestEntries(stats, 2, 5)
  return (
    <div style={{ marginBottom: 14, padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <strong style={{ fontSize: 12, color: '#cbd5e1' }}>Your progress by category</strong>
        <button onClick={onReset} style={{ fontSize: 10, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Reset progress
        </button>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: weakest.length > 0 ? 10 : 0 }}>
        {KIND_LIST.map((kind) => {
          const acc = aggregateAccuracy(stats, kind)
          return (
            <span key={kind} style={{ fontSize: 11, color: '#94a3b8' }}>
              {KIND_DISPLAY_NAME[kind]}: {acc === null ? 'not tried yet' : `${Math.round(acc * 100)}%`}
            </span>
          )
        })}
      </div>
      {weakest.length > 0 && (
        <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
          You'll see more of: {weakest.map((w) => `${w.key.split(':').slice(1).join(':')} (${Math.round(w.accuracy * 100)}%)`).join(' · ')}
        </div>
      )}
    </div>
  )
}

export default function PracticeQuiz() {
  const [stats, setStats] = useState<StatsMap>(() => loadStats())
  const [question, setQuestion] = useState<Question>(() => generateQuestion(stats))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [showProgress, setShowProgress] = useState(false)

  const answered = selectedIndex !== null

  function correctIndexFor(q: Question): number {
    if (q.kind === 'visual-match' || q.kind === 'newman-match') return q.correctIndex
    if (q.kind === 'cip-rank') return [q.a, q.b].indexOf(q.winner)
    return q.isTrue ? 0 : 1
  }

  function select(i: number) {
    if (answered) return
    setSelectedIndex(i)
    const wasCorrect = i === correctIndexFor(question)
    setScore((s) => ({ correct: s.correct + (wasCorrect ? 1 : 0), total: s.total + 1 }))
    setStats((prev) => {
      const next = recordAnswer(prev, categoryKeyFor(question), wasCorrect)
      saveStats(next)
      return next
    })
  }

  function next() {
    setQuestion(generateQuestion(stats))
    setSelectedIndex(null)
  }

  function resetProgress() {
    setStats({})
    saveStats({})
  }

  const title =
    question.kind === 'visual-match'
      ? question.direction === 'wedgeToFischer'
        ? 'Which Fischer projection matches this 3D structure?'
        : 'Which 3D structure matches this Fischer projection?'
      : question.kind === 'newman-match'
        ? question.direction === 'sawhorseToNewman'
          ? 'Which Newman projection matches this sawhorse projection?'
          : 'Which sawhorse projection matches this Newman projection?'
        : QUESTION_TITLE[question.kind]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 16, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
        <strong style={{ fontSize: 15 }}>{title}</strong>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <button onClick={() => setShowProgress((v) => !v)} style={{ fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {showProgress ? 'Hide progress' : 'Show progress'}
          </button>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Score: {score.correct}/{score.total}</span>
        </div>
      </div>

      {showProgress && <WeakAreasPanel stats={stats} onReset={resetProgress} />}

      {question.kind === 'visual-match' && <VisualMatchUI question={question} selectedIndex={selectedIndex} answered={answered} onSelect={select} />}
      {question.kind === 'cip-rank' && <CipRankUI question={question} selectedIndex={selectedIndex} answered={answered} onSelect={select} />}
      {question.kind === 'rotation-concept' && <RotationConceptUI question={question} selectedIndex={selectedIndex} answered={answered} onSelect={select} />}
      {question.kind === 'newman-match' && <NewmanMatchUI question={question} selectedIndex={selectedIndex} answered={answered} onSelect={select} />}

      {answered && (
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: selectedIndex === correctIndexFor(question) ? '#22c55e' : '#ef4444' }}>
            {selectedIndex === correctIndexFor(question) ? 'Correct!' : 'Not quite — see the explanation above.'}
          </span>
          <button
            onClick={next}
            style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid #f9731680', background: '#f9731620', color: '#f97316', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Next question
          </button>
        </div>
      )}
    </div>
  )
}
