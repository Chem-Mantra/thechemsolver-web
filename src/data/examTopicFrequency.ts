// Real topic-frequency data from TheChemSolver's own question bank
// (Supabase QBankMCQ/QBankFRQ/QBankIChO), computed 2026-07-02.
// Source field: MCQ/FRQ 'topic' column, IChO 'domain' column.
// Each source keeps its top 7 topics by count; the remainder is folded into 'Other'.

export interface TopicFreq { topic: string; count: number; pct: number }
export interface SourceFreq { total: number; topics: TopicFreq[] }


export const USNCO_LOCAL: SourceFreq = {
  total: 1500,
  topics: [
    { topic: 'Thermodynamics', count: 154, pct: 10.3 },
    { topic: 'Electrochemistry', count: 146, pct: 9.7 },
    { topic: 'Kinetics', count: 145, pct: 9.7 },
    { topic: 'Bonding', count: 145, pct: 9.7 },
    { topic: 'Atomic Structure', count: 122, pct: 8.1 },
    { topic: 'Organic Chemistry', count: 116, pct: 7.7 },
    { topic: 'States of Matter', count: 97, pct: 6.5 },
    { topic: 'Other', count: 575, pct: 38.3 },
  ],
}

export const USNCO_NAT_PART1: SourceFreq = {
  total: 1560,
  topics: [
    { topic: 'Kinetics', count: 156, pct: 10.0 },
    { topic: 'Thermodynamics', count: 144, pct: 9.2 },
    { topic: 'Electrochemistry', count: 139, pct: 8.9 },
    { topic: 'Organic Chemistry', count: 138, pct: 8.8 },
    { topic: 'Bonding', count: 133, pct: 8.5 },
    { topic: 'Descriptive Chemistry', count: 132, pct: 8.5 },
    { topic: 'Equilibrium', count: 129, pct: 8.3 },
    { topic: 'Other', count: 589, pct: 37.8 },
  ],
}

export const USNCO_NAT_PART2: SourceFreq = {
  total: 156,
  topics: [
    { topic: 'Kinetics', count: 18, pct: 11.5 },
    { topic: 'Thermodynamics', count: 16, pct: 10.3 },
    { topic: 'Descriptive Chemistry', count: 16, pct: 10.3 },
    { topic: 'Electrochemistry', count: 15, pct: 9.6 },
    { topic: 'Equilibrium / Solubility', count: 5, pct: 3.2 },
    { topic: 'Acid-Base Equilibrium / Titration', count: 4, pct: 2.6 },
    { topic: 'Acid-Base Equilibrium / Buffers', count: 3, pct: 1.9 },
    { topic: 'Other', count: 79, pct: 50.6 },
  ],
}

export const USNCO_NAT_PART3: SourceFreq = {
  total: 46,
  topics: [
    { topic: 'Qualitative Analysis', count: 6, pct: 13.0 },
    { topic: 'Acid-Base Titration', count: 4, pct: 8.7 },
    { topic: 'Kinetics', count: 3, pct: 6.5 },
    { topic: 'Electrochemistry', count: 2, pct: 4.3 },
    { topic: 'Calorimetry', count: 2, pct: 4.3 },
    { topic: 'Chromatography', count: 2, pct: 4.3 },
    { topic: 'Paper Chromatography', count: 1, pct: 2.2 },
    { topic: 'Other', count: 26, pct: 56.5 },
  ],
}

export const ICHO_PREP: SourceFreq = {
  total: 222,
  topics: [
    { topic: 'Physical Chemistry — Kinetics', count: 50, pct: 22.5 },
    { topic: 'Analytical Chemistry', count: 46, pct: 20.7 },
    { topic: 'Physical Chemistry — Thermodynamics', count: 34, pct: 15.3 },
    { topic: 'Physical Chemistry', count: 32, pct: 14.4 },
    { topic: 'Organic Chemistry', count: 29, pct: 13.1 },
    { topic: 'Physical Chemistry — Electrochemistry', count: 12, pct: 5.4 },
    { topic: 'Inorganic Chemistry — Solid State', count: 8, pct: 3.6 },
    { topic: 'Other', count: 11, pct: 5.0 },
  ],
}

export const ICHO_VOLUMES: SourceFreq = {
  total: 39,
  topics: [
    { topic: 'Physical Chemistry', count: 12, pct: 30.8 },
    { topic: 'Organic Chemistry', count: 7, pct: 17.9 },
    { topic: 'Physical Chemistry — Thermodynamics', count: 5, pct: 12.8 },
    { topic: 'Physical Chemistry — Kinetics', count: 5, pct: 12.8 },
    { topic: 'Analytical Chemistry', count: 4, pct: 10.3 },
    { topic: 'Analytical Chemistry — Spectroscopy', count: 2, pct: 5.1 },
    { topic: 'Physical Chemistry — Electrochemistry', count: 2, pct: 5.1 },
    { topic: 'Other', count: 2, pct: 5.1 },
  ],
}

// Computed 2026-07-03 from Supabase QBankOrgo (chapter_title column), 1,125 real
// exam problems from CU Boulder, Dartmouth, Michigan/Reusch, ACS sample, UDel,
// UW Oshkosh, and MNSU Jasperse practice-test archives.
export const ORGO1: SourceFreq = {
  total: 1059,
  topics: [
    { topic: 'Alkenes — Reactions & Synthesis', count: 259, pct: 24.5 },
    { topic: 'Stereochemistry', count: 253, pct: 23.9 },
    { topic: 'Acids & Bases', count: 188, pct: 17.8 },
    { topic: 'Functional Groups & Reactivity', count: 145, pct: 13.7 },
    { topic: 'Alkyl Halides & Nucleophilic Substitution', count: 98, pct: 9.3 },
    { topic: 'Bonding & Molecular Structure', count: 65, pct: 6.1 },
    { topic: 'Other', count: 51, pct: 4.8 },
  ],
}

// n=66 — thin sample (most sourced archives are Orgo1-heavy; see [[project_orgo_question_bank_extraction]]).
// Shown with an explicit caveat on the strategy page rather than omitted.
export const ORGO2: SourceFreq = {
  total: 66,
  topics: [
    { topic: 'Aldehydes & Ketones', count: 40, pct: 60.6 },
    { topic: 'Spectroscopy & Structure Determination', count: 11, pct: 16.7 },
    { topic: 'Electrophilic Aromatic Substitution', count: 7, pct: 10.6 },
    { topic: 'Alkenes — Reactions & Synthesis', count: 3, pct: 4.5 },
    { topic: 'Functional Groups & Reactivity', count: 2, pct: 3.0 },
    { topic: 'Acids & Bases', count: 2, pct: 3.0 },
    { topic: 'Alkyl Halides & Nucleophilic Substitution', count: 1, pct: 1.5 },
  ],
}
