'use client'
import { useEffect, useState } from 'react'
import { NamingResult } from '@/lib/nomenclature/nameMolecule'

export interface NamingPanelProps {
  result: NamingResult
  highlightOn: boolean
  numberingOn: boolean
  onToggleHighlight: () => void
  onToggleNumbering: () => void
  practiceMode: boolean
  onTogglePracticeMode: () => void
  /** Shrinks padding/min-height/name font size — for hosts (like the projection-formula lab) that
   * need to give the space above this panel more room. Defaults to false so the original
   * `/labs/nomenclature` presentation, where this panel is the main content, is unaffected. */
  compact?: boolean
}

export default function NamingPanel({
  result,
  highlightOn,
  numberingOn,
  onToggleHighlight,
  onToggleNumbering,
  practiceMode,
  onTogglePracticeMode,
  compact = false,
}: NamingPanelProps) {
  const [revealed, setRevealed] = useState(false)
  const [guess, setGuess] = useState('')
  const [stepMode, setStepMode] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  // A new molecule means a new (likely shorter or longer) rule trail — start back at step 1 rather
  // than leaving the reader stranded past the end of the new explanation.
  useEffect(() => setStepIndex(0), [result.iupacName, result.error])

  return (
    <div
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(9,14,28,0.9)',
        padding: compact ? '12px 20px' : '22px 26px',
        minHeight: compact ? 0 : 300,
        maxHeight: compact ? 180 : undefined,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 8 : 14,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {result.error ? (
          <span style={{ fontSize: 16, color: '#fbbf24' }}>{result.error}</span>
        ) : practiceMode && !revealed ? (
          <>
            <input
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess for the IUPAC name..."
              style={{ flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#f8fafc', fontSize: 16 }}
            />
            <button
              type="button"
              onClick={() => setRevealed(true)}
              style={{ padding: '10px 18px', borderRadius: 8, border: 'none', background: '#f97316', color: '#0b0712', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Reveal
            </button>
          </>
        ) : (
          <>
            <span data-testid="iupac-name" style={{ fontSize: compact ? 20 : 34, fontWeight: 800, color: '#f8fafc' }}>{result.iupacName ?? '—'}</span>
            {result.commonName && <span style={{ fontSize: 16, color: '#94a3b8' }}>({result.commonName})</span>}
            {result.molecularFormula && <span style={{ fontSize: 16, color: '#64748b', marginLeft: 'auto' }}>{result.molecularFormula}</span>}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
        <ToggleChip label="Highlight parent chain" active={highlightOn} onClick={onToggleHighlight} />
        <ToggleChip label="Show numbering" active={numberingOn} onClick={onToggleNumbering} />
        <ToggleChip label="Practice mode" active={practiceMode} onClick={() => { setRevealed(false); setGuess(''); onTogglePracticeMode() }} />
        <ToggleChip label="Step-by-step" active={stepMode} onClick={() => { setStepIndex(0); setStepMode((v) => !v) }} />
      </div>

      {!result.error && result.explanation.length > 0 && (!practiceMode || revealed) && (
        stepMode ? (
          <div style={{ fontSize: 14, color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Step {Math.min(stepIndex, result.explanation.length - 1) + 1} of {result.explanation.length}
              </span>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                style={navButtonStyle(stepIndex === 0)}
              >
                ← Prev
              </button>
              <button
                type="button"
                disabled={stepIndex >= result.explanation.length - 1}
                onClick={() => setStepIndex((i) => Math.min(result.explanation.length - 1, i + 1))}
                style={navButtonStyle(stepIndex >= result.explanation.length - 1)}
              >
                Next →
              </button>
            </div>
            <p style={{ lineHeight: 1.6, margin: 0 }}>{result.explanation[Math.min(stepIndex, result.explanation.length - 1)]}</p>
          </div>
        ) : (
          <details style={{ fontSize: 14, color: '#cbd5e1' }}>
            <summary style={{ cursor: 'pointer', color: '#f97316', fontWeight: 700, fontSize: 13 }}>Why this name? (rules applied)</summary>
            <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.7 }}>
              {result.explanation.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </details>
        )
      )}
    </div>
  )
}

function navButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    padding: '4px 11px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    border: '1px solid rgba(255,255,255,0.1)',
    background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
    color: disabled ? '#475569' : '#cbd5e1',
  }
}

function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        border: `1px solid ${active ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
        background: active ? '#f9731620' : 'rgba(255,255,255,0.03)',
        color: active ? '#f97316' : '#94a3b8',
      }}
    >
      {label}
    </button>
  )
}
