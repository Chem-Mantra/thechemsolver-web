import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import EmailCaptureForm from '../components/EmailCaptureForm'
import InterestForm from '../components/InterestForm'
import AuthNavButton from '../components/AuthNavButton'

// Rewritten (not redirected) from international.chem-mantra.online/ by
// middleware.ts, so the URL bar stays at the clean root -- this is the real
// homepage for that host now, replacing the provisional 302-to-/ap-chemistry
// from step 1 of the 2026-08-28 domain-split migration. Links here are
// relative: this page only ever renders on international.chem-mantra.online.
export const metadata: Metadata = {
  title: 'TheChemSolver International — Chemistry Tools for AP Chem, Orgo, USNCO & IChO',
  description: 'Free interactive chemistry solvers and virtual labs for AP Chemistry, Organic Chemistry, USNCO, and IChO. IUPAC namer, titration simulator, VSEPR, equilibrium, kinetics, electrochemistry and more.',
  keywords: 'AP chemistry tools free, organic chemistry solver, IChO chemistry, USNCO practice, IUPAC namer, titration simulator, VSEPR, equilibrium calculator, chemistry virtual lab',
  alternates: { canonical: 'https://international.chem-mantra.online/' },
  openGraph: {
    title: 'TheChemSolver International — Free Chemistry Solvers & Virtual Labs',
    description: 'Free interactive chemistry tools for AP Chemistry, Orgo, USNCO, and IChO students.',
    url: 'https://international.chem-mantra.online/',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const HUBS = [
  { label: 'AP Chemistry', href: '/ap-chemistry', color: 'blue', tag: 'College Board Exam', desc: 'Simulations · Ebook · Tests — all 9 units covered' },
  { label: 'Organic Chemistry', href: '/organic-chemistry', color: 'emerald', tag: 'Orgo 1 & 2 · Pre-Med', desc: 'Simulations · Ebook · Tests — 22 chapters, MCAT-ready' },
  { label: 'USNCO', href: '/usnco', color: 'orange', tag: 'US Chemistry Olympiad', desc: 'Simulations · Ebook · Tests — Local & National levels' },
  { label: 'IChO', href: '/icho', color: 'yellow', tag: 'International Olympiad', desc: 'Simulations · Ebook · Problems — university-depth prep' },
] as const

// Tailwind's JIT compiler only picks up literal class strings, not
// dynamically-built ones (`bg-${color}-700` is invisible to it and ships
// unstyled) -- every variant used anywhere below has to appear literally
// somewhere in this file, which is what this map's `cta` field is for.
const COLOR = {
  blue:    { bg: 'bg-blue-900/20 hover:bg-blue-900/35', border: 'border-blue-700/30 hover:border-blue-600/50', text: 'text-blue-400', cta: 'bg-blue-700 hover:bg-blue-600' },
  emerald: { bg: 'bg-emerald-900/20 hover:bg-emerald-900/35', border: 'border-emerald-700/30 hover:border-emerald-600/50', text: 'text-emerald-400', cta: 'bg-emerald-700 hover:bg-emerald-600' },
  orange:  { bg: 'bg-orange-900/20 hover:bg-orange-900/35', border: 'border-orange-700/30 hover:border-orange-600/50', text: 'text-orange-400', cta: 'bg-orange-700 hover:bg-orange-600' },
  yellow:  { bg: 'bg-yellow-900/20 hover:bg-yellow-900/35', border: 'border-yellow-700/30 hover:border-yellow-600/50', text: 'text-yellow-400', cta: 'bg-yellow-700 hover:bg-yellow-600' },
} as const

export default function InternationalHomePage() {
  return (
    <div className="bg-[#060610] text-white">
      <nav className="border-b border-white/10 px-5 py-4 flex items-center justify-between sticky top-0 bg-[#060610]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="TheChemSolver" width={32} height={32} className="rounded-full" priority />
          <span className="font-bold text-xl tracking-tight">TheChemSolver</span>
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">15-DAY FREE</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm">
          {HUBS.map(h => (
            <Link key={h.href} href={h.href} className={`${COLOR[h.color].text} hover:opacity-80 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors`}>{h.label}</Link>
          ))}
          <span className="text-white/20 mx-1">|</span>
          <Link href="/labs" className="text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">All Labs</Link>
          <Link href="/ebook/ap-chemistry" className="text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Ebook</Link>
        </div>
        <div className="flex items-center gap-2">
          <AuthNavButton />
          <Link href="/labs/nomenclature" className="hidden sm:inline-block bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">
            Try IUPAC Namer →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 py-20 md:py-28 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-sm text-purple-300 mb-6">
          🆓 15-day free trial · then $15/year
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-5 leading-tight tracking-tight">
          Chemistry Tools for
          <span className="block bg-gradient-to-r from-blue-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mt-1">
            AP · USNCO · IChO
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Explore every interactive lab and simulator free for 15 days — purpose-built for AP Chemistry Units 1–9 through IChO-level coordination chemistry. After that, full access is $15/year for students.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
          {HUBS.map(h => {
            const c = COLOR[h.color]
            return (
              <Link key={h.href} href={h.href} className={`group ${c.bg} border ${c.border} rounded-2xl p-5 text-left transition-all`}>
                <div className={`${c.text} text-xs font-bold uppercase tracking-widest mb-2`}>{h.label}</div>
                <div className="font-bold text-base mb-2">{h.tag}</div>
                <div className="text-gray-400 text-xs mb-4 leading-relaxed">{h.desc}</div>
                <div className={`${c.text} text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block`}>Open Hub →</div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { v: '30+', l: 'Simulators' },
            { v: '15d', l: 'Free Trial' },
            { v: '$15', l: 'Per Year' },
            { v: '4', l: 'Exam Tracks' },
          ].map(s => (
            <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-white mb-0.5">{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browse all simulations */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">30+ Free Interactive Labs</div>
            <h2 className="text-2xl font-bold mb-2">All Chemistry Simulations</h2>
            <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
              Titration curves, VSEPR geometry, kinetics plots, electrochemical cells, quantum orbitals, coordination chemistry, and more — all free, all in one place.
            </p>
          </div>
          <Link
            href="/labs"
            className="shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm whitespace-nowrap"
          >
            Browse All Simulations →
          </Link>
        </div>
      </section>

      {/* Exam interest registration (WhatsApp notify to founder) */}
      <section id="register" className="px-5 py-16 border-t border-white/10 bg-gradient-to-b from-purple-950/20 to-transparent">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-3">
              Guided prep
            </p>
            <h2 className="text-3xl font-black mb-4 leading-tight">
              Register if you&apos;re preparing for AP, Orgo, USNCO, or IChO
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Tell us which exam you&apos;re targeting. We&apos;ll point you to the right labs, ebooks,
              and practice sets — and reach out if you want a study plan.
            </p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-blue-400">●</span> AP Chemistry — units, FRQs, simulations</li>
              <li className="flex gap-2"><span className="text-emerald-400">●</span> Orgo 1 &amp; 2 — mechanisms &amp; structure tools</li>
              <li className="flex gap-2"><span className="text-orange-400">●</span> USNCO — Local &amp; National practice</li>
              <li className="flex gap-2"><span className="text-yellow-400">●</span> IChO — deep prep problems</li>
            </ul>
            <p className="text-xs text-gray-500 mt-6">
              15-day free trial on every tool · then $15/year full access
            </p>
          </div>
          <InterestForm />
        </div>
      </section>

      {/* Why Free */}
      <section className="px-5 py-16 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Why Is Everything Free?</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Explore every lab free for 15 days. After that, full access is $15/year for students.
          </p>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              { icon: '🚀', label: 'Start Instantly', desc: 'Open any tool and start immediately' },
              { icon: '♾️', label: 'Unlimited Use', desc: 'No daily limits or usage caps' },
              { icon: '📱', label: 'Works on Mobile', desc: 'Fully responsive on any device' },
            ].map(f => (
              <div key={f.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <div className="font-semibold text-xs mb-1">{f.label}</div>
                <div className="text-gray-500 text-xs">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="px-5 py-16 border-t border-white/10">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">Get Notified About New Tools</h2>
          <p className="text-gray-400 text-sm mb-5">Occasional emails when we ship new simulators or study guides. No spam, unsubscribe anytime.</p>
          <EmailCaptureForm sourcePage="/" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 text-center">
        <h2 className="text-3xl font-bold mb-3">Pick Your Exam — Start Preparing</h2>
        <p className="text-gray-400 mb-8">Simulations, ebook, and practice tests — all in one hub per exam.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {HUBS.map(h => (
            <Link key={h.href} href={h.href} className={`${COLOR[h.color].cta} text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm`}>{h.label} →</Link>
          ))}
          <Link href="/labs" className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">All Simulations →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        <div className="flex justify-center flex-wrap gap-4 text-xs mb-3">
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="https://www.thechemsolver.com/about" className="hover:text-white transition-colors">About</Link>
          <Link href="https://www.thechemsolver.com/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="https://www.thechemsolver.com/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="https://www.thechemsolver.com/contact" className="hover:text-white transition-colors">Contact</Link>
          <a href="#register" className="hover:text-white transition-colors">Register interest</a>
        </div>
        <p className="text-[10px] text-gray-700">© {new Date().getFullYear()} TheChemSolver. All rights reserved.</p>
      </footer>
    </div>
  )
}
