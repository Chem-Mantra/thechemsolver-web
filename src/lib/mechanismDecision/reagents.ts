import { ReagentProfile } from './types'

/** Curated list of the reagents that actually show up in intro-organic homework/exam problems,
 * pre-classified along the 3 axes `predict.ts` needs — lets the UI offer a concrete, recognizable
 * picker ("is NaOH SN1 or SN2?") instead of asking a student to abstractly rate nucleophilicity/
 * basicity/bulk themselves, while still feeding the same rules engine underneath. */
export const REAGENTS: ReagentProfile[] = [
  {
    id: 'naoh-aq',
    label: 'NaOH (aq) — hydroxide, water',
    nucleophilicity: 'strong',
    basicity: 'strong',
    bulk: 'small',
    defaultSolvent: 'protic',
    note: 'Hydroxide is both a strong nucleophile and a strong base — small enough to attack from behind easily.',
  },
  {
    id: 'naoh-dmso',
    label: 'NaOH in DMSO — hydroxide, polar aprotic',
    nucleophilicity: 'strong',
    basicity: 'strong',
    bulk: 'small',
    defaultSolvent: 'aprotic',
    note: 'Same hydroxide, but DMSO can’t solvate it the way water does — it stays a "naked," even more reactive anion.',
  },
  {
    id: 'water',
    label: 'H₂O (no added base) — just the solvent',
    nucleophilicity: 'weak',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'protic',
    note: 'Neutral water is a weak nucleophile and an even weaker base — it can only react once a carbocation has already formed on its own.',
  },
  {
    id: 'roh',
    label: 'ROH (alcohol solvent, e.g. EtOH/MeOH, no added base)',
    nucleophilicity: 'weak',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'protic',
    note: 'Like water, a neutral alcohol solvent is a weak nucleophile/weak base — it waits for a carbocation.',
  },
  {
    id: 'nai-acetone',
    label: 'NaI in acetone — iodide, polar aprotic',
    nucleophilicity: 'strong',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'aprotic',
    note: 'Iodide is an excellent, small nucleophile but a very weak base (its conjugate acid HI is a strong acid) — the classic "strong Nu, not a base" reagent.',
  },
  {
    id: 'nacn',
    label: 'NaCN — cyanide',
    nucleophilicity: 'strong',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'aprotic',
    note: 'Cyanide is a strong, small nucleophile and only a mild base.',
  },
  {
    id: 'nan3',
    label: 'NaN₃ — azide',
    nucleophilicity: 'strong',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'aprotic',
    note: 'Azide is a strong, small nucleophile and a weak base — behaves like iodide/cyanide here.',
  },
  {
    id: 'naoet-etoh',
    label: 'NaOEt in EtOH — ethoxide',
    nucleophilicity: 'strong',
    basicity: 'strong',
    bulk: 'small',
    defaultSolvent: 'protic',
    note: 'Ethoxide is a strong base AND a decent nucleophile — small enough that SN2 is still in play, but basic enough to push E2 once steric hindrance rises.',
  },
  {
    id: 'tbuok',
    label: 't-BuOK — potassium tert-butoxide',
    nucleophilicity: 'weak',
    basicity: 'strong',
    bulk: 'bulky',
    defaultSolvent: 'aprotic',
    note: 'A very strong base, but its 3 methyl groups make backside SN2 attack nearly impossible — it almost always grabs a proton (E2) instead.',
  },
  {
    id: 'dbu',
    label: 'DBU / DBN — non-nucleophilic strong amine base',
    nucleophilicity: 'weak',
    basicity: 'strong',
    bulk: 'bulky',
    defaultSolvent: 'aprotic',
    note: 'Purpose-built as a "non-nucleophilic strong base" — essentially never does SN2, used specifically to force E2.',
  },
  {
    id: 'rs-',
    label: 'NaSR — thiolate (RS⁻)',
    nucleophilicity: 'strong',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'aprotic',
    note: 'Sulfur’s lone pairs are very polarizable, making thiolate an excellent nucleophile despite being a weak base (its conjugate acid RSH is fairly acidic).',
  },
  {
    id: 'no-reagent-heat',
    label: 'No nucleophile/base added, just heat (pure solvolysis)',
    nucleophilicity: 'weak',
    basicity: 'weak',
    bulk: 'small',
    defaultSolvent: 'protic',
    note: 'With nothing deliberately added, only the solvent itself can act — a weak-Nu/weak-base scenario by definition.',
  },
]

export function reagentById(id: string): ReagentProfile {
  const found = REAGENTS.find((r) => r.id === id)
  if (!found) throw new Error(`Unknown reagent id: ${id}`)
  return found
}
