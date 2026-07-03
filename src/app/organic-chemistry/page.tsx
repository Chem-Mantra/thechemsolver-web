import { Metadata } from 'next'
import Link from 'next/link' // used by gateway card links
import EmailCaptureForm from '../components/EmailCaptureForm'
import TopicBarChart from '../components/TopicBarChart'
import { ORGO1, ORGO2 } from '@/data/examTopicFrequency'

const ORGO1_GREEN = '#10b981'
const ORGO2_PURPLE = '#a855f7'

export const metadata: Metadata = {
  title: 'Organic Chemistry — Free Orgo 1 & 2 Tools & Real Exam Data',
  description: 'Free Organic Chemistry tools for Orgo 1 & 2 students. Real topic-frequency data from 1,125 exam problems, interactive simulations, free ebook covering all 22 chapters, and practice tests. Perfect for pre-med and MCAT prep. No login required.',
  alternates: { canonical: 'https://www.thechemsolver.com/organic-chemistry' },
  openGraph: {
    title: 'Organic Chemistry — Free Orgo 1 & 2 Prep | TheChemSolver',
    description: 'Free interactive organic chemistry tools — simulations, ebook, and practice for Orgo 1 & 2 / MCAT students.',
    url: 'https://www.thechemsolver.com/organic-chemistry',
    siteName: 'TheChemSolver',
    type: 'website',
  },
}

const COURSE_INFO = [
  { label: 'Orgo 1', detail: '~14–16 weeks · Semester 1', icon: '🧪' },
  { label: 'Orgo 2', detail: '~14–16 weeks · Semester 2', icon: '⚗️' },
  { label: 'Audience', detail: 'Pre-Med · Chem · Bio majors', icon: '🎓' },
  { label: 'MCAT', detail: 'Covers all Orgo on exam', icon: '🏥' },
]

const GATEWAY = [
  {
    icon: '🧪',
    title: 'Simulations',
    subtitle: 'Interactive Labs',
    desc: '30+ simulators covering organic chemistry topics — IUPAC nomenclature, reaction mechanisms (SN1/SN2/E1/E2), molecular geometry, hydrocarbon structure builder, and more.',
    href: '/labs',
    color: '#10b981',
    gradient: 'from-emerald-900/40 to-emerald-950/30',
    border: 'border-emerald-700/40',
    cta: 'Browse All Simulations →',
    badge: 'Available now',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    live: true,
  },
  {
    icon: '📖',
    title: 'Ebook',
    subtitle: 'Orgo 1 & 2 Study Guide',
    desc: 'A complete interactive ebook covering all Orgo 1 & 2 chapters — mechanisms, stereochemistry, carbonyl chemistry, spectroscopy, and more. With flashcards, MCQs, and worked examples.',
    href: '/ebook/organic-chemistry',
    color: '#a855f7',
    gradient: 'from-purple-900/30 to-purple-950/20',
    border: 'border-purple-700/30',
    cta: 'Read Ebook →',
    badge: 'Free · All 22 chapters',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    live: true,
  },
  {
    icon: '📝',
    title: 'Tests',
    subtitle: 'MCQ & Mechanism Practice',
    desc: 'Chapter-by-chapter MCQ banks and mechanism drawing practice sets aligned to Orgo 1 & 2 exams. Timed practice with answer explanations — ideal for MCAT prep too.',
    href: '#',
    color: '#f97316',
    gradient: 'from-orange-900/30 to-orange-950/20',
    border: 'border-orange-700/30',
    cta: 'Coming Soon',
    badge: 'In development',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    live: false,
  },
]

const ORGO1_CHAPTERS = [
  { n: '1',  title: 'Bonding & Molecular Structure',        topics: 'Hybridization (sp, sp², sp³), Lewis structures, formal charge, resonance' },
  { n: '2',  title: 'Acids & Bases in Organic Chemistry',   topics: 'pKₐ scale, conjugate pairs, predicting reaction direction, resonance/induction effects' },
  { n: '3',  title: 'Functional Groups & Overview',         topics: 'Alkanes, alkenes, alkynes, alcohols, ethers, carbonyls, amines — identification & naming' },
  { n: '4',  title: 'Alkanes & Cycloalkanes',               topics: 'IUPAC naming, conformational analysis, Newman projections, ring strain, cis/trans isomers' },
  { n: '5',  title: 'Stereochemistry',                      topics: 'Chirality, stereocenters, R/S configuration, enantiomers, diastereomers, meso compounds, optical activity' },
  { n: '6',  title: 'Alkyl Halides & Nucleophilic Substitution', topics: 'SN1 and SN2 mechanisms, stereochemical outcomes, leaving groups, nucleophile strength, solvent effects' },
  { n: '7',  title: 'Elimination Reactions',                topics: 'E1 and E2 mechanisms, Zaitsev\'s rule, anti periplanar requirement, competition with substitution' },
  { n: '8',  title: 'Alkenes — Reactions & Synthesis',      topics: 'Markovnikov addition, carbocation stability, hydration, halogenation, hydroboration-oxidation, ozonolysis' },
  { n: '9',  title: 'Alkynes',                              topics: 'Terminal vs internal, acidity of terminal H, reduction to alkene, hydration (Markovnikov & anti-Markovnikov)' },
  { n: '10', title: 'Alcohols & Ethers',                    topics: 'Synthesis, oxidation states, Williamson ether synthesis, epoxides, acid/base ring-opening' },
  { n: '11', title: 'Conjugated Systems & Diels-Alder',     topics: '1,2 vs 1,4 addition, resonance in dienes, Diels-Alder cycloaddition, endo/exo selectivity' },
]

const ORGO2_CHAPTERS = [
  { n: '12', title: 'Aromatic Compounds',                   topics: 'Benzene structure, aromaticity, Hückel\'s rule, antiaromaticity, resonance stabilization' },
  { n: '13', title: 'Electrophilic Aromatic Substitution',  topics: 'Halogenation, nitration, sulfonation, Friedel-Crafts alkylation/acylation, ortho/para/meta directors' },
  { n: '14', title: 'Nucleophilic Aromatic Substitution',   topics: 'Addition-elimination mechanism, benzyne pathway, activating groups required' },
  { n: '15', title: 'Spectroscopy & Structure Determination', topics: 'IR (functional group ID), ¹H NMR (chemical shift, splitting, integration), ¹³C NMR, mass spectrometry (m/z, fragmentation)' },
  { n: '16', title: 'Aldehydes & Ketones',                  topics: 'Nucleophilic addition, acetal/hemiacetal formation, imines, enamines, Wittig reaction, cyanohydrins' },
  { n: '17', title: 'Carboxylic Acids',                     topics: 'Acidity (pKₐ), synthesis, Hell-Volhard-Zelinsky, decarboxylation, Fischer esterification' },
  { n: '18', title: 'Carboxylic Acid Derivatives',          topics: 'Esters, amides, anhydrides, acyl chlorides — acyl substitution mechanism, hydrolysis, saponification, Claisen condensation' },
  { n: '19', title: 'Enolates & Alpha Chemistry',           topics: 'Aldol condensation, Claisen condensation, Michael addition, Robinson annulation, Dieckmann' },
  { n: '20', title: 'Amines',                               topics: 'Basicity, synthesis (reductive amination, Gabriel synthesis), reactions, diazonium salts, coupling reactions' },
  { n: '21', title: 'Carbohydrates',                        topics: 'Monosaccharide classification, Fischer projections, Haworth structures, anomers, glycosidic bonds, disaccharides' },
  { n: '22', title: 'Amino Acids & Peptides',               topics: 'Structure, pKₐ and isoelectric point, peptide bond formation, N-/C-terminus, protein structure intro' },
]

export default function OrganicChemistryPage() {
  return (
    <div className="bg-[#060610] text-white">

      {/* Hero */}
      <section className="px-5 pt-14 pb-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">College Course · Pre-Med · MCAT</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">Semester 1 & 2 · McMurry / Klein syllabus</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
          Organic Chemistry
          <span className="block text-xl md:text-2xl font-semibold text-gray-400 mt-1">
            Orgo 1 & 2 — Complete Course Coverage
          </span>
        </h1>
        <p className="text-gray-400 max-w-xl mb-8 leading-relaxed text-sm">
          The most feared pre-med course — made visual and interactive. Free simulations, a full interactive ebook for all 22 chapters, and timed practice sets. Whether you're in Orgo 1, Orgo 2, or prepping for the MCAT, everything is free.
        </p>
        {/* Course info chips */}
        <div className="flex flex-wrap gap-3 mb-2">
          {COURSE_INFO.map(f => (
            <div key={f.label} className="flex items-center gap-2 bg-emerald-900/20 border border-emerald-700/25 rounded-xl px-3 py-2">
              <span className="text-base">{f.icon}</span>
              <div>
                <div className="text-xs font-bold text-emerald-300 leading-none">{f.label}</div>
                <div className="text-[11px] text-gray-400 leading-none mt-0.5">{f.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What Orgo 1 & 2 Actually Test (real exam data) ─────────────── */}
      <section className="px-5 pb-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">📊 Data-Driven Strategy</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-gray-500">1,125 real exam problems analyzed</span>
        </div>
        <div className="rounded-2xl bg-emerald-900/10 border border-emerald-700/20 p-5 mb-5">
          <h2 className="text-sm font-bold text-emerald-300 mb-2">The single biggest finding</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Two chapters — <strong className="text-white">Alkene Reactions</strong> (24.5%) and{' '}
            <strong className="text-white">Stereochemistry</strong> (23.9%) — make up nearly{' '}
            <strong className="text-white">half of every Orgo 1 exam</strong>. Add Acid-Base (17.8%)
            and Functional Groups (13.7%) and four chapters account for roughly 80% of what's tested.
          </p>
        </div>

        <div className="flex items-center gap-3 mb-3 mt-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 bg-emerald-900/20 border border-emerald-700/30 rounded-full">
            Orgo 1 — Chapters 1–11
          </span>
        </div>
        <TopicBarChart title="Orgo 1 Exams" subtitle="CU Boulder, Dartmouth, MNSU & compiled practice archives" data={ORGO1} accentHex={ORGO1_GREEN} />

        <div className="flex items-center gap-3 mb-3 mt-6">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 bg-purple-900/20 border border-purple-700/30 rounded-full">
            Orgo 2 — Chapters 12–22
          </span>
        </div>
        <TopicBarChart title="Orgo 2 Exams" subtitle="Early sample · aromatic + carbonyl-heavy archives" data={ORGO2} accentHex={ORGO2_PURPLE} />
        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
          Note: our Orgo 2 sample (66 problems) is much smaller than Orgo 1's (1,059) — most of the
          free university archives we found so far skew toward Orgo 1. This will get more
          representative as we source more Orgo 2 exams.
        </p>
      </section>

      {/* 3 Gateway Cards */}
      <section className="px-5 pb-16 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold mb-5">Ready to prepare?</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {GATEWAY.map(g => (
            <Link
              key={g.title}
              href={g.href}
              className={`group flex flex-col rounded-2xl border ${g.border} bg-gradient-to-br ${g.gradient} p-6 transition-all duration-200 ${g.live ? 'hover:brightness-110 hover:scale-[1.02] cursor-pointer' : 'opacity-70 pointer-events-none'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: g.color + '22' }}
                >
                  {g.icon}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${g.badgeColor}`}>
                  {g.badge}
                </span>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: g.color }}>
                {g.subtitle}
              </p>
              <h2 className="text-xl font-bold text-white mb-2">{g.title}</h2>
              <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-5">{g.desc}</p>

              <span
                className={`text-sm font-semibold inline-block ${g.live ? 'group-hover:translate-x-1 transition-transform' : ''}`}
                style={{ color: g.color }}
              >
                {g.cta}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Chapter Roadmap */}
      <section className="px-5 pb-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-white">Complete Chapter Roadmap</h2>
        <p className="text-gray-500 text-sm mb-10">22 chapters across Orgo 1 & 2 — the ebook and test bank will follow this structure exactly.</p>

        {/* Orgo 1 */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-emerald-700/30" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 bg-emerald-900/20 border border-emerald-700/30 rounded-full">
              Orgo 1 — Semester 1 · Chapters 1–11
            </span>
            <div className="h-px flex-1 bg-emerald-700/30" />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {ORGO1_CHAPTERS.map(c => (
              <div key={c.n}
                className="flex gap-3 rounded-xl bg-emerald-900/10 border border-emerald-700/20 px-4 py-3">
                <span className="text-xs font-black text-emerald-400 shrink-0 w-6 mt-0.5">Ch{c.n}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-snug mb-0.5">{c.title}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{c.topics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orgo 2 */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-purple-700/30" />
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 px-3 py-1 bg-purple-900/20 border border-purple-700/30 rounded-full">
              Orgo 2 — Semester 2 · Chapters 12–22
            </span>
            <div className="h-px flex-1 bg-purple-700/30" />
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {ORGO2_CHAPTERS.map(c => (
              <div key={c.n}
                className="flex gap-3 rounded-xl bg-purple-900/10 border border-purple-700/20 px-4 py-3">
                <span className="text-xs font-black text-purple-400 shrink-0 w-6 mt-0.5">Ch{c.n}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white leading-snug mb-0.5">{c.title}</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{c.topics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why hard + MCAT note */}
      <section className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '⚠️', title: 'Orgo is the #1 Pre-Med Weed-Out', desc: 'Over 30% of pre-med students fail or drop Orgo 1. Mechanisms, stereochemistry, and reaction patterns require a different kind of thinking than general chemistry.' },
            { icon: '🧲', title: 'MCAT Covers All of Orgo 1 & 2', desc: 'The MCAT Chemical & Physical Foundations section tests the entire Orgo 1 & 2 curriculum. Strong Orgo fundamentals directly translate to MCAT points.' },
            { icon: '🔗', title: 'JEE Orgo → Orgo 1 & 2 Mapping', desc: 'If you\'ve studied JEE Advanced organic chemistry, you\'ve already covered 90% of Orgo 1 & 2. The depth and difficulty of Orgo 2 is below JEE Advanced level.' },
          ].map(c => (
            <div key={c.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-3">{c.icon}</div>
              <div className="font-semibold text-sm mb-2">{c.title}</div>
              <div className="text-gray-500 text-xs leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="px-5 pb-16 max-w-md mx-auto text-center">
        <h2 className="text-lg font-bold mb-2">Get Orgo Updates</h2>
        <p className="text-gray-400 text-sm mb-5">Occasional emails when we ship new simulators or study guides. No spam, unsubscribe anytime.</p>
        <EmailCaptureForm sourcePage="/organic-chemistry" />
      </section>

    </div>
  )
}
