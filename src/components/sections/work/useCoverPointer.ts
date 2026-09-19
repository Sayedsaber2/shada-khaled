import { useState } from 'react'
import type { PointerEvent, RefObject } from 'react'
import { useMotionValue, useSpring } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { SPRING } from '@/lib/motion'

interface CoverPointer {
  /** Pointer position in px, measured from the top-left corner of the cover (sprung). */
  x: MotionValue<number>
  y: MotionValue<number>
  /** true while the pointer is over the cover itself (not over the text under it). */
  isOverCover: boolean
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

/**
 * Tracks the pointer for the "VIEW" disc of a project card.
 *
 * The handlers go on the card's button (it covers the whole card), while the position is
 * measured against the COVER, because the disc lives inside the cover.
 * The position is stored in motion values: moving the mouse never re-renders React.
 * Only crossing the edge of the cover changes state (`isOverCover`).
 */
export function useCoverPointer(coverRef: RefObject<HTMLElement | null>): CoverPointer {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  // The spring makes the disc trail slightly behind the cursor instead of being glued to it
  const x = useSpring(rawX, SPRING.pointer)
  const y = useSpring(rawY, SPRING.pointer)
  const [isOverCover, setIsOverCover] = useState(false)

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const cover = coverRef.current
    if (!cover) return

    const bounds = cover.getBoundingClientRect()
    const pointerX = event.clientX - bounds.left
    const pointerY = event.clientY - bounds.top
    const isInside =
      pointerX >= 0 && pointerX <= bounds.width && pointerY >= 0 && pointerY <= bounds.height

    rawX.set(pointerX)
    rawY.set(pointerY)

    if (isInside && !isOverCover) {
      // Entering: place the disc under the cursor at once. Without this it would
      // fly in from wherever the pointer left the cover last time.
      x.jump(pointerX)
      y.jump(pointerY)
    }
    // React skips the re-render when the value did not change, so this is cheap
    setIsOverCover(isInside)
  }

  const onPointerLeave = () => setIsOverCover(false)

  return { x, y, isOverCover, onPointerMove, onPointerLeave }
}
