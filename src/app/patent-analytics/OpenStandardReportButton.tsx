'use client'

import { OPEN_STANDARD_REPORT_EVENT } from './StandardReportModal'

export default function OpenStandardReportButton({
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
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_STANDARD_REPORT_EVENT))}
    >
      {children}
    </button>
  )
}
