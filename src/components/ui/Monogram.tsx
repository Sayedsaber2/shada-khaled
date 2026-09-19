import { cn } from '@/lib/cn'

/** The single-stroke "S" — one continuous vector path, like a laser cut. viewBox 0 0 100 120 */
export const MONOGRAM_PATH =
  'M74 32C70 19 60 12 49 12C35 12 26 22 26 35C26 66 74 54 74 85C74 98 64 108 50 108C38 108 29 101 25 89'
export const MONOGRAM_VIEWBOX = '0 0 100 120'
/** Where the gold "period" sits, in viewBox units. */
export const MONOGRAM_DOT = { cx: 90, cy: 104, r: 5 }

interface MonogramProps {
  /** rendered height in px (width follows the 100:120 ratio) */
  size?: number
  strokeWidth?: number
  className?: string
  title?: string
}

/** Static brand mark: the "S." used in the navbar, footer and favicon. */
export function Monogram({ size = 28, strokeWidth = 9, className, title }: MonogramProps) {
  return (
    <svg
      viewBox={MONOGRAM_VIEWBOX}
      height={size}
      width={(size * 100) / 120}
      className={cn('overflow-visible', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        d={MONOGRAM_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle {...MONOGRAM_DOT} r={strokeWidth * 0.72} fill="var(--gold)" />
    </svg>
  )
}
