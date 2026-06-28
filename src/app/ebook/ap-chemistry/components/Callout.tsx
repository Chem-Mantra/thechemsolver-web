'use client'

import type { CalloutVariant } from '../types'

const CONFIG: Record<CalloutVariant, { bg: string; border: string; icon: string; label: string }> = {
  insight:   { bg: 'bg-blue-950/40',   border: 'border-blue-500',   icon: '💡', label: 'Insight' },
  warning:   { bg: 'bg-amber-950/40',  border: 'border-amber-500',  icon: '⚠️', label: 'Warning' },
  'exam-tip':{ bg: 'bg-orange-950/40', border: 'border-orange-500', icon: '📝', label: 'AP Exam Tip' },
  analogy:   { bg: 'bg-purple-950/40', border: 'border-purple-500', icon: '🔗', label: 'Analogy' },
  'key-fact':{ bg: 'bg-teal-950/40',   border: 'border-teal-500',   icon: '⚡', label: 'Key Fact' },
}

export default function Callout({
  variant,
  title,
  body,
}: {
  variant: CalloutVariant
  title: string
  body: string
}) {
  const c = CONFIG[variant]
  return (
    <div className={`my-5 rounded-xl border-l-4 ${c.border} ${c.bg} p-4`}>
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide opacity-70">
        <span>{c.icon}</span>
        <span>{c.label}</span>
      </div>
      <p className="mb-0.5 font-semibold text-white">{title}</p>
      <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  )
}
