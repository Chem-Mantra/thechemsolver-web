'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import AuthNavButton from './components/AuthNavButton'

const HOME_NAV_LINKS = [
  { label: 'AP Chemistry',   href: '/ap-chemistry',      color: 'text-blue-400' },
  { label: 'USNCO',          href: '/usnco',              color: 'text-orange-400' },
  { label: 'IChO',           href: '/icho',               color: 'text-yellow-400' },
  { label: 'Orgo 1 & 2',     href: '/organic-chemistry',  color: 'text-emerald-400' },
  { label: 'All Labs',       href: '/labs',                color: 'text-gray-300' },
  { label: 'Ebook',          href: '/ebook/ap-chemistry',  color: 'text-gray-300' },
]

export default function HomeNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="border-b border-white/10 px-5 py-4 flex items-center justify-between sticky top-0 bg-[#060610]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="TheChemSolver" width={32} height={32} className="rounded-full" priority />
          <span className="font-bold text-xl tracking-tight">TheChemSolver</span>
          <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">100% FREE</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/ap-chemistry" className="text-blue-400 hover:text-blue-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">AP Chemistry</Link>
          <Link href="/usnco" className="text-orange-400 hover:text-orange-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">USNCO</Link>
          <Link href="/icho" className="text-yellow-400 hover:text-yellow-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">IChO</Link>
          <span className="text-white/20 mx-1">|</span>
          <Link href="/organic-chemistry" className="text-emerald-400 hover:text-emerald-300 font-semibold px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Orgo 1 & 2</Link>
          <span className="text-white/20 mx-1">|</span>
          <Link href="/labs" className="text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">All Labs</Link>
          <Link href="/ebook/ap-chemistry" className="text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors">Ebook</Link>
        </div>
        <div className="flex items-center gap-2">
          <AuthNavButton />
          <Link href="/labs/nomenclature" className="hidden sm:inline-block bg-purple-600 hover:bg-purple-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">
            Try IUPAC Namer →
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
        <div data-testid="mobile-menu" className="md:hidden border-b border-white/10 bg-[#060610]/98 backdrop-blur sticky top-[65px] z-50 px-5 py-3 flex flex-col gap-1">
          {HOME_NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className={`text-sm ${l.color} font-semibold px-3 py-3 rounded-md hover:bg-white/5 transition-colors`}>
              {l.label}
            </Link>
          ))}
          <div className="border-t border-white/10 my-1" />
          <AuthNavButton variant="mobile" />
          <Link href="/labs/nomenclature" onClick={() => setMenuOpen(false)}
            className="text-sm text-center bg-purple-600 text-white px-3 py-3 rounded-lg font-medium mt-1">
            Try IUPAC Namer →
          </Link>
        </div>
      )}
    </>
  )
}
