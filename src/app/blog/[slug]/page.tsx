import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS, getPost, getAllSlugs } from '@/lib/blog'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDesc,
    alternates: { canonical: `https://www.thechemsolver.com/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDesc,
      url: `https://www.thechemsolver.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      siteName: 'TheChemSolver',
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDesc,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'TheChemSolver' },
    publisher: {
      '@type': 'Organization',
      name: 'TheChemSolver',
      url: 'https://www.thechemsolver.com',
    },
    mainEntityOfPage: `https://www.thechemsolver.com/blog/${post.slug}`,
  }

  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-2xl mx-auto px-5 py-16">
        <Link href="/blog" className="text-xs text-gray-500 hover:text-white mb-6 inline-block">
          ← All posts
        </Link>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-purple-300 uppercase">{post.category}</span>
          <span className="text-[11px] text-gray-500">
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            · {post.readMinutes} min read
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{post.title}</h1>
        <div
          className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed
            prose-headings:text-white prose-a:text-purple-400 prose-strong:text-white
            prose-li:marker:text-purple-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {related.length > 0 && (
          <div className="mt-14 pt-8 border-t border-white/10">
            <h2 className="text-sm font-bold text-white mb-4">More guides</h2>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="text-sm text-purple-300 hover:text-white">
                    {r.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </div>
  )
}
