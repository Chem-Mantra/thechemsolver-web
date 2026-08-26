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
            and Organic Chemistry, and preparatory problem sets for USNCO and IChO — all free to use,
            with no paywall and no time limit.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Why is it free?</h2>
          <p>
            TheChemSolver is supported by display advertising. We believe strong chemistry
            preparation shouldn't depend on a student's or school's budget, so every tool, every
            simulation, and every practice set stays free and unlocked.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Who&rsquo;s behind TheChemSolver</h2>
          <p>
            TheChemSolver is built and maintained by Prashant Kotian, a chemistry researcher
            pursuing a PhD in Chemistry at the Institute of Chemical Technology (ICT), Mumbai,
            with 9+ years teaching organic and analytical chemistry for IIT-JEE and NEET. Every
            simulator, structure engine, and practice set on this site is written and verified
            in-house, not licensed from a third party.
          </p>
          <p>
            That same structure-verification work also powers our{' '}
            <Link href="/patent-analytics" className="text-purple-400 hover:text-purple-300">
              chemical patent structure analysis services
            </Link>{' '}
            for IP teams and patent attorneys — extracting and independently verifying chemical
            structures from patent documents, including genus/species (Markush) claim coverage
            analysis.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Contact</h2>
          <p>
            Questions, corrections, or feedback? Reach out at{' '}
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
