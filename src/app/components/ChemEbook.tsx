'use client'
import { useState, useEffect, useRef } from 'react'

export interface EbookSection {
  id: string
  title: string
  content: string        // prose paragraphs separated by \n\n
  subsections?: EbookSection[]
}

export interface EbookUnit {
  id: string
  number: string         // 'Unit 1', 'Unit 2', ...
  title: string
  color: string          // tailwind text color class
  sections: EbookSection[]
}

interface Props {
  title: string
  subtitle: string
  units: EbookUnit[]
}

export default function ChemEbook({ title, subtitle, units }: Props) {
  const [activeUnit, setActiveUnit] = useState(units[0]?.id ?? '')
  const [activeSection, setActiveSection] = useState(units[0]?.sections[0]?.id ?? '')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  const currentUnit = units.find(u => u.id === activeUnit)
  const currentSection = currentUnit?.sections.find(s => s.id === activeSection)
    ?? currentUnit?.sections.flatMap(s => s.subsections ?? []).find(s => s.id === activeSection)

  function toggleUnit(id: string) {
    setCollapsed(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function selectSection(unitId: string, sectionId: string) {
    setActiveUnit(unitId)
    setActiveSection(sectionId)
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  // Estimate read time
  const wordCount = currentSection?.content.split(/\s+/).length ?? 0
  const readMin = Math.max(1, Math.round(wordCount / 200))

  return (
    <div className="flex h-screen bg-[#060610] text-white overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'} shrink-0 flex flex-col border-r border-white/10 bg-black/30 transition-all duration-200`}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-white/10 shrink-0">
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">{subtitle}</div>
          <div className="font-black text-sm leading-tight">{title}</div>
        </div>

        {/* Unit list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {units.map(unit => (
            <div key={unit.id}>
              {/* Unit header — clickable to collapse */}
              <button
                onClick={() => toggleUnit(unit.id)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-white/5 ${activeUnit === unit.id ? 'bg-white/5' : ''}`}>
                <span className={`text-[10px] font-bold ${unit.color} shrink-0`}>{unit.number}</span>
                <span className="text-xs font-semibold flex-1 leading-tight">{unit.title}</span>
                <svg className={`w-3 h-3 text-gray-600 shrink-0 transition-transform ${collapsed.has(unit.id) ? '-rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Sections */}
              {!collapsed.has(unit.id) && unit.sections.map(section => (
                <div key={section.id}>
                  <button
                    onClick={() => selectSection(unit.id, section.id)}
                    className={`w-full flex items-start gap-2 pl-8 pr-4 py-1.5 text-left text-[11px] transition-colors ${activeSection === section.id ? `${unit.color} bg-white/5 font-semibold` : 'text-gray-500 hover:text-gray-300 hover:bg-white/3'}`}>
                    <span className="mt-0.5 shrink-0">›</span>
                    <span className="leading-tight">{section.title}</span>
                  </button>
                  {/* Subsections */}
                  {section.subsections?.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => selectSection(unit.id, sub.id)}
                      className={`w-full flex items-start gap-2 pl-12 pr-4 py-1 text-left text-[10px] transition-colors ${activeSection === sub.id ? `${unit.color} bg-white/5 font-medium` : 'text-gray-600 hover:text-gray-400 hover:bg-white/3'}`}>
                      <span className="mt-0.5 shrink-0">·</span>
                      <span className="leading-tight">{sub.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Content area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="shrink-0 border-b border-white/10 px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className="text-gray-500 hover:text-white transition-colors p-1"
            aria-label="Toggle sidebar">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 text-xs text-gray-500 truncate">
            {currentUnit?.number} — {currentUnit?.title}
            {currentSection && currentSection.id !== currentUnit?.sections[0]?.id && ` › ${currentSection.title}`}
          </div>
          <div className="text-[10px] text-gray-700 shrink-0">{readMin} min read</div>
        </div>

        {/* Article */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10">
            {currentSection ? (
              <>
                <h1 className={`text-3xl font-black mb-2 ${currentUnit?.color ?? 'text-white'}`}>
                  {currentSection.title}
                </h1>
                <div className="flex items-center gap-3 mb-8 text-[11px] text-gray-600">
                  <span>{currentUnit?.number} — {currentUnit?.title}</span>
                  <span>·</span>
                  <span>{readMin} min read</span>
                  <span>·</span>
                  <span>{wordCount.toLocaleString()} words</span>
                </div>
                <div className="prose prose-invert max-w-none text-gray-200 leading-[1.85] text-[15px] space-y-5">
                  {currentSection.content.split('\n\n').filter(Boolean).map((para, i) => {
                    // Render headings starting with ## or ###
                    if (para.startsWith('### ')) return (
                      <h3 key={i} className="text-base font-bold text-white mt-8 mb-3">{para.slice(4)}</h3>
                    )
                    if (para.startsWith('## ')) return (
                      <h2 key={i} className="text-lg font-bold text-white mt-10 mb-4">{para.slice(3)}</h2>
                    )
                    // Render formula blocks starting with >>
                    if (para.startsWith('>> ')) return (
                      <div key={i} className="bg-white/5 border-l-2 border-purple-500 pl-4 py-2 font-mono text-sm text-purple-200 my-4">
                        {para.slice(3)}
                      </div>
                    )
                    return <p key={i}>{para.trim()}</p>
                  })}
                </div>

                {/* Previous / Next navigation */}
                <div className="flex gap-3 mt-14 pt-8 border-t border-white/10">
                  {(() => {
                    const allSections = currentUnit?.sections.flatMap(s => [s, ...(s.subsections ?? [])]) ?? []
                    const idx = allSections.findIndex(s => s.id === activeSection)
                    const prev = allSections[idx - 1]
                    const next = allSections[idx + 1]
                    return (
                      <>
                        {prev && (
                          <button onClick={() => selectSection(currentUnit!.id, prev.id)}
                            className="flex flex-col items-start text-xs border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors">
                            <span className="text-gray-600 text-[10px] mb-1">← Previous</span>
                            <span className="text-gray-300 font-medium">{prev.title}</span>
                          </button>
                        )}
                        {next && (
                          <button onClick={() => selectSection(currentUnit!.id, next.id)}
                            className="flex flex-col items-end text-xs border border-white/10 rounded-xl px-4 py-3 hover:bg-white/5 transition-colors ml-auto">
                            <span className="text-gray-600 text-[10px] mb-1">Next →</span>
                            <span className="text-gray-300 font-medium">{next.title}</span>
                          </button>
                        )}
                      </>
                    )
                  })()}
                </div>
              </>
            ) : (
              <div className="text-gray-600 text-center py-20">Select a section from the sidebar to begin reading.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
