import { motion } from 'motion/react'
import { Backdrop, FillLayer, WireLayer } from './CoverLayers'
import type { CoverArtProps } from './CoverLayers'
import { drawStroke, fadeInPart } from './coverMotion'

/* -------------------------------------------------------------------------- */
/*  'browser' — websites / web apps.                                           */
/*  A browser window with a hero (headline, button, image) and three cards,    */
/*  plus colour swatches and component chips beside it.                        */
/* -------------------------------------------------------------------------- */

/** Title bar of the window: the frame's rounded top corners, flat bottom. */
const TITLE_BAR = 'M84 88 V76 A6 6 0 0 1 90 70 H310 A6 6 0 0 1 316 76 V88 Z'

const CARD_Y = 170
const CARD_STAGGER = 0.12

/** Three content cards under the hero: a frame and two lines of text each. */
const CARDS = [100, 170, 240].map((x) => ({
  id: `card-${x}`,
  x,
  text: `M${x + 8} ${CARD_Y + 30} H${x + 40} M${x + 8} ${CARD_Y + 37} H${x + 28}`,
}))

/** Colour swatches (start side) — decoration outside the safe box. */
const SWATCHES = [
  { cy: 120, fillClass: 'fill-accent-fill' },
  { cy: 150, fillClass: 'fill-accent-fill/50' },
  { cy: 180, fillClass: 'fill-gold/60' },
]

export function BrowserArt({ showFill }: CoverArtProps) {
  return (
    <>
      <Backdrop>
        {/* The 12-column grid the page was designed on, running past the window */}
        <motion.path
          variants={fadeInPart}
          custom={0}
          strokeDasharray="1 6"
          d="M100 -10 V310 M160 -10 V310 M230 -10 V310 M300 -10 V310"
        />
      </Backdrop>

      <FillLayer visible={showFill}>
        <rect x={84} y={70} width={232} height={160} rx={6} className="fill-surface-3/60" />
        <path d={TITLE_BAR} className="fill-surface-3" />
        <rect x={100} y={138} width={40} height={12} rx={6} className="fill-gold" />
        <rect x={220} y={100} width={80} height={52} rx={4} className="fill-accent-fill/35" />
        <circle cx={282} cy={114} r={5} className="fill-gold/70" />
        {CARDS.map((card) => (
          <rect key={card.id} x={card.x} y={CARD_Y} width={60} height={22} rx={4} className="fill-accent-soft" />
        ))}

        {SWATCHES.map((swatch) => (
          <circle key={swatch.cy} cx={40} cy={swatch.cy} r={9} className={swatch.fillClass} />
        ))}
        <rect x={340} y={112} width={44} height={18} rx={9} className="fill-accent-fill/35" />
      </FillLayer>

      <WireLayer>
        {/* 1 — the window and its address bar */}
        <motion.rect variants={drawStroke} custom={0} x={84} y={70} width={232} height={160} rx={6} />
        <motion.path variants={fadeInPart} custom={0.6} d="M84 88 H316" />
        <motion.g variants={fadeInPart} custom={0.7} className="stroke-line-control">
          <circle cx={96} cy={79} r={2} />
          <circle cx={104} cy={79} r={2} />
          <circle cx={112} cy={79} r={2} />
          <rect x={128} y={75} width={112} height={8} rx={4} />
        </motion.g>

        {/* 2 — the hero: headline, paragraph, button, image */}
        <motion.path variants={fadeInPart} custom={0.9} d="M100 106 H196 M100 116 H172" strokeWidth={2.5} />
        <motion.path variants={fadeInPart} custom={1} d="M100 128 H184" />
        {/* The call to action is the ONE gold detail of this cover */}
        <motion.rect
          variants={fadeInPart}
          custom={1.1}
          x={100}
          y={138}
          width={40}
          height={12}
          rx={6}
          strokeWidth={1.25}
          className="stroke-gold"
        />
        <motion.rect variants={drawStroke} custom={0.4} x={220} y={100} width={80} height={52} rx={4} />
        <motion.g variants={fadeInPart} custom={1.3}>
          <path d="M220 144 L244 120 L262 138 L276 126 L300 148" />
          <circle cx={282} cy={114} r={5} />
        </motion.g>

        {/* 3 — the cards, one after another */}
        {CARDS.map((card, index) => (
          <motion.g key={card.id} variants={fadeInPart} custom={1.3 + index * CARD_STAGGER}>
            <rect x={card.x} y={CARD_Y} width={60} height={44} rx={4} />
            <path d={card.text} />
          </motion.g>
        ))}

        {/* 4 — beside the window: colour swatches and component chips */}
        <motion.g variants={fadeInPart} custom={1.5}>
          {SWATCHES.map((swatch) => (
            <circle key={swatch.cy} cx={40} cy={swatch.cy} r={9} />
          ))}
          <rect x={340} y={112} width={44} height={18} rx={9} />
          <rect x={340} y={140} width={44} height={18} rx={9} />
          <rect x={340} y={168} width={30} height={18} rx={9} />
        </motion.g>
      </WireLayer>
    </>
  )
}
