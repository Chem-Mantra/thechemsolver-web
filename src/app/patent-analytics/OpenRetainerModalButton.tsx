'use client'

import { OPEN_RETAINER_EVENT } from './RetainerModal'

export default function OpenRetainerModalButton({
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
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_RETAINER_EVENT))}
    >
      {children}
    </button>
  )
}
