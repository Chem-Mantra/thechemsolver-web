import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
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
            and Google Analytics (when configured) to understand which pages and tools are used, in
            aggregate. This does not sell personal profiles.
          </p>
          <p>
            <strong className="text-white">Accounts (optional):</strong> You may browse public pages
            without an account. Interactive labs and ebooks start with a 15-day free trial (local
            trial clock and/or Google sign-in). After the trial, continued access to interactive
            tools requires a paid year of access. Sign-in is used to restore access across devices
            and to link PayPal purchases.
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Advertising (Google AdSense)</h2>
          <p>
            This site may be supported by advertising served through Google AdSense (publisher ID
            ca-pub-4376919875096457). Third-party vendors, including Google, use cookies to serve
            ads based on a user&apos;s prior visits to this website or other websites. Google&apos;s
            use of advertising cookies enables it and its partners to serve ads based on visits to
            this site and/or other sites on the Internet.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{' '}
            <a
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              Google Ads Settings
            </a>
            . Alternatively, you can opt out of some third-party vendors&apos; uses of cookies for
            personalized advertising at{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              aboutads.info
            </a>
            . Learn more:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              How Google uses information from sites that use our services
            </a>
            .
          </p>

          <h2 className="text-lg font-bold text-white mt-8 mb-2">Cookies</h2>
          <p>
            Cookies on this site are used by Google AdSense (when ads are active), analytics, and
            essential features such as trial/access state and sign-in sessions. We do not sell cookie
            data. You can control cookies in your browser settings; blocking all cookies may break
            sign-in or trial features.
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
            <a href="mailto:support@thechemsolver.com" className="text-purple-400 hover:text-purple-300">
              support@thechemsolver.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
