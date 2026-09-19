import { useId } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { Asterisk } from 'lucide-react'
import { profile } from '@/data/profile'
import { HERO_DELAY, badgeAppear } from './heroMotion'

/* -------------------------------------------------------------------------- */
/*  A small round "stamp" with text running around a circle.                   */
/*                                                                            */
/*  It is decoration (aria-hidden): the same availability sentence is real     */
/*  text in the About section, so screen readers lose nothing here.            */
/* -------------------------------------------------------------------------- */

/* The SVG is drawn in a 100 × 100 box and scaled by CSS, so every number below is in those units. */
const RING_RADIUS = 37
const RING_LENGTH = 2 * Math.PI * RING_RADIUS
const FONT_SIZE = 7.6
/** JetBrains Mono is monospaced: every character is exactly 0.6em wide. */
const MONO_CHARACTER_WIDTH = 0.6

/** A full circle, starting at 12 o'clock and running clockwise (so the text reads clockwise). */
const RING_PATH = `M 50,${50 - RING_RADIUS} a ${RING_RADIUS},${RING_RADIUS} 0 1,1 0,${RING_RADIUS * 2} a ${RING_RADIUS},${RING_RADIUS} 0 1,1 0,${-RING_RADIUS * 2}`

/** Scrolling this fast (px per second) adds the maximum extra turn. */
const FULL_SPEED = 2500
const MAX_EXTRA_TURN = 90

export function RotatingBadge() {
  const ringId = useId()
  const reducedMotion = useReducedMotion()

  // Scroll speed → a little extra rotation, like a coin that gets flicked when you scroll.
  // Velocity is a jumpy signal, so a soft spring smooths it and brings the badge back to rest.
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 90, damping: 26 })
  const extraTurn = useTransform(
    smoothVelocity,
    [-FULL_SPEED, FULL_SPEED],
    [-MAX_EXTRA_TURN, MAX_EXTRA_TURN],
  )

  // Spread the sentence over the whole circle: split the ring into equal slots,
  // one per character; whatever the character itself does not fill becomes letter-spacing.
  const text = profile.badgeText
  const letterSpacing = RING_LENGTH / text.length - FONT_SIZE * MONO_CHARACTER_WIDTH

  return (
    <motion.div
      aria-hidden="true"
      variants={badgeAppear}
      custom={HERO_DELAY.badge}
      // Below md the badge stays inside the arch's width, so it can never cause sideways scroll
      className="absolute start-0 -bottom-4 size-[84px] md:-start-9 md:-bottom-7 md:size-28"
    >
      {/* Layer 1 — the extra turn from scroll speed (off for reduced motion) */}
      <motion.div className="size-full" style={reducedMotion ? undefined : { rotate: extraTurn }}>
        <div className="relative size-full rounded-full border border-line bg-bg">
          {/* Layer 2 — the endless slow spin is a CSS loop; the Hero section pauses it off-screen */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow" focusable="false">
            <defs>
              <path id={ringId} d={RING_PATH} />
            </defs>
            <circle cx="50" cy="50" r="28" strokeWidth="0.75" className="fill-none stroke-line" />
            <text
              className="fill-fg font-mono font-medium uppercase"
              fontSize={FONT_SIZE}
              letterSpacing={letterSpacing}
            >
              <textPath href={`#${ringId}`}>{text}</textPath>
            </text>
          </svg>

          <Asterisk strokeWidth={1.5} className="absolute inset-0 m-auto size-5 text-gold md:size-7" />
        </div>
      </motion.div>
    </motion.div>
  )
}
