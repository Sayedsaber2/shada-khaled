import { motion } from 'motion/react'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { now } from '@/data/profile'
import type { NowCard } from '@/data/types'
import { cn } from '@/lib/cn'
import { fadeUp } from '@/lib/motion'
import { DrawnRule } from './DrawnRule'

/* -------------------------------------------------------------------------- */
/*  The "Now" strip — what is happening at the moment.                         */
/*                                                                            */
/*   NOW                                        UPDATED — SEPTEMBER 2026       */
/*   ────────────────────────────────────────────────────────────────────      */
/*   LEARNING            │ BUILDING            │ LOOKING FOR                   */
/*   The full UX …       │ My first end-to-…   │ A UI/UX internship …          */
/*                                                                            */
/*  Three columns from md up, stacked on phones. A <dl> is the right HTML for  */
/*  "label : description" pairs. The text lives in src/data/profile.ts.        */
/* -------------------------------------------------------------------------- */

export function NowStrip() {
  if (now.cards.length === 0) return null

  return (
    <div>
      <Reveal variant="fade" className="flex items-baseline justify-between gap-6 pb-4">
        <h3 className="label-mono text-fg">Now</h3>
        {now.updated ? (
          <p className="label-mono text-end text-caption">
            Updated <span aria-hidden="true">— </span>
            {now.updated}
          </p>
        ) : null}
      </Reveal>

      <DrawnRule />

      <RevealGroup as="dl" stagger={0.08} className="grid grid-cols-1 md:grid-cols-3">
        {now.cards.map((card, index) => (
          <NowColumn key={card.id} card={card} isFirst={index === 0} />
        ))}
      </RevealGroup>
    </div>
  )
}

/* -------------------------------- One column ------------------------------ */

interface NowColumnProps {
  card: NowCard
  /** The first column has no divider and no inset: it lines up with the header above */
  isFirst: boolean
}

function NowColumn({ card, isFirst }: NowColumnProps) {
  return (
    // The column carries the divider hairline, so it only fades (a line should appear
    // in place). The text inside rises on its own: <dt> and <dd> inherit "hidden" →
    // "visible" from this item, which is why they need no initial/animate props.
    <RevealItem
      variant="fade"
      className={cn(
        // max-md:last:pb-0 → when stacked, the last card adds no empty space under the strip
        'min-w-0 py-6 max-md:last:pb-0 md:pt-7 md:pb-2 md:pe-[clamp(1rem,2vw,2rem)]',
        // Divider: a line above when stacked, a line at the start edge when side by side
        !isFirst && 'border-t border-line md:border-t-0 md:border-s md:ps-[clamp(1rem,2vw,2rem)]',
      )}
    >
      <motion.dt variants={fadeUp} className="label-mono text-accent-strong">
        {card.label}
      </motion.dt>
      <motion.dd
        variants={fadeUp}
        className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-fg"
      >
        {card.text}
      </motion.dd>
    </RevealItem>
  )
}
