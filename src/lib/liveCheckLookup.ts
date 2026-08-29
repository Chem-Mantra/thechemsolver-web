import { supabaseAdmin } from './supabase-admin'
import { buildFamilyLandscapeLive, buildPortfolioLandscapeResult } from './portfolioLandscape'

// Shared by both check-payment routes (PayPal capture-order, Razorpay
// verify) -- previously each just looked up an EXISTING product_results
// row and, if missing, queued the patent for Prashant to process by hand
// later ("we'll email you within 1 hour"). Now, before falling back to
// that queue, this makes one real attempt to build a Portfolio Landscape
// result live, in the same request -- Portfolio Landscape is the one
// product type that's fully self-contained per patent (no dependency on
// any other patent, no RDKit needed, verified ~5-15s in practice), so it's
// the one case where "instant" can genuinely mean instant even for a
// patent nobody has ever checked before.
export type LiveLookupResult = { found: true; url: string } | { found: false }

function resultUrlFor(productType: string, patentNumber: string): string {
  const slugMap: Record<string, string> = { fto_triage: 'fto-triage', portfolio_landscape: 'portfolio-landscape' }
  const slug = slugMap[productType] || productType
  return `https://patent-analytics.thechemsolver.com/data/${slug}/${patentNumber}`
}

export async function resolveOrFetchLiveResult(patentNumber: string): Promise<LiveLookupResult> {
  const { data: existing } = await supabaseAdmin
    .from('product_results')
    .select('product_type, patent_number')
    .eq('patent_number', patentNumber)
    .eq('confidence_tier', 'auto_verified')
    .limit(1)
    .maybeSingle()

  if (existing) {
    return { found: true, url: resultUrlFor(existing.product_type, existing.patent_number) }
  }

  let landscape
  try {
    landscape = await buildFamilyLandscapeLive(patentNumber)
  } catch (err) {
    console.warn('[liveCheckLookup] live Portfolio Landscape fetch threw (falling back to queue):', err)
    return { found: false }
  }
  if (!landscape) {
    return { found: false } // seed patent itself couldn't be fetched -- fall back to the manual queue
  }

  const result = buildPortfolioLandscapeResult(landscape)
  const { error: insertError } = await supabaseAdmin.from('product_results').insert({
    product_type: 'portfolio_landscape',
    patent_number: result.patent_number,
    headline: result.headline,
    summary: result.summary,
    details_json: result.details_json,
    confidence_tier: result.confidence_tier,
    source_batch: 'live_on_demand',
    published_date: new Date().toISOString().slice(0, 10),
  })
  if (insertError) {
    console.warn('[liveCheckLookup] live result generated but failed to persist (still returning it):', insertError)
  }

  return { found: true, url: resultUrlFor('portfolio_landscape', result.patent_number) }
}
