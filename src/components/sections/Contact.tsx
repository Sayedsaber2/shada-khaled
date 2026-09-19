import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { profile } from '@/data/profile'
import { useInViewFlag } from '@/hooks/useInViewFlag'
import { VIEWPORT, drawLine } from '@/lib/motion'
import { CairoClock } from './contact/CairoClock'
import { ContactHeadline } from './contact/ContactHeadline'
import { CopyEmailButton } from './contact/CopyEmailButton'
import { HelloButton } from './contact/HelloButton'
import { MeshBackground } from './contact/MeshBackground'
import { SocialList } from './contact/SocialList'

/* -------------------------------------------------------------------------- */
/*  07 — CONTACT · the cinematic ending, and the ONE gradient moment.          */
/*                                                                            */
/*  A rounded panel that is DARK IN BOTH THEMES. That is why everything        */
/*  inside it uses fixed colours instead of the theme tokens (allowed here     */
/*  and in the preloader only):                                                */
/*                                                                            */
/*    base            bg-night            #2A1268                              */
/*    text            text-white                                               */
/*    secondary text  text-violet-50/80   rgba(245, 241, 255, 0.8)             */
/*    hairlines       white/16                                                 */
/*    gold accent     #E9C48B                                                  */
/*    paper button    bg-paper + text-ink                                      */
/*                                                                            */
/*  Layout (lg and up) — the content spreads from the top to the bottom:       */
/*                                                                            */
/*    07 — CONTACT                                   GIZA — 21:42 EET          */
/*    ────────────────────────────────────────────────────────────────         */
/*    Let’s make something clear.                                              */
/*                                                                            */
/*    copy · email + copy · CV (cols 1–7)            socials (cols 9–12)       */
/*                                                                            */
/*                                                        ( Say hello )        */
/*                                                                            */
/*  Below lg everything simply stacks in that same order.                      */
/* -------------------------------------------------------------------------- */

const SECTION_INDEX = '06'
const SECTION_LABEL = 'Contact'
const TITLE_ID = 'contact-title'

/* The copy of this section. (Name, email, links… come from src/data/profile.ts.) */
const HEADLINE_LEAD = 'Let’s make something'
const HEADLINE_EMPHASIS = 'clear.'
const AVAILABILITY_COPY =
  'Open to UI/UX internships, junior roles and small freelance projects. I usually reply within a couple of days.'

/* Entrance: the panel starts a little smaller and rounder, then "lands". */
const PANEL_SCALE_FROM = 0.94
const PANEL_RADIUS_FROM = 24
/** Same value as `rounded-plate` (6px), the resting radius of the panel. */
const PANEL_RADIUS_TO = 6

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  // Pauses the CSS loops inside (drifting blobs, blinking clock colon) while off-screen
  useInViewFlag(sectionRef)

  // 0 when the top of the section enters at the bottom of the window → 1 when it has
  // climbed to 30% from the top. The <section> itself is measured, NOT the panel:
  // the panel is being scaled, which would disturb its own measurement.
  // The motion values go straight into `style`: no React state, no re-render per frame.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'start 0.3'] })
  const panelScale = useTransform(scrollYProgress, [0, 1], [PANEL_SCALE_FROM, 1])
  const panelRadius = useTransform(scrollYProgress, [0, 1], [PANEL_RADIUS_FROM, PANEL_RADIUS_TO])

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby={TITLE_ID}
      // The slim gutter around the panel (this section manages its own spacing: no section-y)
      className="px-[clamp(0.5rem,1.5vw,1.5rem)] pb-[clamp(0.5rem,1.5vw,1.5rem)]"
    >
      <motion.div
        // Reduced motion: no scrubbing — the panel simply rests at full size with `rounded-plate`.
        style={reducedMotion ? undefined : { scale: panelScale, borderRadius: panelRadius }}
        // origin-top: it grows from its top edge — the edge you watch arriving — so that edge
        // follows the scroll exactly. isolate: keeps the mesh's negative z-index inside the
        // panel (and makes Safari clip the drifting blobs to the rounded corners).
        // scheme-dark + white outlines: native UI and focus rings are styled for a dark
        // surface, also when the rest of the page is in the light theme.
        className="relative isolate flex min-h-[92svh] origin-top flex-col overflow-hidden rounded-plate bg-night p-[clamp(1.5rem,4vw,4rem)] text-white scheme-dark [&_:focus-visible]:outline-white"
      >
        <MeshBackground />

        {/* Opens like every other section: mono label row + a hairline that draws itself */}
        <Reveal variant="fade" className="flex items-baseline justify-between gap-6 pb-4">
          <p className="label-mono text-violet-50/80">
            <span className="text-[#E9C48B]">{SECTION_INDEX}</span>
            <span aria-hidden="true"> — </span>
            {SECTION_LABEL}
          </p>
          <CairoClock />
        </Reveal>
        <motion.span
          aria-hidden="true"
          className="block h-px w-full origin-left bg-white/16 rtl:origin-right"
          variants={drawLine}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        />

        <div className="mt-[clamp(2.5rem,6vw,6rem)]">
          <ContactHeadline id={TITLE_ID} lead={HEADLINE_LEAD} emphasis={HEADLINE_EMPHASIS} />
        </div>

        <div className="grid-editorial mt-[clamp(3.5rem,7vw,7rem)] gap-y-14">
          {/* START — availability, the email address, the CV */}
          <RevealGroup
            stagger={0.09}
            className="col-span-full flex min-w-0 flex-col items-start gap-[clamp(2rem,3.5vw,3rem)] lg:col-span-7"
          >
            <RevealItem>
              <p className="max-w-[46ch] text-body-lg text-violet-50/80">{AVAILABILITY_COPY}</p>
            </RevealItem>

            {/*
              flex-wrap: when the address and the copy button do not fit on one line (360px
              phones), the BUTTON drops to the next line — the address itself stays in one piece.
            */}
            <RevealItem className="flex max-w-full min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href={`mailto:${profile.email}`}
                // min-h-11: a text link still needs a 44px touch target
                className="inline-flex min-h-11 max-w-full min-w-0 items-center font-display-soft text-[length:clamp(1.25rem,1rem_+_1.6vw,2.25rem)] leading-[1.1] tracking-[-0.01em] text-white"
              >
                {/*
                  The underline lives on this inner span, so it hugs the text and not the taller
                  44px link box. min-w-0 + wrap-anywhere: a last resort — even a very long
                  address breaks inside the panel instead of overflowing it.
                */}
                <span className="link-underline link-underline-on min-w-0 wrap-anywhere">
                  {profile.email}
                </span>
              </a>
              <CopyEmailButton email={profile.email} />
            </RevealItem>

            {profile.cvUrl ? (
              <RevealItem>
                <Button
                  variant="ghost"
                  size="lg"
                  href={profile.cvUrl}
                  download={profile.cvFileName}
                  icon={<Download size={18} strokeWidth={1.5} />}
                  // The ghost variant uses theme tokens, which would turn dark in the light
                  // theme. This panel is always dark, so they are overridden with fixed whites.
                  // The trailing `!` (= !important) is needed because cn() does not merge
                  // conflicting classes — without it the variant's own colours could win.
                  className="border-white/40! text-white! hover:border-white! hover:bg-white/10!"
                >
                  Download CV
                </Button>
              </RevealItem>
            ) : null}
          </RevealGroup>

          {/* END — social links + location */}
          <SocialList className="col-span-full min-w-0 lg:col-span-4 lg:col-start-9" />
        </div>

        {/* mt-auto: whatever height is left goes ABOVE this row, pinning the button to the bottom-end corner */}
        <div className="mt-auto flex justify-end pt-[clamp(3.5rem,6vw,6rem)]">
          <HelloButton />
        </div>
      </motion.div>
    </section>
  )
}
