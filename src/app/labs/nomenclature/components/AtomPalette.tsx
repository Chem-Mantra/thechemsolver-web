'use client'
import { TOOL_GROUPS, ToolId } from './tools'

export interface AtomPaletteProps {
  activeTool: ToolId
  onSelectTool: (tool: ToolId) => void
  showH: boolean
  onToggleShowH: () => void
  onClear: () => void
  onUndo: () => void
  canUndo: boolean
}

export default function AtomPalette({ activeTool, onSelectTool, showH, onToggleShowH, onClear, onUndo, canUndo }: AtomPaletteProps) {
  return (
    <div style={{ width: 208, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(9,14,28,0.6)', padding: 14, overflowY: 'auto' }}>
      <div style={{ display: 'flex', gap: 7, marginBottom: 14 }}>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo the last edit"
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: canUndo ? 'pointer' : 'default',
            color: canUndo ? '#f8fafc' : '#475569',
            background: canUndo ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={onClear}
          title="Clear the whole structure and start over"
          style={{ flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', cursor: 'pointer' }}
        >
          ✕ Clear
        </button>
      </div>

      {TOOL_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7, fontWeight: 700 }}>{group.label}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {group.tools.map((tool) => {
              const [glyph, word] = tool.label.split('\n')
              return (
                <button
                  key={tool.id}
                  type="button"
                  title={tool.hint}
                  onClick={() => onSelectTool(tool.id)}
                  style={{
                    minWidth: word ? 56 : 44,
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: word ? 2 : 0,
                    border: `1px solid ${activeTool === tool.id ? '#f9731680' : 'rgba(255,255,255,0.1)'}`,
                    background: activeTool === tool.id ? '#f9731622' : 'rgba(255,255,255,0.05)',
                    color: activeTool === tool.id ? '#f97316' : '#e2e8f0',
                  }}
                >
                  <span style={{ fontSize: word ? 24 : 14, lineHeight: 1 }}>{glyph}</span>
                  {word && <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.02em' }}>{word}</span>}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#e2e8f0', cursor: 'pointer' }}>
          <input type="checkbox" checked={showH} onChange={onToggleShowH} style={{ width: 15, height: 15 }} />
          Show H counts
        </label>
      </div>
    </div>
  )
}
