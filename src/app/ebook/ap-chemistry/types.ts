export type CalloutVariant = 'insight' | 'warning' | 'exam-tip' | 'analogy' | 'key-fact'

export type ContentBlock =
  | { type: 'text'; body: string }
  | { type: 'formula'; latex: string; display?: boolean; caption?: string }
  | { type: 'callout'; variant: CalloutVariant; title: string; body: string }
  | { type: 'list'; variant: 'bullet' | 'numbered'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'simulation'; title: string; description: string }

export interface MCQ {
  question: string
  options: string[]
  correct: number   // 0-indexed
  explanation: string
}

export interface Flashcard {
  front: string
  back: string
}

export interface Concept {
  id: string
  title: string
  subtitle: string
  estimatedMinutes: number
  accentHex: string
  blocks: ContentBlock[]
  mcqs: MCQ[]
  flashcards: Flashcard[]
}

export interface EbookUnit {
  id: string
  number: number
  title: string
  examWeight: string
  accentHex: string
  concepts: Concept[]
}
