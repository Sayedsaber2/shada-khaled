import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  Guilloché: the fine engraved rosette printed on banknotes and diplomas.    */
/*                                                                            */
/*  It is generated, not drawn by hand: ONE thin ellipse, repeated 24 times,   */
/*  each copy turned a little further around the same centre.                  */
/*  Pure decoration → aria-hidden.                                             */
/* -------------------------------------------------------------------------- */

/* The SVG is drawn in a 200 × 200 box and scaled by CSS, so every number below is in those units. */
const BOX_SIZE = 200
const CENTER = BOX_SIZE / 2
const ELLIPSE_RADIUS_X = 98
const ELLIPSE_RADIUS_Y = 36

const ELLIPSE_COUNT = 24
/** An ellipse looks the same after half a turn, so the copies are spread over 180°, not 360°. */
const ELLIPSE_ANGLES = Array.from(
  { length: ELLIPSE_COUNT },
  (_, index) => (index * 180) / ELLIPSE_COUNT,
)

interface GuillocheProps {
  /** Size + position, decided by the plate. */
  className?: string
}

export function Guilloche({ className }: GuillocheProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
      fill="none"
      // Endless, very slow turn (120s). It is a CSS loop on `transform` only, and the
      // Credentials section pauses it while off-screen (useInViewFlag).
      // Under reduced motion index.css ends the loop at once, so the rosette stands still.
      className={cn('animate-spin-slower', className)}
    >
      {ELLIPSE_ANGLES.map((angle) => (
        <ellipse
          key={angle}
          cx={CENTER}
          cy={CENTER}
          rx={ELLIPSE_RADIUS_X}
          ry={ELLIPSE_RADIUS_Y}
          transform={`rotate(${angle} ${CENTER} ${CENTER})`}
          stroke="var(--accent-strong)"
          strokeWidth={0.6}
          // Each line is very faint; where many lines cross, the faint strokes add up
          // and the pattern gets its depth for free
          strokeOpacity={0.12}
        />
      ))}
    </svg>
  )
}
