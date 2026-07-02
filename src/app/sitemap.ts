export const dynamic = 'force-static'

const LAB_SLUGS = [
  'titration', 'nomenclature', 'equilibrium', 'ionic-equilibrium',
  'kinetics', 'thermodynamics', 'electrochemical-potentials', 'coordination',
  'nuclear-decay', 'quantum', 'radial-probability', 'atomic-evolution',
  'vsepr', 'hydrocarbon', 'stereochemistry', 'organic-mechanism', 'periodic-table',
  'crystal-field', 'hybridization', 'projection-formula', 'electrochemistry',
  'electrochemical', 'periodic', 'mechanisms', 'organic-synthesis',
  'gas-laws', 'colligative-properties', 'phase-diagram', 'unit-cell', 'mo-diagram',
  'lewis-structure', 'bond-polarity', 'imf-comparator', 'beer-lambert', 'chromatography',
  'reaction-classifier', 'net-ionic-equation', 'limiting-reagent', 'stoichiometry-mapper',
  'hess-law', 'calorimetry', 'bond-energy', 'enthalpy-diagram', 'electrolytic-cell',
  'photoelectric-effect', 'h-emission-spectrum', 'electron-config', 'pes-spectrum',
  'isotope-mass-spec', 'nmr-predictor', 'mass-spec', 'sn1-sn2-e1-e2',
]

export default function sitemap() {
  const base = 'https://www.thechemsolver.com'

  return [
    { url: base,                      lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 1.0  },
    { url: `${base}/labs`,            lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.9  },
    { url: `${base}/about`,           lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3  },
    { url: `${base}/privacy`,         lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2  },
    { url: `${base}/terms`,           lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2  },
    { url: `${base}/ap-chemistry`,    lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${base}/ap-chemistry/practice`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${base}/usnco`,           lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${base}/usnco/practice`,  lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.85 },
    { url: `${base}/icho`,            lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${base}/icho/problems`,   lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.85 },
    ...LAB_SLUGS.map(slug => ({
      url: `${base}/labs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]
}
