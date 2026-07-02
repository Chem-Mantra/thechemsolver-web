import type { Metadata } from 'next'
import EbookClient from './EbookClient'

export const metadata: Metadata = {
  title: 'Organic Chemistry Ebook — Orgo 1 & 2 Interactive Study Guide',
  description:
    'Free interactive Organic Chemistry ebook for Orgo 1 & 2. Concept-by-concept lessons with worked mechanisms, KaTeX formulas, practice MCQs, and flashcard decks. Pre-med and MCAT ready.',
  openGraph: {
    title: 'Organic Chemistry Interactive Ebook | TheChemSolver',
    description:
      'Free interactive Orgo 1 & 2 ebook — mechanisms, stereochemistry, carbonyl chemistry, spectroscopy. Practice MCQs and flashcards for every chapter.',
    url: 'https://www.thechemsolver.com/ebook/organic-chemistry',
    siteName: 'TheChemSolver',
    type: 'website',
  },
  alternates: { canonical: 'https://www.thechemsolver.com/ebook/organic-chemistry' },
}

const courseLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Organic Chemistry Ebook — Orgo 1 & 2 Interactive Study Guide',
  description:
    'Free interactive Organic Chemistry ebook covering all 22 chapters of Orgo 1 & 2 with worked mechanisms, KaTeX formulas, practice MCQs, and flashcard decks.',
  provider: {
    '@type': 'Organization',
    name: 'TheChemSolver',
    sameAs: 'https://www.thechemsolver.com',
  },
  isAccessibleForFree: true,
  url: 'https://www.thechemsolver.com/ebook/organic-chemistry',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
  },
}

export default function OrganicChemistryEbookPage() {
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
