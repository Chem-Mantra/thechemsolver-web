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

export default function APChemistryEbookPage() {
  return <EbookClient />
}
