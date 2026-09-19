import type { Variants } from 'motion/react'
import { EASE } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  Motion shared by the five generated covers.                                */
/*                                                                            */
/*  The <svg> in ProjectCover.tsx switches ONE state name: 'hidden' → 'drawn'. */
/*  Motion passes that name down the tree, and every variant below describes   */
/*  what it means for one kind of part. `custom` is always an extra delay in   */
/*  seconds, so each part can take its turn:                                   */
/*                                                                            */
/*    <motion.path variants={drawStroke} custom={0.4} d="…" />                 */
/* -------------------------------------------------------------------------- */

/** Wait for the card's clip reveal (or the sheet sliding up) before the pen starts. */
const START_DELAY = 0.3
const DRAW_SECONDS = 1.4

/** A stroke that draws itself. */
export const drawStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  drawn: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: DRAW_SECONDS, ease: EASE.inOutCubic, delay: START_DELAY + delay },
      // Switches on exactly when the drawing starts: at length 0 a round line cap
      // would otherwise already show as a dot
      opacity: { duration: 0.01, delay: START_DELAY + delay },
    },
  }),
}

/** A detail that simply fades in: text rows, dots, ticks. */
export const fadeInPart: Variants = {
  hidden: { opacity: 0 },
  drawn: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: EASE.soft, delay: START_DELAY + delay },
  }),
}

/** A chart bar growing up from the baseline. */
export const growBar: Variants = {
  hidden: { scaleY: 0 },
  drawn: (delay: number) => ({
    scaleY: 1,
    transition: { duration: 0.7, ease: EASE.outExpo, delay: START_DELAY + delay },
  }),
}

/** Makes `scaleY` grow from the BOTTOM edge of the bar's own box (the default is its centre). */
export const GROW_FROM_BOTTOM = { transformBox: 'fill-box', originY: 1 } as const
