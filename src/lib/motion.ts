import type { Transition, Variants } from 'motion/react'

/* -------------------------------------------------------------------------- */
/*  Motion language — "Traced, then settled".                                  */
/*  Things are revealed precisely (masks, path draws, clips) and decelerate.   */
/*  Bounce is allowed in exactly one place: the certificate stamp.             */
/* -------------------------------------------------------------------------- */

type Bezier = [number, number, number, number]

export const EASE = {
  /** Default for every reveal / entrance */
  outExpo: [0.16, 1, 0.3, 1] as Bezier,
  /** Path draws, the preloader trace */
  inOutCubic: [0.65, 0, 0.35, 1] as Bezier,
  /** Big page-level moves: curtains, clip reveals, sheets */
  inOutQuart: [0.76, 0, 0.24, 1] as Bezier,
  /** Micro hovers */
  soft: [0.22, 0.61, 0.36, 1] as Bezier,
  /** The certificate stamp overshoot */
  stamp: [0.34, 1.56, 0.64, 1] as Bezier,
}

export const SPRING = {
  /** layoutId indicators: nav dot, filter pill */
  ui: { type: 'spring', stiffness: 380, damping: 30 } as Transition,
  /** Grid re-flow when filtering */
  layout: { type: 'spring', stiffness: 300, damping: 32 } as Transition,
  /** Scroll-progress smoothing */
  progress: { stiffness: 120, damping: 30, restDelta: 0.001 },
  /** Pointer-driven movement: magnetic buttons, tilt, parallax */
  pointer: { stiffness: 150, damping: 15, mass: 0.2 },
  tilt: { stiffness: 200, damping: 20 },
}

export const DURATION = {
  micro: 0.2,
  small: 0.35,
  reveal: 0.9,
  hero: 1.1,
}

/** Shared viewport settings for whileInView reveals. */
export const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' } as const
/** For blocks that can be taller than the screen (20% may never be visible at once). */
export const VIEWPORT_TALL = { once: true, amount: 'some', margin: '0px 0px -12% 0px' } as const

/* ------------------------------- Variants --------------------------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE.outExpo } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE.soft } },
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE.outExpo } },
}

/** Text rising out of an overflow-hidden mask. Put it on the INNER element. */
export const maskRise: Variants = {
  hidden: { y: '110%', rotate: 3 },
  visible: { y: '0%', rotate: 0, transition: { duration: DURATION.hero, ease: EASE.outExpo } },
}

/** Hairline that draws from the left. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1, ease: EASE.outExpo } },
}

/** Image / cover wipe from the bottom. */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: DURATION.hero, ease: EASE.inOutQuart },
  },
}

/** Parent that staggers its children. Children use any variants with hidden/visible keys. */
export function staggerParent(stagger = 0.07, delayChildren = 0.05): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  }
}
