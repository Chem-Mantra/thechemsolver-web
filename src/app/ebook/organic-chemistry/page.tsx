import type { Metadata } from 'next'
import EbookClient from './EbookClient'

export const metadata: Metadata = {
  title: 'Organic Chemistry Ebook — Orgo 1 & 2 Interactive Study Guide | TheChemSolver',
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

export default function OrganicChemistryEbookPage() {
  return <EbookClient />
}
