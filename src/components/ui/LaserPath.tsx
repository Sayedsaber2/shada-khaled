import { useEffect, useRef, useState } from 'react'
import { motion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'

/* -------------------------------------------------------------------------- */
/*  <LaserPath> — the site's signature motif.                                  */
/*  A vector path is "cut" by a laser: the stroke draws itself and a small     */
/*  glowing gold dot rides the tip. Nod to the owner's laser-cutting craft.    */
/*                                                                            */
/*  Render it INSIDE an <svg>. `progress` is a MotionValue from 0 to 1 —       */
/*  from useScroll (scroll-scrubbed) or animate() (timed).                     */
/*                                                                            */
/*    <svg viewBox="0 0 100 120">                                              */
/*      <LaserPath d="M…" progress={progress} />                               */
/*    </svg>                                                                   */
/* -------------------------------------------------------------------------- */

interface LaserPathProps {
  d: string
  progress: MotionValue<number>
  /** stroke colour of the drawn line (any CSS colour / url(#gradient)) */
  stroke?: string
  strokeWidth?: number
  /** faint full-length guide underneath, like an uncut vector */
  guide?: boolean
  /** show the gold laser head */
  dot?: boolean
  dotRadius?: number
  /** keeps stroke widths constant when the svg is stretched */
  nonScaling?: boolean
}

export function LaserPath({
  d,
  progress,
  stroke = 'var(--accent-strong)',
  strokeWidth = 1.25,
  guide = true,
  dot = true,
  dotRadius = 3,
  nonScaling = false,
}: LaserPathProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [length, setLength] = useState(0)

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength())
  }, [d])

  const pointAt = (value: number) => {
    const path = pathRef.current
    if (!path || length === 0) return { x: 0, y: 0 }
    return path.getPointAtLength(Math.max(0, Math.min(1, value)) * length)
  }

  const cx = useTransform(progress, (value) => pointAt(value).x)
  const cy = useTransform(progress, (value) => pointAt(value).y)
  // The laser head only exists while cutting: fades in at the start, out at the end
  const dotOpacity = useTransform(progress, [0, 0.015, 0.985, 1], [0, 1, 1, 0])

  const vectorEffect = nonScaling ? 'non-scaling-stroke' : undefined

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {guide ? (
        <path d={d} stroke="var(--line-strong)" strokeWidth={strokeWidth} vectorEffect={vectorEffect} />
      ) : null}
      <motion.path
        ref={pathRef}
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        vectorEffect={vectorEffect}
        style={{ pathLength: progress }}
      />
      {dot && length > 0 ? (
        <motion.g style={{ opacity: dotOpacity }}>
          <motion.circle cx={cx} cy={cy} r={dotRadius * 2.6} fill="var(--accent)" opacity={0.28} />
          <motion.circle cx={cx} cy={cy} r={dotRadius} fill="var(--gold)" />
        </motion.g>
      ) : null}
    </g>
  )
}
