import { useEffect } from 'react'
import type { RefObject } from 'react'
import { useMotionValue, useSpring } from 'motion/react'
import type { MotionValue } from 'motion/react'

/** Pointer position, from -1 (left / top of the window) to 1 (right / bottom). 0 = centre. */
export interface PointerParallax {
  x: MotionValue<number>
  y: MotionValue<number>
}

/** Deliberately lazy spring: the lights should float after the cursor, not track it. */
const POINTER_SPRING = { stiffness: 50, damping: 20 }

/**
 * Follows the pointer while it is over `targetRef` and returns two sprung motion values.
 * Multiply them by a distance in px to move a layer (see BokehOrbs).
 *
 * When `enabled` is false no listener is attached and both values rest at 0, so the
 * layers using them simply stay where they are (touch screens, reduced motion).
 */
export function usePointerParallax(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): PointerParallax {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, POINTER_SPRING)
  const y = useSpring(rawY, POINTER_SPRING)

  useEffect(() => {
    const target = targetRef.current
    if (!enabled || !target) return

    // Motion values update outside React: no re-render per pointer event.
    // We divide by the window size (not the element's box) so nothing reads layout here.
    const onPointerMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1)
      rawY.set((event.clientY / window.innerHeight) * 2 - 1)
    }
    const recentre = () => {
      rawX.set(0)
      rawY.set(0)
    }

    target.addEventListener('pointermove', onPointerMove)
    target.addEventListener('pointerleave', recentre)
    return () => {
      target.removeEventListener('pointermove', onPointerMove)
      target.removeEventListener('pointerleave', recentre)
      recentre()
    }
  }, [enabled, targetRef, rawX, rawY])

  return { x, y }
}
