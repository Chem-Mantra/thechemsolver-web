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
}> = {
  markush_coverage: {
    slug: 'markush-coverage',
    name: 'Genus/Species (Markush) Claim Coverage Analysis',
    shortName: 'Markush Coverage',
    tagline: 'Does a specific compound fall inside a patent’s broad genus claim?',
    hasLiveData: false,
  },
  section_3d: {
    slug: 'section-3d',
    name: 'Section 3(d) Compliance Screening',
    shortName: 'Section 3(d) Screening',
    tagline: 'India-specific "known substance" derivative classification.',
    hasLiveData: false,
  },
  fto_triage: {
    slug: 'fto-triage',
    name: 'Prior-Art / FTO Structural Triage',
    shortName: 'FTO Structural Triage',
    tagline: 'Fast first-pass structure search across many patents (also covers CDMO process pre-screens).',
    hasLiveData: true,
  },
  portfolio_landscape: {
    slug: 'portfolio-landscape',
    name: 'Patent Family / Portfolio Landscape Reports',
    shortName: 'Portfolio Landscape',
    tagline: 'An entire patent family, consolidated into one structure database.',
    hasLiveData: true,
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
