import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About TheChemSolver',
  description:
    'About TheChemSolver — who we are, what we build, freemium access for AP Chemistry, USNCO, and IChO students, and how to contact us.',
  alternates: { canonical: 'https://www.thechemsolver.com/about' },
}

export default function AboutPage() {
  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-black mb-6">About TheChemSolver</h1>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-5">
          <p>
            TheChemSolver is an interactive chemistry learning platform built for{' '}
            <strong className="text-white">AP Chemistry</strong>,{' '}
            <strong className="text-white">USNCO</strong> (US National Chemistry Olympiad),{' '}
            <strong className="text-white">IChO</strong> (International Chemistry Olympiad), and
            college-level Organic Chemistry students. We focus on visual, hands-on simulators and
            clear explanations — not clickbait or scraped content.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Who runs this site</h2>
          <p>
            TheChemSolver is operated by the same educator team behind Chem Mantra (India JEE/NEET
            chemistry coaching). Content and tools are designed for high-school and early-college
            chemistry: AP units, competition prep, and organic mechanisms. We are a small education
            project, not a large media network.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">What we offer</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>30+ interactive simulators (titration, equilibrium, kinetics, VSEPR, electrochemistry, quantum orbitals, organic mechanisms, and more)</li>
            <li>Interactive ebooks for AP Chemistry and Organic Chemistry</li>
            <li>USNCO and IChO-style practice pathways</li>
            <li>Free public study guides and hub pages (blog, exam overviews)</li>
          </ul>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Access model (transparent pricing)</h2>
          <p>
            Explore interactive labs, practice sets, and ebooks free for{' '}
            <strong className="text-white">15 days</strong>. After that, full student access is{' '}
            <strong className="text-white">$15 per year</strong> via PayPal (one year of access per
            purchase — not a surprise auto-renew). Marketing pages, About, Contact, Privacy, Terms,
            and study guides remain free to browse without payment.
          </p>
          <p>
            The site may display third-party ads (Google AdSense) for free and trial visitors. Paid
            students can use tools without ad inventory.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Content standards</h2>
          <p>
            We write and maintain original explanations and interactive tools aligned to public exam
            frameworks (College Board AP Chemistry, ACS/USNCO, IChO preparatory themes). We do not
            sell fake “guaranteed scores,” adult content, or copyright-infringing full exam dumps.
            Always cross-check official board materials for the current exam year.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Contact</h2>
          <p>
            Questions, corrections, billing after trial, or feedback:{' '}
            <Link href="/contact" className="text-purple-400 hover:text-purple-300">
              contact page
            </Link>{' '}
            or email{' '}
            <a href="mailto:support@thechemsolver.com" className="text-purple-400 hover:text-purple-300">
              support@thechemsolver.com
            </a>
            . For privacy requests: same address or see our Privacy Policy.
          </p>

          <p className="text-xs text-gray-500 pt-4">
            See also our{' '}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
