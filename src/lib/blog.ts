export type BlogPost = {
  slug: string
  title: string
  metaTitle: string
  metaDesc: string
  date: string
  readMinutes: number
  category: string
  excerpt: string
  content: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'ap-chemistry-titration-curves-explained',
    title: 'AP Chemistry Titration Curves Explained (With Free Simulator)',
    metaTitle: 'AP Chemistry Titration Curves Explained — Free Simulator | TheChemSolver',
    metaDesc:
      'Learn strong acid–strong base, weak acid–strong base, and polyprotic titration curves for AP Chemistry. Practice free with TheChemSolver titration lab.',
    date: '2026-07-18',
    readMinutes: 8,
    category: 'AP Chemistry',
    excerpt:
      'How to read equivalence points, half-equivalence, and buffer regions on AP titration FRQs — plus a free interactive curve simulator.',
    content: `
<h2>Why titration curves matter on AP Chemistry</h2>
<p>College Board loves titration FRQs: you must map <strong>pH vs volume</strong>, spot the equivalence point, and reason about buffer regions. A clean mental model beats memorizing every shape.</p>

<h2>The four shapes you must know</h2>
<ol>
  <li><strong>Strong acid + strong base</strong> — steep jump through pH 7 at equivalence.</li>
  <li><strong>Weak acid + strong base</strong> — buffer region before equivalence; equivalence pH &gt; 7.</li>
  <li><strong>Weak base + strong acid</strong> — buffer region; equivalence pH &lt; 7.</li>
  <li><strong>Polyprotic</strong> — multiple equivalence points (watch stoichiometry carefully).</li>
</ol>

<h2>Half-equivalence is your friend</h2>
<p>For a monoprotic weak acid, at half-equivalence <strong>pH = pK<sub>a</sub></strong>. That single fact unlocks many free-response points.</p>

<h2>Practice with the free lab</h2>
<p>Open the interactive <a href="/labs/titration">Titration Curve Simulator</a> on TheChemSolver — free for 15 days, then $15/year for full access. Drag titrant volume and watch the curve update in real time.</p>

<h2>Exam tip</h2>
<p>Always label axes, mark equivalence, and write one sentence about what species dominate <em>before</em> and <em>after</em> equivalence. Graders reward clear chemistry language.</p>
`,
  },
  {
    slug: 'usnco-local-exam-strategy',
    title: 'USNCO Local Exam Strategy: How to Train With Past Papers',
    metaTitle: 'USNCO Local Exam Strategy 2026 — Past Papers + Free Practice',
    metaDesc:
      'A practical USNCO Local exam plan: topic weights, timing, and how to use free MCQ practice on TheChemSolver for Local and National stages.',
    date: '2026-07-18',
    readMinutes: 7,
    category: 'USNCO',
    excerpt:
      'Timing, topic focus, and a weekly drill plan for the ACS Local Chemistry Olympiad — with free past-paper style practice.',
    content: `
<h2>What the Local exam actually tests</h2>
<p>The USNCO Local section is a timed multiple-choice paper spanning general chemistry. Expect stoichiometry, equilibrium, electrochemistry, organic fundamentals, and descriptive chemistry — not just AP Unit 1.</p>

<h2>A simple 4-week plan</h2>
<ul>
  <li><strong>Week 1:</strong> Stoichiometry + gases + thermo (speed drills).</li>
  <li><strong>Week 2:</strong> Equilibrium + acids/bases + solubility.</li>
  <li><strong>Week 3:</strong> Redox + electrochem + kinetics.</li>
  <li><strong>Week 4:</strong> Full timed Local papers + error log.</li>
</ul>

<h2>Practice on TheChemSolver</h2>
<p>Use <a href="/usnco/practice">USNCO Practice</a> for Local and National stages. Explore free for 15 days; unlock a full year for $15 if you need longer prep.</p>

<h2>National pipeline</h2>
<p>If Local goes well, National I (MCQ) and National II (FRQ) need deeper olympiad style. Start National sets early — FRQ stamina takes weeks to build.</p>
`,
  },
  {
    slug: 'organic-sn1-sn2-e1-e2-decision-tree',
    title: 'SN1 / SN2 / E1 / E2 Decision Tree for Orgo & Olympiad',
    metaTitle: 'SN1 SN2 E1 E2 Decision Tree — Free Predictor Lab | TheChemSolver',
    metaDesc:
      'A practical decision tree for SN1, SN2, E1, and E2 mechanisms. Heat, base strength, substrate class — plus a free interactive predictor.',
    date: '2026-07-18',
    readMinutes: 9,
    category: 'Organic Chemistry',
    excerpt:
      'Stop guessing mechanisms. Use substrate class, nucleophile/base strength, and solvent cues — then check yourself with the free predictor.',
    content: `
<h2>Start with the substrate</h2>
<ul>
  <li><strong>Methyl / primary</strong> → SN2 (unless bulky base → E2).</li>
  <li><strong>Secondary</strong> → competition; check base strength and heat.</li>
  <li><strong>Tertiary</strong> → SN1/E1 (polar protic) or E2 (strong base).</li>
</ul>

<h2>Base / nucleophile strength</h2>
<p>Strong bulky bases (t-BuOK) favor <strong>E2</strong>. Good nucleophiles that are weaker bases favor <strong>SN2</strong>. Weak nucleophiles in polar protic solvent open the door to <strong>SN1/E1</strong>.</p>

<h2>Heat and leaving groups</h2>
<p>Heat tilts toward elimination. Excellent leaving groups (I⁻, OTs⁻) accelerate both substitution and elimination — the rest of the conditions decide which wins.</p>

<h2>Train with the free tool</h2>
<p>Open the <a href="/labs/sn1-sn2-e1-e2">SN1/SN2/E1/E2 Predictor</a> and change conditions live. Free trial is 15 days; student full access is $15/year.</p>
`,
  },
]

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug)
}

export function getAllSlugs() {
  return POSTS.map((p) => p.slug)
}
