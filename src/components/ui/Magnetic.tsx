import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { SPRING } from '@/lib/motion'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/cn'

interface MagneticProps {
  children: ReactNode
  /** 0.2 = subtle … 0.5 = strong */
  strength?: number
  /** max travel in px */
  max?: number
  className?: string
}

/**
 * Pulls its child towards the cursor, then springs back on leave.
 * Only active with a real mouse, and never under reduced motion.
 */
export function Magnetic({ children, strength = 0.3, max = 14, className }: MagneticProps) {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), SPRING.pointer)
  const y = useSpring(useMotionValue(0), SPRING.pointer)

  if (!finePointer || reducedMotion) {
    return <div className={cn('inline-block', className)}>{children}</div>
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * strength
    const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * strength
    x.set(Math.max(-max, Math.min(max, offsetX)))
    y.set(Math.max(-max, Math.min(max, offsetY)))
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
