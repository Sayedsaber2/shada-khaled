import { useEffect, useId, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import type { Variants } from 'motion/react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { Project } from '@/data/types'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { ProjectSheetContent } from './ProjectSheetContent'

/* -------------------------------------------------------------------------- */
/*  <ProjectSheet> — the case study, as a sheet that slides up over the page.  */
/*                                                                            */
/*  This file is the SHELL: portal, scroll lock, focus trap, backdrop, the     */
/*  sliding panel, the top bar and the Previous / Next footer.                 */
/*  What is written inside the sheet lives in ProjectSheetContent.tsx.         */
/*                                                                            */
/*  It is a modal dialog, so while it is open:                                 */
/*   • the page behind cannot scroll          (lockScroll / unlockScroll)      */
/*   • Tab stays inside, Esc closes           (useFocusTrap)                   */
/*   • focus returns to the card that opened it, when it closes                */
/* -------------------------------------------------------------------------- */

/** The content waits until the panel has (almost) landed. outExpo is nearly there by then. */
const FIRST_CONTENT_DELAY = 0.45
/** Previous / Next: the panel is already in place, so the next content starts at once. */
const SWAPPED_CONTENT_DELAY = 0.05

/* The dialog passes ONE state name down ('hidden' → 'visible' → 'exit');
   the backdrop and the panel each describe what that state means for them. */

const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: EASE.soft } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE.soft, delay: 0.1 } },
}

/** Reduced motion: <MotionConfig> drops the `y` movement and keeps the fade. */
const panelSlide: Variants = {
  hidden: { opacity: 0, y: '8%' },
  visible: { opacity: 1, y: '0%', transition: { duration: 0.6, ease: EASE.outExpo } },
  exit: { opacity: 0, y: '8%', transition: { duration: 0.4, ease: EASE.inOutQuart } },
}

/**
 * Cross-fade between two projects. `custom` = how long the blocks inside wait before
 * they start rising one after another (see `blockRise` in ProjectSheetContent.tsx).
 */
const contentSwap: Variants = {
  hidden: { opacity: 0 },
  visible: (blocksDelay: number) => ({
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: EASE.soft,
      delayChildren: blocksDelay,
      staggerChildren: 0.05,
    },
  }),
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE.soft } },
}

/* --------------------------------- Sheet ---------------------------------- */

interface ProjectSheetProps {
  /** Every project, in the order of the grid — Previous / Next walk through this list. */
  projects: Project[]
  /** Slug of the open project, or null while the sheet is closed. */
  openSlug: string | null
  /** Must be a stable function (useCallback): the focus trap re-runs when it changes. */
  onClose: () => void
  onSwitch: (slug: string) => void
}

export function ProjectSheet({ projects, openSlug, onClose, onSwitch }: ProjectSheetProps) {
  const { lockScroll, unlockScroll } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)

  const openIndex = projects.findIndex((project) => project.slug === openSlug)
  const isOpen = openIndex !== -1

  // Freeze the page behind the sheet. Lock and unlock live in ONE effect: the cleanup runs
  // when `isOpen` turns false (or on unmount), so they always come in pairs — also in
  // React StrictMode, which mounts every effect twice in development.
  useEffect(() => {
    if (!isOpen) return
    lockScroll()
    return () => unlockScroll()
  }, [isOpen, lockScroll, unlockScroll])

  // Tab stays inside the panel, Esc closes. When it switches off, the hook gives focus
  // back to whatever had it before — the card that opened the sheet.
  useFocusTrap(panelRef, isOpen, onClose)

  // A portal renders the sheet at the end of <body>: outside <main>, above the navbar,
  // and safe from any transformed parent that would trap a `position: fixed` child.
  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <SheetDialog
          key="project-sheet"
          panelRef={panelRef}
          projects={projects}
          openIndex={openIndex}
          onClose={onClose}
          onSwitch={onSwitch}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

/* --------------------------------- Dialog --------------------------------- */

interface SheetDialogProps {
  panelRef: RefObject<HTMLDivElement | null>
  projects: Project[]
  openIndex: number
  onClose: () => void
  onSwitch: (slug: string) => void
}

function SheetDialog({ panelRef, projects, openIndex, onClose, onSwitch }: SheetDialogProps) {
  const titleId = useId()
  const scrollerRef = useRef<HTMLDivElement>(null)
  // false while the exit animation plays: still in the DOM, but it must not be usable
  const isPresent = useIsPresent()
  const [hasLanded, setHasLanded] = useState(false)

  const project = projects[openIndex]
  const projectNumber = String(openIndex + 1).padStart(2, '0')

  // Previous / Next wrap around: after the last project comes the first one again
  const previousProject = projects[(openIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(openIndex + 1) % projects.length]
  const hasSiblings = projects.length > 1

  // Runs between the two halves of the cross-fade, while the sheet is empty:
  // the new project starts at the top, and keyboard focus moves up with it.
  const handleContentSwapped = () => {
    scrollerRef.current?.scrollTo({ top: 0 })
    panelRef.current?.focus({ preventScroll: true })
  }

  return (
    <motion.div
      // z-50: above the navbar (40). The film grain (60) stays on top on purpose.
      className="fixed inset-0 z-50"
      inert={!isPresent}
      initial="hidden"
      animate="visible"
      exit="exit"
      onAnimationComplete={(definition) => {
        if (definition === 'visible') setHasLanded(true)
      }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-(--backdrop)"
        variants={backdropFade}
        onClick={onClose}
      />

      {/* The panel: full screen on phones; from lg it leaves a small gap at the top so the
          dimmed page peeks out and the sheet reads as a layer, not as a new page.
          overflow-hidden rounds the scroller's corners — the sticky parts inside still
          work, because they stick to the scroller, which sits INSIDE this box. */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        // The shadow token is `none` in the dark theme (no shadows on ink) and soft in light
        className="absolute inset-x-0 top-0 bottom-0 overflow-hidden bg-bg [box-shadow:var(--sheet-shadow)] lg:top-6 lg:rounded-t-[12px]"
        variants={panelSlide}
      >
        <div
          ref={scrollerRef}
          // Lets the sheet scroll natively (Lenis would swallow the wheel otherwise)…
          data-lenis-prevent
          // …and stops the scroll from leaking to the page when the sheet hits its end
          className="h-full overflow-y-auto overscroll-contain"
        >
          <SheetTopBar number={projectNumber} context={project.context} onClose={onClose} />

          {/* mode="wait": the old project fades out completely, THEN the new one fades in */}
          <AnimatePresence mode="wait" onExitComplete={handleContentSwapped}>
            <motion.div
              key={project.slug}
              variants={contentSwap}
              custom={hasLanded ? SWAPPED_CONTENT_DELAY : FIRST_CONTENT_DELAY}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <ProjectSheetContent project={project} titleId={titleId} />
            </motion.div>
          </AnimatePresence>

          {/* Outside the cross-fade on purpose: the buttons stay mounted, so keyboard
              focus is never lost in the middle of a swap */}
          {hasSiblings ? (
            <SheetFooterNav
              previousProject={previousProject}
              nextProject={nextProject}
              onSwitch={onSwitch}
            />
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* --------------------------------- Top bar -------------------------------- */

interface SheetTopBarProps {
  number: string
  context: string
  onClose: () => void
}

/** Sticks to the top of the scroller, so "Close" is always one tap away. */
function SheetTopBar({ number, context, onClose }: SheetTopBarProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="container-page flex h-14 items-center justify-between gap-4">
        <p className="label-mono min-w-0 truncate text-caption">
          <span className="text-gold">P/{number}</span>
          <span aria-hidden="true"> — </span>
          {context}
        </p>
        {/* -me-2: the 44px target has 8px of inner padding; this lines the icon up with the page edge */}
        <button
          type="button"
          onClick={onClose}
          className="label-mono -me-2 inline-flex h-11 shrink-0 items-center gap-2 px-2 text-fg transition-colors duration-300 ease-soft hover:text-accent-strong"
        >
          Close
          <X aria-hidden="true" size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------- Footer nav ------------------------------- */

interface SheetFooterNavProps {
  previousProject: Project
  nextProject: Project
  onSwitch: (slug: string) => void
}

function SheetFooterNav({ previousProject, nextProject, onSwitch }: SheetFooterNavProps) {
  return (
    <nav
      aria-label="More projects"
      // The bottom padding grows on phones with a home indicator (iOS safe area)
      className="container-page pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid border-t border-line sm:grid-cols-2">
        <FooterNavButton
          direction="previous"
          project={previousProject}
          onClick={() => onSwitch(previousProject.slug)}
        />
        <FooterNavButton
          direction="next"
          project={nextProject}
          onClick={() => onSwitch(nextProject.slug)}
        />
      </div>
    </nav>
  )
}

interface FooterNavButtonProps {
  direction: 'previous' | 'next'
  project: Project
  onClick: () => void
}

function FooterNavButton({ direction, project, onClick }: FooterNavButtonProps) {
  const isNext = direction === 'next'

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex min-w-0 flex-col gap-3 py-8 text-start lg:py-10',
        // "Next" sits on the end side from sm up, with a hairline between the two halves
        isNext && 'max-sm:border-t max-sm:border-line sm:items-end sm:border-s sm:border-line sm:ps-8 sm:text-end',
        !isNext && 'sm:pe-8',
      )}
    >
      <span className="label-mono inline-flex items-center gap-2 text-caption transition-colors duration-300 ease-soft group-hover:text-accent-strong">
        {isNext ? null : (
          <ArrowLeft
            aria-hidden="true"
            size={16}
            strokeWidth={1.5}
            className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1"
          />
        )}
        {isNext ? 'Next project' : 'Previous'}
        {isNext ? (
          <ArrowRight
            aria-hidden="true"
            size={16}
            strokeWidth={1.5}
            className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
          />
        ) : null}
      </span>
      <span className="font-display-soft text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] leading-[1.15] text-fg">
        {project.title}
      </span>
    </button>
  )
}
