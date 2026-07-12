export const dynamic = 'force-dynamic'
export const revalidate = 0

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

// Maps each Supabase table to the /q/[type]/[id] URL segment used in
// src/app/q/[type]/[id]/page.tsx.
const QUESTION_TABLES: { table: string; urlType: string }[] = [
  { table: 'QBankMCQ', urlType: 'mcq' },
  { table: 'APChapterMCQ', urlType: 'ap-mcq' },
  { table: 'QBankFRQ', urlType: 'frq' },
  { table: 'APChapterFRQ', urlType: 'ap-frq' },
  { table: 'QBankIChO', urlType: 'icho' },
]

const SUPABASE_PAGE_SIZE = 1000 // Supabase/PostgREST's default row cap per request

async function fetchAllRows(table: string) {
  const { supabase } = await import('@/lib/supabase')
  const rows: { id: number; created_at: string | null }[] = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select('id, created_at')
      .range(from, from + SUPABASE_PAGE_SIZE - 1)
    if (error || !data) break
    rows.push(...data)
    if (data.length < SUPABASE_PAGE_SIZE) break
    from += SUPABASE_PAGE_SIZE
  }
  return rows
}

async function getQuestionPages(base: string) {
  try {
    const results = await Promise.all(QUESTION_TABLES.map(({ table }) => fetchAllRows(table)))
    return results.flatMap((rows, i) => {
      const { urlType } = QUESTION_TABLES[i]
      return rows.map(row => ({
        url: `${base}/q/${urlType}/${row.id}`,
        lastModified: row.created_at ? new Date(row.created_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    })
  } catch {
    // DB unavailable — sitemap still returns the static shell below.
    return []
  }
}

export default async function sitemap() {
  const base = 'https://www.thechemsolver.com'

  const staticPages = [
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
    { url: `${base}/organic-chemistry`, lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${base}/ebook/ap-chemistry`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/ebook/organic-chemistry`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/ebook/advanced-chemistry`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 },
    ...LAB_SLUGS.map(slug => ({
      url: `${base}/labs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]

  const questionPages = await getQuestionPages(base)

  return [...staticPages, ...questionPages]
}
