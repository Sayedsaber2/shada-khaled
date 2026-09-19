import { SectionHeader } from '@/components/ui/SectionHeader'
import { journey } from '@/data/journey'
import { TimelineItem } from './path/TimelineItem'

/* -------------------------------------------------------------------------- */
/*  05 — PATH: experience + education, newest first (src/data/journey.ts).     */
/*                                                                            */
/*  A plain vertical timeline: a straight line on the start edge, with one     */
/*  small dot per entry. Nothing here is tied to scroll position — every       */
/*  item just fades in when it comes into view, like the rest of the site.     */
/* -------------------------------------------------------------------------- */

export function Path() {
  return (
    <section id="path" aria-labelledby="path-title" className="section-y">
      <div className="container-page">
        <SectionHeader index="04" label="Path" title="Experience & *education*" titleId="path-title" />

        {/* border-s: the vertical line the dots sit on. role="list": Safari drops list
            semantics when list-style is none. */}
        <ol role="list" aria-label="Timeline, newest first" className="max-w-3xl border-s border-line">
          {journey.map((item, index) => (
            <TimelineItem key={item.id} item={item} isLast={index === journey.length - 1} />
          ))}
        </ol>
      </div>
    </section>
  )
}
