import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About & Contact',
  description: 'About TheChemSolver — free interactive chemistry simulators, ebooks, and practice tools for AP Chemistry, USNCO, and IChO students. How to contact us.',
  alternates: { canonical: 'https://www.thechemsolver.com/about' },
}

export default function AboutPage() {
  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-black mb-6">About TheChemSolver</h1>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-5">
          <p>
            TheChemSolver is a free, interactive chemistry learning platform built for AP Chemistry,
            USNCO (US National Chemistry Olympiad), IChO (International Chemistry Olympiad), and
            college-level Organic Chemistry students.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">What we offer</h2>
          <p>
            30+ interactive chemistry simulators (titration curves, equilibrium, kinetics, VSEPR,
            electrochemistry, quantum orbitals, and more), full interactive ebooks for AP Chemistry
            and Organic Chemistry, and preparatory problem sets for USNCO and IChO.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Free trial, then $15/year</h2>
          <p>
            Explore every lab, practice set, and ebook free for <strong>15 days</strong>. After that,
            full student access is <strong>$15/year</strong> via PayPal — no auto-renew surprise; one
            year of access per purchase. Marketing pages and study guides stay free to browse.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Contact</h2>
          <p>
            Questions, corrections, or feedback? Visit our{' '}
            <Link href="/contact" className="text-purple-400 hover:text-purple-300">
              contact page
            </Link>{' '}
            or email{' '}
            <a href="mailto:support@thechemsolver.com" className="text-purple-400 hover:text-purple-300">
              support@thechemsolver.com
            </a>.
          </p>

          <p className="text-xs text-gray-500 pt-4">
            See also our <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link> and{' '}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Use</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
