import { motion } from 'motion/react'
import { ArrowDown } from 'lucide-react'
import { heroStrip } from '@/data/profile'
import { HERO_DELAY, lineDraw, softFadeIn } from './heroMotion'

/** Where the "Scroll" cue takes you: the first section after the hero. */
const NEXT_SECTION = '#about'

/**
 * The fact strip at the bottom of the hero: a hairline, three "LABEL — value" facts
 * and a scroll cue. It is the last thing to appear in the entrance.
 *
 * The cells sit on the editorial grid: 2 × 2 on phones, four across from md up.
 */
export function HeroStrip() {
  return (
    <div className="pb-4 md:pb-6">
      <motion.span
        aria-hidden="true"
        className="hairline origin-left"
        variants={lineDraw}
        custom={HERO_DELAY.strip}
      />

      <motion.ul
        // Safari drops list semantics when list-style is none; role="list" restores them
        role="list"
        className="grid-editorial label-mono gap-y-1 pt-2 md:pt-3"
        variants={softFadeIn}
        custom={HERO_DELAY.strip + 0.15}
      >
        {heroStrip.map((fact) => (
          <li
            key={fact.label}
            className="col-span-2 flex min-h-11 min-w-0 flex-wrap content-center items-baseline gap-x-2 gap-y-1 lg:col-span-3"
          >
            {/* Narrow cells: the label takes a full row and the value wraps under it.
                From xl there is room for the one-line "LABEL — value". */}
            <span className="basis-full text-caption xl:basis-auto">{fact.label}</span>
            <span aria-hidden="true" className="hidden text-caption xl:inline">
              —
            </span>
            <span className="min-w-0 text-fg">{fact.value}</span>
          </li>
        ))}

        <li className="col-span-2 flex min-h-11 items-center md:justify-end lg:col-span-3">
          <a
            href={NEXT_SECTION}
            className="inline-flex min-h-11 items-center gap-2 text-fg transition-colors duration-300 ease-soft hover:text-accent-strong"
          >
            <span className="link-underline">
              Scroll<span className="sr-only"> to the next section</span>
            </span>
            {/* The bob is a CSS loop: it pauses with the rest of the hero when off-screen */}
            <ArrowDown aria-hidden="true" size={14} strokeWidth={1.5} className="animate-bob" />
          </a>
        </li>
      </motion.ul>
    </div>
  )
}
