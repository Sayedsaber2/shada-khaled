import { Chip } from '@/components/ui/Chip'
import { Reveal } from '@/components/ui/Reveal'

/* -------------------------------------------------------------------------- */
/*  The slim strip under the certificate plates: a credential that is still    */
/*  being earned.                                                              */
/*                                                                            */
/*   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐         */
/*     DEPI — UI/UX DESIGN TRACK                        ( In progress )        */
/*   └ ─ ─ ━━━━━━ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘         */
/*           └ a short violet segment slides along the bottom edge             */
/*                                                                            */
/*  The segment is an INDETERMINATE progress line: it says "this is moving"    */
/*  without inventing a percentage nobody can measure.                         */
/* -------------------------------------------------------------------------- */

interface InProgressStripProps {
  title: string
  /** Short status for the chip, e.g. "In progress" */
  note: string
}

export function InProgressStrip({ title, note }: InProgressStripProps) {
  return (
    <Reveal>
      {/* Dashed border = "not finished yet", the same language as the dashed "still learning" chips */}
      <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-plate border border-dashed border-line-control px-6 py-5">
        <p className="label-mono min-w-0 text-fg">{title}</p>
        <Chip tone="dashed">{note}</Chip>

        {/*
          The 1px track lies exactly on the dashed bottom border (-bottom-px) and stops
          before the rounded corners (inset-x-1.5 = the 6px plate radius).
          overflow-hidden: the segment enters and leaves through the ends of the track.
          Decoration only — the chip already says the status in words.
        */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1.5 -bottom-px h-px overflow-hidden"
        >
          {/*
            animate-indeterminate slides the 25%-wide segment across with `transform` only.
            The Credentials section pauses the loop while it is off-screen (useInViewFlag).
            Reduced motion: no loop. A segment parked at the start would look like "25% done",
            so the whole line is tinted instead — still "in progress", still no fake number.
          */}
          <span className="block h-full w-1/4 animate-indeterminate bg-accent motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-50" />
        </span>
      </div>
    </Reveal>
  )
}
