import Link from 'next/link'
import { PRODUCTS, getLatestAcrossProducts, type ProductType } from '@/lib/productResults'
import { MARKUSH_SAMPLE, SECTION_3D_SAMPLE } from './data/sampleContent'

type CardItem = { href: string; label: string }

/** One block card per product, listing real linked items. Self-scrolls
 * (CSS keyframe, auto-duplicated content) only once there are enough real
 * items to make that worthwhile -- a 1-2 item list just displays plainly. */
function ProductCard({ productType, items }: { productType: ProductType; items: CardItem[] }) {
  const p = PRODUCTS[productType]
  const scrolls = items.length >= 4
  const displayItems = scrolls ? [...items, ...items] : items // duplicate for seamless loop

  return (
    <div className="pa-glass pa-glass-elevated p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--tertiary-bright)' }} />
        <Link href={`/patent-analytics/data/${p.slug}`} className="text-xs font-semibold uppercase tracking-wide hover:underline" style={{ color: 'var(--on-surface)' }}>
          {p.shortName}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>Results processing — check back soon.</p>
      ) : (
        <div className={scrolls ? 'pa-sidebar-scroll-viewport' : undefined}>
          <div className={scrolls ? 'pa-sidebar-scroll-track' : 'flex flex-col gap-2'}>
            {displayItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="block text-xs leading-snug px-2 py-1.5 rounded-md hover:bg-black/[0.03] transition-colors"
                style={{ color: 'var(--on-surface-variant)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function ProductSidebarCards({ side }: { side: 'left' | 'right' }) {
  const live = await getLatestAcrossProducts(8)

  const cardsData: { productType: ProductType; items: CardItem[] }[] = [
    {
      productType: 'fto_triage',
      items: live.fto_triage.map((r) => ({ href: `/patent-analytics/data/fto-triage#${r.id}`, label: r.headline })),
    },
    {
      productType: 'portfolio_landscape',
      items: live.portfolio_landscape.map((r) => ({ href: `/patent-analytics/data/portfolio-landscape#${r.id}`, label: r.headline })),
    },
    {
      productType: 'markush_coverage',
      items: [{ href: '/patent-analytics/data/markush-coverage', label: MARKUSH_SAMPLE.caseTitle }],
    },
    {
      productType: 'section_3d',
      items: [{ href: '/patent-analytics/data/section-3d', label: SECTION_3D_SAMPLE.caseTitle }],
    },
  ]

  // Split across left/right sidebars so both blank margins get used.
  const half = Math.ceil(cardsData.length / 2)
  const shown = side === 'left' ? cardsData.slice(0, half) : cardsData.slice(half)

  return (
    <aside className="hidden xl:block w-[260px] shrink-0 py-12 md:py-16">
      <div className="sticky top-24">
        <p className="pa-mono text-[10px] uppercase tracking-wide mb-3 px-1" style={{ color: 'var(--on-surface-muted)' }}>
          Free sample data
        </p>
        {shown.map((c) => (
          <ProductCard key={c.productType} productType={c.productType} items={c.items} />
        ))}
      </div>
    </aside>
  )
}
