import type { PointerEvent, RefObject } from 'react'
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useFinePointer } from '@/hooks/useMediaQuery'
import { SPRING } from '@/lib/motion'

/** The plate leans at most this many degrees towards the pointer. */
const MAX_TILT = 5

export interface PlateTilt {
  /** false on touch screens and for reduced motion: attach nothing, the plate stays flat. */
  enabled: boolean
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  /** Typed for any HTML element, so the stage can be a <li>, a <div> … */
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

/**
 * Hover effect of a certificate plate: a 3D tilt towards the pointer + a soft light
 * ("sheen") that follows it.
 *
 * Attach the two handlers to the element AROUND the tilting plate (the one that owns
 * the `perspective`). That element never rotates, so measuring it gives stable numbers.
 *
 * `sheenRef` points at the sheen layer: the hook moves its gradient by writing the CSS
 * variables --sheen-x / --sheen-y on it.
 *
 * Nothing here causes a React re-render: the tilt lives in motion values and the
 * sheen position is written straight to the DOM.
 */
export function usePlateTilt(sheenRef: RefObject<HTMLElement | null>): PlateTilt {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const enabled = finePointer && !reducedMotion

  // Pointer position over the plate: -0.5 = left / top edge, 0 = centre, 0.5 = right / bottom edge
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  // The side under the pointer is pushed away from the viewer, as if pressed with a finger.
  // The springs make the plate follow softly and swing back to flat when the pointer leaves.
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING.tilt)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING.tilt)

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width // 0 → 1
    const vertical = (event.clientY - bounds.top) / bounds.height // 0 → 1

    pointerX.set(horizontal - 0.5)
    pointerY.set(vertical - 0.5)

    // The sheen's radial-gradient reads these two variables as its centre
    sheenRef.current?.style.setProperty('--sheen-x', `${horizontal * 100}%`)
    sheenRef.current?.style.setProperty('--sheen-y', `${vertical * 100}%`)
  }

  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return { enabled, rotateX, rotateY, onPointerMove, onPointerLeave }
}
