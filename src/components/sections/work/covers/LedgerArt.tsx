import { motion } from 'motion/react'
import { Backdrop, FillLayer, WireLayer } from './CoverLayers'
import type { CoverArtProps } from './CoverLayers'
import { drawStroke, fadeInPart } from './coverMotion'

/* -------------------------------------------------------------------------- */
/*  'ledger' — data / management systems (the pharmacy system).                */
/*  A database table with one highlighted record, three related tables         */
/*  connected to it, and a few capsules.                                       */
/* -------------------------------------------------------------------------- */

/** Main table: x 92 → 252, y 78 → 198. A header row plus five records, 20 units each. */
const TABLE_GRID = 'M92 98 H252 M92 118 H252 M92 138 H252 M92 158 H252 M92 178 H252 M132 78 V198 M200 78 V198'
/** Header of the table: the frame's rounded top corners, flat bottom. */
const TABLE_HEADER = 'M92 98 V82 A4 4 0 0 1 96 78 H248 A4 4 0 0 1 252 82 V98 Z'

/** The "text" of each record: three short strokes, one per column. */
const RECORDS = [
  { id: 'record-1', d: 'M100 108 H122 M140 108 H186 M208 108 H238' },
  { id: 'record-2', d: 'M100 128 H118 M140 128 H176 M208 128 H234' },
  { id: 'record-3', d: 'M100 148 H124 M140 148 H190 M208 148 H240' },
  { id: 'record-4', d: 'M100 168 H120 M140 168 H168 M208 168 H232' },
  { id: 'record-5', d: 'M100 188 H122 M140 188 H180 M208 188 H236' },
]
const RECORD_STAGGER = 0.1

/** Relations: from the table to the three related tables (drawn as one continuous stroke). */
const RELATIONS = 'M252 108 H272 M252 148 H262 V172 H272 M166 198 V210'

interface CapsuleShape {
  id: string
  cx: number
  cy: number
  width: number
  height: number
  /** degrees, around the capsule's own centre */
  angle: number
}

/** One capsule inside the safe box (top), two as decoration near the side edges. */
const CAPSULES: CapsuleShape[] = [
  { id: 'top', cx: 124, cy: 44, width: 44, height: 18, angle: -25 },
  { id: 'start', cx: 38, cy: 156, width: 40, height: 16, angle: -40 },
  { id: 'end', cx: 358, cy: 128, width: 36, height: 14, angle: 30 },
]

function capsuleRotation(capsule: CapsuleShape): string {
  return `rotate(${capsule.angle} ${capsule.cx} ${capsule.cy})`
}

/** The right half of a capsule — the hi-fi version colours it gold. */
function capsuleEndHalf({ cx, cy, width, height }: CapsuleShape): string {
  const radius = height / 2
  const straightEnd = cx + width / 2 - radius
  return `M${cx} ${cy - radius} H${straightEnd} A${radius} ${radius} 0 0 1 ${straightEnd} ${cy + radius} H${cx} Z`
}

export function LedgerArt({ showFill }: CoverArtProps) {
  return (
    <>
      <Backdrop>
        {/* Ledger paper: double margin line at the start, single at the end, two rules */}
        <motion.path
          variants={fadeInPart}
          custom={0}
          d="M68 -10 V310 M72 -10 V310 M334 -10 V310 M-10 20 H410 M-10 262 H410"
        />
      </Backdrop>

      <FillLayer visible={showFill}>
        <rect x={92} y={78} width={160} height={120} rx={4} className="fill-surface-3/60" />
        <path d={TABLE_HEADER} className="fill-accent-fill/25" />
        {/* The selected record, with a solid marker on its start edge */}
        <rect x={92} y={138} width={160} height={20} className="fill-accent-soft" />
        <rect x={92} y={138} width={3} height={20} className="fill-accent-fill" />

        <rect x={272} y={88} width={44} height={40} rx={4} className="fill-surface-3" />
        <rect x={272} y={152} width={44} height={40} rx={4} className="fill-surface-3" />
        <rect x={132} y={210} width={68} height={26} rx={4} className="fill-surface-3" />

        {CAPSULES.map((capsule) => (
          <g key={capsule.id} transform={capsuleRotation(capsule)}>
            <rect
              x={capsule.cx - capsule.width / 2}
              y={capsule.cy - capsule.height / 2}
              width={capsule.width}
              height={capsule.height}
              rx={capsule.height / 2}
              className="fill-accent-fill/60"
            />
            <path d={capsuleEndHalf(capsule)} className="fill-gold/50" />
          </g>
        ))}
        <circle cx={292} cy={44} r={12} className="fill-accent-fill/30" />
      </FillLayer>

      <WireLayer>
        {/* 1 — the table: frame, grid, then the records fade in from top to bottom */}
        <motion.rect variants={drawStroke} custom={0} x={92} y={78} width={160} height={120} rx={4} />
        <motion.path variants={fadeInPart} custom={0.5} d={TABLE_GRID} className="stroke-accent/50" />
        <motion.path
          variants={fadeInPart}
          custom={0.7}
          d="M100 88 H118 M140 88 H172 M208 88 H230"
          strokeWidth={1.75}
        />
        {RECORDS.map((record, index) => (
          <motion.path
            key={record.id}
            variants={fadeInPart}
            custom={0.8 + index * RECORD_STAGGER}
            d={record.d}
          />
        ))}
        {/* A caret pointing at the selected record */}
        <motion.path variants={fadeInPart} custom={1.4} d="M80 143 L86 148 L80 153" strokeWidth={1.25} />

        {/* 2 — relations run out of the table, the related tables answer */}
        <motion.path variants={drawStroke} custom={0.9} d={RELATIONS} />
        <motion.g variants={fadeInPart} custom={1}>
          <circle cx={252} cy={108} r={2} className="fill-surface-2" />
          <circle cx={252} cy={148} r={2} className="fill-surface-2" />
          <circle cx={166} cy={198} r={2} className="fill-surface-2" />
        </motion.g>
        <motion.rect variants={drawStroke} custom={1.1} x={272} y={88} width={44} height={40} rx={4} />
        <motion.rect variants={drawStroke} custom={1.2} x={272} y={152} width={44} height={40} rx={4} />
        <motion.rect variants={drawStroke} custom={1.3} x={132} y={210} width={68} height={26} rx={4} />
        <motion.path
          variants={fadeInPart}
          custom={1.9}
          d="M272 100 H316 M280 110 H308 M280 118 H300 M272 164 H316 M280 174 H306 M280 182 H298 M132 220 H200 M140 228 H180"
        />

        {/* 3 — capsules. The one inside the safe box is the ONE gold detail of this cover */}
        {CAPSULES.map((capsule, index) => (
          <g
            key={capsule.id}
            transform={capsuleRotation(capsule)}
            strokeWidth={capsule.id === 'top' ? 1.25 : 1}
            className={capsule.id === 'top' ? 'stroke-gold' : undefined}
          >
            <motion.rect
              variants={drawStroke}
              custom={0.4 + index * 0.2}
              x={capsule.cx - capsule.width / 2}
              y={capsule.cy - capsule.height / 2}
              width={capsule.width}
              height={capsule.height}
              rx={capsule.height / 2}
            />
            <motion.path
              variants={fadeInPart}
              custom={1.4 + index * 0.2}
              d={`M${capsule.cx} ${capsule.cy - capsule.height / 2} V${capsule.cy + capsule.height / 2}`}
            />
          </g>
        ))}
        <motion.circle variants={drawStroke} custom={0.6} cx={292} cy={44} r={12} />
        <motion.path variants={fadeInPart} custom={1.6} d="M283.5 35.5 L300.5 52.5" />
      </WireLayer>
    </>
  )
}
