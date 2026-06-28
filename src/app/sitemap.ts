export const dynamic = 'force-static'

const LAB_SLUGS = [
  'titration', 'nomenclature', 'equilibrium', 'ionic-equilibrium',
  'kinetics', 'thermodynamics', 'electrochemical-potentials', 'coordination',
  'nuclear-decay', 'quantum', 'radial-probability', 'atomic-evolution',
  'vsepr', 'hydrocarbon', 'stereochemistry', 'organic-mechanism', 'periodic-table',
  'crystal-field', 'hybridization', 'projection-formula', 'electrochemistry',
  'electrochemical', 'periodic', 'mechanisms', 'organic-synthesis',
]

export default function sitemap() {
  const base = 'https://www.thechemsolver.com'

  return [
    { url: base,                      lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 1.0  },
    { url: `${base}/labs`,            lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.9  },
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
