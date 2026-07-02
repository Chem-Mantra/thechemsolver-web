/** Gas constant in L·atm/(mol·K) — the unit system this whole module standardizes on (P in atm, V in
 * L, n in mol, T in K), matching how AP Chem / general chemistry textbooks present these equations. */
export const R_L_ATM = 0.082057

export interface VdwGasConstants {
  id: string
  label: string
  /** L²·atm/mol² — measures intermolecular ATTRACTION (bigger a = stickier molecules, e.g. polar/large
   * gases), which LOWERS the real pressure below ideal by pulling molecules away from the container wall
   * right as they're about to strike it. */
  a: number
  /** L/mol — the gas's own molar "excluded volume" (molecules aren't points), which RAISES the real
   * pressure above ideal at high density by leaving less free volume for them to move in. */
  b: number
}

/** Commonly textbook-cited van der Waals constants (e.g. Tro's General Chemistry appendix, CRC
 * Handbook) for the gases that actually show up in AP Chem / Gen Chem problems. */
export const VDW_GASES: VdwGasConstants[] = [
  { id: 'he', label: 'Helium (He)', a: 0.0341, b: 0.0237 },
  { id: 'h2', label: 'Hydrogen (H₂)', a: 0.244, b: 0.0266 },
  { id: 'ne', label: 'Neon (Ne)', a: 0.211, b: 0.0171 },
  { id: 'ar', label: 'Argon (Ar)', a: 1.34, b: 0.0322 },
  { id: 'n2', label: 'Nitrogen (N₂)', a: 1.39, b: 0.0391 },
  { id: 'o2', label: 'Oxygen (O₂)', a: 1.36, b: 0.0318 },
  { id: 'ch4', label: 'Methane (CH₄)', a: 2.25, b: 0.0428 },
  { id: 'co2', label: 'Carbon dioxide (CO₂)', a: 3.59, b: 0.0427 },
  { id: 'nh3', label: 'Ammonia (NH₃)', a: 4.17, b: 0.0371 },
  { id: 'h2o', label: 'Water vapor (H₂O)', a: 5.46, b: 0.0305 },
  { id: 'cl2', label: 'Chlorine (Cl₂)', a: 6.49, b: 0.0562 },
]

export function vdwGasById(id: string): VdwGasConstants {
  const found = VDW_GASES.find((g) => g.id === id)
  if (!found) throw new Error(`Unknown gas id: ${id}`)
  return found
}
