import { useId } from 'react'
import { motion } from 'motion/react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import { sealStamp } from './plateMotion'

/* -------------------------------------------------------------------------- */
/*  THE STAMP — a round gold seal, like the embossed one on a paper diploma.   */
/*                                                                            */
/*   · · · · ·    ring of dots (the "scalloped" edge of a real seal)           */
/*   ─────────    outer ring                                                   */
/*   TOP PERFORMER · TOP PERFORMER ·   the achievement, running in a circle    */
/*   ─────────    inner ring                                                   */
/*       ★        centre glyph                                                 */
/*                                                                            */
/*  It is decoration (aria-hidden): <CertificatePlate> prints the same words   */
/*  as real text next to the issuer, so nobody depends on reading a circle.    */
/* -------------------------------------------------------------------------- */

const GOLD = 'var(--gold)'

/* The SVG is drawn in a 120 × 120 box and scaled by CSS, so every number below is in those units. */
const BOX_SIZE = 120
const CENTER = BOX_SIZE / 2

const DOT_RING_RADIUS = 56.5
const DOT_COUNT = 60
const OUTER_RING_RADIUS = 50.5
const INNER_RING_RADIUS = 32
const STAR_SIZE = 26

/** The circle the letters stand on. Their tops point outwards, into the band between the two rings. */
const TEXT_RING_RADIUS = 38.25
const TEXT_RING_LENGTH = 2 * Math.PI * TEXT_RING_RADIUS
const FONT_SIZE = 8.5
/** JetBrains Mono is monospaced: every character is exactly 0.6em wide. */
const MONO_CHARACTER_WIDTH = 0.6
/** About this many characters give the ring the wide, engraved letter-spacing of a real seal. */
const TARGET_CHARACTERS = 32

/** A full circle, starting at 12 o'clock and running clockwise (so the text reads clockwise). */
const TEXT_RING_PATH = `M ${CENTER},${CENTER - TEXT_RING_RADIUS} a ${TEXT_RING_RADIUS},${TEXT_RING_RADIUS} 0 1,1 0,${TEXT_RING_RADIUS * 2} a ${TEXT_RING_RADIUS},${TEXT_RING_RADIUS} 0 1,1 0,${-TEXT_RING_RADIUS * 2}`

/**
 * "GRADE A" → "GRADE A · GRADE A · GRADE A · "
 * Short words are repeated more often, so every seal ends up with a similar amount of text.
 * (Keep the seal words short — up to ~24 characters — or the letters start to touch.)
 */
function buildRingText(words: string): string {
  const unit = `${words} · `
  const repeats = Math.max(1, Math.round(TARGET_CHARACTERS / unit.length))
  return unit.repeat(repeats)
}

interface SealProps {
  /** The words on the seal, e.g. "TOP PERFORMER" */
  words: string
  /** The plate's own reveal delay (seconds) — the stamp is timed on top of it, see plateMotion.ts */
  revealDelay: number
  /** Size + position, decided by the plate. */
  className?: string
}

export function Seal({ words, revealDelay, className }: SealProps) {
  const ringId = useId()

  // Spread the text over the whole circle: split the ring into equal slots, one per
  // character; whatever the character itself does not fill becomes letter-spacing.
  const ringText = buildRingText(words)
  const letterSpacing = TEXT_RING_LENGTH / ringText.length - FONT_SIZE * MONO_CHARACTER_WIDTH

  return (
    // The stamp animation (scale + twist + fade, the site's only overshoot) lives on this
    // wrapper. It receives "hidden" / "visible" from the plate — it has no scroll trigger of its own.
    <motion.div
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
      variants={sealStamp}
      custom={revealDelay}
    >
      {/*
        -rotate-12 is the seal's RESTING angle: stamps are never perfectly straight.
        It is plain CSS, so it also holds when reduced motion skips the animation above.
      */}
      <svg
        viewBox={`0 0 ${BOX_SIZE} ${BOX_SIZE}`}
        fill="none"
        focusable="false"
        className="size-full -rotate-12"
      >
        <defs>
          <path id={ringId} d={TEXT_RING_PATH} />
        </defs>

        {/*
          Ring of dots without drawing 60 circles: pathLength tells the browser to treat the
          circle as 60 units long, so the dash pattern "0 1" means "a zero-length dash every
          1 unit" — and a zero-length dash with ROUND caps is a dot.
        */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={DOT_RING_RADIUS}
          stroke={GOLD}
          strokeWidth={1.75}
          strokeLinecap="round"
          pathLength={DOT_COUNT}
          strokeDasharray="0 1"
        />
        <circle cx={CENTER} cy={CENTER} r={OUTER_RING_RADIUS} stroke={GOLD} strokeWidth={1} />

        <text
          fill={GOLD}
          fontSize={FONT_SIZE}
          letterSpacing={letterSpacing}
          className="font-mono font-medium uppercase"
        >
          <textPath href={`#${ringId}`}>{ringText}</textPath>
        </text>

        <circle cx={CENTER} cy={CENTER} r={INNER_RING_RADIUS} stroke={GOLD} strokeWidth={0.75} />

        {/* A lucide icon is an <svg> itself, so x / y / size place it inside this drawing */}
        <Star
          x={CENTER - STAR_SIZE / 2}
          y={CENTER - STAR_SIZE / 2}
          size={STAR_SIZE}
          color={GOLD}
          strokeWidth={1.5}
        />
      </svg>
    </motion.div>
  )
}
