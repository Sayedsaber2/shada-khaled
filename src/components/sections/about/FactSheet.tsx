import { useRef } from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { facts } from '@/data/profile'
import type { Fact } from '@/data/types'
import { useInViewFlag } from '@/hooks/useInViewFlag'
import { cn } from '@/lib/cn'
import { DURATION, EASE, VIEWPORT } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  The fact sheet — the sticky left rail of the About section.                */
/*                                                                            */
/*   ─────────────────────────────── hairline (draws itself)                   */
/*   NAME          Shada Khaled Ebrahim                                        */
/*   ───────────────────────────────                                           */
/*   STATUS        ● Open to internships & junior roles                        */
/*                                                                            */
/*  A <dl> (definition list) is the right HTML for "label : value" pairs.      */
/*  The <dl> is the ONLY scroll trigger. Every animated piece receives its row */
/*  number through `custom` and turns it into a delay, so the rows play one    */
/*  after another: hairline first, then the text.                              */
/* -------------------------------------------------------------------------- */

/** Seconds between one row and the next. */
const ROW_STAGGER = 0.06
/**
 * The text waits for its hairline. The line eases with outExpo, which covers ~90% of
 * its travel in the first third — after 0.3s it already reads as drawn.
 */
const TEXT_DELAY = 0.3

const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  visible: (rowIndex: number) => ({
    scaleX: 1,
    transition: { duration: DURATION.reveal, ease: EASE.outExpo, delay: rowIndex * ROW_STAGGER },
  }),
}

const textRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (rowIndex: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE.outExpo,
      delay: TEXT_DELAY + rowIndex * ROW_STAGGER,
    },
  }),
}

interface FactSheetProps {
  /** Grid placement + sticky behaviour come from the parent section. */
  className?: string
}

export function FactSheet({ className }: FactSheetProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  // The status dot pulses forever (CSS keyframes) → pause it while the rail is off-screen
  useInViewFlag(rootRef)

  if (facts.length === 0) return null

  return (
    <div ref={rootRef} className={className}>
      <h3 className="sr-only">Fact sheet</h3>

      {/* One column on phones · two on tablets (the rail is full width there) · one again inside the lg rail */}
      <motion.dl
        className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,2rem)] md:grid-cols-2 lg:grid-cols-1"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
      >
        {facts.map((fact, rowIndex) => (
          <FactRow key={fact.label} fact={fact} rowIndex={rowIndex} />
        ))}
      </motion.dl>
    </div>
  )
}

/* --------------------------------- One row -------------------------------- */

interface FactRowProps {
  fact: Fact
  /** Position in the list → becomes the stagger delay */
  rowIndex: number
}

function FactRow({ fact, rowIndex }: FactRowProps) {
  return (
    // Fixed label column + a value column that is allowed to shrink and wrap (minmax(0, 1fr)).
    // items-baseline: the small mono label sits on the first text line of the value.
    <div className="relative grid grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-4">
      <dt className="label-mono text-caption">
        {/*
          HTML only allows <dt> and <dd> inside a <dl> row, so the hairline lives inside
          the <dt>. It is positioned against the row (the nearest `relative` parent),
          which is why it still spans the full width.
        */}
        <motion.span
          aria-hidden="true"
          className="hairline absolute inset-x-0 top-0 origin-left"
          variants={ruleDraw}
          custom={rowIndex}
        />
        <motion.span className="block" variants={textRise} custom={rowIndex}>
          {fact.label}
        </motion.span>
      </dt>

      <dd className="min-w-0 text-[0.9375rem] leading-normal text-fg">
        <motion.span className="block" variants={textRise} custom={rowIndex}>
          {fact.status ? <StatusDot /> : null}
          {fact.value}
        </motion.span>
      </dd>
    </div>
  )
}

/* ------------------------------- Status dot ------------------------------- */

/**
 * The green "available" signal: a dot that breathes + a ring that pings outwards.
 * Decorative — the words next to it already say the status.
 */
function StatusDot() {
  return (
    <span aria-hidden="true" className="relative me-2.5 inline-block size-2 align-middle">
      {/*
        opacity-0 is the ring's resting state: only the keyframes make it visible.
        With reduced motion the animation is switched off, so the ring simply never shows.
      */}
      <span className={cn('absolute inset-0 rounded-full bg-status', 'animate-ping-ring opacity-0')} />
      <span className="absolute inset-0 animate-pulse-dot rounded-full bg-status" />
    </span>
  )
}
