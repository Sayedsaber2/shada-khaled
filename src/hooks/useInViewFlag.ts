import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Writes data-inview="true|false" on the element. index.css pauses every CSS
 * animation inside [data-inview="false"], so ambient loops (drifting orbs,
 * rotating badges, sheens) cost nothing while they are off-screen.
 */
export function useInViewFlag(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.inview = entry.isIntersecting ? 'true' : 'false'
      },
      { rootMargin: '10% 0px 10% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}
