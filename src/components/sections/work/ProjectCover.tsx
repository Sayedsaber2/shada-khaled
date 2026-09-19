import { useRef } from 'react'
import type { ComponentType } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import type { CoverKind, Project } from '@/data/types'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { publicUrl } from '@/lib/asset'
import { BrowserArt } from './covers/BrowserArt'
import { ChartArt } from './covers/ChartArt'
import type { CoverArtProps } from './covers/CoverLayers'
import { LedgerArt } from './covers/LedgerArt'
import { PhoneArt } from './covers/PhoneArt'
import { RouteArt } from './covers/RouteArt'

/* -------------------------------------------------------------------------- */
/*  <ProjectCover> — what fills a project's cover frame.                       */
/*                                                                            */
/*   cover.kind === 'image'  → the real mockup (<img>)                         */
/*   anything else           → a GENERATED illustration, so a project looks    */
/*                             finished before its mockups exist.              */
/*                                                                            */
/*  The illustration tells the story of how a designer works:                  */
/*   1. a WIREFRAME draws itself once, when the cover scrolls into view;       */
/*   2. hovering / focusing the card fades in the HI-FI fills underneath.      */
/*                                                                            */
/*  The parent decides the size and shape: this component simply fills it.     */
/* -------------------------------------------------------------------------- */

type GeneratedKind = Exclude<CoverKind, 'image'>

const ART_BY_KIND: Record<GeneratedKind, ComponentType<CoverArtProps>> = {
  route: RouteArt,
  chart: ChartArt,
  ledger: LedgerArt,
  phone: PhoneArt,
  browser: BrowserArt,
}

/** Used when a project says kind: 'image' but forgot the `src`. */
const FALLBACK_KIND: GeneratedKind = 'browser'

/** A soft violet glow behind the drawing, so the art never floats on a flat surface. */
const RADIAL_WASH =
  'radial-gradient(ellipse 70% 70% at 50% 55%, color-mix(in srgb, var(--accent-fill) 30%, transparent), transparent)'

interface ProjectCoverProps {
  cover: Project['cover']
  /** Alt text for a real image when `cover.alt` is empty. */
  title: string
  /** true → show the hi-fi fill layer (card hovered / focused, or the sheet banner). */
  active: boolean
}

export function ProjectCover({ cover, title, active }: ProjectCoverProps) {
  if (cover.kind === 'image' && cover.src) {
    return (
      <img
        src={publicUrl(cover.src)}
        alt={cover.alt ?? `${title} — cover`}
        // Only hints for the browser's layout: the frame around the image sets the real size
        width={1600}
        height={1200}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    )
  }

  const kind = cover.kind === 'image' ? FALLBACK_KIND : cover.kind
  return <GeneratedCover kind={kind} active={active} />
}

/* ----------------------------- Generated cover ---------------------------- */

interface GeneratedCoverProps {
  kind: GeneratedKind
  active: boolean
}

function GeneratedCover({ kind, active }: GeneratedCoverProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const hasEnteredView = useInView(wrapperRef, { once: true, amount: 0.3 })
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion() === true

  // Touch screens cannot hover, and reduced motion should not have to wait for anything:
  // both get the finished hi-fi version straight away.
  const showFill = active || !finePointer || reducedMotion

  const Art = ART_BY_KIND[kind]

  return (
    <div ref={wrapperRef} aria-hidden="true" className="relative h-full w-full">
      <div className="absolute inset-0" style={{ backgroundImage: RADIAL_WASH }} />
      <motion.svg
        viewBox="0 0 400 300"
        // "slice" = behave like object-fit: cover. The art fills any frame shape and is
        // cropped around its centre (see the SAFE BOX note in covers/CoverLayers.tsx).
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        className="absolute inset-0 h-full w-full"
        // Reduced motion: `initial={false}` renders the 'drawn' state at once — nothing is traced
        initial={reducedMotion ? false : 'hidden'}
        animate={hasEnteredView || reducedMotion ? 'drawn' : 'hidden'}
      >
        <Art showFill={showFill} />
      </motion.svg>
    </div>
  )
}
