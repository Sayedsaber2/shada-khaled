import { motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { MaskText } from '@/components/ui/MaskText'
import { EASE, VIEWPORT } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  "Let’s make something clear." — the last big headline of the site.         */
/*                                                                            */
/*  The final word is a gold Fraunces italic with a hand-drawn squiggle that   */
/*  draws itself underneath. The squiggle has to be exactly as wide as that    */
/*  word, so the headline is built from TWO <MaskText> pieces inside one <h2>: */
/*  the second piece sits in a `relative inline-block` wrapper, and the        */
/*  squiggle is positioned against that wrapper.                               */
/* -------------------------------------------------------------------------- */

/** Seconds between two rising words (the same rhythm as every other headline). */
const WORD_STAGGER = 0.06

/** The squiggle waits until the words have mostly settled, then underlines the last one. */
const SQUIGGLE_DELAY = 0.8
const SQUIGGLE_DURATION = 0.9

/** A loose wave drawn in a 300 × 20 box. The box is scaled to the width of the word. */
const SQUIGGLE_VIEWBOX = '0 0 300 20'
const SQUIGGLE_PATH = 'M4 13 C 30 4, 52 5, 78 12 S 122 18, 150 9 S 204 4, 228 11 S 272 16, 296 6'

const squiggleDraw: Variants = {
  // opacity 0: a path of length 0 with round caps would still show up as a tiny dot
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: SQUIGGLE_DURATION, delay: SQUIGGLE_DELAY, ease: EASE.inOutCubic },
      // Switches on at the very moment the drawing starts
      opacity: { duration: 0.01, delay: SQUIGGLE_DELAY },
    },
  },
}

interface ContactHeadlineProps {
  /** id for aria-labelledby on the <section> */
  id: string
  /** The plain part: "Let’s make something" */
  lead: string
  /** The gold italic part: "clear." */
  emphasis: string
}

export function ContactHeadline({ id, lead, emphasis }: ContactHeadlineProps) {
  const leadWordCount = lead.trim().split(/\s+/).length

  return (
    // aria-label: screen readers get the sentence in one piece. (The animated word
    // <span>s inside <MaskText> are aria-hidden.)
    <h2 id={id} aria-label={`${lead} ${emphasis}`} className="text-display-xl text-white">
      <MaskText as="span" text={lead} stagger={WORD_STAGGER} />{' '}
      <span className="relative inline-block">
        <MaskText
          as="span"
          // The asterisks mark the phrase as "emphasised" for <MaskText>
          text={`*${emphasis}*`}
          // Same look as the `emphasis` utility, but in the panel's fixed gold instead of violet
          emphasisClassName="font-display font-[340] italic text-[#E9C48B]"
          stagger={WORD_STAGGER}
          // Continue the word-by-word rhythm of the first piece
          delay={leadWordCount * WORD_STAGGER}
        />
        <SquiggleUnderline />
      </span>
    </h2>
  )
}

/** Decorative underline that draws itself from start to end (pathLength 0 → 1). */
function SquiggleUnderline() {
  const reducedMotion = useReducedMotion()

  return (
    // The <svg> is the scroll trigger and hands "hidden" / "visible" down to the path
    <motion.svg
      aria-hidden="true"
      focusable="false"
      viewBox={SQUIGGLE_VIEWBOX}
      fill="none"
      // top-full: hangs just under the word's line box, where a normal underline would be.
      // overflow-visible: the round line caps may poke a little outside the viewBox.
      className="pointer-events-none absolute inset-x-0 top-full h-auto w-full overflow-visible"
      // Reduced motion: start in the finished state, so the line is simply there
      initial={reducedMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.path
        d={SQUIGGLE_PATH}
        strokeLinecap="round"
        // The drawing scales with the word, so the stroke is thicker (in SVG units) on
        // small screens — on screen it stays close to 2px everywhere.
        className="stroke-[#E9C48B] stroke-4 lg:stroke-[2.5]"
        variants={squiggleDraw}
      />
    </motion.svg>
  )
}
