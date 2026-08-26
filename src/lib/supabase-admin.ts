import { createClient } from '@supabase/supabase-js'

// SERVER-ONLY. Uses the service role key, which bypasses Row Level
// Security entirely -- must never be imported into a 'use client' file or
// otherwise reach the browser bundle. Used by API routes that need to
// write data anon users aren't allowed to (patent_news articles,
// linkedin_tokens), where the frontend client (src/lib/supabase.ts, anon
// key) intentionally can't.
const url = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL!
const serviceKey = process.env.THECHEMSOLVER_SUPABASE_SERVICE_KEY!

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
