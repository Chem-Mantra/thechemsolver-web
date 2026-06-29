'use client'

/**
 * ChemText — renders chemistry text with proper sub/superscripts and symbols.
 * Handles patterns extracted from AP/USNCO/IChO PDFs via NLM.
 *
 * Rules applied (in order):
 *  1. HTML-escape the raw text
 *  2. Ionic charge superscripts: 2+, 2-, +, - after element/bracket → superscript
 *  3. Atomic/mass number: leading digits before uppercase element (e.g. 235U) → superscript
 *  4. Chemical subscripts: uppercase [a-z]? followed by digits in formula context → subscript
 *  5. Delta/degree symbols already present as unicode — pass through unchanged
 */

function chemToHtml(raw: string): string {
  // Step 1: HTML-escape (prevent XSS)
  let s = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Step 2: Ionic charges — e.g. Fe2+, Ca2+, SO4 2-, OH-, Cl-
  // Pattern: word-char or ) followed by digit(s) then +/-
  s = s.replace(/([A-Za-z\)])\)?([\d]*)([+\-])/g, (match, prev, num, sign) => {
    // Don't apply inside already-tagged HTML
    if (match.includes('<')) return match
    const charge = num ? `${num}${sign}` : sign
    return `${prev}<sup>${charge}</sup>`
  })

  // Step 3: Mass/atomic number prefix — e.g. 235U, 14C, 131I
  s = s.replace(/\b(\d{1,3})([A-Z][a-z]?\b)/g, '<sup>$1</sup>$2')

  // Step 4: Chemical formula subscripts — e.g. H2O, CO2, H2SO4, CaCO3, Na2CO3
  // Pattern: uppercase (optional lowercase) followed by 2+ digits that look like subscript context
  // Guard: don't apply to plain numbers in text (heuristic: must be preceded by a letter)
  s = s.replace(/([A-Za-z\)])(\d+)(?=[A-Z()\s.,;:\)\]–\-]|$)/g, (match, prev, num) => {
    // Skip if it looks like a year or question number
    if (parseInt(num) > 99) return match
    return `${prev}<sub>${num}</sub>`
  })

  // Step 5: Arrow normalisation (text arrows → unicode, if not already)
  s = s.replace(/ -&gt; /g, ' → ')
  s = s.replace(/ =&gt; /g, ' ⇒ ')
  s = s.replace(/--&gt;/g, '⟶')

  return s
}

interface Props {
  text: string
  className?: string
  block?: boolean  // if true renders as div (for multiline), else span
}

export default function ChemText({ text, className = '', block = false }: Props) {
  const html = chemToHtml(text ?? '')
  if (block) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
