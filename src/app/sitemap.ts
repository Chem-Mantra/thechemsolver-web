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
  // Education sections moved to international.chem-mantra.online as part of
  // the 2026-08-28 domain split (thechemsolver.com -> B2B/patent-analytics
  // only). This sitemap is served identically regardless of which host
  // requests it -- same pattern already used for the patent-analytics
  // subdomain pages below -- so it just needs to list each page's real,
  // current canonical URL. Root "/" stays here; it's the AdSense-funnel
  // homepage and hasn't moved.
  const intlBase = 'https://international.chem-mantra.online'

  const staticPages = [
    { url: base,                      lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 1.0  },
    { url: `${base}/about`,           lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3  },
    { url: `${base}/contact`,         lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4  },
    { url: `${base}/privacy`,         lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2  },
    { url: `${base}/terms`,           lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.2  },
  ]

  const internationalPages = [
    { url: `${intlBase}/labs`,            lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.9  },
    { url: `${intlBase}/blog`,            lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.7  },
    { url: `${intlBase}/ap-chemistry`,    lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${intlBase}/ap-chemistry/practice`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${intlBase}/usnco`,           lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${intlBase}/usnco/practice`,  lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.85 },
    { url: `${intlBase}/icho`,            lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${intlBase}/icho/problems`,   lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.85 },
    { url: `${intlBase}/organic-chemistry`, lastModified: new Date(), changeFrequency: 'weekly'  as const, priority: 0.95 },
    { url: `${intlBase}/ebook/ap-chemistry`,      lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${intlBase}/ebook/organic-chemistry`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${intlBase}/ebook/advanced-chemistry`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 },
    ...LAB_SLUGS.map(slug => ({
      url: `${intlBase}/labs/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]

  const { POSTS } = await import('@/lib/blog')
  const blogPages = POSTS.map((p) => ({
    url: `${intlBase}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const questionPages = await getQuestionPages(intlBase)
  const patentAnalyticsPages = await getPatentAnalyticsPages()

  return [...staticPages, ...internationalPages, ...blogPages, ...questionPages, ...patentAnalyticsPages]
}

// patent-analytics.thechemsolver.com is a subdomain of this same site, not
// a separate deployment -- listing its absolute URLs here (rather than a
// second sitemap) is enough for discovery since sitemap entries don't need
// to share a host with the sitemap file itself.
async function getPatentAnalyticsPages() {
  const paBase = 'https://patent-analytics.thechemsolver.com'
  const staticEntry = { url: `${paBase}/`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 }
  // Real gap found 2026-08-28: only the bare homepage was ever listed here --
  // /pricing and every /data/[product] listing page (plus the new /cdmo
  // landing page) were never in the sitemap at all, only discoverable via
  // on-site links. Google already knows about the /data pages from manual
  // URL Inspection requests, but they belong in the sitemap properly too.
  const otherStaticPages = [
    '/pricing', '/cdmo', '/licensing', '/newest-patents',
    '/newest-patents/samples/egfr-her2-inhibitor',
    '/newest-patents/samples/shp2-inhibitor',
    '/newest-patents/samples/glp1r-agonist',
  ].map((path) => ({
    url: `${paBase}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  try {
    const { PRODUCTS: ALL_PRODUCTS } = await import('@/lib/productResults')
    const productListingPages = Object.values(ALL_PRODUCTS).map((p) => ({
      url: `${paBase}/data/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
    otherStaticPages.push(...productListingPages)

    const { getAllArticles, slugify } = await import('@/lib/patentNews')
    const articles = await getAllArticles()
    const articlePages = articles.map((a) => ({
      url: `${paBase}/news/${slugify(a.title)}`,
      lastModified: new Date(a.published_date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Each product-result row is its own indexable page (real numbers,
    // real patents) once the daily bulk pipeline starts uploading them --
    // empty for now, populates automatically as product_results fills in.
    //
    // Real bug found + fixed 2026-08-28: a patent can appear in MULTIPLE
    // fto_triage rows (as patent_a in several different cross-patent
    // pairs), but they all resolve to the SAME page
    // (getResultByProductAndPatent takes the most recent row per
    // product_type+patent_number). Mapping every row to a URL without
    // deduping produced a sitemap with the same URL listed up to 17 times
    // -- 294 entries for only 129 actual distinct pages. Dedupe by URL.
    const { PRODUCTS, getLatestAcrossProducts } = await import('@/lib/productResults')
    const live = await getLatestAcrossProducts(500)
    const productPageMap = new Map<string, { url: string; lastModified: Date; changeFrequency: 'monthly'; priority: number }>()
    for (const [productType, results] of Object.entries(live)) {
      for (const r of results) {
        const url = `${paBase}/data/${PRODUCTS[productType as keyof typeof PRODUCTS].slug}/${r.patent_number}`
        const existing = productPageMap.get(url)
        const lastModified = new Date(r.published_date)
        if (!existing || lastModified > existing.lastModified) {
          productPageMap.set(url, { url, lastModified, changeFrequency: 'monthly', priority: 0.6 })
        }
      }
    }
    const productPages = Array.from(productPageMap.values())

    return [staticEntry, ...otherStaticPages, ...articlePages, ...productPages]
  } catch {
    return [staticEntry, ...otherStaticPages]
  }
}
