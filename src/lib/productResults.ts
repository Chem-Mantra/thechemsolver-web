import { supabase } from './supabase'

export type ProductType = 'markush_coverage' | 'section_3d' | 'fto_triage' | 'portfolio_landscape'

export type ProductResult = {
  id: string
  product_type: ProductType
  patent_number: string
  headline: string
  summary: string
  details_json: Record<string, unknown>
  confidence_tier: 'auto_verified' | 'needs_review'
  source_batch: string | null
  published_date: string
}

export const PRODUCTS: Record<ProductType, {
  slug: string
  name: string
  shortName: string
  tagline: string
  hasLiveData: boolean // true = pulls from product_results (2025 bulk run); false = sample-only page
  faq: { question: string; answer: string }[]
}> = {
  markush_coverage: {
    slug: 'markush-coverage',
    name: 'Genus/Species (Markush) Claim Coverage Analysis',
    shortName: 'Markush Coverage',
    tagline: 'Does a specific compound fall inside a patent’s broad genus claim?',
    hasLiveData: true,
    faq: [
      {
        question: 'What does Markush/genus coverage analysis check?',
        answer: "Whether a specific compound structurally falls inside a patent's broad genus (Markush) claim, using real cheminformatics substructure matching rather than a keyword search.",
      },
      {
        question: 'How is this delivered?',
        answer: 'A free automated instant check is available (patent number + your compound) via the Newest Patent Extraction tool’s Markush mode — it parses the genus diagram and claim text automatically and confirms a match when it can. When it can’t confirm automatically, you get the free result plus the option to escalate to a human-reviewed Standard Report ($199).',
      },
      {
        question: 'Can I see a real example first?',
        answer: 'Yes — real, currently-live sample results are listed on this page for free before you request anything.',
      },
    ],
  },
  section_3d: {
    slug: 'section-3d',
    name: 'Section 3(d) Compliance Screening',
    shortName: 'Section 3(d) Screening',
    tagline: 'India-specific "known substance" derivative classification.',
    hasLiveData: true,
    faq: [
      {
        question: 'What is Section 3(d) screening?',
        answer: "An India-specific check of whether a claimed compound is a salt, ester, isomer, or other \"known substance\" derivative of something already known — the structural half of the test used to strike down Novartis's Glivec patent.",
      },
      {
        question: 'Does it decide if a patent is invalid?',
        answer: 'No — it flags the structural relationship for your review. Whether therapeutic efficacy was actually enhanced is a separate clinical/legal question outside its scope.',
      },
      {
        question: "What's the turnaround?",
        answer: 'Human-reviewed Standard Report, not an automated instant check — real sample output is on this page so you can see the format first.',
      },
    ],
  },
  fto_triage: {
    slug: 'fto-triage',
    name: 'Prior-Art / FTO Structural Triage',
    shortName: 'FTO Structural Triage',
    tagline: 'Fast first-pass structure search across many patents (also covers CDMO process pre-screens).',
    hasLiveData: true,
    faq: [
      {
        question: 'What is FTO Structural Triage?',
        answer: 'A fast first-pass freedom-to-operate screen — search a target compound or synthetic route against the existing patent landscape before committing R&D or manufacturing spend.',
      },
      {
        question: 'How fast is it?',
        answer: "It's automated: the $10 Instant Compound Check on an arbitrary patent typically returns within about an hour.",
      },
      {
        question: 'Does it work for CDMO process patents too?',
        answer: 'Yes — the same engine also powers a dedicated CDMO process pre-screen page.',
      },
    ],
  },
  portfolio_landscape: {
    slug: 'portfolio-landscape',
    name: 'Patent Family / Portfolio Landscape Reports',
    shortName: 'Portfolio Landscape',
    tagline: 'An entire patent family, consolidated into one structure database.',
    hasLiveData: true,
    faq: [
      {
        question: 'What is Portfolio Landscape mapping?',
        answer: 'It consolidates an entire patent family around one drug or target into a single structure database, so you can see which patents are weak or expiring and time a launch window.',
      },
      {
        question: 'Is it automated?',
        answer: 'Yes, for any patent number — the $10 Instant Compound Check flow covers this product live.',
      },
      {
        question: 'What about ongoing monitoring, not just a one-time report?',
        answer: 'A separate retainer-based Portfolio Intelligence service adds continuous alerts as new matching patents publish.',
      },
    ],
  },
}

export function productBySlug(slug: string): ProductType | null {
  const entry = (Object.entries(PRODUCTS) as [ProductType, (typeof PRODUCTS)[ProductType]][])
    .find(([, v]) => v.slug === slug)
  return entry ? entry[0] : null
}

// Public reads only ever see confidence_tier='auto_verified' rows -- enforced
// by the table's own Row Level Security policy, not just this filter. This
// query is deliberately unfiltered on tier so a future RLS change is the
// only thing that could ever widen what's shown, not an app-layer mistake.
export async function getResultsByProduct(productType: ProductType, limit = 100): Promise<ProductResult[]> {
  const { data, error } = await supabase
    .from('product_results')
    .select('*')
    .eq('product_type', productType)
    .order('published_date', { ascending: false })
    .limit(limit)
  if (error) {
    console.warn('product_results fetch failed:', error.message)
    return []
  }
  return data as ProductResult[]
}

// Readable URL segment (patent number) rather than the row's uuid -- SEO-
// friendly and stable even if a patent is ever reprocessed. Not DB-enforced
// unique per (product_type, patent_number), so this takes the most recent
// if a batch ever reran a patent -- that's the correct choice regardless
// (newer analysis supersedes older).
export async function getResultByProductAndPatent(productType: ProductType, patentNumber: string): Promise<ProductResult | null> {
  const { data, error } = await supabase
    .from('product_results')
    .select('*')
    .eq('product_type', productType)
    .eq('patent_number', patentNumber)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return null
  return data as ProductResult
}

export async function getLatestAcrossProducts(perProduct = 6): Promise<Record<ProductType, ProductResult[]>> {
  const liveTypes = (Object.keys(PRODUCTS) as ProductType[]).filter((t) => PRODUCTS[t].hasLiveData)
  const results = await Promise.all(liveTypes.map((t) => getResultsByProduct(t, perProduct)))
  const out = {} as Record<ProductType, ProductResult[]>
  liveTypes.forEach((t, i) => { out[t] = results[i] })
  return out
}

export type LiveVolumeStats = {
  totalResults: number
  uniquePatents: number
}

// Grows automatically as 04_upload_to_website.py uploads more rows -- no
// redeploy needed, since the page that calls this sets `revalidate` instead
// of being fully static.
export async function getLiveVolumeStats(): Promise<LiveVolumeStats> {
  const { count, error: countError } = await supabase
    .from('product_results')
    .select('*', { count: 'exact', head: true })
  if (countError) {
    console.warn('product_results count fetch failed:', countError.message)
    return { totalResults: 0, uniquePatents: 0 }
  }

  const { data, error } = await supabase.from('product_results').select('patent_number')
  const uniquePatents = error || !data ? 0 : new Set(data.map((r) => r.patent_number)).size

  return { totalResults: count ?? 0, uniquePatents }
}
