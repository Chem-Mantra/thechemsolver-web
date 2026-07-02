export interface PhaseDiagramSubstance {
  id: string
  label: string
  triplePointK: number
  triplePointAtm: number
  criticalPointK: number
  criticalPointAtm: number
  /** K at 1 atm; null when the substance has no liquid phase at 1 atm (its triple point pressure
   * exceeds 1 atm, so it sublimes directly — the classic "dry ice" case). */
  normalMeltingPointK: number | null
  normalBoilingPointK: number | null
  /** K at 1 atm — only set when normalMeltingPointK is null (the substance sublimes at 1 atm). Used to
   * calibrate the sublimation curve specifically below the triple point, since it has a different
   * (steeper) slope than the vaporization curve and a single triple→critical exponential alone
   * under-predicts how cold the substance must get to stay solid at 1 atm. */
  normalSublimationPointK: number | null
  /** Sign of dP/dT along the solid-liquid (fusion) boundary. 'negative' is water's famous anomaly
   * (ice is LESS dense than liquid water, so increasing pressure favors the denser liquid and LOWERS
   * the melting point — the physical basis of pressure-melting/ice skating folklore). 'positive' is
   * the normal case (solid denser than liquid, e.g. CO2), where pressure raises the melting point. */
  fusionSlope: 'negative' | 'positive'
}

/** Triple/critical point values are well-established, commonly textbook-cited reference data. Curve
 * shapes AWAY from these anchor points (and the fusion curve's exact slope magnitude) are schematic —
 * see core.ts's module comment for exactly what's modeled physically vs illustratively. */
export const PHASE_SUBSTANCES: PhaseDiagramSubstance[] = [
  {
    id: 'water',
    label: 'Water (H₂O)',
    triplePointK: 273.16,
    triplePointAtm: 0.00604,
    criticalPointK: 647.1,
    criticalPointAtm: 217.75,
    normalMeltingPointK: 273.15,
    normalBoilingPointK: 373.15,
    normalSublimationPointK: null,
    fusionSlope: 'negative',
  },
  {
    id: 'co2',
    label: 'Carbon Dioxide (CO₂)',
    triplePointK: 216.55,
    triplePointAtm: 5.11,
    criticalPointK: 304.13,
    criticalPointAtm: 72.8,
    normalMeltingPointK: null,
    normalBoilingPointK: null,
    normalSublimationPointK: 194.65, // -78.5°C — the classic "dry ice" sublimation point at 1 atm
    fusionSlope: 'positive',
  },
]

export function phaseSubstanceById(id: string): PhaseDiagramSubstance {
  const found = PHASE_SUBSTANCES.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown substance id: ${id}`)
  return found
}
