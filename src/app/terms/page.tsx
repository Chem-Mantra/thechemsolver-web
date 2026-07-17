import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of Use for TheChemSolver — the free chemistry simulators, ebooks, and practice tools.',
  alternates: { canonical: 'https://www.thechemsolver.com/terms' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'July 2026'

export default function TermsPage() {
  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-black mb-2">Terms of Use</h1>
        <p className="text-xs text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-5">
          <p>
            By using TheChemSolver (thechemsolver.com), you agree to these terms. If you don't
            agree, please don't use the site.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Free trial, then paid access</h2>
          <p>
            New students may explore interactive labs, practice sets, and ebooks free for 15 days
            (trial starts on first visit for guests, or on first Google sign-in for accounts). After
            the trial, continued access to those interactive tools requires a paid plan (see Payments
            below). Marketing pages and public SEO content remain free to browse. We reserve the right
            to modify, suspend, or discontinue any tool or feature at any time.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Educational use only</h2>
          <p>
            Content on this site — simulators, explanations, practice questions, and ebook material —
            is provided for educational study purposes. While we aim for accuracy, we make no
            guarantee that content is error-free or that it fully reflects any specific exam's current
            official curriculum. Always cross-check against your official course materials and exam
            board resources (College Board, ACS, IChO) before an exam.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">No warranty</h2>
          <p>
            The site is provided "as is" without warranties of any kind. We are not liable for any
            damages arising from your use of the site, including reliance on any content for exam
            preparation.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Intellectual property</h2>
          <p>
            Original content, simulators, and design on this site are owned by TheChemSolver.
            Preparatory problems from official exam bodies (e.g., IChO, USNCO) are used for
            educational reference; rights to those original problem sets remain with their
            respective exam organizations.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Advertising</h2>
          <p>
            This site displays third-party advertising served through Google AdSense. We are not
            responsible for the content of ads shown by our advertising partners.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Payments</h2>
          <p>
            After the free trial, signed-in students may purchase full access for one year at the
            price shown on the site (currently $15/year for students). Payments are processed
            securely via PayPal; we do not store your card or PayPal details. This is a one-time
            payment for one year of access, not an auto-renewing subscription — access ends when the
            year expires unless you purchase again. Use the same email for Google sign-in and PayPal
            so access can be granted automatically.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Changes to these terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after changes
            means you accept the updated terms.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href="mailto:support@thechemsolver.com" className="text-purple-400 hover:text-purple-300">
              support@thechemsolver.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
