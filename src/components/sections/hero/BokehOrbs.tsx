import { motion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { cn } from '@/lib/cn'
import { HERO_DELAY, softFadeIn } from './heroMotion'
import type { PointerParallax } from './usePointerParallax'

/* -------------------------------------------------------------------------- */
/*  "Bokeh spill": soft circles of light BEHIND the arch, in the colours of    */
/*  the city lights in the photo, so the photo seems to leak onto the page.    */
/*                                                                            */
/*  Each orb is a plain radial gradient that fades to transparent. The         */
/*  gradient itself is the blur, so no CSS `filter` is needed (filters are     */
/*  expensive to animate).                                                     */
/* -------------------------------------------------------------------------- */

interface OrbConfig {
  id: string
  /** Size + position in % of the portrait frame, so the orbs scale with the arch. */
  placement: string
  /** Gradient colour (theme utilities, so both themes work). */
  light: string
  /** One of the CSS drift loops from index.css. */
  drift: string
  /** px of travel when the pointer reaches the edge of the window. Bigger = feels closer. */
  pointerTravel: number
  /** px of travel while the hero scrolls away. Bigger = feels closer. */
  scrollTravel: number
}

// Desktop sizes (the frame is 440px wide): 220 / 190 / 130 / 88 px.
const ORBS: OrbConfig[] = [
  {
    id: 'gold-large',
    placement: 'top-[2%] -end-[26%] w-1/2',
    light: 'from-gold/35',
    drift: 'animate-drift-a',
    pointerTravel: 24,
    scrollTravel: -120,
  },
  {
    id: 'violet',
    placement: 'bottom-[6%] -start-[24%] w-[43%]',
    light: 'from-violet-500/30',
    drift: 'animate-drift-b',
    pointerTravel: 18,
    scrollTravel: -90,
  },
  {
    id: 'sky',
    placement: 'top-[22%] -start-[17%] w-[30%]',
    light: 'from-sky/20',
    drift: 'animate-drift-c',
    pointerTravel: 14,
    scrollTravel: -60,
  },
  {
    id: 'gold-small',
    placement: '-bottom-[7%] end-[8%] w-1/5',
    light: 'from-gold/35',
    drift: 'animate-drift-b',
    pointerTravel: 10,
    scrollTravel: -40,
  },
]

interface OrbProps {
  orb: OrbConfig
  pointer: PointerParallax
  scrollProgress: MotionValue<number>
  parallaxEnabled: boolean
}

/**
 * Three nested layers with ONE job each, because an element can only have one
 * `transform`: scroll parallax → pointer parallax → the CSS drift loop.
 */
function Orb({ orb, pointer, scrollProgress, parallaxEnabled }: OrbProps) {
  const scrollY = useTransform(scrollProgress, [0, 1], [0, orb.scrollTravel])
  // `pointer` rests at 0 when the pointer effect is off, so these stay at 0 too
  const pointerX = useTransform(pointer.x, (position) => position * orb.pointerTravel)
  const pointerY = useTransform(pointer.y, (position) => position * orb.pointerTravel)

  return (
    <motion.div
      className={cn('absolute aspect-square', orb.placement)}
      style={parallaxEnabled ? { y: scrollY } : undefined}
    >
      <motion.div className="size-full" style={{ x: pointerX, y: pointerY }}>
        <div
          className={cn(
            'size-full rounded-full bg-radial-[circle_closest-side] to-transparent',
            orb.light,
            orb.drift,
          )}
        />
      </motion.div>
    </motion.div>
  )
}

interface BokehOrbsProps {
  pointer: PointerParallax
  scrollProgress: MotionValue<number>
  parallaxEnabled: boolean
  /** Daylight photos have no glowing lights to echo: show the orbs at half strength. */
  soft: boolean
}

export function BokehOrbs({ pointer, scrollProgress, parallaxEnabled, soft }: BokehOrbsProps) {
  return (
    // The outer div owns the "half strength" opacity; the inner one owns the entrance fade.
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', soft && 'opacity-50')}>
      <motion.div className="absolute inset-0" variants={softFadeIn} custom={HERO_DELAY.orbs}>
        {ORBS.map((orb) => (
          <Orb
            key={orb.id}
            orb={orb}
            pointer={pointer}
            scrollProgress={scrollProgress}
            parallaxEnabled={parallaxEnabled}
          />
        ))}
      </motion.div>
    </div>
  )
}
