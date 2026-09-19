import { motion } from 'motion/react'
import { Backdrop, FillLayer, WireLayer } from './CoverLayers'
import type { CoverArtProps } from './CoverLayers'
import { drawStroke, fadeInPart } from './coverMotion'

/* -------------------------------------------------------------------------- */
/*  'route' — services / maps / mobility (the car service platform).           */
/*  A route with three stops, a booking card and a "car health" gauge.         */
/* -------------------------------------------------------------------------- */

/**
 * The route. It starts on the EDGE of the start ring (centre 104, 222 · radius 5) so the
 * ring stays empty. The fill layer re-uses the path as the soft "road" under the line.
 */
const ROUTE_PATH = 'M109 222 C150 222 152 172 196 162 S254 116 300 104'
/** Map pin whose tip touches the end of the route (300, 104). */
const PIN_PATH = 'M300 104 C293 94 288 88 288 80 A12 12 0 1 1 312 80 C312 88 307 94 300 104 Z'

/** Gauge: a half circle, centre (284, 228), radius 32. The "level" stops at two thirds. */
const GAUGE_ARC = 'M252 228 A32 32 0 0 1 316 228'
const GAUGE_LEVEL = 'M252 228 A32 32 0 0 1 300 200.3'
const GAUGE_TICKS = 'M249 228 H245 M259.3 203.3 L256.4 200.4 M284 193 V189 M308.7 203.3 L311.6 200.4 M319 228 H323'

export function RouteArt({ showFill }: CoverArtProps) {
  return (
    <>
      <Backdrop>
        {/* Streets around the block — they frame the scene and bleed off every edge */}
        <motion.path
          variants={fadeInPart}
          custom={0}
          d="M-10 40 L410 12 M48 -10 L20 310 M-10 286 L410 262 M372 -10 L352 310 M33 150 L-10 156 M362 150 L410 144"
        />
        {/* Where the route came from, and where it goes next */}
        <motion.path
          variants={fadeInPart}
          custom={0.2}
          strokeDasharray="2 6"
          d="M-10 250 C40 250 66 222 99 222 M300 104 C338 94 362 58 410 40"
        />
      </Backdrop>

      <FillLayer visible={showFill}>
        <path d={ROUTE_PATH} fill="none" strokeWidth={9} strokeLinecap="round" className="stroke-accent-fill/25" />
        <circle cx={104} cy={222} r={5} className="fill-accent-fill" />
        <path d={PIN_PATH} className="fill-gold/30" />

        {/* Booking card */}
        <rect x={84} y={72} width={112} height={68} rx={6} className="fill-surface-3" />
        <circle cx={100} cy={90} r={7} className="fill-accent-fill/60" />
        <rect x={94} y={114} width={92} height={16} rx={8} className="fill-accent-fill" />

        <path d={GAUGE_LEVEL} fill="none" strokeWidth={5} strokeLinecap="round" className="stroke-accent-fill" />
      </FillLayer>

      <WireLayer>
        {/* 1 — the route, then its three stops in travel order */}
        <motion.path variants={drawStroke} custom={0} d={ROUTE_PATH} strokeWidth={1.5} />
        <motion.circle variants={fadeInPart} custom={0.1} cx={104} cy={222} r={5} />
        <motion.circle variants={fadeInPart} custom={0.7} cx={196} cy={162} r={3.5} className="fill-surface-2" />
        {/* The destination is the ONE gold detail of this cover */}
        <motion.path variants={drawStroke} custom={0.9} d={PIN_PATH} strokeWidth={1.25} className="stroke-gold" />
        <motion.circle variants={fadeInPart} custom={1.6} cx={300} cy={80} r={4} className="stroke-gold" />

        {/* 2 — the booking card: frame first, then its rows one after another */}
        <motion.rect variants={drawStroke} custom={0.2} x={84} y={72} width={112} height={68} rx={6} />
        <motion.circle variants={fadeInPart} custom={0.9} cx={100} cy={90} r={7} />
        <motion.path variants={fadeInPart} custom={1} d="M114 87 H162 M114 95 H146" />
        <motion.path variants={fadeInPart} custom={1.1} d="M94 105 H186" className="stroke-line-strong" />
        <motion.rect variants={fadeInPart} custom={1.2} x={94} y={114} width={92} height={16} rx={8} />

        {/* 3 — the gauge */}
        <motion.path variants={drawStroke} custom={0.5} d={GAUGE_ARC} />
        <motion.g variants={fadeInPart} custom={1.4}>
          <path d={GAUGE_TICKS} />
          <path d="M284 228 L296 207.2" strokeWidth={1.5} />
          <circle cx={284} cy={228} r={3} className="fill-surface-2" />
        </motion.g>
      </WireLayer>
    </>
  )
}
