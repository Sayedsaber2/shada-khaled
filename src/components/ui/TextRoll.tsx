import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Hover "text roll": the label slides up and an identical copy rolls in from below.
 * The PARENT must have the `group` class — the roll reacts to group-hover / group-focus.
 */
export function TextRoll({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('relative inline-block overflow-hidden align-bottom', className)}>
      <span className="block transition-transform duration-[350ms] ease-out-expo group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-[350ms] ease-out-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}
