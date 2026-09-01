import { supabase } from './supabase'

export type PatentNewsArticle = {
  id: string
  title: string
  summary: string
  body: string
  parties: string
  source_url: string
  image_url: string | null
  inline_image_url: string | null
  published_date: string
}

// Deterministic, not stored -- computed the same way whenever we need a
// URL for an article and whenever we need to resolve one back to a row,
// so no schema migration or uniqueness bookkeeping is needed for it.
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 80)
    .replace(/^-+|-+$/g, '')
}

export async function getAllArticles(): Promise<PatentNewsArticle[]> {
  const { data, error } = await supabase
    .from('patent_news')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(200)
  if (error) {
    console.warn('patent_news fetch failed:', error.message)
    return []
  }
  return data as PatentNewsArticle[]
}

export async function getArticleBySlug(slug: string): Promise<PatentNewsArticle | null> {
  const articles = await getAllArticles()
  return articles.find((a) => slugify(a.title) === slug) ?? null
}
