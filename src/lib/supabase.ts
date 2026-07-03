import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_THECHEMSOLVER_SUPABASE_ANON_KEY!

// Browser-safe client (anon key, used in client components and API routes).
// PKCE flow is required for the native app's Google sign-in: the OAuth
// redirect returns a `code` via a custom URL scheme deep link, exchanged
// for a session in AuthCallbackListener.tsx — see docs/RAZORPAY_SETUP.md.
export const supabase = createClient(url, anon, {
  auth: { flowType: 'pkce' },
})

// Type helpers matching our 3 tables
export type MCQRow = {
  id: number
  source: string
  year: number
  exam: string
  question_number: number
  stem: string
  options: { A: string; B: string; C: string; D: string }
  correct_answer: 'A' | 'B' | 'C' | 'D'
  topic: string
  subtopic: string
  has_visual: boolean
  image_url: string | null
}

export type FRQPart = {
  label: string
  question: string
  points: number | null
  model_answer: string | null
  image_url?: string | null
}

export type FRQRow = {
  id: number
  source: string
  year: number
  exam: string
  problem_number: number
  frq_type: string
  context: string
  parts: FRQPart[]
  total_points: number | null
  topic: string
  has_visual: boolean
  image_url: string | null
}

export type IChOPart = {
  label: string
  question: string
  points: number | null
  model_answer: string | null
  image_url?: string | null
  sub_parts?: { label: string; question: string; points: number | null; model_answer: string | null; image_url?: string | null }[]
}

export type IChORow = {
  id: number
  source: string
  year: number | null
  icho_edition: string
  problem_number: number
  title: string
  domain: string
  context: string
  parts: IChOPart[]
  total_points: number | null
  has_visual: boolean
  image_url: string | null
}
