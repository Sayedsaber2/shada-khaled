import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { profile } from '@/data/profile'

/* -------------------------------------------------------------------------- */
/*  The two short story columns under the manifesto:                           */
/*  "From the workshop" → "To the screen".                                     */
/*                                                                            */
/*  Two columns from md up, one column on phones. The column gap is the same   */
/*  as the editorial grid's, so each column lines up with 4 of the 12 columns. */
/* -------------------------------------------------------------------------- */

interface StoryChapter {
  title: string
  text: string
}

// `profile` is declared `as const`. Reading the story as a plain list lets us check
// its length, so the block hides itself if the list is ever emptied.
const chapters: readonly StoryChapter[] = profile.story

export function Story() {
  if (chapters.length === 0) return null

  return (
    <RevealGroup
      stagger={0.09}
      className="grid grid-cols-1 gap-x-[clamp(1rem,2vw,2rem)] gap-y-12 md:grid-cols-2"
    >
      {chapters.map((chapter) => (
        <RevealItem key={chapter.title} className="min-w-0">
          <h3 className="label-mono flex items-center gap-3 text-caption">
            {/* A small gold diamond: the same node shape as on the timeline (a rotated square) */}
            <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold-deco" />
            {chapter.title}
          </h3>
          <p className="mt-5 max-w-[62ch] text-muted">{chapter.text}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  )
}
