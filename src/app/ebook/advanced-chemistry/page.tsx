import type { Metadata } from 'next'
import EbookClient from './EbookClient'

export const metadata: Metadata = {
  title: 'Advanced Chemistry Ebook — USNCO & IChO Interactive Study Guide',
  description:
    'Free interactive Advanced Chemistry ebook covering the topics beyond AP Chemistry that USNCO National and IChO actually test — analytical chemistry, advanced kinetics, thermodynamics, and equilibrium. Grounded in real past-paper topic frequency.',
  openGraph: {
    title: 'Advanced Chemistry Interactive Ebook | TheChemSolver',
    description:
      'Free interactive ebook for USNCO National and IChO — analytical chemistry, advanced kinetics, thermodynamics, equilibrium, and more.',
    url: 'https://www.thechemsolver.com/ebook/advanced-chemistry',
    siteName: 'TheChemSolver',
    type: 'website',
  },
  alternates: { canonical: 'https://www.thechemsolver.com/ebook/advanced-chemistry' },
}

const courseLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Advanced Chemistry Ebook — USNCO & IChO Interactive Study Guide',
  description:
    'Free interactive Advanced Chemistry ebook covering analytical chemistry, advanced kinetics, thermodynamics, and equilibrium for USNCO National and IChO preparation.',
  provider: {
    '@type': 'Organization',
    name: 'TheChemSolver',
    sameAs: 'https://www.thechemsolver.com',
  },
  isAccessibleForFree: true,
  url: 'https://www.thechemsolver.com/ebook/advanced-chemistry',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
  },
}

export default function AdvancedChemistryEbookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
      />
      <EbookClient />
    </>
  )
}
