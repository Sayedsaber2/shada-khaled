import { useRef, useState } from 'react'
import type { FocusEvent, MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { MotionValue, Variants } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Chip } from '@/components/ui/Chip'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'
import type { Project } from '@/data/types'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'
import { DURATION, EASE, VIEWPORT, clipReveal } from '@/lib/motion'
import { ProjectCover } from './ProjectCover'
import { COVER_ASPECT_CLASSES } from './gridLayout'
import type { CardSpan } from './gridLayout'
import { useCoverPointer } from './useCoverPointer'

/* -------------------------------------------------------------------------- */
/*  <ProjectCard> — one project in the Work grid.                              */
/*                                                                            */
/*   ┌───────────────────────────┐                                             */
/*   │ 01                        │  cover: wipes open on scroll, wireframe      */
/*   │        (cover art)        │  draws itself, hover → hi-fi + "VIEW" disc   */
/*   └───────────────────────────┘                                             */
/*   P/01 · 2026 · UI/UX CONCEPT        (gold badge)                           */
/*   Project title                                  ↗                          */
/*   ─────────────────────────────── line draws across on hover                */
/*   One-line summary                                                          */
/*                                                                            */
/*  The whole card is ONE button. It is a transparent layer stretched over     */
/*  the card (not a wrapper around it): a <button> may not contain headings,   */
/*  and this way the title stays a real <h3> for screen-reader navigation.     */
/* -------------------------------------------------------------------------- */

/** While the cover wipes open, the art inside settles from slightly zoomed-in. */
const artSettle: Variants = {
  hidden: { scale: 1.15 },
  visible: { scale: 1, transition: { duration: DURATION.hero, ease: EASE.inOutQuart } },
}

interface ProjectCardProps {
  project: Project
  /** Position in the full project list, already formatted: "01" */
  number: string
  span: CardSpan
  /**
   * true  → the cover wipes open when it scrolls into view (first visit of the grid).
   * false → the cover is simply there (cards that come back after filtering).
   */
  revealOnScroll: boolean
  onOpen: (slug: string) => void
}

export function ProjectCard({ project, number, span, revealOnScroll, onOpen }: ProjectCardProps) {
  const coverRef = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion() === true
  const pointer = useCoverPointer(coverRef)

  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  // "Active" = hovered with a mouse OR focused with the keyboard: both show the hi-fi cover
  const isActive = isHovered || isFocused

  // The disc follows a real mouse only, and never under reduced motion
  const showViewDisc = finePointer && !reducedMotion
  // clip-path is not a transform, so <MotionConfig reducedMotion> would still play the wipe
  const skipCoverReveal = reducedMotion || !revealOnScroll

  const metaLine = [`P/${number}`, project.year, project.categories.join(', ')].join(' · ')

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    // A mouse click focuses the button too. Only KEYBOARD focus may switch the hover look
    // on — otherwise the card would stay "hovered" after the sheet closes.
    if (event.currentTarget.matches(':focus-visible')) setIsFocused(true)
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // Safari does not focus a button on click. Focusing it by hand guarantees that the
    // sheet can give focus back to THIS card when it closes.
    event.currentTarget.focus({ preventScroll: true })
    onOpen(project.slug)
  }

  return (
    // data-active drives every hover style below through `group-data-[active=true]:`
    //
    // The scroll trigger (whileInView) lives on THIS wrapper; the cover below only inherits
    // the variants. Why: browsers report an element that is fully hidden by its own clip-path
    // as "not in view", so a clipped element can never trigger its own reveal.
    <motion.div
      className="group relative"
      data-active={isActive}
      initial={skipCoverReveal ? false : 'hidden'}
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <motion.div
        ref={coverRef}
        className={cn(
          'relative overflow-hidden rounded-plate border border-line bg-surface-2',
          COVER_ASPECT_CLASSES[span],
        )}
        variants={clipReveal}
      >
        {/* Big index numeral, under the art so the drawing overlaps it like print */}
        <span
          aria-hidden="true"
          className="text-outline absolute end-4 top-3 font-display text-[clamp(3rem,5vw,5rem)] leading-none select-none lg:end-5 lg:top-4"
        >
          {number}
        </span>

        {/* Two wrappers, one job each: Motion settles the art (1.15 → 1) during the
            reveal, plain CSS zooms it a little (1 → 1.04) on hover. */}
        <motion.div className="absolute inset-0" variants={artSettle}>
          <div className="h-full w-full transition-transform duration-800 ease-soft motion-safe:group-data-[active=true]:scale-[1.04]">
            <ProjectCover cover={project.cover} title={project.title} active={isActive} />
          </div>
        </motion.div>

        {showViewDisc ? (
          <ViewDisc x={pointer.x} y={pointer.y} visible={isHovered && pointer.isOverCover} />
        ) : null}
      </motion.div>

      {/* delay: the cover leads, the caption follows a beat later */}
      <RevealGroup className="mt-5 lg:mt-6" stagger={0.07} delay={0.2}>
        <RevealItem className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="label-mono min-w-0 text-caption">{metaLine}</p>
          {project.badge ? <Chip tone="gold">{project.badge}</Chip> : null}
        </RevealItem>

        <RevealItem className="relative mt-3 flex items-start justify-between gap-4 pb-4 lg:pb-5">
          <h3 className="min-w-0 text-h3">{project.title}</h3>
          {/* At rest the arrow points to the end side (→); on hover it turns to "open" (↗).
              Tailwind v4 rotates / moves with the `rotate` and `translate` CSS properties,
              so those are the ones listed in the transition. */}
          <ArrowUpRight
            aria-hidden="true"
            strokeWidth={1.25}
            className="mt-[0.1em] size-7 shrink-0 rotate-45 text-caption transition-[rotate,translate,color] duration-500 ease-out-expo group-data-[active=true]:translate-x-0.5 group-data-[active=true]:-translate-y-0.5 group-data-[active=true]:rotate-0 group-data-[active=true]:text-accent-strong lg:size-8"
          />
          {/* The title's underline: a resting hairline, and a violet line that draws over it */}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line" />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent-strong transition-transform duration-700 ease-out-expo group-data-[active=true]:scale-x-100"
          />
        </RevealItem>

        <RevealItem>
          <p className="mt-4 max-w-[52ch] text-muted">{project.summary}</p>
        </RevealItem>
      </RevealGroup>

      {/* THE button: an invisible layer over the whole card (see the note at the top) */}
      <button
        type="button"
        aria-label={`Open project: ${project.title}`}
        aria-haspopup="dialog"
        // Square corners on purpose: `focus-corners` paints its gold ticks as a background,
        // and a rounded corner would cut them off
        className="focus-corners absolute inset-0 z-10 w-full rounded-none text-start"
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        onPointerEnter={() => setIsHovered(finePointer)}
        onPointerMove={showViewDisc ? pointer.onPointerMove : undefined}
        onPointerLeave={() => {
          setIsHovered(false)
          pointer.onPointerLeave()
        }}
      />
    </motion.div>
  )
}

/* -------------------------------- VIEW disc -------------------------------- */

const DISC_SIZE = 88

interface ViewDiscProps {
  x: MotionValue<number>
  y: MotionValue<number>
  visible: boolean
}

/**
 * The violet disc that follows the pointer inside the cover. It is an extra hint, not a
 * replacement: the native cursor stays visible. The cover clips it at its edges.
 */
function ViewDisc({ x, y, visible }: ViewDiscProps) {
  return (
    // Outer element: position only. `left-0` (not `start-0`) on purpose — the pointer
    // position is measured from the physical left edge, also in a right-to-left layout.
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0"
      style={{ x, y, marginLeft: -DISC_SIZE / 2, marginTop: -DISC_SIZE / 2 }}
    >
      {/* Inner element: the pop in / out (scale), so it never fights with the position */}
      <motion.span
        className="label-mono flex items-center justify-center rounded-full bg-accent-fill text-white"
        style={{ width: DISC_SIZE, height: DISC_SIZE }}
        initial={{ scale: 0 }}
        animate={{ scale: visible ? 1 : 0 }}
        transition={{ duration: DURATION.small, ease: EASE.outExpo }}
      >
        View
      </motion.span>
    </motion.span>
  )
}
