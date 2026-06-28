import { SubstituentKind } from '@/lib/nomenclature/editOps'

export type ToolId =
  | 'chain'
  | 'bond-1'
  | 'bond-2'
  | 'bond-3'
  | 'wedge'
  | 'hash'
  | SubstituentKind
  | 'ring-benzene'
  | 'ring-cyclohexane'
  | 'ring-cyclopropane'
  | 'ring-cyclobutane'
  | 'ring-cyclopentane'
  | 'ring-spiro'
  | 'ring-fused'
  | 'erase'

export interface ToolGroup {
  label: string
  tools: { id: ToolId; label: string; hint: string }[]
}

export const TOOL_GROUPS: ToolGroup[] = [
  { label: 'Chain', tools: [{ id: 'chain', label: 'C', hint: 'Click an atom to add a carbon, or click empty space to start' }] },
  {
    label: 'Bonds',
    tools: [
      { id: 'bond-1', label: '—', hint: 'Click a bond to make it single' },
      { id: 'bond-2', label: '=', hint: 'Click a bond to make it double' },
      { id: 'bond-3', label: '≡', hint: 'Click a bond to make it triple' },
    ],
  },
  {
    label: 'Stereo (R/S, V15)',
    tools: [
      {
        id: 'wedge',
        label: '▲',
        hint:
          'Click a bond near the stereocenter end to mark that substituent as coming TOWARD you (wedge). ' +
          'Click the same spot again to clear it. Needed before this engine can assign an "R"/"S" label.',
      },
      {
        id: 'hash',
        label: '⋮',
        hint:
          'Click a bond near the stereocenter end to mark that substituent as going AWAY from you (hash). ' +
          'Click the same spot again to clear it.',
      },
    ],
  },
  {
    label: 'Halogens',
    tools: [
      { id: 'F', label: 'F', hint: 'Attach fluorine' },
      { id: 'Cl', label: 'Cl', hint: 'Attach chlorine' },
      { id: 'Br', label: 'Br', hint: 'Attach bromine' },
      { id: 'I', label: 'I', hint: 'Attach iodine' },
    ],
  },
  {
    label: 'Groups',
    tools: [
      { id: 'OH', label: 'OH', hint: 'Attach a hydroxyl group' },
      { id: 'NH2', label: 'NH2', hint: 'Attach an amino group' },
      { id: 'CH3', label: 'CH3', hint: 'Attach a methyl group' },
      { id: 'C2H5', label: 'C2H5', hint: 'Attach an ethyl group' },
    ],
  },
  {
    label: 'Carbonyl (V2)',
    tools: [
      {
        id: 'C=O',
        label: 'C=O',
        hint:
          'Attach a double-bonded oxygen to an EXISTING chain atom — becomes an aldehyde at a chain end, a ketone in the middle. ' +
          'Combine with a halogen/NH2 tool on the same atom for an acid halide ("propanoyl chloride") or amide ("propanamide").',
      },
      { id: 'COOH', label: 'COOH', hint: 'Attach a carboxylic acid group' },
      { id: 'CN', label: 'CN', hint: 'Attach a nitrile group (-C#N) — adds its own carbon, becomes part of the parent chain' },
    ],
  },
  {
    label: 'Other groups (V3)',
    tools: [
      { id: 'NO2', label: 'NO2', hint: 'Attach a nitro group (always cited as a prefix — it has no suffix form)' },
      { id: 'OCH3', label: 'OCH3', hint: 'Attach a methoxy group (-O-CH3, a plain ether)' },
      { id: 'COOCH3', label: 'COOCH3', hint: 'Attach a methyl ester group (-COOCH3)' },
    ],
  },
  {
    label: 'Rings',
    tools: [
      {
        id: 'ring-benzene',
        label: '⬡\nbenzene',
        hint: 'Click empty space to start a benzene ring; drag onto an existing atom to bond a ring onto it; drag onto a RING atom for spiro, or click a RING bond for fused',
      },
      {
        id: 'ring-cyclohexane',
        label: '⬡\nhexane',
        hint: 'Click empty space to start a cyclohexane ring; drag onto an existing atom to bond a ring onto it; drag onto a RING atom for spiro, or click a RING bond for fused',
      },
      {
        id: 'ring-cyclopentane',
        label: '⬠\npentane',
        hint: 'Click empty space to start a cyclopentane ring; drag onto an existing atom to bond a ring onto it; drag onto a RING atom for spiro, or click a RING bond for fused',
      },
      {
        id: 'ring-cyclobutane',
        label: '◻\nbutane',
        hint: 'Click empty space to start a cyclobutane ring; drag onto an existing atom to bond a ring onto it; drag onto a RING atom for spiro, or click a RING bond for fused',
      },
      {
        id: 'ring-cyclopropane',
        label: '△\npropane',
        hint: 'Click empty space to start a cyclopropane ring; drag onto an existing atom to bond a ring onto it; drag onto a RING atom for spiro, or click a RING bond for fused',
      },
    ],
  },
  {
    label: 'Fused/spiro rings (V4)',
    tools: [
      {
        id: 'ring-spiro',
        label: 'spiro',
        hint:
          'Click an EXISTING ring atom to fuse a new 6-membered ring onto it sharing exactly that one atom (a spiro union) — ' +
          'or just use any ring tool above and drag onto a ring atom directly, picking the new ring\'s own size',
      },
      {
        id: 'ring-fused',
        label: 'fused',
        hint:
          'Click an EXISTING ring bond to fuse a new 6-membered ring sharing that edge (ortho-fused/bicyclic) — ' +
          'or just use any ring tool above and click a ring bond directly, picking the new ring\'s own size',
      },
    ],
  },
  { label: 'Erase', tools: [{ id: 'erase', label: '✕', hint: 'Click a leaf atom to remove it' }] },
]
