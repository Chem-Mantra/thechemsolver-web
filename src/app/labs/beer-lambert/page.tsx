import { Metadata } from 'next'
import LabSEOShell from '../_components/LabSEOShell'
import { LAB_META } from '../_data/labMeta'
import BeerLambertTool from './BeerLambertTool'

const SLUG = 'beer-lambert'
const US_BASE = 'https://www.thechemsolver.com'
const meta = LAB_META[SLUG]

export const metadata: Metadata = {
  title: meta.h1,
  description: meta.description,
  keywords: meta.keywords.join(', '),
  alternates: { canonical: `${US_BASE}/labs/${SLUG}` },
  openGraph: {
    title: `${meta.name} — Free Chemistry Tool`,
    description: meta.description,
    url: `${US_BASE}/labs/${SLUG}`,
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

export default function Page() {
  return (
    <LabSEOShell slug={SLUG}>
      <BeerLambertTool />
    </LabSEOShell>
  )
}
