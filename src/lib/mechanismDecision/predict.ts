// The standard intro-organic-chemistry SN1/SN2/E1/E2 decision framework (Klein / Master Organic
// Chemistry style), encoded as explicit rules rather than guessed per-question — every branch below
// corresponds to a specific, commonly-taught teaching point, named in its own comment so the reasoning
// text generated for students traces back to a real rule rather than an opaque score.
//
// Deliberately OUT OF SCOPE for v1 (flagged honestly in `caveats`, never silently guessed):
// - Neighboring-group steric hindrance beyond plain substrate class (e.g. neopentyl bromide is
//   technically primary but its SN2 is blocked by the adjacent tert-butyl-like bulk — a different axis
//   from substrate class that this model doesn't capture).
// - Ring stereochemistry / anti-periplanar geometry requirements for E2 (e.g. trans-diaxial-only
//   elimination in cyclohexanes).
// - Carbocation rearrangement specifics (hydride/methyl shifts) — SN1/E1 verdicts note that
//   rearrangement is POSSIBLE but don't predict the rearranged product.
import { PredictionInput, PredictionResult, MechanismVerdict, Mechanism, Likelihood } from './types'
import { reagentById } from './reagents'

const SUBSTRATE_LABEL: Record<PredictionInput['substrate'], string> = {
  methyl: 'methyl',
  primary: 'primary (1°)',
  secondary: 'secondary (2°)',
  tertiary: 'tertiary (3°)',
}

function verdict(mechanism: Mechanism, likelihood: Likelihood, reasoning: string[]): MechanismVerdict {
  return { mechanism, likelihood, reasoning }
}

export function predictMechanism(input: PredictionInput): PredictionResult {
  const { substrate, resonanceStabilized, solvent, heat } = input
  const reagent = reagentById(input.reagentId)
  const caveats: string[] = [
    'This models the standard textbook decision framework (substrate class, nucleophile/base strength and bulk, solvent, temperature) — it does not account for neighboring-group steric effects beyond plain substrate class, ring anti-periplanar geometry, or specific carbocation rearrangement products.',
  ]

  // Methyl: structurally exceptional — no adjacent carbon means no β-hydrogen to eliminate, and a
  // methyl cation is far too unstable to ever form, so SN2 is the ONLY mechanistically possible
  // pathway regardless of what reagent or conditions are chosen.
  if (substrate === 'methyl') {
    const verdicts = [
      verdict('SN2', 'dominant', [
        'Methyl carbon has no steric hindrance at all, so backside attack is essentially unhindered.',
        `${reagent.label}: ${reagent.note}`,
      ]),
      verdict('SN1', 'none', ['A methyl cation (CH₃⁺) is far too unstable to ever form — no alkyl groups to stabilize the positive charge.']),
      verdict('E1', 'none', ['E1 requires the same unstable methyl cation as SN1 above — never forms.']),
      verdict('E2', 'none', ['Elimination needs a hydrogen on the carbon ADJACENT to the leaving group. A methyl carbon (CH₃–LG) has no adjacent carbon at all, so there is no β-hydrogen to remove.']),
    ]
    return {
      verdicts,
      dominant: ['SN2'],
      summary: 'Methyl substrates can only undergo SN2 — elimination is structurally impossible (no β-hydrogen) and SN1/E1 are impossible (no stable methyl cation), regardless of reagent or conditions.',
      caveats,
    }
  }

  const canIonize = substrate === 'tertiary' || substrate === 'secondary' || resonanceStabilized
  const sn2StericallyBlocked = substrate === 'tertiary'
  const reagentTooBulkyForSn2 = reagent.bulk === 'bulky'
  const sn2Viable = !sn2StericallyBlocked && !reagentTooBulkyForSn2 && reagent.nucleophilicity === 'strong'
  const e2Viable = reagent.basicity === 'strong'
  // SN1/E1 only WIN when the carbocation pathway has no faster bimolecular competitor — a strong
  // nucleophile or strong base reacts fast enough to outrun ionization even on a substrate that COULD
  // ionize, which is exactly why "3° + strong base" is E2, not SN1/E1, even though a 3° carbocation is
  // perfectly stable.
  const sn1e1Favored = canIonize && reagent.nucleophilicity === 'weak' && reagent.basicity === 'weak'

  const protic = solvent === 'protic'
  const solventNote = protic
    ? 'A polar protic solvent solvates and stabilizes carbocations (helps SN1/E1) but also cages/weakens small anions (slightly slows SN2/E2).'
    : 'A polar aprotic solvent can\'t hydrogen-bond to anions, so the nucleophile/base stays "naked" and more reactive — favors SN2/E2 over SN1/E1.'

  const verdicts: MechanismVerdict[] = []

  // --- SN1/E1 branch (weak nucleophile, weak base, ionizable substrate) ---
  if (sn1e1Favored) {
    const reasoningBase = [
      `${SUBSTRATE_LABEL[substrate]}${resonanceStabilized && substrate !== 'tertiary' ? ' (resonance-stabilized — allylic/benzylic)' : ''} carbon can form a reasonably stable carbocation.`,
      `${reagent.label}: ${reagent.note}`,
      'With no strong nucleophile or base around to react fast, the rate-limiting step is just the substrate ionizing on its own — once that carbocation forms, both substitution (SN1) and elimination (E1) can follow from it, so they occur as a MIXTURE.',
      solventNote,
    ]
    if (heat) {
      verdicts.push(verdict('E1', 'dominant', [...reasoningBase, 'Heating shifts the SN1/E1 ratio toward elimination (E1) — the standard "heat favors elimination" rule.']))
      verdicts.push(verdict('SN1', 'minor', [...reasoningBase, 'Still occurs alongside E1, just as the minor product at elevated temperature.']))
    } else {
      verdicts.push(verdict('SN1', 'dominant', [...reasoningBase, 'At room temperature/no added heat, substitution (SN1) is typically the major product of this mixture.']))
      verdicts.push(verdict('E1', 'minor', [...reasoningBase, 'Still occurs alongside SN1 as the minor product — heating would shift more of the mixture toward E1.']))
    }
    verdicts.push(verdict('SN2', 'none', [
      sn2StericallyBlocked
        ? 'SN2 is sterically blocked at a 3° carbon — there is no open backside angle for any nucleophile to attack.'
        : `${reagent.label} is too weak a nucleophile to compete with the (already-favored) unimolecular ionization pathway.`,
    ]))
    verdicts.push(verdict('E2', 'none', [`${reagent.label} is too weak a base to drive a concerted E2 elimination — any elimination here goes through the carbocation (E1) instead.`]))
  } else {
    // --- SN2/E2 branch (at least one of nucleophilicity/basicity is strong) ---
    if (sn2Viable && e2Viable) {
      // Both pathways are live — substrate sterics and temperature decide the actual ratio.
      if (substrate === 'primary') {
        verdicts.push(verdict('SN2', 'dominant', [
          'A 1° carbon has almost no steric hindrance, so even a base/nucleophile that COULD do either reaction overwhelmingly prefers the faster, less crowded backside attack (SN2).',
          `${reagent.label}: ${reagent.note}`,
        ]))
        verdicts.push(verdict('E2', 'minor', ['Still mechanistically possible (this reagent is a strong enough base), but outcompeted by SN2 at an unhindered 1° carbon.']))
      } else {
        // secondary
        if (heat) {
          verdicts.push(verdict('E2', 'dominant', [
            `${reagent.label} is both a strong nucleophile and a strong base, so at a 2° carbon the outcome is genuinely temperature-sensitive — heating shifts the balance toward elimination (E2).`,
          ]))
          verdicts.push(verdict('SN2', 'minor', ['Still occurs as the minor pathway alongside E2 at elevated temperature.']))
        } else {
          verdicts.push(verdict('SN2', 'dominant', [
            `${reagent.label} is both a strong nucleophile and a strong base, so at a 2° carbon with no added heat, substitution (SN2) is typically the major pathway.`,
          ]))
          verdicts.push(verdict('E2', 'minor', ['Still mechanistically possible — heating this same reaction would shift more product toward E2.']))
        }
      }
      verdicts.push(verdict('SN1', 'none', [`${reagent.label} reacts far faster than the substrate can spontaneously ionize — the bimolecular pathway always wins when a strong Nu/base is present.`]))
      verdicts.push(verdict('E1', 'none', ['Same reasoning as SN1 above: no need to wait for spontaneous ionization when a strong base is already present to drive E2 directly.']))
    } else if (sn2Viable) {
      // Strong, small, non-basic nucleophile (I⁻, CN⁻, N3⁻, RS⁻-style) — SN2 with no real E2 competition.
      verdicts.push(verdict('SN2', 'dominant', [
        `${reagent.label}: ${reagent.note}`,
        `${SUBSTRATE_LABEL[substrate]} carbon is open enough for backside attack, and this reagent is a strong, small nucleophile — classic SN2.`,
      ]))
      verdicts.push(verdict('E2', 'none', [`${reagent.label} is too weak a base to drive elimination — it reacts as a nucleophile, not a base.`]))
      verdicts.push(verdict('SN1', 'none', ['The strong nucleophile reacts via the faster bimolecular pathway before the substrate has any chance to ionize on its own.']))
      verdicts.push(verdict('E1', 'none', ['Same reasoning as SN1 — no carbocation intermediate forms when SN2 outcompetes ionization.']))
    } else if (e2Viable) {
      // Either sterically blocked (3°) or the reagent itself is too bulky for SN2 — strong base, E2.
      verdicts.push(verdict('E2', 'dominant', [
        sn2StericallyBlocked
          ? 'SN2 is sterically blocked at a 3° carbon, so any strong base present drives elimination instead.'
          : `${reagent.label} is a strong base, but its own bulk blocks it from a clean backside SN2 approach — it grabs a proton (E2) instead. ${reagent.note}`,
      ]))
      verdicts.push(verdict('SN2', 'none', [
        sn2StericallyBlocked ? 'No open backside angle exists at a 3° carbon.' : `${reagent.label} is too bulky to approach for backside attack.`,
      ]))
      verdicts.push(verdict('SN1', 'none', [
        canIonize
          ? `${reagent.label} is a strong enough base to react before the substrate can spontaneously ionize — E2 wins over the carbocation pathway.`
          : 'This substrate cannot form a reasonably stable carbocation.',
      ]))
      verdicts.push(verdict('E1', 'none', ['Same reasoning as SN1 — the strong base drives a direct, concerted E2 rather than waiting for ionization.']))
    } else {
      // Weak nucleophile AND weak base, but the substrate ALSO can't ionize (plain 1°, no resonance) —
      // none of the 4 mechanisms proceed at a meaningful rate. Flagged honestly rather than forced.
      verdicts.push(verdict('SN2', 'none', [`${reagent.label} is too weak a nucleophile to react readily, even at an open 1° carbon.`]))
      verdicts.push(verdict('SN1', 'none', ['A plain 1° carbocation is too unstable to form at any meaningful rate.']))
      verdicts.push(verdict('E1', 'none', ['Same reasoning as SN1 — no carbocation forms to eliminate from.']))
      verdicts.push(verdict('E2', 'none', [`${reagent.label} is too weak a base to drive elimination.`]))
    }
  }

  const dominant = verdicts.filter((v) => v.likelihood === 'dominant').map((v) => v.mechanism)
  const minor = verdicts.filter((v) => v.likelihood === 'minor').map((v) => v.mechanism)

  let summary: string
  let productHint: string | undefined
  if (dominant.length === 0) {
    summary = `No pathway proceeds at a meaningful rate: ${SUBSTRATE_LABEL[substrate]} can't form a stable carbocation, and ${reagent.label} is too weak to react via SN2 or E2 either.`
  } else if (dominant.length === 1 && minor.length === 0) {
    summary = `${dominant[0]} is the clear dominant pathway.`
  } else {
    summary = `${dominant.join(' and ')} ${dominant.length > 1 ? 'are the dominant pathways (a genuine mixture)' : 'dominates'}${minor.length ? `, with ${minor.join('/')} as the minor product` : ''}.`
  }

  if (dominant.includes('SN2')) {
    productHint = 'SN2 proceeds with INVERSION of configuration at the carbon — if the starting material is a single enantiomer, the product is the opposite configuration at that center.'
  } else if (dominant.includes('SN1')) {
    productHint = 'SN1 proceeds through a flat carbocation, so nucleophilic attack can occur from either face — if the starting material was a single enantiomer, expect a RACEMIC (or largely racemized) mixture, plus the possibility of hydride/methyl shifts rearranging the carbocation before it reacts.'
  } else if (dominant.includes('E2') || dominant.includes('E1')) {
    productHint = reagent.bulk === 'bulky'
      ? 'A bulky base favors the Hofmann product (the LESS substituted alkene) — it removes a proton from the more accessible, less hindered side.'
      : 'Absent a bulky base, expect the Zaitsev product (the MORE substituted, more stable alkene) as major.'
  }

  return { verdicts, dominant, summary, productHint, caveats }
}
