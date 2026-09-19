import { motion } from 'motion/react'
import { VIEWPORT, drawLine } from '@/lib/motion'

/**
 * A 1px hairline that draws itself from the left the first time it scrolls into view.
 * Only `scaleX` is animated, so the browser never has to re-layout anything.
 */
export function DrawnRule() {
  return (
    <motion.span
      aria-hidden="true"
      className="hairline origin-left"
      variants={drawLine}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    />
  )
}
