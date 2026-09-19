import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import type { AnimationPlaybackControls, MotionValue, Variants } from 'motion/react'
import { usePreloaderGate } from '@/components/layout/preloader/usePreloaderGate'
import { LaserPath } from '@/components/ui/LaserPath'
import { MONOGRAM_DOT, MONOGRAM_PATH, MONOGRAM_VIEWBOX } from '@/components/ui/Monogram'
import { useApp } from '@/context/AppContext'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'
import { DURATION, EASE } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  <Preloader> — the brand moment: a laser cuts the monogram, then a violet   */
/*  curtain lifts.                                                             */
/*                                                                            */
/*  It is a small state machine. `phase` says where we are:                    */
/*                                                                            */
/*    loading  → captions fade in, the laser traces the "S", the counter runs. */
/*               Ends when the counter reaches 100 (trace done AND gate open). */
/*    complete → the stroke turns into the gradient, the gold period pops in.  */
/*               Ends when that 0.3s animation finishes.                       */
/*    exiting  → captions slide out of their masks, the monogram fades.        */
/*               Ends when those variants finish (onAnimationComplete).        */
/*    lifting  → finishIntro() + the double curtain (ink, then violet) lifts.  */
/*               Ends when the violet panel is gone.                           */
/*    done     → renders nothing, scrolling is released.                       */
/*                                                                            */
/*  Three versions (`mode`): 'full' on the first visit, 'short' on repeat      */
/*  visits in the same tab, 'reduced' for prefers-reduced-motion (no trace,    */
/*  no curtain — just a cross-fade).                                           */
/* -------------------------------------------------------------------------- */

type PreloaderPhase = 'loading' | 'complete' | 'exiting' | 'lifting' | 'done'
type PreloaderMode = 'full' | 'short' | 'reduced'

interface ModeTiming {
  /** seconds before the trace + counter start */
  traceDelay: number
  /** how long the trace + counter run */
  traceDuration: number
  /** the "S" settling into "S." (gradient stroke + gold period) */
  settleDuration: number
  /** the preloader never finishes sooner than this */
  minSeconds: number
}

const TIMING: Record<PreloaderMode, ModeTiming> = {
  full: { traceDelay: 0.2, traceDuration: 1.4, settleDuration: 0.3, minSeconds: 1.9 },
  // Repeat visit: the mark is already cut, only the counter makes a quick run to 100
  short: { traceDelay: 0, traceDuration: 0.35, settleDuration: 0, minSeconds: 0.4 },
  // Reduced motion: everything is static, we only wait for the gate
  reduced: { traceDelay: 0, traceDuration: 0, settleDuration: 0, minSeconds: 0.6 },
}

const CAPTION_ENTER_STAGGER = 0.05
const CONTENT_EXIT = { captionDuration: 0.45, captionStagger: 0.04, markDuration: 0.4 }
const CURTAIN = { duration: 0.95, violetLag: 0.09 }
const REDUCED_FADE_DURATION = 0.4
/** The content exit takes ≈0.6s; if its "finished" callback has not arrived by then, move on. */
const EXIT_SAFETY_MS = 1200

/** While the gate is closed the counter waits here: 0.995 → shows "099". */
const HOLD_AT = 0.995
/** Stroke width of the traced "S", in viewBox units (≈ 3px on screen). */
const MARK_STROKE_WIDTH = 3

/* ------------------------------- Captions ---------------------------------- */

const NAME_CAPTION = `${profile.firstName} ${profile.lastName} — Folio ${new Date().getFullYear()}`

/** "UI/UX Designer in training — DEPI · Giza, Egypt" → "UI/UX Designer · in training" */
function buildRoleCaption(): string {
  const beforeDash = profile.eyebrow.split('—')[0].trim()
  const qualifier = beforeDash.startsWith(profile.role)
    ? beforeDash.slice(profile.role.length).trim()
    : ''
  return qualifier ? `${profile.role} · ${qualifier}` : profile.role
}

const ROLE_CAPTION = buildRoleCaption()

/* --------------------------- Repeat-visit memory --------------------------- */

const SEEN_KEY = 'sk_seen'

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false // storage blocked (private mode): simply play the full intro
  }
}

function rememberIntro(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // storage blocked: the full intro plays again next time, nothing breaks
  }
}

function pickMode(reducedMotion: boolean | null): PreloaderMode {
  if (reducedMotion) return 'reduced'
  return hasSeenIntro() ? 'short' : 'full'
}

/* -------------------------------- Variants --------------------------------- */
/*  The stage passes ONE state name down ('hidden' → 'enter' → 'exit');         */
/*  every child below describes what that state means for itself.              */

const captionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  enter: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.small,
      ease: EASE.outExpo,
      delay: order * CAPTION_ENTER_STAGGER,
    },
  }),
  exit: (order: number) => ({
    // opacity is repeated on purpose: a value missing from a variant animates back to `hidden`
    opacity: 1,
    y: '-110%',
    transition: {
      duration: CONTENT_EXIT.captionDuration,
      ease: EASE.inOutQuart,
      delay: order * CONTENT_EXIT.captionStagger,
    },
  }),
}

const markVariants: Variants = {
  hidden: { opacity: 0, scale: 1 },
  enter: { opacity: 1, scale: 1, transition: { duration: DURATION.small, ease: EASE.outExpo } },
  exit: {
    opacity: 0,
    scale: 0.86,
    transition: { duration: CONTENT_EXIT.markDuration, ease: EASE.inOutQuart },
  },
}

/* ------------------------------ Small pieces ------------------------------- */

interface CornerCaptionProps {
  /** position in the stagger order: 0 = first in, first out */
  order: number
  /** typography + alignment of this caption */
  className?: string
  children: ReactNode
}

/** One corner of the frame. The outer span is a mask: on exit the text slides up behind it. */
function CornerCaption({ order, className, children }: CornerCaptionProps) {
  return (
    <span className={cn('block overflow-hidden', className)}>
      <motion.span className="block" variants={captionVariants} custom={order}>
        {children}
      </motion.span>
    </span>
  )
}

function formatCount(loaded: number): string {
  return String(Math.floor(loaded * 100)).padStart(3, '0')
}

/** "000" → "100". */
function CounterDigits({ loaded }: { loaded: MotionValue<number> }) {
  const digitsRef = useRef<HTMLSpanElement>(null)

  // The value changes up to 60 times a second: write straight into the DOM
  // instead of re-rendering React for every frame.
  useMotionValueEvent(loaded, 'change', (value) => {
    if (digitsRef.current) digitsRef.current.textContent = formatCount(value)
  })

  return <span ref={digitsRef}>{formatCount(loaded.get())}</span>
}

interface TracedMonogramProps {
  /** 0 → 1: how much of the "S" the laser has cut */
  trace: MotionValue<number>
  /** 0 → 1: the cut line turns into the gradient and the gold period pops in */
  settle: MotionValue<number>
}

function TracedMonogram({ trace, settle }: TracedMonogramProps) {
  const gradientId = useId()

  return (
    <svg
      viewBox={MONOGRAM_VIEWBOX}
      className="aspect-[5/6] h-[clamp(96px,16vw,140px)] overflow-visible"
      focusable="false"
    >
      <defs>
        {/* userSpaceOnUse: the gradient runs across the whole letter, top-left → bottom-right */}
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="26" y1="12" x2="74" y2="108">
          <stop offset="0" stopColor="var(--accent-strong)" />
          <stop offset="0.38" stopColor="var(--accent)" />
          <stop offset="0.68" stopColor="var(--rose)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>

      {/* The cut: faint guide underneath, violet stroke drawing itself, gold laser dot on the tip */}
      <LaserPath
        d={MONOGRAM_PATH}
        progress={trace}
        stroke="var(--accent-strong)"
        strokeWidth={MARK_STROKE_WIDTH}
      />

      {/* An identical path with the gradient stroke, cross-faded on top once the cut is done */}
      <motion.path
        d={MONOGRAM_PATH}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={MARK_STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: settle }}
      />

      {/* The gold period: "S" becomes "S.", the same mark as the navbar logo */}
      <motion.circle
        cx={MONOGRAM_DOT.cx}
        cy={MONOGRAM_DOT.cy}
        r={MONOGRAM_DOT.r}
        fill="var(--gold)"
        style={{ scale: settle }}
      />
    </svg>
  )
}

/* -------------------------------- Preloader -------------------------------- */

export function Preloader() {
  const { finishIntro, lockScroll, unlockScroll } = useApp()
  const reducedMotion = useReducedMotion()

  // Decided once on the first render, so the version cannot change half-way through
  const [mode] = useState<PreloaderMode>(() => pickMode(reducedMotion))
  const [phase, setPhase] = useState<PreloaderPhase>('loading')
  const timing = TIMING[mode]

  /* Motion values drive the visuals directly — no React re-render per frame. */
  const trace = useMotionValue(mode === 'reduced' ? 1 : 0)
  const settle = useMotionValue(mode === 'full' ? 0 : 1)
  const inkCurtainY = useMotionValue('0%')
  const violetCurtainY = useMotionValue('0%')
  const stageOpacity = useMotionValue(1)
  const gate = usePreloaderGate({ minSeconds: timing.minSeconds, imageSrc: profile.photo })

  // What the visitor reads as "loaded": it follows the trace (so the counter can never
  // get ahead of the laser) and waits at 99 until the gate opens.
  const loaded = useTransform(() => Math.min(trace.get(), gate.get() === 1 ? 1 : HOLD_AT))

  // Only the first visit draws the path; the short and reduced versions show it already cut
  const pathProgress = useTransform(trace, (value) => (mode === 'full' ? value : 1))

  // loading → complete: the moment the counter reaches 100
  useMotionValueEvent(loaded, 'change', (value) => {
    if (value >= 1) setPhase((current) => (current === 'loading' ? 'complete' : current))
  })

  // Freeze the page while the preloader is up. Lock and unlock live in ONE effect, so they
  // always come in pairs: React StrictMode (mount → cleanup → mount) cannot double-unlock,
  // and switching to 'done' runs the cleanup, which is exactly when scrolling must return.
  const isDone = phase === 'done'
  useEffect(() => {
    if (isDone) return
    lockScroll()
    return () => unlockScroll()
  }, [isDone, lockScroll, unlockScroll])

  // The timed work of each phase. Whatever a phase starts is stopped by its own cleanup.
  useEffect(() => {
    let cancelled = false
    const running: AnimationPlaybackControls[] = []
    let safetyTimer: number | undefined

    const goTo = (next: PreloaderPhase) => {
      if (!cancelled) setPhase(next)
    }

    try {
      if (phase === 'loading') {
        // No `.then()` here: this phase ends when the counter reaches 100 (listener above)
        const tracing = animate(trace, 1, {
          delay: timing.traceDelay,
          duration: timing.traceDuration,
          ease: EASE.inOutCubic,
        })
        running.push(tracing)
      }

      if (phase === 'complete') {
        // In the short / reduced versions `settle` already is 1, so this finishes instantly
        const settling = animate(settle, 1, { duration: timing.settleDuration, ease: EASE.outExpo })
        running.push(settling)
        // Reduced motion skips the slide-out and goes straight to the cross-fade
        settling.then(() => goTo(mode === 'reduced' ? 'lifting' : 'exiting'))
      }

      // 'exiting' is played by the variants in the JSX (see `contentState`) and normally ends
      // through onAnimationComplete. This timer is only a safety net: if that callback never
      // fires, the curtain still lifts and the visitor is never trapped behind the preloader.
      if (phase === 'exiting') {
        safetyTimer = window.setTimeout(() => goTo('lifting'), EXIT_SAFETY_MS)
      }

      if (phase === 'lifting') {
        rememberIntro()
        // Called when the curtain STARTS to move, so the hero animates in underneath it
        finishIntro()

        if (mode === 'reduced') {
          const fading = animate(stageOpacity, 0, { duration: REDUCED_FADE_DURATION, ease: EASE.soft })
          running.push(fading)
          fading.then(() => goTo('done'))
        } else {
          const curtain = { duration: CURTAIN.duration, ease: EASE.inOutQuart }
          const liftingInk = animate(inkCurtainY, '-100%', curtain)
          // The violet panel follows a beat later: the one full-screen purple flash of the site
          const liftingViolet = animate(violetCurtainY, '-100%', { ...curtain, delay: CURTAIN.violetLag })
          running.push(liftingInk, liftingViolet)
          liftingViolet.then(() => goTo('done'))
        }
      }
    } catch {
      // Never trap the visitor behind the preloader: if anything throws, open the site
      finishIntro()
      goTo('done')
    }

    return () => {
      cancelled = true
      window.clearTimeout(safetyTimer)
      running.forEach((controls) => controls.stop())
    }
  }, [phase, mode, timing, trace, settle, inkCurtainY, violetCurtainY, stageOpacity, finishIntro])

  if (isDone) return null

  // Reduced motion never plays the slide-out: the whole stage cross-fades instead
  const isLeaving = phase === 'exiting' || phase === 'lifting'
  const contentState = isLeaving && mode !== 'reduced' ? 'exit' : 'enter'

  return (
    // data-theme="dark" re-declares the colour tokens for this subtree, so the preloader
    // (and the <LaserPath> inside it) stays dark even when the site is in the light theme.
    <motion.div
      role="status"
      aria-live="polite"
      data-theme="dark"
      className="fixed inset-0 z-[100]"
      style={{ opacity: stageOpacity }}
    >
      <span className="sr-only">{phase === 'loading' ? 'Loading portfolio' : 'Portfolio loaded'}</span>

      {/* Panel B — solid violet, directly under the ink panel. Only seen while the curtain lifts. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-violet-600 will-change-transform"
        style={{ y: violetCurtainY }}
      />

      {/* Panel A — ink. Holds everything the visitor sees. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-ink will-change-transform"
        style={{ y: inkCurtainY }}
      >
        <motion.div
          className="absolute inset-0"
          initial="hidden"
          animate={contentState}
          onAnimationComplete={(definition) => {
            // exiting → lifting: fires once every caption and the monogram have left
            if (definition === 'exit') {
              setPhase((current) => (current === 'exiting' ? 'lifting' : current))
            }
          }}
        >
          {/* The four corner captions, padded like the page container */}
          <div className="absolute inset-0 flex flex-col justify-between p-[clamp(1.25rem,4vw,4rem)]">
            <div className="flex items-start justify-between gap-x-6">
              <CornerCaption order={0} className="label-mono min-w-0 text-caption">
                {NAME_CAPTION}
              </CornerCaption>
              {/* -me: cancels the letter-spacing after the last letter, so the text ends ON the margin */}
              <CornerCaption order={1} className="label-mono -me-[0.14em] shrink-0 text-end text-caption">
                {profile.location}
              </CornerCaption>
            </div>

            <div className="flex items-end justify-between gap-x-6">
              <CornerCaption order={2} className="label-mono min-w-0 text-caption">
                {ROLE_CAPTION}
              </CornerCaption>
              <CornerCaption
                order={3}
                className="shrink-0 font-mono text-display-md leading-none text-paper tabular-nums"
              >
                <CounterDigits loaded={loaded} />
              </CornerCaption>
            </div>
          </div>

          {/* The laser trace, dead centre */}
          <div className="absolute inset-0 grid place-items-center">
            <motion.div variants={markVariants}>
              <TracedMonogram trace={pathProgress} settle={settle} />
            </motion.div>
          </div>
        </motion.div>

        {/* Progress hairline on the bottom edge. It grows with the counter and, because it sits
            on the ink panel, becomes the glowing hem of the curtain when the panel lifts. */}
        <motion.span
          className="absolute inset-x-0 bottom-0 block h-px origin-left bg-(image:--grad-violet-hour)"
          style={{ scaleX: loaded }}
        />
      </motion.div>
    </motion.div>
  )
}
