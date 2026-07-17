'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import AuthNavButton from './components/AuthNavButton'

const NAV_EXAMS = [
  { label: 'AP Chemistry',   href: '/ap-chemistry',      color: 'text-blue-400' },
  { label: 'Orgo 1 & 2',    href: '/organic-chemistry', color: 'text-emerald-400' },
  { label: 'USNCO',          href: '/usnco',             color: 'text-orange-400' },
  { label: 'IChO',           href: '/icho',              color: 'text-yellow-400' },
]
const NAV_TOOLS = [
  { label: 'All Labs',   href: '/labs' },
  { label: 'Ebook',      href: '/ebook/ap-chemistry' },
]

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isEbook = pathname?.startsWith('/ebook/')
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu on route change so it never lingers over new content.
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Full-screen app routes: no nav, no footer, no flex-col wrapper
  if (isHome || isEbook) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#060610] text-white flex flex-col">
      <nav className="border-b border-white/10 px-5 py-3 flex items-center justify-between sticky top-0 bg-[#060610]/95 backdrop-blur z-50">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="TheChemSolver" width={28} height={28} className="rounded-full" />
            <span className="font-bold text-base tracking-tight">TheChemSolver</span>
            <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full">15-DAY FREE</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            <span className="text-white/20 text-xs mr-1">|</span>
            {NAV_EXAMS.map(e => (
              <Link key={e.href} href={e.href}
                className={`text-xs ${e.color} hover:opacity-80 px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors whitespace-nowrap font-semibold`}>
                {e.label}
              </Link>
            ))}
            <span className="text-white/20 text-xs mx-1">|</span>
            {NAV_TOOLS.map(t => (
              <Link key={t.href} href={t.href}
                className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors whitespace-nowrap">
                {t.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <AuthNavButton />
            <Link href="/" className="hidden md:inline-block text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-colors font-medium shrink-0">
              Home
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex items-center justify-center w-11 h-11 -mr-1 rounded-md text-white/90 hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div data-testid="mobile-menu" className="md:hidden border-b border-white/10 bg-[#060610]/98 backdrop-blur sticky top-[57px] z-50 px-5 py-3 flex flex-col gap-1">
            {NAV_EXAMS.map(e => (
              <Link key={e.href} href={e.href}
                className={`text-sm ${e.color} font-semibold px-3 py-3 rounded-md hover:bg-white/5 transition-colors`}>
                {e.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-1" />
            {NAV_TOOLS.map(t => (
              <Link key={t.href} href={t.href}
                className="text-sm text-gray-300 px-3 py-3 rounded-md hover:bg-white/5 transition-colors">
                {t.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-1" />
            <AuthNavButton variant="mobile" />
            <Link href="/" className="text-sm text-center bg-purple-600 text-white px-3 py-3 rounded-lg font-medium mt-1">
              Home
            </Link>
          </div>
        )}

      <div className="flex-1">{children}</div>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src="/logo.png" alt="TheChemSolver" width={22} height={22} className="rounded-full" />
          <span className="font-bold text-white text-sm">TheChemSolver.com</span>
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-1.5 py-0.5 rounded-full">15-day free trial</span>
        </div>
        <p className="text-xs mb-3 max-w-md mx-auto">
          Interactive chemistry tools for AP Chemistry, Organic Chemistry, IChO, and College Gen Chem —
          free for 15 days, then $15/year.
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-xs mb-3">
          <Link href="/ap-chemistry"      className="text-blue-400 hover:text-blue-300 transition-colors">AP Chemistry</Link>
          <Link href="/organic-chemistry" className="text-emerald-400 hover:text-emerald-300 transition-colors">Orgo 1 & 2</Link>
          <Link href="/usnco"             className="text-orange-400 hover:text-orange-300 transition-colors">USNCO</Link>
          <Link href="/icho"              className="text-yellow-400 hover:text-yellow-300 transition-colors">IChO</Link>
          <span className="text-white/20">|</span>
          <Link href="/labs"    className="hover:text-white transition-colors">All Labs</Link>
          <Link href="/ebook"   className="hover:text-white transition-colors">Study Guide</Link>
          <Link href="/about"   className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-white transition-colors">Terms</Link>
          <a href="mailto:support@thechemsolver.com" className="hover:text-white transition-colors">Contact</a>
        </div>
        <p className="text-[10px] text-gray-700 mt-4">
          © {new Date().getFullYear()} TheChemSolver. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
