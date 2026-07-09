'use client'

/**
 * ChemText — renders chemistry text with proper sub/superscripts and symbols.
 * Handles patterns extracted from AP/USNCO/IChO PDFs via NLM.
 *
 * Rules applied (in order):
 *  1. HTML-escape the raw text
 *  2. Ionic charge superscripts: 2+, 2-, +, - after element/bracket → superscript
 *     (only when NOT immediately followed by a lowercase letter, which would mean
 *     this is a hyphenated English word like "acid-base", not a charge)
 *  3. Atomic/mass number: leading digits before an actual element symbol (e.g. 235U) →
 *     superscript (checked against a real periodic-table symbol list, so "52M"/"2A"-style
 *     units or placeholder variables aren't mistaken for isotope notation)
 *  4. Chemical subscripts: uppercase [a-z]? followed by digits in formula context → subscript
 *  5. Delta/degree symbols already present as unicode — pass through unchanged
 */

// All 118 element symbols — used to guard step 3 against false positives like "52M" (molarity)
// or "2A"/"3Z" (answer-choice/placeholder labels), which look like isotope notation but aren't.
const ELEMENT_SYMBOLS = new Set([
  'H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca',
  'Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y',
  'Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce',
  'Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir',
  'Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm',
  'Bk','Cf','Es','Fm','Md','No','Lr','Rf','Db','Sg','Bh','Hs','Mt','Ds','Rg','Cn','Nh','Fl','Mc',
  'Lv','Ts','Og',
])

export function chemToHtml(raw: string): string {
  // Step 1: HTML-escape (prevent XSS)
  let s = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Step 2: Ionic charges — e.g. Fe2+, Ca2+, SO4 2-, OH-, Cl-
  // Pattern: word-char or ) followed by digit(s) then +/-, NOT followed by a lowercase
  // letter (which would mean this is really a hyphenated word like "acid-base").
  s = s.replace(/([A-Za-z\)])\)?([\d]*)([+\-])(?![a-z])/g, (match, prev, num, sign) => {
    // Don't apply inside already-tagged HTML
    if (match.includes('<')) return match
    const charge = num ? `${num}${sign}` : sign
    return `${prev}<sup>${charge}</sup>`
  })

  // Step 3: Mass/atomic number prefix — e.g. 235U, 14C, 131I — only for real element symbols.
  s = s.replace(/\b(\d{1,3})([A-Z][a-z]?)\b/g, (match, num, sym) => {
    if (!ELEMENT_SYMBOLS.has(sym)) return match
    return `<sup>${num}</sup>${sym}`
  })

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
