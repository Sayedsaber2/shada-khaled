import { motion } from 'motion/react'
import { useApp } from '@/context/AppContext'
import { Monogram } from '@/components/ui/Monogram'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { profile, socials } from '@/data/profile'
import { EASE, VIEWPORT } from '@/lib/motion'
import { BackToTop } from './BackToTop'
import { ThemeToggle } from './ThemeToggle'
import { FooterNav } from './footer/FooterNav'
import { FooterSocials } from './footer/FooterSocials'
import { FooterWordmark } from './footer/FooterWordmark'

/* -------------------------------------------------------------------------- */
/*  <Footer> — the colophon of the folio.                                      */
/*                                                                            */
/*    S.                       01 About     04 Path         (in)(@)(tel) | (☼) */
/*    Designed with care by …  02 Toolkit   05 Credentials                     */
/*                             03 Work      06 Contact                   (↑)   */
/*    ──────────────────────────────────────────────────────────────────────   */
/*    © 2026 NAME · LOCATION · LAST UPDATED — SEP 2026 · V1.0 — …              */
/*                                                                            */
/*                         S h a d a   K h a l e d                             */
/*                     (big, solid, fully on screen — nothing cropped)         */
/*                                                                            */
/*  Below `md` the three blocks stack; the icons and the arrow share one row.  */
/* -------------------------------------------------------------------------- */

const displayName = `${profile.firstName} ${profile.lastName}`

/** "Sep 2026" — from the date Vite stamped into the bundle (see vite.config.ts). */
function formatBuildDate(): string | null {
  const buildDate = new Date(__BUILD_DATE__)
  if (Number.isNaN(buildDate.getTime())) return null

  // The stamp is a UTC timestamp, so it is also read as UTC: every visitor sees the same month
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
  return formatter.format(buildDate)
}

const lastUpdated = formatBuildDate()

/** The mono row under the hairline. Written in normal case — `label-mono` uppercases it in CSS. */
const colophon: string[] = [
  `© ${new Date().getFullYear()} ${profile.fullName}`,
  profile.location,
  ...(lastUpdated ? [`Last updated — ${lastUpdated}`] : []),
  'v1.0 — A work in progress, like its designer',
]

export function Footer() {
  const { introDone } = useApp()
  const hasSocials = socials.length > 0

  return (
    <footer
      // Not reachable by keyboard / screen readers while the preloader covers the page
      // (<main> and the navbar do the same).
      inert={!introDone}
      className="bg-bg py-[clamp(4rem,8vw,8rem)]"
    >
      <div className="container-page">
        <RevealGroup stagger={0.09} className="grid-editorial gap-y-12">
          {/* START — the mark and a one-line credit */}
          <RevealItem className="col-span-full min-w-0 lg:col-span-5">
            {/* h-11: the same 44px first row as the links and icons beside it, so all three
                blocks start on one optical line */}
            <div className="flex h-11 items-center text-fg">
              <Monogram size={40} />
            </div>
            <p className="mt-6 max-w-[36ch] text-[0.9375rem] leading-[1.6] text-muted">
              Designed with care by {displayName}. Built with React, Tailwind &amp; Motion.
            </p>
          </RevealItem>

          {/* MIDDLE — section links */}
          <RevealItem className="col-span-full min-w-0 md:col-span-4 lg:col-start-6">
            <FooterNav />
          </RevealItem>

          {/* END — social icons + theme switch, then the way back up.
              Phones: one row (icons at the start, arrow at the end).
              From `md`: a column on the end edge; justify-between parks the arrow on the last
              line of the links. The DOM order is the visual order in both layouts, and
              "Back to top" stays the last stop of the Tab key on the whole page. */}
          <RevealItem className="col-span-full flex min-w-0 flex-wrap items-center justify-between gap-6 md:col-span-4 md:flex-col md:flex-nowrap md:items-end lg:col-span-3 lg:col-start-10">
            {/* -ms-1 / -me-1: the 36px rings sit inside 44px touch targets; the negative margin
                lines the outer ring up with the text edge instead of leaving a 4px dent */}
            <div className="-ms-1 flex flex-wrap items-center md:ms-0 md:-me-1 md:justify-end">
              <FooterSocials />
              {hasSocials ? (
                // A short rule between "places to go" (links) and "a setting" (the theme)
                <span aria-hidden="true" className="mx-2 block h-4 w-px bg-line-strong" />
              ) : null}
              <ThemeToggle />
            </div>

            <BackToTop className="ms-auto" />
          </RevealItem>
        </RevealGroup>

        {/* Hairline that draws itself from the start edge, like the one under every section label */}
        <motion.span
          aria-hidden="true"
          className="hairline mt-[clamp(3rem,6vw,6rem)] origin-left rtl:origin-right"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.1, ease: EASE.outExpo }}
        />

        {/* flex-wrap: one line on wide screens, a tidy stack of lines on phones */}
        <RevealGroup
          as="ul"
          stagger={0.06}
          className="label-mono flex flex-wrap justify-between gap-x-8 gap-y-2 pt-5 text-caption"
        >
          {colophon.map((line) => (
            <RevealItem key={line} as="li" variant="fade" className="min-w-0">
              {line}
            </RevealItem>
          ))}
        </RevealGroup>

        <FooterWordmark />
      </div>
    </footer>
  )
}
