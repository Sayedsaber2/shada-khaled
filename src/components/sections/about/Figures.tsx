import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { figures } from '@/data/profile'
import type { Figure } from '@/data/types'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, maskRise } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  Four true figures: a big Fraunces numeral over a mono caption.             */
/*                                                                            */
/*   ─────────────┬─────────────┬─────────────┬─────────────                   */
/*   3            │ 3           │ A           │ ’28                            */
/*   YEARS IN …   │ PROJECTS …  │ INNOVEGYPT… │ MIS GRADUATION                 */
/*                                                                            */
/*  2 × 2 on phones, four across from md up. Numbers count up from 0, text     */
/*  values ("A", "’28") rise out of a mask — both when the row scrolls in.     */
/* -------------------------------------------------------------------------- */

/** Seconds between one cell and the next (also delays each count-up to match). */
const CELL_STAGGER = 0.08
/** How long a number takes to count from 0 to its value. */
const COUNT_DURATION = 1.2

export function Figures() {
  const rowRef = useRef<HTMLDivElement>(null)
  // Same trigger settings as the <RevealGroup> below, so the count-up starts with the fade-in
  const isInView = useInView(rowRef, VIEWPORT)

  if (figures.length === 0) return null

  return (
    <div ref={rowRef}>
      <RevealGroup
        as="dl"
        stagger={CELL_STAGGER}
        className="grid grid-cols-2 gap-y-10 md:grid-cols-4"
      >
        {figures.map((figure, index) => (
          <FigureCell key={figure.id} figure={figure} index={index} isInView={isInView} />
        ))}
      </RevealGroup>
    </div>
  )
}

/* -------------------------------- One cell -------------------------------- */

interface FigureCellProps {
  figure: Figure
  /** Position in the row → decides the dividers and the count-up delay */
  index: number
  isInView: boolean
}

function FigureCell({ figure, index, isInView }: FigureCellProps) {
  // The first cell of a row has no divider and no inset, so it lines up with the text above.
  // A row holds 2 cells on phones and 4 cells from md up.
  const startsRowOnPhones = index % 2 === 0
  const startsRowOnDesktop = index % 4 === 0

  return (
    // variant="fade": the cell carries hairlines, and a hairline should appear in place, not slide
    <RevealItem
      variant="fade"
      className={cn(
        'flex min-w-0 flex-col border-t border-line pt-5 pe-4 pb-1',
        !startsRowOnPhones && 'max-md:border-s max-md:ps-4',
        !startsRowOnDesktop && 'md:border-s md:ps-[clamp(1rem,2vw,2rem)]',
      )}
    >
      {/* HTML wants the <dt> (caption) before the <dd> (value); `order-first` shows the value on top */}
      <dt className="label-mono mt-4 text-caption">{figure.caption}</dt>
      <dd className="order-first font-display-soft text-[length:clamp(3rem,2rem_+_4vw,5.5rem)] leading-none text-fg lining-nums tabular-nums">
        {/* Screen readers get the final value; the animated copy is hidden from them */}
        <span className="sr-only">{figure.value}</span>
        {typeof figure.value === 'number' ? (
          <CountUpValue value={figure.value} delay={index * CELL_STAGGER} isInView={isInView} />
        ) : (
          <MaskedValue value={figure.value} />
        )}
      </dd>
    </RevealItem>
  )
}

/* --------------------------- Numbers: count up ---------------------------- */

interface CountUpValueProps {
  value: number
  /** seconds — keeps the count-up in step with the staggered fade of its cell */
  delay: number
  isInView: boolean
}

function CountUpValue({ value, delay, isInView }: CountUpValueProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const node = numberRef.current
    if (!node || !isInView || reducedMotion) return

    // animate() runs outside React: every frame writes straight into the DOM node,
    // so the component does not re-render 60 times a second.
    // The figures are whole numbers, so every frame is rounded (0 → 1 → 2 → 3).
    const controls = animate(0, value, {
      duration: COUNT_DURATION,
      delay,
      ease: EASE.outExpo,
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [isInView, reducedMotion, value, delay])

  return (
    <span ref={numberRef} aria-hidden="true">
      {/* Reduced motion: the final value from the first paint. Otherwise the count starts at 0. */}
      {reducedMotion ? value : 0}
    </span>
  )
}

/* --------------------------- Text values: mask rise ----------------------- */

function MaskedValue({ value }: { value: string }) {
  const reducedMotion = useReducedMotion()

  // Reduced motion: no mask, no movement — the value is simply there
  if (reducedMotion) return <span aria-hidden="true">{value}</span>

  return (
    // The mask. The extra padding (cancelled by the negative margins) keeps the apostrophe
    // and the edges of the glyphs from being clipped.
    <span
      aria-hidden="true"
      className="-mx-[0.08em] -mb-[0.14em] inline-block overflow-hidden px-[0.08em] pb-[0.14em] align-bottom"
    >
      {/* No initial/animate here: it inherits "hidden" → "visible" from the <RevealGroup> above */}
      <motion.span className="inline-block origin-bottom-left" variants={maskRise}>
        {value}
      </motion.span>
    </span>
  )
}
