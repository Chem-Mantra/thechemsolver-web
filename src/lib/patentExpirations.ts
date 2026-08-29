import { supabase } from './supabase'

export type PatentExpiration = {
  id: string
  drug_name: string
  title: string
  caption: string
  patent_number: string | null
  expiry_date: string | null
  image_url: string
  published_date: string
}

// Same deterministic-slug approach as patentNews.ts's slugify -- no schema
// migration or uniqueness bookkeeping needed for URLs.
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export async function getAllExpirations(): Promise<PatentExpiration[]> {
  const { data, error } = await supabase
    .from('patent_expirations')
    .select('id, drug_name, title, caption, patent_number, expiry_date, image_url, published_date')
    .order('published_date', { ascending: false })
    .limit(200)
  if (error) {
    console.warn('patent_expirations fetch failed:', error.message)
    return []
  }
  return data as PatentExpiration[]
}

export async function getExpirationBySlug(slug: string): Promise<PatentExpiration | null> {
  const items = await getAllExpirations()
  return items.find((a) => slugify(a.title) === slug) ?? null
}
