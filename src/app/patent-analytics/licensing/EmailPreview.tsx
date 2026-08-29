/** Renders a real alert email exactly as it's sent (plain text, matching
 * 06_check_retainer_watches.py's send_compound_match_email/
 * send_new_members_email templates verbatim) inside a mail-client-style
 * card, so the "sample result" for this service is literally what a
 * subscriber's inbox looks like, not a marketing paraphrase of it. */
export default function EmailPreview({ subject, body, note }: { subject: string; body: string[]; note: string }) {
  return (
    <div className="pa-glass pa-glass-elevated overflow-hidden">
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border-light)', background: 'var(--surface-container-low)' }}>
        <div className="pa-mono text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--on-surface-muted)' }}>Subject</div>
        <div className="text-sm font-semibold" style={{ color: 'var(--on-surface)' }}>{subject}</div>
      </div>
      <pre className="px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap font-sans" style={{ color: 'var(--on-surface-variant)' }}>
        {body.join('\n')}
      </pre>
      <div className="px-5 py-3 border-t text-xs leading-relaxed" style={{ borderColor: 'var(--border-light)', color: 'var(--on-surface-muted)' }}>
        {note}
      </div>
    </div>
  )
}
