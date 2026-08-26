import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Chemistry Blog — AP, USNCO & Organic Guides',
  description:
    'Free AP Chemistry, USNCO, and Organic Chemistry study guides from TheChemSolver — titration curves, olympiad strategy, and mechanism decision trees with interactive labs.',
  alternates: { canonical: 'https://www.thechemsolver.com/blog' },
  openGraph: {
    title: 'TheChemSolver Chemistry Blog',
    description: 'AP, USNCO, and Orgo guides paired with free interactive labs.',
    url: 'https://www.thechemsolver.com/blog',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <div className="max-w-3xl mx-auto px-5 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">Study guides</p>
        <h1 className="text-3xl md:text-4xl font-black mb-3">Chemistry blog</h1>
        <p className="text-sm text-gray-400 mb-10 leading-relaxed max-w-2xl">
          Exam-focused guides for AP Chemistry, USNCO, and Organic Chemistry — each linked to a free
          interactive lab on TheChemSolver (15-day free trial, then $15/year).
        </p>

        <div className="flex flex-col gap-5">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/[0.03] hover:border-purple-500/40 p-6 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-[11px] text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  · {post.readMinutes} min
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{post.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
