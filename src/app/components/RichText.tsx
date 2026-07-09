'use client'

import katex from 'katex'
import 'katex/dist/katex.min.css'
import { chemToHtml } from './ChemText'

/**
 * RichText — renders solution/explanation text that mixes plain chemistry
 * notation (handled by ChemText's heuristics), real LaTeX math delimited by
 * \(...\), \[...\], or $...$, Markdown **bold**, and paragraph/bullet/numbered
 * lists. Built for the `explanation` / `context` / `model_answer` fields,
 * which (unlike `stem`/`options`) were generated with real LaTeX+Markdown.
 *
 * Two-phase approach:
 *  1. Inline pass — a single linear scan recognising three token types (math
 *     delimiters, ** bold markers, plain text) so a **bold** span that
 *     happens to wrap around an inline \(...\) formula still closes
 *     correctly — splitting math and bold into two independent regex sweeps
 *     breaks exactly that case, since each sweep only sees half the pair.
 *     A lone/unmatched delimiter (no closing partner) is treated as
 *     ordinary text rather than stalling the scan.
 *  2. Block pass — split the resulting HTML on blank lines into paragraphs,
 *     and turn any paragraph that's entirely bullet ("* "/"- ") or numbered
 *     ("1. ") lines into a real <ul>/<ol>.
 */

function renderMath(latex: string, display: boolean): string {
  try {
    return katex.renderToString(latex, { displayMode: display, throwOnError: false, trust: false })
  } catch {
    // Malformed LaTeX (e.g. unbalanced delimiters) — fall back to showing the source
    // rather than crashing the page.
    return display ? `\\[${latex}\\]` : `\\(${latex}\\)`
  }
}

function inlinePass(raw: string): string {
  let result = ''
  let i = 0
  let plainStart = 0
  let boldOpen = false
  const n = raw.length

  const flushPlain = (upTo: number) => {
    if (upTo > plainStart) result += chemToHtml(raw.slice(plainStart, upTo))
  }

  while (i < n) {
    // \[ ... \] display math
    if (raw[i] === '\\' && raw[i + 1] === '[') {
      const end = raw.indexOf('\\]', i + 2)
      if (end !== -1) {
        flushPlain(i)
        result += renderMath(raw.slice(i + 2, end), true)
        i = end + 2
        plainStart = i
        continue
      }
    }
    // \( ... \) inline math
    if (raw[i] === '\\' && raw[i + 1] === '(') {
      const end = raw.indexOf('\\)', i + 2)
      if (end !== -1) {
        flushPlain(i)
        result += renderMath(raw.slice(i + 2, end), false)
        i = end + 2
        plainStart = i
        continue
      }
    }
    // $ ... $ inline math (not spanning a newline, to avoid swallowing stray currency signs)
    if (raw[i] === '$') {
      const nlIdx = raw.indexOf('\n', i + 1)
      const end = raw.indexOf('$', i + 1)
      if (end !== -1 && (nlIdx === -1 || end < nlIdx)) {
        flushPlain(i)
        result += renderMath(raw.slice(i + 1, end), false)
        i = end + 1
        plainStart = i
        continue
      }
      // No valid closing $ — not math, just an ordinary character; keep scanning.
      i += 1
      continue
    }
    // ** bold marker (toggles state; survives spanning a math token above)
    if (raw[i] === '*' && raw[i + 1] === '*') {
      flushPlain(i)
      result += boldOpen ? '</strong>' : '<strong>'
      boldOpen = !boldOpen
      i += 2
      plainStart = i
      continue
    }
    i += 1
  }
  flushPlain(n)
  if (boldOpen) result += '</strong>' // unclosed ** in source — close it rather than leak state
  return result
}

function blockPass(html: string): string {
  const paragraphs = html.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  return paragraphs
    .map(p => {
      const lines = p.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length > 0 && lines.every(l => /^[*\-]\s+/.test(l))) {
        return `<ul>${lines.map(l => `<li>${l.replace(/^[*\-]\s+/, '')}</li>`).join('')}</ul>`
      }
      if (lines.length > 0 && lines.every(l => /^\d+[.)]\s+/.test(l))) {
        return `<ol>${lines.map(l => `<li>${l.replace(/^\d+[.)]\s+/, '')}</li>`).join('')}</ol>`
      }
      return `<p>${lines.join('<br/>')}</p>`
    })
    .join('')
}

function richTextToHtml(raw: string): string {
  return blockPass(inlinePass(raw))
}

interface Props {
  text: string
  className?: string
}

export default function RichText({ text, className = '' }: Props) {
  if (!text) return null
  const html = richTextToHtml(text)
  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
