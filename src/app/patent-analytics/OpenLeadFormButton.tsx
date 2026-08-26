'use client'

export const OPEN_LEAD_FORM_EVENT = 'patent-analytics:open-lead-form'

export default function OpenLeadFormButton({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_LEAD_FORM_EVENT))}
    >
      {children}
    </button>
  )
}
