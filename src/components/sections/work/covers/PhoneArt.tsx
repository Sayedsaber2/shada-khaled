import { motion } from 'motion/react'
import { Backdrop, FillLayer, WireLayer } from './CoverLayers'
import type { CoverArtProps } from './CoverLayers'
import { drawStroke, fadeInPart } from './coverMotion'

/* -------------------------------------------------------------------------- */
/*  'phone' — mobile apps.                                                     */
/*  A phone wireframe: header, a hero card, list rows and a tab bar, with a    */
/*  notification and a floating action button beside it.                       */
/* -------------------------------------------------------------------------- */

const ROW_HEIGHT = 28
const FIRST_ROW_Y = 138
const ROW_STAGGER = 0.12

/** Three list rows: a square thumbnail and two lines of text each. */
const LIST_ROWS = [0, 1, 2].map((index) => {
  const y = FIRST_ROW_Y + index * ROW_HEIGHT
  return { id: `row-${index}`, y, text: `M186 ${y + 7} H236 M186 ${y + 15} H216` }
})

export function PhoneArt({ showFill }: CoverArtProps) {
  return (
    <>
      <Backdrop>
        {/* Layout guides of the artboard: the phone's edges, extended across the canvas */}
        <motion.path
          variants={fadeInPart}
          custom={0}
          strokeDasharray="1 6"
          d="M146 -10 V310 M254 -10 V310 M-10 36 H410 M-10 264 H410"
        />
      </Backdrop>

      <FillLayer visible={showFill}>
        <rect x={146} y={36} width={108} height={228} rx={18} className="fill-surface-3/70" />
        <circle cx={236} cy={66} r={6} className="fill-accent-fill/60" />
        <rect x={158} y={80} width={84} height={46} rx={6} className="fill-accent-fill/35" />
        <rect x={168} y={112} width={30} height={8} rx={4} className="fill-gold" />
        {LIST_ROWS.map((row) => (
          <rect key={row.id} x={158} y={row.y} width={20} height={20} rx={4} className="fill-accent-soft" />
        ))}
        <circle cx={176} cy={244} r={4} className="fill-accent-fill" />

        <rect x={56} y={104} width={76} height={34} rx={6} className="fill-surface-3" />
        {/* Kept translucent so the "+" drawn on top stays readable in both themes */}
        <circle cx={290} cy={178} r={14} className="fill-accent-fill/35" />
      </FillLayer>

      <WireLayer>
        {/* 1 — the device */}
        <motion.rect variants={drawStroke} custom={0} x={146} y={36} width={108} height={228} rx={18} />
        <motion.path variants={fadeInPart} custom={0.7} d="M188 48 H212 M186 257 H214" />

        {/* 2 — the screen, from top to bottom */}
        <motion.g variants={fadeInPart} custom={0.8}>
          <path d="M158 66 H200" strokeWidth={2} />
          <circle cx={236} cy={66} r={6} />
        </motion.g>
        <motion.rect variants={drawStroke} custom={0.5} x={158} y={80} width={84} height={46} rx={6} />
        <motion.path variants={fadeInPart} custom={1} d="M168 94 H208 M168 103 H192" />
        {/* The call to action is the ONE gold detail of this cover */}
        <motion.rect
          variants={fadeInPart}
          custom={1.1}
          x={168}
          y={112}
          width={30}
          height={8}
          rx={4}
          strokeWidth={1.25}
          className="stroke-gold"
        />
        {LIST_ROWS.map((row, index) => (
          <motion.g key={row.id} variants={fadeInPart} custom={1.2 + index * ROW_STAGGER}>
            <rect x={158} y={row.y} width={20} height={20} rx={4} />
            <path d={row.text} />
          </motion.g>
        ))}
        <motion.g variants={fadeInPart} custom={1.7}>
          <path d="M146 228 H254" className="stroke-accent/50" />
          <circle cx={176} cy={244} r={4} />
          <circle cx={200} cy={244} r={4} />
          <circle cx={224} cy={244} r={4} />
        </motion.g>

        {/* 3 — beside the phone: a notification and the floating action button */}
        <motion.rect variants={drawStroke} custom={0.8} x={56} y={104} width={76} height={34} rx={6} />
        <motion.g variants={fadeInPart} custom={1.6}>
          <circle cx={72} cy={121} r={6} />
          <path d="M86 117 H122 M86 125 H108" />
        </motion.g>
        <motion.circle variants={drawStroke} custom={1} cx={290} cy={178} r={14} />
        <motion.path variants={fadeInPart} custom={1.8} d="M284 178 H296 M290 172 V184" />
      </WireLayer>
    </>
  )
}
