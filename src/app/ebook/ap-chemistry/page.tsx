import AccessGate from '@/app/AccessGate'
import type { Metadata } from 'next'
import EbookClient from './EbookClient'

export const metadata: Metadata = {
  title: 'AP Chemistry Ebook — Interactive Study Guide',
  description:
    'Free interactive AP Chemistry ebook on TheChemSolver. Immersive concept-by-concept lessons with KaTeX formulas, interactive MCQs, flashcards, and simulation placeholders for all 9 units.',
  openGraph: {
    title: 'AP Chemistry Interactive Ebook | TheChemSolver',
    description:
      'Free interactive AP Chemistry ebook — concept lessons, practice MCQs, flashcard decks, and simulations. Track your progress unit by unit.',
    url: 'https://www.thechemsolver.com/ebook/ap-chemistry',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const courseLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'AP Chemistry Ebook — Interactive Study Guide',
  description:
    'Free interactive AP Chemistry ebook covering all 9 units with KaTeX formulas, practice MCQs, flashcards, and simulation-linked lessons.',
  provider: {
    '@type': 'Organization',
    name: 'TheChemSolver',
    sameAs: 'https://www.thechemsolver.com',
  },
  isAccessibleForFree: true,
  url: 'https://www.thechemsolver.com/ebook/ap-chemistry',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
  },
}

export default function APChemistryEbookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseLd) }}
      />
      <AccessGate title="Continue the interactive ebook"><EbookClient /></AccessGate>
    </>
  )
}
