import { supabaseAdmin } from './supabase-admin'

export type StructureRecord = {
  page: number
  tier: 'confirmed' | 'needs_review' | 'failed'
  reason: string | null
  molscribe_smiles: string | null
  molnextr_smiles: string | null
}

export type LiveExtractionResultJson = {
  patent_number: string
  n_pages_total: number
  n_pages_scanned: number
  n_structures_found: number
  n_confirmed: number
  structures: StructureRecord[]
  error_message: string | null
  timing: Record<string, unknown>
}

export type CompoundMatchResult = {
  matched: boolean
  query_canonical_smiles: string | null
  matched_pages: number[]
  error?: string
}

export type LiveExtractionRequest = {
  id: string
  patent_number: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  outcome: 'confirmed' | 'needs_review' | null
  unlocked: boolean
  result_json: LiveExtractionResultJson | null
  error_message: string | null
  created_at: string
  completed_at: string | null
  // Compound-vs-one-patent variant only -- null for the regular "list every
  // structure in this patent" flow. See live_extraction_schema_compound_match_addendum.sql
  // -- these columns must exist in the DB before this file's .select() below
  // is updated to request them (same rule that bit the `unlocked` rollout).
  query_compound_input: string | null
  match_result: CompoundMatchResult | null
}

// Server-side only (admin/service-role client, never exposed to the
// browser) -- this table has no public RLS read policy since it stores
// requester_email/requester_name, so a public anon-key read would 404
// regardless of this query's own field list. Using the admin client here
// and deliberately selecting only fields safe to show any visitor who has
// the (unguessable uuid) link -- never requester_email/requester_name --
// is what actually keeps that data private, not RLS on this table.
export async function getLiveExtractionRequest(id: string): Promise<LiveExtractionRequest | null> {
  const { data, error } = await supabaseAdmin
    .from('live_extraction_requests')
    .select('id, patent_number, status, outcome, unlocked, result_json, error_message, created_at, completed_at, query_compound_input, match_result')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return data as LiveExtractionRequest
}
