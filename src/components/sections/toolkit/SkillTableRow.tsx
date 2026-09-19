import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { Chip } from '@/components/ui/Chip'
import { RevealItem } from '@/components/ui/Reveal'
import type { SkillRow } from '@/data/types'
import { EASE, VIEWPORT, drawLine, staggerParent } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  One row of the Toolkit table:                                              */
/*                                                                            */
/*   ───────────────────────────────────────────── hairline (draws itself)     */
/*   01   UX Foundations    (chip) (chip) (chip)          LEARNING — DEPI      */
/*                                                                   ● ○ ○     */
/*                                                                            */
/*  The <li> is the ONLY scroll trigger. Everything inside uses variants with  */
/*  the same "hidden" / "visible" names, so the whole row plays as one         */
/*  sequence: hairline → cells → chips → level dots.                           */
/* -------------------------------------------------------------------------- */

/**
 * The cells wait for the hairline. It eases with outExpo, which covers ~90% of
 * its travel in the first third — so after 0.35s the line already reads as drawn.
 */
const CELLS_DELAY = 0.35
/** The dots start filling once their own cell has mostly risen into place. */
const DOTS_DELAY = 0.3

const cellsStagger = staggerParent(0.05, CELLS_DELAY)
const chipsStagger = staggerParent(0.03, 0)
const dotsStagger = staggerParent(0.1, DOTS_DELAY)

/** A level dot filling up. Scale only, so it never triggers layout. */
const dotFill: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { duration: 0.25, ease: EASE.outExpo } },
}

const LEVEL_STEPS = [1, 2, 3] as const

interface SkillTableRowProps {
  row: SkillRow
}

export function SkillTableRow({ row }: SkillTableRowProps) {
  return (
    <motion.li
      className="group relative isolate"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {/*
        Hover fill: sweeps in from the left behind the row (scale only — cheap).
        The negative inset makes it a little wider than the row, so the text never
        touches the edge of the fill. It stays inside the page padding: no overflow.
        `group-hover` only fires on devices that really hover, so touch is unaffected.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 origin-left scale-x-0 bg-surface-2 transition-transform duration-450 ease-soft group-hover:scale-x-100 lg:-inset-x-6"
      />

      <motion.span aria-hidden="true" className="hairline origin-left" variants={drawLine} />

      {/* items-baseline: the small mono texts and the chips all sit on the title's first baseline */}
      <motion.div
        className="grid-editorial items-baseline gap-y-5 py-[clamp(1.5rem,3vw,2.75rem)]"
        variants={cellsStagger}
      >
        {/*
          Below lg: index + title share one line (flex).
          From lg: `contents` removes this wrapper from the layout, so the index and
          the title become real cells of the 12-column grid.
        */}
        <div className="col-span-full flex min-w-0 items-baseline gap-x-4 lg:contents">
          <RevealItem
            as="span"
            className="label-mono shrink-0 text-caption transition-colors duration-300 group-hover:text-gold lg:col-span-1"
          >
            {/* Decorative: the list already tells screen readers the position */}
            <span aria-hidden="true">{row.index}</span>
          </RevealItem>

          <RevealItem className="min-w-0 lg:col-span-3">
            {/* The hover shift lives on the <h3>, not on the wrapper that Motion is animating */}
            <h3 className="text-h3 transition-transform duration-450 ease-soft motion-safe:group-hover:translate-x-3">
              {row.title}
            </h3>
          </RevealItem>
        </div>

        <SkillChips title={row.title} skills={row.skills} learning={row.learning ?? []} />

        <RevealItem className="col-span-full flex min-w-0 items-center gap-3 lg:col-span-2 lg:flex-col lg:items-end">
          <p className="label-mono text-caption lg:text-end">
            {row.levelLabel}
            <span className="sr-only">
              . Level {row.level} of {LEVEL_STEPS.length}
            </span>
          </p>
          <LevelMeter level={row.level} />
        </RevealItem>
      </motion.div>
    </motion.li>
  )
}

/* ------------------------------ Skill chips ------------------------------- */

interface SkillChipsProps {
  title: string
  skills: string[]
  /** Skills that are still being studied → dashed chip. */
  learning: string[]
}

function SkillChips({ title, skills, learning }: SkillChipsProps) {
  return (
    <motion.ul
      // role="list": Safari drops list semantics when list-style is none
      role="list"
      aria-label={`${title} skills`}
      className="col-span-full flex min-w-0 flex-wrap gap-2 lg:col-span-6"
      variants={chipsStagger}
    >
      {skills.map((skill) => {
        const isLearning = learning.includes(skill)
        return (
          <RevealItem as="li" key={skill}>
            <Chip tone={isLearning ? 'dashed' : 'default'}>
              {skill}
              {/* The dashed border is visual only — say it in words too */}
              {isLearning ? <span className="sr-only"> (currently learning)</span> : null}
            </Chip>
          </RevealItem>
        )
      })}
    </motion.ul>
  )
}

/* ------------------------------ Level meter ------------------------------- */

interface LevelMeterProps {
  level: SkillRow['level']
}

/** Three 8px dots. Purely visual: the row exposes "Level 2 of 3" as sr-only text instead. */
function LevelMeter({ level }: LevelMeterProps) {
  return (
    <motion.span aria-hidden="true" className="flex gap-1.5" variants={dotsStagger}>
      {LEVEL_STEPS.map((step) => (
        // The ring is the "empty" dot and is always there…
        <span key={step} className="relative size-2 rounded-full border border-line-control">
          {/* …a filled dot grows on top of it (-inset-px also covers the 1px ring) */}
          {step <= level ? (
            <motion.span
              className="absolute -inset-px rounded-full bg-accent-strong"
              variants={dotFill}
            />
          ) : null}
        </span>
      ))}
    </motion.span>
  )
}
