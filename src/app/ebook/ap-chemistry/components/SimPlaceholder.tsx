'use client'

export default function SimPlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="my-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-600 bg-slate-900/40 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-3xl">
        🧪
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
        Interactive Simulation
      </p>
      <p className="text-lg font-bold text-white">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-slate-400">{description}</p>
      <span className="mt-2 rounded-full bg-slate-800 px-4 py-1 text-xs font-medium text-slate-400">
        Coming Soon
      </span>
    </div>
  )
}
