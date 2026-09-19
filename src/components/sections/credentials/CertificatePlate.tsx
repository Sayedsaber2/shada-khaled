import { useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { ArrowLink } from '@/components/ui/Button'
import type { Certificate } from '@/data/types'
import { publicUrl } from '@/lib/asset'
import { cn } from '@/lib/cn'
import { VIEWPORT } from '@/lib/motion'
import { Guilloche } from './Guilloche'
import { Seal } from './Seal'
import { frameDraw, impactNudge, plateReveal } from './plateMotion'
import { usePlateTilt } from './usePlateTilt'

/* -------------------------------------------------------------------------- */
/*  One certificate, drawn with CSS + SVG (no photo of a real document):       */
/*                                                                            */
/*   ┌──────────────────────────────────────────┐  the plate, 7 : 5            */
/*   │ ┌──────────────────────────────────────┐ │  inner hairline frame        */
/*   │ │ ISSUER                  2026  (SEAL) │ │  gold seal, stamps in        */
/*   │ │ ◆ ACHIEVEMENT                 (    ) │ │                              */
/*   │ │                                      │ │                              */
/*   │ │ Certificate title                    │ │                              */
/*   │ │                                      │ │                              */
/*   │ │ Description …      View credential ↗ │ │  link only if a URL exists   */
/*   │ └──────────────────────────────────────┘ │  + a faint guilloché rosette */
/*   └──────────────────────────────────────────┘    turning in this corner    */
/*                                                                            */
/*  Two layers, one job each:                                                  */
/*   <li>       the STAGE — never rotates. It owns the scroll trigger, the     */
/*              reveal, the 3D `perspective` and the pointer listeners.        */
/*   <article>  the PLATE — tilts towards the pointer and dips when stamped.   */
/*                                                                            */
/*  The stage is also a CSS container (`@container`): everything inside is     */
/*  sized in `cqw` = % of the PLATE's width instead of the screen's width.     */
/*  A plate is half the page on a laptop but the full page on a phone, so      */
/*  only its own width can keep the title, the seal and the padding in         */
/*  proportion everywhere.                                                     */
/* -------------------------------------------------------------------------- */

/** The light that follows the pointer. usePlateTilt moves it by writing --sheen-x / --sheen-y. */
const SHEEN_GRADIENT =
  'radial-gradient(22rem circle at var(--sheen-x, 50%) var(--sheen-y, 50%), color-mix(in srgb, var(--gold) 10%, transparent), transparent 70%)'

interface CertificatePlateProps {
  certificate: Certificate
  /** Seconds to wait before this plate starts its choreography (the stagger inside one row). */
  revealDelay: number
  /** Grid placement, decided by the Credentials section. */
  className?: string
}

/** Renders a <li>: use it inside a <ul> / <ol>. */
export function CertificatePlate({ certificate, revealDelay, className }: CertificatePlateProps) {
  // The sheen layer is moved by usePlateTilt (it writes CSS variables on this element)
  const sheenRef = useRef<HTMLDivElement>(null)
  const tilt = usePlateTilt(sheenRef)
  const titleId = `certificate-${certificate.id}-title`

  return (
    <motion.li
      // group/plate: a NAMED group, so hovering the plate does not also trigger the
      // plain `group-hover:` styles inside <ArrowLink>.
      // flex: stretches the plate to the full row height → two plates in a row always match.
      className={cn('group/plate @container flex min-w-0 perspective-[1000px]', className)}
      variants={plateReveal}
      custom={revealDelay}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      onPointerMove={tilt.enabled ? tilt.onPointerMove : undefined}
      onPointerLeave={tilt.enabled ? tilt.onPointerLeave : undefined}
    >
      <motion.article
        aria-labelledby={titleId}
        className={cn(
          'plate flex w-full flex-col overflow-hidden',
          // Shared measurements: the seal and the text around it both read these two variables
          '[--plate-pad:clamp(1.5rem,6.5cqw,3rem)] [--seal-size:clamp(6rem,19cqw,7.5rem)]',
          'p-(--plate-pad)',
          // The 7 : 5 certificate format as a MINIMUM height (100cqw = the plate's width).
          // Not `aspect-ratio`: together with overflow-hidden it would cut long text off
          // on narrow plates — a min-height simply lets the plate grow instead.
          'min-h-[calc(100cqw_*_5_/_7)]',
        )}
        // The 2px dip when the seal lands (y) and the pointer tilt (rotateX / rotateY)
        // are different transform values, so they can share this element.
        variants={impactNudge}
        custom={revealDelay}
        style={tilt.enabled ? { rotateX: tilt.rotateX, rotateY: tilt.rotateY } : undefined}
      >
        {/* Decoration. Sized in cqw so the rosette keeps its place in the corner on every plate size. */}
        <Guilloche className="pointer-events-none absolute -end-[16cqw] -bottom-[21cqw] w-[62cqw]" />
        <InnerFrame revealDelay={revealDelay} />

        {tilt.enabled ? (
          <div
            ref={sheenRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-soft group-hover/plate:opacity-100"
            style={{ backgroundImage: SHEEN_GRADIENT }}
          />
        ) : null}

        {/* `relative` lifts the text above the absolutely positioned decoration */}
        <div className="relative flex flex-1 flex-col">
          {/* Top zone: as tall as the seal and padded at the end, so nothing ever runs under the seal */}
          <div className="min-h-[calc(var(--seal-size)_-_0.5rem)] pe-[calc(var(--seal-size)_+_0.5rem)]">
            <div className="flex items-baseline justify-between gap-4">
              <p className="label-mono min-w-0 text-caption">
                <span className="sr-only">Issued by </span>
                {certificate.issuer}
              </p>
              <p className="label-mono shrink-0 text-caption">
                <span className="sr-only">Year </span>
                {certificate.year}
              </p>
            </div>

            {/* The words of the seal again, as real text: the seal itself is decoration (aria-hidden) */}
            <p className="label-mono mt-3 flex items-center gap-2 text-gold">
              <span aria-hidden="true" className="size-[5px] shrink-0 rotate-45 bg-gold" />
              <span className="sr-only">Achievement: </span>
              {certificate.seal}
            </p>
          </div>

          {/*
            my-auto centres the title in whatever height is left.
            The size follows text-display-md (same maximum, line-height and tracking) but
            scales with the plate (cqw) instead of the screen.
          */}
          <h3
            id={titleId}
            className="my-auto max-w-[18ch] py-[clamp(1.25rem,4cqw,2rem)] text-[length:clamp(1.5rem,7cqw,3.25rem)] leading-[1.18] tracking-[-0.02em] text-fg"
          >
            {certificate.title}
          </h3>

          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <p className="max-w-[46ch] min-w-0 grow basis-64 text-sm text-muted @lg:text-base">
              {certificate.description}
            </p>

            {certificate.credentialUrl ? (
              // ms-auto keeps the link at the end even when it wraps under the description.
              // min-h-11 = 44px touch target. Its text sits in the middle of those 44px, so
              // -mb-3 lowers the link until its words share a line with the description's last line.
              <ArrowLink
                href={publicUrl(certificate.credentialUrl)}
                target="_blank"
                rel="noreferrer"
                icon={<ArrowUpRight size={16} strokeWidth={1.5} />}
                className="ms-auto -mb-3 min-h-11 shrink-0 text-sm"
              >
                View credential
                <span className="sr-only">: {certificate.title} (opens in a new tab)</span>
              </ArrowLink>
            ) : null}
          </div>
        </div>

        {/* Pulled 0.5rem into the padding: a circle looks inset when its box lines up with the text */}
        <Seal
          words={certificate.seal}
          revealDelay={revealDelay}
          className="absolute end-[calc(var(--plate-pad)_-_0.5rem)] top-[calc(var(--plate-pad)_-_0.5rem)] size-(--seal-size)"
        />
      </motion.article>
    </motion.li>
  )
}

/* ------------------------------- Inner frame ------------------------------ */

/**
 * The second border every paper certificate has, 10px inside the plate's edge.
 * It traces itself once around the plate (pathLength 0 → 1) when the plate reveals.
 *
 * The SVG has no viewBox, so 1 unit = 1 CSS pixel: the <rect> can use "100%" sizes and
 * its stroke is a true 1px hairline on every plate size — nothing is ever stretched.
 */
function InnerFrame({ revealDelay }: { revealDelay: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      fill="none"
      // overflow-visible: half of the 1px stroke sits outside the SVG box and must not be clipped
      className="pointer-events-none absolute start-[10px] top-[10px] size-[calc(100%_-_20px)] overflow-visible"
    >
      <motion.rect
        width="100%"
        height="100%"
        stroke="var(--line-strong)"
        strokeWidth={1}
        // Snaps the straight edges to whole pixels, so the hairline stays sharp
        shapeRendering="crispEdges"
        variants={frameDraw}
        custom={revealDelay}
      />
    </svg>
  )
}
