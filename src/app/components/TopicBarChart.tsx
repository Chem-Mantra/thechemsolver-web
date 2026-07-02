import type { SourceFreq } from '@/data/examTopicFrequency'

export default function TopicBarChart({
  title,
  subtitle,
  data,
  accentHex,
}: {
  title: string
  subtitle: string
  data: SourceFreq
  accentHex: string
}) {
  const maxPct = Math.max(...data.topics.map(t => t.pct))

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 md:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle} · n = {data.total.toLocaleString()} questions</p>
      </div>

      <div className="space-y-2">
        {data.topics.map(t => (
          <div key={t.topic} className="flex items-center gap-3" title={`${t.topic}: ${t.count} questions (${t.pct}%)`}>
            <span className="w-36 md:w-44 shrink-0 text-xs text-gray-400 truncate text-right">
              {t.topic}
            </span>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="flex-1 h-4 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(t.pct / maxPct) * 100}%`,
                    background: t.topic === 'Other' ? '#475569' : accentHex,
                  }}
                />
              </div>
              <span className="w-12 shrink-0 text-xs text-gray-300 tabular-nums">{t.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
