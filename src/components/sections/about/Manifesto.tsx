import { Fragment, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { profile } from '@/data/profile'

/* -------------------------------------------------------------------------- */
/*  The manifesto — the visual headline of the About section.                  */
/*                                                                            */
/*  Every word starts as faint ink and "lights up" one after another while     */
/*  you scroll, so the paragraph is read at the speed of the scroll.           */
/*  The ONE word wrapped in *asterisks* (src/data/profile.ts) is set in the    */
/*  Fraunces italic and lights up in violet instead of white.                  */
/*                                                                            */
/*  How it works: useScroll gives ONE motion value (0 → 1) for the paragraph.  */
/*  Word number i owns the slice [i/n, (i+1)/n] of that progress. Only         */
/*  `opacity` changes and no React state is involved, so scrolling never       */
/*  re-renders anything.                                                       */
/* -------------------------------------------------------------------------- */

/** Opacity of a word before the scroll reaches it: faint, but still readable as a shape. */
const DIM_OPACITY = 0.14

/** The slice of the scroll progress that belongs to one word: [start, end], both 0–1. */
type ProgressRange = [number, number]

interface ManifestoWord {
  text: string
  /** true for the word that was wrapped in *asterisks* */
  isEmphasis: boolean
}

function splitIntoWords(text: string): ManifestoWord[] {
  return text
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => ({
      text: token.replaceAll('*', ''),
      isEmphasis: token.includes('*'),
    }))
}

// The text never changes at runtime, so it is prepared once, outside the component
const WORDS = splitIntoWords(profile.manifesto)
const PLAIN_TEXT = profile.manifesto.replaceAll('*', '')

export function Manifesto() {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()

  // 0 when the top of the paragraph reaches 85% of the screen height (just entered),
  // 1 when its bottom reaches 45% (just above the middle) → the last word is lit
  // while the paragraph is still comfortably in view.
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.85', 'end 0.45'],
  })

  return (
    <p ref={paragraphRef} className="font-display-soft text-display-md text-fg">
      {/* Screen readers get the sentence once, as plain text… */}
      <span className="sr-only">{PLAIN_TEXT}</span>

      {/* …and skip the ~45 separate word spans, which would be read out in pieces */}
      <span aria-hidden="true">
        {WORDS.map((word, index) => (
          <Fragment key={`${word.text}-${index}`}>
            <Word
              word={word}
              range={[index / WORDS.length, (index + 1) / WORDS.length]}
              progress={scrollYProgress}
              isStatic={reducedMotion === true}
            />
            {/* A real space between the words, so the paragraph wraps like normal text */}
            {' '}
          </Fragment>
        ))}
      </span>
    </p>
  )
}

/* ---------------------------------- Word ---------------------------------- */

interface WordProps {
  word: ManifestoWord
  range: ProgressRange
  /** Scroll progress of the whole paragraph, 0 → 1 */
  progress: MotionValue<number>
  /** true with reduced motion → no scrubbing at all */
  isStatic: boolean
}

/** Picks the right version of a word. It calls no hooks itself, so the early returns are fine. */
function Word({ word, range, progress, isStatic }: WordProps) {
  if (isStatic) {
    // Reduced motion: the whole paragraph is simply there, fully opaque
    return <span className={word.isEmphasis ? 'emphasis' : undefined}>{word.text}</span>
  }
  if (word.isEmphasis) {
    return <ScrubbedEmphasis text={word.text} range={range} progress={progress} />
  }
  return <ScrubbedWord text={word.text} range={range} progress={progress} />
}

/* ------------------------------ Scrubbed words ---------------------------- */

/*
  These are separate components (not code inside the .map above) because hooks
  such as useTransform may not be called inside a loop. One component per word =
  one legal hook call per word.
*/

interface ScrubbedWordProps {
  text: string
  range: ProgressRange
  progress: MotionValue<number>
}

function ScrubbedWord({ text, range, progress }: ScrubbedWordProps) {
  const opacity = useTransform(progress, range, [DIM_OPACITY, 1])

  return <motion.span style={{ opacity }}>{text}</motion.span>
}

/**
 * The emphasised word changes COLOUR while it lights up: faint white → full violet.
 * Animating `color` would repaint the text on every frame, and the scroll value cannot
 * blend two CSS variables anyway. So two copies of the word are stacked instead: the
 * faint white one fades out while the violet one fades in. Only opacity changes, and
 * both colours stay theme tokens, so the light theme works without extra code.
 */
function ScrubbedEmphasis({ text, range, progress }: ScrubbedWordProps) {
  const dimOpacity = useTransform(progress, range, [DIM_OPACITY, 0])
  const violetOpacity = useTransform(progress, range, [0, 1])

  return (
    // `emphasis` = Fraunces italic + violet. inline-block keeps both copies on one line.
    <span className="emphasis relative inline-block">
      <motion.span className="text-fg" style={{ opacity: dimOpacity }}>
        {text}
      </motion.span>
      {/* Same word, same font → it sits exactly on top of the first copy */}
      <motion.span className="absolute start-0 top-0" style={{ opacity: violetOpacity }}>
        {text}
      </motion.span>
    </span>
  )
}
