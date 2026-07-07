// AP Chemistry's 9 official Course & Exam Description units.
// Shared between the hub page (/ap-chemistry) and the chapterwise practice
// tab (/ap-chemistry/practice) so the unit list/order/weights live in one place.

export interface APUnit {
  n: number
  name: string
  weight: string
}

export const AP_UNITS: APUnit[] = [
  { n: 1, name: 'Atomic Structure & Properties', weight: '7–9%' },
  { n: 2, name: 'Compound Structure & Properties', weight: '7–9%' },
  { n: 3, name: 'Properties of Substances & Mixtures', weight: '18–22%' },
  { n: 4, name: 'Chemical Reactions', weight: '7–9%' },
  { n: 5, name: 'Kinetics', weight: '7–9%' },
  { n: 6, name: 'Thermochemistry', weight: '7–9%' },
  { n: 7, name: 'Equilibrium', weight: '7–9%' },
  { n: 8, name: 'Acids & Bases', weight: '11–15%' },
  { n: 9, name: 'Thermodynamics & Electrochemistry', weight: '7–9%' },
]
