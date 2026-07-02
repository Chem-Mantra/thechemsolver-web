export const AVOGADRO = 6.02214076e23 // /mol — exact, 2019 SI redefinition

export type CellType = 'simple-cubic' | 'bcc' | 'fcc'

export interface CellTypeInfo {
  id: CellType
  label: string
  atomsPerCell: number
  coordinationNumber: number
}

export const CELL_TYPES: CellTypeInfo[] = [
  { id: 'simple-cubic', label: 'Simple Cubic (SC)', atomsPerCell: 1, coordinationNumber: 6 },
  { id: 'bcc', label: 'Body-Centered Cubic (BCC)', atomsPerCell: 2, coordinationNumber: 8 },
  { id: 'fcc', label: 'Face-Centered Cubic (FCC)', atomsPerCell: 4, coordinationNumber: 12 },
]

export function cellTypeInfo(id: CellType): CellTypeInfo {
  const found = CELL_TYPES.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown cell type: ${id}`)
  return found
}
