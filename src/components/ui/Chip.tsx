import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ChipProps {
  children: ReactNode
  /** default: hairline pill · accent: violet tint · gold: achievement · dashed: "still learning" */
  tone?: 'default' | 'accent' | 'gold' | 'dashed'
  className?: string
}

const tones = {
  default: 'border-line-strong text-muted',
  accent: 'border-transparent bg-accent-soft text-accent-strong',
  gold: 'border-gold-deco/50 text-gold',
  dashed: 'border-dashed border-line-control text-caption',
}

/** Small mono pill for tools, tags and statuses. */
export function Chip({ children, tone = 'default', className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 font-mono text-[0.75rem] leading-none tracking-[0.02em] whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
