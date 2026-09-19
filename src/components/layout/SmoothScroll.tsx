import { useEffect } from 'react'
import Lenis from 'lenis'
import { cancelFrame, frame, useReducedMotion } from 'motion/react'
import { useApp } from '@/context/AppContext'

/**
 * Buttery wheel scrolling (Lenis), driven by Motion's frame loop so both libraries
 * share ONE requestAnimationFrame. Touch devices keep their native scrolling.
 * Also turns every in-page link (<a href="#about">) into a smooth scroll.
 */
export function SmoothScroll() {
  const { registerLenis, scrollTo } = useApp()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, autoRaf: false })
    registerLenis(lenis)

    const update = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp)
    frame.update(update, true)

    return () => {
      cancelFrame(update)
      registerLenis(null)
      lenis.destroy()
    }
  }, [reducedMotion, registerLenis])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = link?.getAttribute('href')
      if (!hash || hash === '#') return

      const target = document.getElementById(hash.slice(1))
      if (!target) return

      event.preventDefault()
      scrollTo(target)
      history.replaceState(null, '', hash)
      // Move keyboard focus with the scroll so tabbing continues from the new section
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scrollTo])

  return null
}
