import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  The "violet hour" sky behind the Contact panel — the ONE gradient moment.  */
/*                                                                            */
/*  Three huge soft blobs drift slowly over the night-violet base. Each blob   */
/*  is a plain radial gradient that fades to transparent: the gradient itself  */
/*  is the blur, so no CSS `filter` is needed (filters are expensive to move). */
/*  The drift loops are CSS keyframes (transform only); <Contact> pauses them  */
/*  while the section is off-screen (useInViewFlag).                           */
/*                                                                            */
/*  CONTRAST SAFETY — white text is only 2.5:1 on rose and 1.7:1 on gold, so:  */
/*   1. the rose and gold blobs have their CENTRE outside the panel (end edge  */
/*      and bottom-end corner). Only their faint outer half is ever visible,   */
/*      and their brightest parts never overlap each other;                    */
/*   2. a dark scrim sits on top of the blobs, under the small copy.           */
/*  If you move or brighten a blob, re-check the text contrast on top of it.   */
/* -------------------------------------------------------------------------- */

interface Blob {
  id: string
  /** Size + position. `max(vw, rem)` keeps the blobs big enough on phones. */
  placement: string
  /** Gradient colour stops: centre → half way (the blob fades to transparent at its rim). */
  light: string
  /** One of the CSS drift loops from index.css. */
  drift: string
}

const BLOBS: Blob[] = [
  {
    // Brand violet, the largest: glows behind the headline (white on it is still 6.5:1)
    id: 'violet',
    placement: '-top-[max(20vw,9.5rem)] -start-[max(15vw,7rem)] size-[max(60vw,28rem)]',
    light: 'from-violet-600/80 via-violet-600/30',
    drift: 'animate-drift-a',
  },
  {
    // Rose: its centre sits just OUTSIDE the end edge (offset = 60% of its size)
    id: 'rose',
    placement: 'top-[40%] -end-[max(27vw,13.2rem)] size-[max(45vw,22rem)]',
    light: 'from-[#E08BB5]/45 via-[#E08BB5]/15',
    drift: 'animate-drift-b',
  },
  {
    // Gold: its centre sits just BELOW the bottom-end corner, behind the "Say hello" button
    id: 'gold',
    placement: '-bottom-[max(22vw,9.9rem)] -end-[max(12vw,5.4rem)] size-[max(40vw,18rem)]',
    light: 'from-[#E9C48B]/35 via-[#E9C48B]/12',
    drift: 'animate-drift-c',
  },
]

export function MeshBackground() {
  return (
    // -z-10 works because the panel is `isolate`: the mesh stays above the panel's own
    // background colour but below all of its content.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      {BLOBS.map((blob) => (
        <div
          key={blob.id}
          className={cn(
            'absolute rounded-full bg-radial-[circle_closest-side] to-transparent',
            blob.placement,
            blob.light,
            blob.drift,
          )}
        />
      ))}

      {/*
        Text-safe scrim: darkest on the start side, where the small copy sits.
        The mask fades it out towards the top, so the violet glow behind the big
        headline stays visible (large white type is safe on violet).
      */}
      <div className="absolute inset-0 bg-linear-to-r from-violet-950/85 via-violet-950/55 via-55% to-transparent [mask-image:linear-gradient(to_bottom,transparent_8%,black_42%)] rtl:bg-linear-to-l" />
    </div>
  )
}
