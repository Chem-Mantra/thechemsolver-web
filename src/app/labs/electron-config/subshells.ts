// Aufbau (Madelung-rule) subshell fill order, shared between the 2D
// click/drag builder and the 3D atomic model so both stay in sync.

export type SubshellMeta = { n: number; l: 's' | 'p' | 'd' | 'f'; orbitals: number; label: string }

export const SUBSHELLS: SubshellMeta[] = (
  [
    { n: 1, l: 's', orbitals: 1 },
    { n: 2, l: 's', orbitals: 1 },
    { n: 2, l: 'p', orbitals: 3 },
    { n: 3, l: 's', orbitals: 1 },
    { n: 3, l: 'p', orbitals: 3 },
    { n: 4, l: 's', orbitals: 1 },
    { n: 3, l: 'd', orbitals: 5 },
    { n: 4, l: 'p', orbitals: 3 },
    { n: 5, l: 's', orbitals: 1 },
    { n: 4, l: 'd', orbitals: 5 },
    { n: 5, l: 'p', orbitals: 3 },
    { n: 6, l: 's', orbitals: 1 },
    { n: 4, l: 'f', orbitals: 7 },
    { n: 5, l: 'd', orbitals: 5 },
    { n: 6, l: 'p', orbitals: 3 },
    { n: 7, l: 's', orbitals: 1 },
    { n: 5, l: 'f', orbitals: 7 },
    { n: 6, l: 'd', orbitals: 5 },
    { n: 7, l: 'p', orbitals: 3 },
  ] as Array<Omit<SubshellMeta, 'label'>>
).map(s => ({ ...s, label: `${s.n}${s.l}` }))

export const sumArr = (a: number[]) => a.reduce((x, y) => x + y, 0)

export function initFilled(): Record<string, number[]> {
  return Object.fromEntries(SUBSHELLS.map(s => [s.label, Array(s.orbitals).fill(0)]))
}
