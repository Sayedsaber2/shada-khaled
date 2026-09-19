import { motion } from 'motion/react'
import { Backdrop, FillLayer, WireLayer } from './CoverLayers'
import type { CoverArtProps } from './CoverLayers'
import { GROW_FROM_BOTTOM, drawStroke, fadeInPart, growBar } from './coverMotion'

/* -------------------------------------------------------------------------- */
/*  'chart' — analytics / dashboards (the student analyzer).                   */
/*  An app window with rising bars, a grade line and its grade dots.           */
/* -------------------------------------------------------------------------- */

const BASELINE_Y = 204
const BAR_WIDTH = 20
const BAR_STAGGER = 0.05

/** One bar per term. `fillClass` makes the hi-fi bars get stronger towards the best result. */
const BARS = [
  { x: 118, height: 30, fillClass: 'fill-accent-fill/35' },
  { x: 154, height: 46, fillClass: 'fill-accent-fill/45' },
  { x: 190, height: 40, fillClass: 'fill-accent-fill/55' },
  { x: 226, height: 64, fillClass: 'fill-accent-fill/70' },
  { x: 262, height: 84, fillClass: 'fill-accent-fill' },
]

/** The grade line floats above the middle of each bar. The last grade is the gold one. */
const GRADES = [
  { x: 128, y: 160 },
  { x: 164, y: 142 },
  { x: 200, y: 150 },
  { x: 236, y: 124 },
]
const BEST_GRADE = { x: 272, y: 104 }

/** Stops at the EDGE of the gold ring (3 units before its centre), so the ring stays empty. */
const GRADE_LINE = 'M128 160 L164 142 L200 150 L236 124 L269.4 105.5'
/** Same points, closed down to the baseline: the soft area under the line. */
const GRADE_AREA = 'M128 160 L164 142 L200 150 L236 124 L272 104 V204 H128 Z'

/** Title bar of the window: the frame's rounded top corners, flat bottom. */
const TITLE_BAR = 'M84 88 V76 A6 6 0 0 1 90 70 H310 A6 6 0 0 1 316 76 V88 Z'

export function ChartArt({ showFill }: CoverArtProps) {
  return (
    <>
      <Backdrop>
        {/* Grid lines that run past the window: the data is bigger than the screen */}
        <motion.path variants={fadeInPart} custom={0} strokeDasharray="1 6" d="M-10 124 H410 M-10 164 H410" />
      </Backdrop>

      <FillLayer visible={showFill}>
        <rect x={84} y={70} width={232} height={160} rx={6} className="fill-surface-3/60" />
        <path d={TITLE_BAR} className="fill-surface-3" />
        <path d={GRADE_AREA} className="fill-accent-soft" />
        {BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={BASELINE_Y - bar.height}
            width={BAR_WIDTH}
            height={bar.height}
            rx={2}
            className={bar.fillClass}
          />
        ))}
        <circle cx={BEST_GRADE.x} cy={BEST_GRADE.y} r={3} className="fill-gold" />
        {/* Floating student card + attendance ring (decoration outside the safe box) */}
        <rect x={24} y={132} width={44} height={56} rx={4} className="fill-surface-3" />
        <path d="M360 92 A18 18 0 1 1 342 110" fill="none" strokeWidth={5} strokeLinecap="round" className="stroke-accent-fill/70" />
      </FillLayer>

      <WireLayer>
        {/* 1 — the window */}
        <motion.rect variants={drawStroke} custom={0} x={84} y={70} width={232} height={160} rx={6} />
        <motion.path variants={fadeInPart} custom={0.6} d="M84 88 H316 M176 79 H224" />
        <motion.g variants={fadeInPart} custom={0.7} className="stroke-line-control">
          <circle cx={96} cy={79} r={2} />
          <circle cx={104} cy={79} r={2} />
          <circle cx={112} cy={79} r={2} />
        </motion.g>

        {/* 2 — baseline, then the bars grow out of it one after another */}
        <motion.path variants={drawStroke} custom={0.3} d="M104 204 H296" />
        {BARS.map((bar, index) => (
          <motion.rect
            key={bar.x}
            variants={growBar}
            custom={0.7 + index * BAR_STAGGER}
            style={GROW_FROM_BOTTOM}
            x={bar.x}
            y={BASELINE_Y - bar.height}
            width={BAR_WIDTH}
            height={bar.height}
            rx={2}
          />
        ))}

        {/* 3 — the grade line, its dots appearing as the pen passes them */}
        <motion.path variants={drawStroke} custom={0.9} d={GRADE_LINE} strokeWidth={1.5} />
        {GRADES.map((grade, index) => (
          <motion.circle
            key={grade.x}
            variants={fadeInPart}
            custom={1.2 + index * 0.2}
            cx={grade.x}
            cy={grade.y}
            r={2.5}
            className="fill-surface-2"
          />
        ))}
        {/* The best grade is the ONE gold detail of this cover (the fill layer fills the ring) */}
        <motion.circle
          variants={fadeInPart}
          custom={2}
          cx={BEST_GRADE.x}
          cy={BEST_GRADE.y}
          r={3}
          strokeWidth={1.25}
          className="stroke-gold"
        />

        {/* 4 — legend under the chart */}
        <motion.g variants={fadeInPart} custom={1.6}>
          <circle cx={108} cy={218} r={2} />
          <path d="M114 218 H146 M166 218 H190" />
          <circle cx={160} cy={218} r={2} />
        </motion.g>

        {/* 5 — decoration outside the safe box: a student card and an attendance ring */}
        <motion.g variants={fadeInPart} custom={1.2}>
          <rect x={24} y={132} width={44} height={56} rx={4} />
          <circle cx={46} cy={150} r={7} />
          <path d="M32 168 H60 M36 176 H56" />
          <circle cx={360} cy={110} r={18} />
        </motion.g>
      </WireLayer>
    </>
  )
}
