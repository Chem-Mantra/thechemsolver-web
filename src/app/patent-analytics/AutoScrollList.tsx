'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type CardItem = { href: string; label: string }

const PIXELS_PER_SECOND = 14

/**
 * Auto-scrolls slowly via real `scrollTop` (not a CSS transform loop) so
 * pausing and native manual scroll (wheel/touch/drag) share the same state
 * instead of fighting each other. Real bug this replaces: the old CSS
 * keyframe version paused correctly on hover but had `overflow: hidden` on
 * the viewport, so a paused hover still couldn't be scrolled by hand at
 * all -- fixed by making the viewport natively scrollable (scrollbar
 * hidden visually via CSS, not via overflow:hidden) and driving the auto-
 * scroll increment with requestAnimationFrame on that same scrollTop.
 */
export default function AutoScrollList({ items }: { items: CardItem[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [, setPausedState] = useState(false) // triggers re-render for the visual state only
  const displayItems = [...items, ...items]

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf: number
    let lastTime: number | null = null

    function step(time: number) {
      if (lastTime === null) lastTime = time
      const dtSeconds = (time - lastTime) / 1000
      lastTime = time
      if (!pausedRef.current && el) {
        const half = el.scrollHeight / 2
        el.scrollTop += PIXELS_PER_SECOND * dtSeconds
        if (el.scrollTop >= half) {
          el.scrollTop -= half
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  function setPaused(value: boolean) {
    pausedRef.current = value
    setPausedState(value)
  }

  return (
    <div
      ref={viewportRef}
      className="pa-sidebar-scroll-viewport"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex flex-col gap-2">
        {displayItems.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="block text-xs leading-snug px-2 py-1.5 rounded-md hover:bg-black/[0.03] transition-colors"
            style={{ color: 'var(--on-surface-variant)' }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
