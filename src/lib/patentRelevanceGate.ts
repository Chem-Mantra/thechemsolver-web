import * as cheerio from 'cheerio'
import { fetchPatentHtml } from './portfolioLandscape'

// Shared pre-flight relevance check for every product that accepts a raw
// patent number from a client. Stops a client from paying for (or queuing)
// a check on a patent this business has nothing to say about -- e.g. a
// furniture or software patent -- before any money changes hands or any
// manual-review time gets spent on it.
//
// CPC allow-list: A61K (medicinal preparations) and C07 (organic chemistry)
// -- kept identical, by hand, to CPC_PREFIXES in the pipeline repo's own
// 01_fetch_2025_patents.py (H:\CodeProjects\patent-chem-extraction-pilot),
// which is the pipeline's own established, tested definition of "a patent
// this business's chemistry tools apply to." If that list changes, update
// both places.
const CHEMISTRY_CPC_PREFIXES = ['A61K', 'C07']

// CPC codes live in the SAME Google Patents HTML page already fetched
// elsewhere in this codebase for compound/family extraction (verified
// directly against a real page: <span itemprop="Code">C07D239/22</span>
// under the classifications section) -- no extra network call needed when
// a caller already has the HTML.
export function extractCpcCodes(html: string): string[] {
  const $ = cheerio.load(html)
  const codes: string[] = []
  $('span[itemprop="Code"]').each((_, el) => {
    const text = $(el).text().trim()
    if (text) codes.push(text)
  })
  return codes
}

export type RelevanceResult = {
  relevant: boolean
  reason?: 'not_chemistry' | 'unverifiable'
  cpcCodes?: string[]
}

export const NOT_CHEMISTRY_MESSAGE =
  "This doesn't look like a chemistry or pharmaceutical patent (no A61K/C07 classification found) -- our tools are built specifically for chemical structure and patent-chemistry analysis, and aren't designed for other patent types."

// Deliberately fails OPEN (returns 'unverifiable', never blocks) when the
// patent's Google Patents page can't be fetched at all -- a fetch failure
// here just as easily means "this patent is too new for Google's own page
// indexing yet" (a real, confirmed lag, see PORTFOLIO_LANDSCAPE_RESULTS.md
// and the 2026-08-30 session findings) as it means "bad patent number."
// Blocking on inability-to-verify would wrongly reject exactly the newest,
// most valuable patents this business increasingly wants to serve. Only
// ever block when CPC codes were actually read and none matched -- i.e.
// positive evidence of irrelevance, not absence of evidence of relevance.
export async function checkPatentRelevance(patentNumber: string): Promise<RelevanceResult> {
  const html = await fetchPatentHtml(patentNumber)
  if (!html) {
    return { relevant: false, reason: 'unverifiable' }
  }
  const cpcCodes = extractCpcCodes(html)
  const isRelevant = cpcCodes.some((code) => CHEMISTRY_CPC_PREFIXES.some((prefix) => code.startsWith(prefix)))
  if (isRelevant) {
    return { relevant: true, cpcCodes }
  }
  return { relevant: false, reason: 'not_chemistry', cpcCodes }
}
