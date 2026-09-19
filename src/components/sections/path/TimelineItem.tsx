import { ArrowUpRight } from 'lucide-react'
import { ArrowLink } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Reveal } from '@/components/ui/Reveal'
import type { JourneyItem } from '@/data/types'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  One entry of the Path timeline:                                            */
/*                                                                            */
/*   ●  2026 — PRESENT  [TRAINING]  (● NOW)        ← meta row (dot sits here)   */
/*      UI/UX Design Trainee                       ← title (h3)                */
/*      DEPI — Digital Egypt Pioneers · Egypt      ← organization · location   */
/*      - bullet                                                               */
/*      ▏ highlighted line                         ← optional                  */
/*      (chip) (chip)                              ← optional                  */
/*      See the project ↗                          ← optional                  */
/*                                                                            */
/*  The whole item fades up together as one piece — no per-word or scroll-      */
/*  linked animation to follow.                                                */
/* -------------------------------------------------------------------------- */

interface TimelineItemProps {
  item: JourneyItem
  isLast: boolean
}

export function TimelineItem({ item, isLast }: TimelineItemProps) {
  const tags = item.tags ?? []

  return (
    <li className={cn('relative ps-8', isLast ? '' : 'pb-12')}>
      {/* The dot sits ON the line the <ol> draws (border-s). Filled for the current entry. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -start-[5px] top-1.5 size-[9px] rounded-full border-2 border-bg',
          item.current ? 'bg-accent' : 'bg-line-control',
        )}
      />

      <Reveal variant="left">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="label-mono flex h-8 items-center text-caption">{item.period}</p>
          <p className="label-mono inline-flex h-6 items-center rounded-plate border border-line-strong px-2 text-caption">
            <span className="sr-only">Type: </span>
            {item.type}
          </p>
          {item.current ? (
            <Chip tone="accent" className="uppercase">
              {/* Ambient loop — the section has no useInViewFlag now, so it simply always runs;
                  it is a single small dot and costs nothing noticeable. */}
              <span aria-hidden="true" className="size-1.5 animate-pulse-dot rounded-full bg-status" />
              Now
            </Chip>
          ) : null}
        </div>

        <h3 className="mt-4 text-h3 text-fg">{item.title}</h3>

        <p className="mt-3 font-[520] text-muted">
          {item.organization}
          {item.location ? (
            <>
              <span aria-hidden="true"> · </span>
              <span className="sr-only">, </span>
              {item.location}
            </>
          ) : null}
        </p>

        {/* role="list": Safari drops list semantics when list-style is none */}
        <ul role="list" className="mt-5 max-w-[62ch] space-y-2 text-muted">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="relative ps-5">
              <span
                aria-hidden="true"
                className="absolute start-0 top-[0.7em] size-1.5 rounded-full bg-line-control"
              />
              {bullet}
            </li>
          ))}
        </ul>

        {item.highlight ? (
          <p className="mt-6 max-w-[46ch] border-s-2 border-gold-deco ps-4 text-fg italic">
            {item.highlight}
          </p>
        ) : null}

        {tags.length > 0 ? (
          <ul role="list" aria-label={`${item.title} — topics`} className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>
        ) : null}

        {item.projectSlug ? (
          <div className="mt-4">
            {/* The Work section listens to this hash and opens the matching case study. */}
            <ArrowLink
              href={`#work/${item.projectSlug}`}
              icon={<ArrowUpRight size={16} strokeWidth={1.5} />}
              className="min-h-11"
            >
              See the project
              <span className="sr-only">: {item.title}</span>
            </ArrowLink>
          </div>
        ) : null}
      </Reveal>
    </li>
  )
}
