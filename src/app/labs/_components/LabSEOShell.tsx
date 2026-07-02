import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LAB_META, getLabBody } from '../_data/labMeta'

const US_BASE = 'https://www.thechemsolver.com'

function AdSlot({ className = '', label = 'Advertisement' }: { className?: string; label?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-gray-700 text-[10px] ${className}`}>
      {/* Replace the div above with <ins className="adsbygoogle"> once AdSense is approved */}
      <span className="uppercase tracking-widest opacity-50">{label}</span>
    </div>
  )
}

export default function LabSEOShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const meta = LAB_META[slug]
  if (!meta) notFound()

  const url = `${US_BASE}/labs/${slug}`

  const learningResourceLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: meta.name,
    headline: meta.h1,
    description: meta.description,
    url,
    isAccessibleForFree: true,
    learningResourceType: 'Interactive Simulation',
    about: meta.topics,
    ...(meta.apUnits.length > 0 ? { teaches: meta.apUnits } : {}),
    provider: {
      '@type': 'Organization',
      name: 'TheChemSolver',
      url: US_BASE,
    },
  }

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${meta.name}`,
    step: meta.howTo.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }

  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
      />

      {/* Brief header for SEO — above the tool */}
      <div className="border-b border-white/10 px-5 py-4 bg-[#060610]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/" className="hover:text-white transition-colors">TheChemSolver</Link>
            <span>/</span>
            <Link href="/labs" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-gray-300">{meta.name}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-white">{meta.h1}</h1>
              <p className="text-xs text-gray-400 mt-0.5 max-w-2xl">{meta.description.split('.')[0]}.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {meta.apUnits.length > 0 && (
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full whitespace-nowrap">
                  {meta.apUnits[0].split(':')[0]}
                </span>
              )}
              {meta.icho && (
                <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-1 rounded-full">IChO</span>
              )}
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 rounded-full">Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard ad above tool */}
      <div className="px-5 py-2 max-w-6xl mx-auto">
        <AdSlot className="h-14 max-w-[728px]" label="728×90 Leaderboard" />
      </div>

      {/* Two-column layout: 70% tool + 30% sticky sidebar ad */}
      <div className="flex gap-5 max-w-6xl mx-auto px-5 items-start">

        {/* ── Left: interactive tool (70%) ────────────────────── */}
        <div className="flex-1 min-w-0">
          {children}

          {/* Horizontal ad directly below the tool — high CTR position */}
          <div className="mt-4">
            <AdSlot className="h-24" label="300×250 Below Tool" />
          </div>
        </div>

        {/* ── Right: sticky 300×600 ad sidebar (30%) ───────────── */}
        <aside className="hidden lg:block w-[300px] shrink-0">
          <div className="sticky top-20 space-y-4">
            <AdSlot className="w-[300px] h-[600px]" label="300×600 Half Page" />
            <AdSlot className="w-[300px] h-[250px]" label="300×250 Rectangle" />
          </div>
        </aside>
      </div>

      {/* Mobile sticky anchor ad (hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060610]/95 backdrop-blur border-t border-white/10 py-1.5 px-3 flex justify-center">
        <AdSlot className="h-14 w-full max-w-[320px]" label="320×50 Mobile Anchor" />
      </div>
      {/* Spacer so content doesn't hide behind mobile anchor */}
      <div className="lg:hidden h-16" />

      {/* SEO content section — below the tool */}
      <div className="border-t border-white/10 mt-8 px-5 py-12 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">

          {/* Topics covered */}
          <div>
            <h2 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Topics Covered</h2>
            <ul className="space-y-1.5">
              {meta.topics.map(t => (
                <li key={t} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* How to use */}
          <div>
            <h2 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">How to Use</h2>
            <ol className="space-y-2">
              {meta.howTo.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="bg-purple-600/30 text-purple-300 rounded-full w-5 h-5 flex items-center justify-center shrink-0 font-bold text-[10px]">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Curriculum alignment */}
          <div>
            <h2 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wider">Curriculum Alignment</h2>
            <div className="space-y-2">
              {meta.apUnits.length > 0 && (
                <div>
                  <div className="text-xs text-blue-400 font-semibold mb-1">AP Chemistry</div>
                  {meta.apUnits.map(u => (
                    <div key={u} className="text-xs text-gray-400 bg-blue-500/5 border border-blue-500/10 rounded px-2 py-1 mb-1">{u}</div>
                  ))}
                </div>
              )}
              {meta.icho && (
                <div>
                  <div className="text-xs text-yellow-400 font-semibold mb-1">IChO Syllabus</div>
                  <div className="text-xs text-gray-400 bg-yellow-500/5 border border-yellow-500/10 rounded px-2 py-1">Included in IChO preparatory topics</div>
                </div>
              )}
              <div className="mt-3">
                <div className="text-xs text-green-400 font-semibold mb-1">Access</div>
                <div className="text-xs text-gray-400">100% free · No account · No time limit</div>
              </div>
            </div>
          </div>
        </div>

        {/* 300+ word SEO prose — required for AdSense approval */}
        <div className="max-w-4xl mx-auto mt-10 pt-8 border-t border-white/10">
          <h2 className="text-lg font-bold mb-4">{meta.h1.split('—')[0].trim()} — In Depth</h2>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-4">
            {getLabBody(slug, meta).split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para.trim()}</p>
            ))}
          </div>
        </div>

        {/* Ad below long-form content */}
        <div className="max-w-4xl mx-auto mt-8">
          <AdSlot className="h-24" label="728×90 Below Article" />
        </div>

        {/* Related tools */}
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-white/10">
          <h2 className="font-bold text-sm text-gray-300 mb-4 uppercase tracking-wider">More Free Chemistry Tools</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LAB_META)
              .filter(([s]) => s !== slug)
              .slice(0, 8)
              .map(([s, m]) => (
                <Link
                  key={s}
                  href={`/labs/${s}`}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {m.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
