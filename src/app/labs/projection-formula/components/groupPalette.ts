import { SubstituentKind } from '@/lib/nomenclature/editOps'

export interface PaletteGroup {
  label: string
  items: { kind: SubstituentKind; label: string; color: string }[]
}

// Same SubstituentKind set the nomenclature lab's own palette offers (tools.ts), minus 'C=O' (it
// turns the attach atom itself into the carbonyl carbon — incompatible with a stereocenter that must
// stay sp3 with 4 distinct substituents; CHO is the sp3-safe aldehyde equivalent, see editOps.ts).
export const PALETTE_GROUPS: PaletteGroup[] = [
  {
    label: 'Halogens',
    items: [
      { kind: 'F', label: 'F', color: '#4ade80' },
      { kind: 'Cl', label: 'Cl', color: '#22c55e' },
      { kind: 'Br', label: 'Br', color: '#a16207' },
      { kind: 'I', label: 'I', color: '#7c3aed' },
    ],
  },
  {
    label: 'Alkyl',
    items: [
      { kind: 'CH3', label: 'CH3', color: '#94a3b8' },
      { kind: 'C2H5', label: 'C2H5', color: '#94a3b8' },
    ],
  },
  {
    label: 'Functional groups',
    items: [
      { kind: 'OH', label: 'OH', color: '#ef4444' },
      { kind: 'NH2', label: 'NH2', color: '#3b82f6' },
      { kind: 'CHO', label: 'CHO', color: '#f97316' },
      { kind: 'COOH', label: 'COOH', color: '#f97316' },
      { kind: 'CN', label: 'CN', color: '#06b6d4' },
      { kind: 'NO2', label: 'NO2', color: '#eab308' },
      { kind: 'OCH3', label: 'OCH3', color: '#ef4444' },
      { kind: 'COOCH3', label: 'COOCH3', color: '#f97316' },
    ],
  },
]

export const GROUP_COLOR: Record<string, string> = Object.fromEntries(
  PALETTE_GROUPS.flatMap((g) => g.items.map((it) => [it.kind, it.color]))
)
GROUP_COLOR.H = '#f8fafc'
GROUP_COLOR.C = '#94a3b8'

/** CIP-rank colors, index 0 = rank 1 (highest priority) ... index 3 = rank 4 (lowest) — used by the
 * "Show CIP ranking" overlay on both the 3D and Fischer panels, so a student can visually match the
 * SAME substituent's rank across both panels via color, independent of which actual element/group it
 * happens to be. */
export const RANK_COLOR: [string, string, string, string] = ['#ef4444', '#f97316', '#eab308', '#64748b']
