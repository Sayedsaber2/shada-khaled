import { SectionLabel } from '@/components/ui/SectionHeader'
import { profile } from '@/data/profile'
import { FactSheet } from './about/FactSheet'
import { Figures } from './about/Figures'
import { Manifesto } from './about/Manifesto'
import { NowStrip } from './about/NowStrip'
import { Story } from './about/Story'

/* -------------------------------------------------------------------------- */
/*  01 — ABOUT                                                                 */
/*                                                                            */
/*   01 — ABOUT ────────────────────────────────────────────────────────       */
/*                                                                            */
/*   FACT SHEET        The manifesto, lit word by word while scrolling         */
/*   (sticky rail,     Story: two short columns                                */
/*    cols 1–4)        Figures: four big numerals                              */
/*                     Now: what is happening at the moment      (cols 5–12)   */
/*                                                                            */
/*  Below lg everything stacks in the same order. All text comes from          */
/*  src/data/profile.ts.                                                       */
/* -------------------------------------------------------------------------- */

const SECTION_INDEX = '01'

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y">
      <div className="container-page">
        <SectionLabel index={SECTION_INDEX} label="About" />

        {/* The manifesto is the visual headline, so the real <h2> is for screen readers only */}
        <h2 id="about-title" className="sr-only">
          About {profile.firstName}
        </h2>

        <div className="grid-editorial mt-[clamp(3rem,6vw,6rem)] gap-y-[clamp(3.5rem,7vw,7rem)]">
          {/*
            The rail stays on screen while the longer right column scrolls past.
            - top-[120px] = the fixed navbar (72px) + breathing room.
            - self-start is required: a grid item normally stretches to the full row height,
              and an element that already fills its row has no room left to stick in.
            - lg:pe-… adds one extra gutter, so the rail's hairlines stop short of the manifesto.
          */}
          <FactSheet className="col-span-full min-w-0 lg:sticky lg:top-[120px] lg:col-span-4 lg:self-start lg:pe-[clamp(1rem,2vw,2rem)]" />

          {/* One consistent, generous gap between the four blocks */}
          <div className="col-span-full flex min-w-0 flex-col gap-[clamp(3.5rem,7vw,7rem)] lg:col-span-8 lg:col-start-5">
            <Manifesto />
            <Story />
            <Figures />
            <NowStrip />
          </div>
        </div>
      </div>
    </section>
  )
}
