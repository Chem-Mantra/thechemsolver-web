import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact TheChemSolver',
  description:
    'Contact TheChemSolver support for AP Chemistry, USNCO, IChO, and Organic Chemistry tools — questions, corrections, billing, and partnership inquiries.',
  alternates: { canonical: 'https://www.thechemsolver.com/contact' },
  openGraph: {
    title: 'Contact TheChemSolver',
    description: 'Support and feedback for free chemistry labs, practice, and ebooks.',
    url: 'https://www.thechemsolver.com/contact',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <div className="max-w-xl mx-auto px-5 py-16">
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">Support</p>
        <h1 className="text-3xl font-black mb-3">Contact us</h1>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          Questions about labs, practice sets, billing after your free trial, or a content correction?
          We read every message.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <ContactForm />
        </div>

        <div className="space-y-3 text-sm text-gray-400">
          <p>
            Prefer email?{' '}
            <a href="mailto:support@thechemsolver.com" className="text-purple-400 hover:text-purple-300">
              support@thechemsolver.com
            </a>
          </p>
          <p>
            Account / PayPal access:{' '}
            <Link href="/account" className="text-purple-400 hover:text-purple-300">
              thechemsolver.com/account
            </Link>
          </p>
          <p className="text-xs text-gray-600 pt-2">
            See also{' '}
            <Link href="/privacy" className="text-purple-400/80 hover:text-purple-300">
              Privacy
            </Link>{' '}
            ·{' '}
            <Link href="/terms" className="text-purple-400/80 hover:text-purple-300">
              Terms
            </Link>{' '}
            ·{' '}
            <Link href="/about" className="text-purple-400/80 hover:text-purple-300">
              About
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
