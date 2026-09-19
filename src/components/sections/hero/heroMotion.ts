import type { Variants } from 'motion/react'
import { DURATION, EASE } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  The hero entrance is ONE choreography that starts when the preloader       */
/*  curtain begins to lift (`introDone` flips to true in <Hero>).              */
/*                                                                            */
/*  How it is wired:                                                           */
/*  - <Hero> is the only element with `initial` / `animate`.                   */
/*  - Every motion element below it only declares `variants` + `custom`.       */
/*    Motion passes the "hidden" / "visible" label down the tree, so they all  */
/*    start together and each one waits for its own delay (`custom`).          */
/* -------------------------------------------------------------------------- */

/** Seconds after `introDone`. Change the order of the whole entrance here. */
export const HERO_DELAY = {
  portrait: 0.1,
  name: 0.15,
  copy: 0.55,
  orbs: 0.7,
  badge: 1,
  caption: 1.1,
  strip: 1.15,
} as const

/** Between the two lines of the name. */
export const NAME_STAGGER = 0.09
/** Between eyebrow → statement → buttons. */
export const COPY_STAGGER = 0.08

/** Must match the `rounded-[999px_999px_6px_6px]` class on the arch in Portrait.tsx. */
const ARCH_RADIUS = '999px 999px 6px 6px'

/** A line of the name rising out of its overflow-hidden mask. */
export const nameLineRise: Variants = {
  hidden: { y: '110%', rotate: 3 },
  visible: (delay: number) => ({
    y: '0%',
    rotate: 0,
    transition: { duration: DURATION.hero, ease: EASE.outExpo, delay },
  }),
}

/** Eyebrow, statement and buttons. */
export const copyFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.outExpo, delay },
  }),
}

/** Quiet supporting pieces: orbs, photo caption, bottom strip. */
export const softFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 1.2, ease: EASE.soft, delay },
  }),
}

/** Hairlines draw from the left (give the element `origin-left`). */
export const lineDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: (delay: number) => ({
    scaleX: 1,
    transition: { duration: 1, ease: EASE.outExpo, delay },
  }),
}

/**
 * The arch wipes open from its base. Keeping `round …` inside the clip-path
 * means the moving edge is always arch-shaped, never a flat cut.
 */
export const archReveal: Variants = {
  hidden: { clipPath: `inset(100% 0% 0% 0% round ${ARCH_RADIUS})` },
  visible: (delay: number) => ({
    clipPath: `inset(0% 0% 0% 0% round ${ARCH_RADIUS})`,
    transition: { duration: 1.2, ease: EASE.inOutQuart, delay },
  }),
}

/** The photo starts zoomed in and settles while the arch opens (runs a little longer). */
export const photoSettle: Variants = {
  hidden: { scale: 1.25 },
  visible: (delay: number) => ({
    scale: 1,
    transition: { duration: 1.6, ease: EASE.outExpo, delay },
  }),
}

/** The rotating badge grows into place once the arch is open. No overshoot. */
export const badgeAppear: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.reveal, ease: EASE.outExpo, delay },
  }),
}
