import { motion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { skillRows } from '@/data/skills'
import { cn } from '@/lib/cn'
import { VIEWPORT, drawLine } from '@/lib/motion'
import { SkillTableRow } from './toolkit/SkillTableRow'

/* -------------------------------------------------------------------------- */
/*  02 — TOOLKIT                                                               */
/*  An editorial table instead of cards or percentage bars: one row per skill  */
/*  group, separated by hairlines that draw themselves. Content comes from     */
/*  src/data/skills.ts.                                                        */
/* -------------------------------------------------------------------------- */

const SECTION_INDEX = '02'

export function Toolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          index={SECTION_INDEX}
          label="Toolkit"
          title="Tools & *skills*"
          titleId="toolkit-title"
          lead="No percentage bars here — just an honest picture of what I use daily and what I’m still learning."
        />

        <ChipLegend />

        {/* role="list": Safari drops list semantics when list-style is none */}
        <ul role="list">
          {skillRows.map((row) => (
            <SkillTableRow key={row.id} row={row} />
          ))}
        </ul>

        {/* Closing hairline under the last row */}
        <motion.span
          aria-hidden="true"
          className="hairline origin-left"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        />
      </div>
    </section>
  )
}

/* --------------------------------- Legend --------------------------------- */

/** Explains the two chip styles. Sits above the chips column of the table. */
function ChipLegend() {
  return (
    <Reveal variant="fade" className="grid-editorial pb-5">
      <ul
        role="list"
        aria-label="Chip legend"
        className="label-mono col-span-full flex flex-wrap items-center gap-x-6 gap-y-2 text-caption lg:col-span-8 lg:col-start-5"
      >
        <li className="flex items-center gap-2.5">
          <LegendSwatch className="border-line-strong" />
          In use
        </li>
        <li className="flex items-center gap-2.5">
          <LegendSwatch className="border-dashed border-line-control" />
          Currently learning
        </li>
      </ul>
    </Reveal>
  )
}

/** A tiny empty chip. The border classes mirror <Chip>'s "default" and "dashed" tones. */
function LegendSwatch({ className }: { className: string }) {
  return <span aria-hidden="true" className={cn('h-3 w-6 rounded-full border', className)} />
}
