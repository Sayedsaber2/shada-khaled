import { Reveal } from '@/components/ui/Reveal'
import { profile } from '@/data/profile'

/* -------------------------------------------------------------------------- */
/*  <FooterWordmark> — the name that closes the page.                          */
/*  Simple and static: solid text, fully on screen, nothing cropped or          */
/*  animated. Purely decorative → aria-hidden (the name is already the <h1>     */
/*  of the Hero section).                                                       */
/* -------------------------------------------------------------------------- */

const wordmark = `${profile.firstName} ${profile.lastName}`

export function FooterWordmark() {
  return (
    <Reveal
      variant="fade"
      as="p"
      className="mt-[clamp(3rem,6vw,5rem)] px-4 text-center font-display-soft text-violet-hour text-[length:clamp(2.25rem,9vw,6rem)] leading-[1.15] tracking-[-0.02em] select-none"
    >
      {/* The name is already the page's <h1> in the Hero — this is decoration only. */}
      <span aria-hidden="true">{wordmark}</span>
    </Reveal>
  )
}
