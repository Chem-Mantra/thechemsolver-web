import Link from 'next/link'
import { PRODUCTS, getLatestAcrossProducts, type ProductType } from '@/lib/productResults'
import { getAllExpirations, slugify as slugifyExpiration } from '@/lib/patentExpirations'
import AutoScrollList from './AutoScrollList'

type CardItem = { href: string; label: string }
// Patent Expiry Watch isn't a product_results-backed product (it's daily
// infographic content, see patentExpirations.ts), so it can't reuse
// ProductType/PRODUCTS -- a small discriminated union instead of forcing
// it into that type.
type CardData =
  | { kind: 'product'; productType: ProductType; items: CardItem[] }
  | { kind: 'expirations'; items: CardItem[] }

/** One block card per product, listing real linked items. Self-scrolls
 * only once there are enough real items to make that worthwhile -- a 1-2
 * item list just displays plainly. */
function BlockCard({ title, href, items }: { title: string; href: string; items: CardItem[] }) {
  const scrolls = items.length >= 4

  return (
    <div className="pa-glass pa-glass-elevated p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--tertiary-bright)' }} />
        <Link href={href} className="text-xs font-semibold uppercase tracking-wide hover:underline" style={{ color: 'var(--on-surface)' }}>
          {title}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>Results processing — check back soon.</p>
      ) : scrolls ? (
        <AutoScrollList items={items} />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
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
      )}
    </div>
  )
}

export default async function ProductSidebarCards({ side }: { side: 'left' | 'right' }) {
  const [live, expirations] = await Promise.all([getLatestAcrossProducts(8), getAllExpirations()])

  const cardsData: CardData[] = [
    {
      kind: 'product', productType: 'fto_triage',
      items: live.fto_triage.map((r) => ({ href: `/patent-analytics/data/fto-triage/${r.patent_number}`, label: r.headline })),
    },
    {
      kind: 'product', productType: 'portfolio_landscape',
      items: live.portfolio_landscape.map((r) => ({ href: `/patent-analytics/data/portfolio-landscape/${r.patent_number}`, label: r.headline })),
    },
    {
      kind: 'product', productType: 'markush_coverage',
      items: live.markush_coverage.map((r) => ({ href: `/patent-analytics/data/markush-coverage/${r.patent_number}`, label: r.headline })),
    },
    {
      kind: 'product', productType: 'section_3d',
      items: live.section_3d.map((r) => ({ href: `/patent-analytics/data/section-3d/${r.patent_number}`, label: r.headline })),
    },
    {
      kind: 'expirations',
      items: expirations.slice(0, 8).map((e) => ({ href: `/patent-analytics/expirations/${slugifyExpiration(e.title)}`, label: e.title })),
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
        {shown.map((c) =>
          c.kind === 'product' ? (
            <BlockCard key={c.productType} title={PRODUCTS[c.productType].shortName} href={`/patent-analytics/data/${PRODUCTS[c.productType].slug}`} items={c.items} />
          ) : (
            <BlockCard key="expirations" title="Patent Expiry Watch" href="/patent-analytics/expirations" items={c.items} />
          )
        )}
      </div>
    </aside>
  )
}
