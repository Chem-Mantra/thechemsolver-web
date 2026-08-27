'use client'

import { OPEN_CHECK_PATENT_EVENT } from './CheckPatentModal'

export default function OpenCheckPatentButton({
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
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHECK_PATENT_EVENT))}
    >
      {children}
    </button>
  )
}
