import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | TheChemSolver',
  description: 'Privacy Policy for TheChemSolver — how we use cookies, Google AdSense, analytics, and any information you provide.',
  alternates: { canonical: 'https://www.thechemsolver.com/privacy' },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'July 2026'

export default function PrivacyPage() {
  return (
    <div className="bg-[#060610] text-white min-h-screen">
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mb-8">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed space-y-5">
          <p>
            TheChemSolver ("we," "our," or "the site") provides free chemistry simulators, ebooks,
            and practice tools at thechemsolver.com. This policy explains what information is
            collected when you use the site and how it's used.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Information we collect</h2>
          <p>
            <strong className="text-white">Email address (optional):</strong> If you voluntarily submit your email
            through one of our "get updates" signup forms, we store that email address to send
            occasional updates about new tools or study guides. You can ask us to remove your email
            at any time by contacting us (see below).
          </p>
          <p>
            <strong className="text-white">Usage data:</strong> We use privacy-focused analytics (Vercel Analytics)
            to understand which pages and tools are used, in aggregate. This does not identify you
            personally.
          </p>
          <p>
            We do not require an account to use any simulator, ebook, or practice tool on this site.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Advertising (Google AdSense)</h2>
          <p>
            This site is supported by advertising served through Google AdSense. Google and its
            partners may use cookies and similar technologies to serve ads based on your prior
            visits to this site or other websites. You can learn more about how Google uses data
            and manage your ad personalization settings at{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              Google Ads Settings
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              How Google uses information from sites that use our services
            </a>.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Cookies</h2>
          <p>
            Cookies on this site are used by our advertising partner (Google AdSense) and by our
            analytics provider. We do not use cookies to store personal profiles ourselves.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Children's privacy</h2>
          <p>
            TheChemSolver is intended for high school and college students studying chemistry. We do
            not knowingly collect personal information from children under 13. If you believe a
            child under 13 has submitted their email through our signup form, contact us and we will
            remove it.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Data sharing</h2>
          <p>
            We do not sell your personal information. Email addresses submitted through our signup
            forms are stored with our database provider (Supabase) and are not shared with third
            parties except as needed to operate the site.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Contact</h2>
          <p>
            Questions about this policy, or requests to remove your email from our list, can be sent
            to{' '}
            <a href="mailto:admin@thechemsolver.com" className="text-purple-400 hover:text-purple-300">
              admin@thechemsolver.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
