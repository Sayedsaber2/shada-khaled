import type { Variants } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  A certificate plate plays ONE short choreography when it scrolls into      */
/*  view:                                                                      */
/*                                                                            */
/*    0.0s  the plate rises in                                                 */
/*    0.2s  the inner hairline frame starts drawing itself                     */
/*    0.5s  the gold seal STAMPS in (the only overshoot on the whole site)     */
/*   ~0.7s  the seal "hits the paper" → the plate dips 2px and comes back      */
/*                                                                            */
/*  How it is wired (same idea as hero/heroMotion.ts):                         */
/*  - <CertificatePlate>'s outer element is the only one with `initial` /      */
/*    `whileInView`. Motion passes the "hidden" / "visible" label down the     */
/*    tree, so every piece below only declares `variants` + `custom`.          */
/*  - `custom` is the plate's own reveal delay in seconds. Every delay here    */
/*    is added on top of it, so the whole sequence shifts together.            */
/* -------------------------------------------------------------------------- */

/** Seconds between two plates that sit in the same row. */
export const PLATE_STAGGER = 0.12

const FRAME_DELAY = 0.2
const STAMP_DELAY = 0.5
const STAMP_DURATION = 0.5

/**
 * EASE.stamp overshoots: it reaches its target for the first time about 37% into the
 * animation, and only settles after that. That first touch is the "impact".
 */
const STAMP_IMPACT_DELAY = STAMP_DELAY + STAMP_DURATION * 0.37

/** The plate itself: fade + rise. */
export const plateReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (revealDelay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE.outExpo, delay: revealDelay },
  }),
}

/** The inner hairline frame traces itself once around the plate (use on an SVG shape). */
export const frameDraw: Variants = {
  hidden: { pathLength: 0 },
  visible: (revealDelay: number) => ({
    pathLength: 1,
    transition: { duration: 1.2, ease: EASE.inOutCubic, delay: revealDelay + FRAME_DELAY },
  }),
}

/**
 * The stamp: the seal starts bigger, invisible and twisted, then lands.
 * `rotate` ends at 0 because the seal's resting angle (-12°) is a plain CSS class
 * on the SVG inside — so -18° here + -12° there = the stamp starts at -30°.
 */
export const sealStamp: Variants = {
  hidden: { opacity: 0, scale: 1.7, rotate: -18 },
  visible: (revealDelay: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: STAMP_DURATION, ease: EASE.stamp, delay: revealDelay + STAMP_DELAY },
  }),
}

/** The plate reacts to the stamp: a tiny dip at the moment of impact. */
export const impactNudge: Variants = {
  hidden: { y: 0 },
  visible: (revealDelay: number) => ({
    y: [0, 2, 0],
    transition: { duration: 0.15, ease: EASE.soft, delay: revealDelay + STAMP_IMPACT_DELAY },
  }),
}
