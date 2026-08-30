import { faqJsonLd, type FaqItem } from '@/lib/faqSchema'

// Visible content and JSON-LD are built from the exact same array on purpose
// -- Google's structured-data guidelines require FAQPage schema to match
// what's actually shown on the page, not just be bolted on for rich results.
export default function FaqSection({ title, faqs }: { title: string; faqs: FaqItem[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--on-surface)' }}>{title}</h2>
      <div className="flex flex-col gap-2">
        {faqs.map((f) => (
          <details key={f.question} className="pa-glass p-5">
            <summary className="text-sm font-semibold cursor-pointer" style={{ color: 'var(--on-surface)' }}>
              {f.question}
            </summary>
            <p className="text-sm mt-2" style={{ color: 'var(--on-surface-variant)' }}>{f.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
    </section>
  )
}
