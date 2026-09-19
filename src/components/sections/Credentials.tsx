import { useRef } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { certificates, credentialInProgress } from '@/data/journey'
import { useInViewFlag } from '@/hooks/useInViewFlag'
import { CertificatePlate } from './credentials/CertificatePlate'
import { InProgressStrip } from './credentials/InProgressStrip'
import { PLATE_STAGGER } from './credentials/plateMotion'

/* -------------------------------------------------------------------------- */
/*  06 — CREDENTIALS: certificates drawn as paper plates, each with a gold     */
/*  seal that stamps in. Content comes from src/data/journey.ts.               */
/*                                                                            */
/*   ┌───────────────┐ ┌───────────────┐   two plates per row from md up,      */
/*   │  certificate  │ │  certificate  │   one per row on phones.              */
/*   └───────────────┘ └───────────────┘   Any number works: extra plates      */
/*   ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   simply wrap onto new rows.          */
/*     in-progress strip (optional)                                            */
/*   └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘                                       */
/* -------------------------------------------------------------------------- */

const PLATES_PER_ROW = 2

export function Credentials() {
  const sectionRef = useRef<HTMLElement>(null)

  // Two endless CSS loops live in this section (the slowly turning rosettes and the
  // in-progress line) → pause them while the section is off-screen
  useInViewFlag(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="credentials"
      aria-labelledby="credentials-title"
      className="section-y"
    >
      <div className="container-page">
        <SectionHeader
          index="05"
          label="Credentials"
          title="Certificates & *recognition*"
          titleId="credentials-title"
        />

        {/*
          --grid-gap repeats the column gap of `grid-editorial`, so the space between rows of
          plates — and between the plates and the strip — equals the space between columns.
        */}
        <div className="flex flex-col gap-(--grid-gap) [--grid-gap:clamp(1rem,2vw,2rem)]">
          {certificates.length > 0 ? (
            // role="list": Safari drops list semantics when list-style is none
            <ul role="list" className="grid-editorial gap-y-(--grid-gap)">
              {certificates.map((certificate, index) => (
                <CertificatePlate
                  key={certificate.id}
                  certificate={certificate}
                  // Half of the grid: 4 of 8 columns on tablets, 6 of 12 on desktop
                  className="col-span-full md:col-span-4 lg:col-span-6"
                  // Plates in the same row scroll into view together, so the second one
                  // waits a moment: start plate first, then its neighbour
                  revealDelay={(index % PLATES_PER_ROW) * PLATE_STAGGER}
                />
              ))}
            </ul>
          ) : null}

          {credentialInProgress ? (
            <InProgressStrip title={credentialInProgress.title} note={credentialInProgress.note} />
          ) : null}
        </div>
      </div>
    </section>
  )
}
