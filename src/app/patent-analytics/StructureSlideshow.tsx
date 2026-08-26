'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Real HD structures extracted by our own pipeline (auto-verified only —
// see /reports for the verification methodology) from real patents:
// US7314934B2, US7314874B2, USRE39991E1.
const STRUCTURES = [
  { src: '/patent-analytics/structures/s1.png', patent: 'US7314934B2' },
  { src: '/patent-analytics/structures/s2.png', patent: 'US7314934B2' },
  { src: '/patent-analytics/structures/s3.png', patent: 'US7314934B2' },
  { src: '/patent-analytics/structures/s4.png', patent: 'US7314874B2' },
  { src: '/patent-analytics/structures/s5.png', patent: 'US7314874B2' },
  { src: '/patent-analytics/structures/s6.png', patent: 'USRE39991E1' },
  { src: '/patent-analytics/structures/s7.png', patent: 'USRE39991E1' },
  { src: '/patent-analytics/structures/s8.png', patent: 'US7314934B2' },
]

const INTERVAL_MS = 3200

export default function StructureSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % STRUCTURES.length)
    }, INTERVAL_MS)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="pa-glass pa-glass-elevated absolute inset-0 overflow-hidden"
      style={{ transform: 'perspective(1000px) rotateY(-6deg) rotateX(3deg)' }}
    >
      {STRUCTURES.map((s, i) => (
        <div
          key={s.src}
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{
            opacity: i === index ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <div className="relative w-full h-full">
            <Image src={s.src} alt={`Extracted structure from patent ${s.patent}`} fill className="object-contain" sizes="320px" priority={i === 0} />
          </div>
        </div>
      ))}

      {/* Patent-source caption + progress dots */}
      <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center gap-2">
        <div className="pa-mono text-[10px]" style={{ color: 'var(--on-surface-muted)' }}>
          {STRUCTURES[index].patent}
        </div>
        <div className="flex gap-1.5">
          {STRUCTURES.map((s, i) => (
            <span
              key={s.src}
              className="rounded-full transition-all"
              style={{
                width: i === index ? 16 : 5,
                height: 5,
                background: i === index ? 'var(--primary)' : 'var(--outline-variant)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
