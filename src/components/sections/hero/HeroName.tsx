import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { profile } from '@/data/profile'
import { HERO_DELAY, NAME_STAGGER, nameLineRise } from './heroMotion'

interface NameLineProps {
  children: ReactNode
  /** seconds after the intro */
  delay: number
  className?: string
}

/**
 * One line of the name inside its own mask.
 * The OUTER span clips (overflow-hidden), the INNER span rises from below it.
 *
 * The mask is made a little bigger with padding and pulled back with the same
 * negative margin: the layout does not change, but descenders and the italic
 * overhang are no longer cut off by the clip.
 */
function NameLine({ children, delay, className }: NameLineProps) {
  return (
    <span
      // The <h1> already carries the name as its aria-label
      aria-hidden="true"
      className={cn(
        '-mx-[0.08em] -mt-[0.06em] -mb-[0.18em] block overflow-hidden px-[0.08em] pt-[0.06em] pb-[0.18em]',
        className,
      )}
    >
      <motion.span className="block origin-bottom-left" variants={nameLineRise} custom={delay}>
        {children}
      </motion.span>
    </span>
  )
}

/**
 * The <h1>. Place it inside a `grid-cols-subgrid` parent: the h1 passes the page's
 * column lines down once more, so the second line can start on column line 2 —
 * an indent of exactly one editorial column, with no magic numbers.
 */
export function HeroName() {
  return (
    <h1
      id="hero-title"
      aria-label={`${profile.firstName} ${profile.lastName}`}
      className="col-span-full grid grid-cols-subgrid text-display-xl text-fg"
    >
      <NameLine delay={HERO_DELAY.name} className="col-span-full">
        {profile.firstName}
      </NameLine>

      {/* No indent on phones: one column of four would push the word too far in */}
      <NameLine delay={HERO_DELAY.name + NAME_STAGGER} className="col-span-full sm:col-start-2">
        <span className="emphasis">{profile.lastName}</span>
        <span className="text-gold">.</span>
      </NameLine>
    </h1>
  )
}
