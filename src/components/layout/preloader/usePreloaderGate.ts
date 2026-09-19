import { useEffect } from 'react'
import { useMotionValue } from 'motion/react'
import type { MotionValue } from 'motion/react'

/** Whatever the network does, the visitor never waits longer than this. */
const HARD_CAP_SECONDS = 4

interface PreloaderGateOptions {
  /** The intro never ends sooner than this, so the choreography has time to play. */
  minSeconds: number
  /** The hero portrait. It must be downloaded AND decoded before the curtain lifts. */
  imageSrc: string
}

/** Web fonts: otherwise the hero headline would swap typefaces right after the curtain lifts. */
function waitForFonts(): Promise<void> {
  if (!('fonts' in document)) return Promise.resolve()
  // A font that fails to load must never block the site, so errors count as "ready"
  return document.fonts.ready.then(
    () => undefined,
    () => undefined,
  )
}

/** The portrait: decode() resolves once the image can be painted without a hitch. */
function waitForImage(src: string): Promise<void> {
  if (!src) return Promise.resolve()
  const image = new Image()
  image.src = src
  // A missing or broken photo must never block the site either
  return image.decode().catch(() => undefined)
}

/**
 * The "gate" decides when the preloader is ALLOWED to finish.
 * It opens when all three are true:
 *   1. the minimum time has passed   2. the web fonts are ready   3. the portrait is decoded
 * …or when the 4s hard cap runs out, whichever comes first.
 *
 * It returns a motion value (0 = closed, 1 = open) instead of React state, so the
 * counter can react to it without re-rendering the component.
 */
export function usePreloaderGate({ minSeconds, imageSrc }: PreloaderGateOptions): MotionValue<number> {
  const gate = useMotionValue(0)

  useEffect(() => {
    let cancelled = false
    const timers: number[] = []

    const openGate = () => {
      if (!cancelled) gate.set(1)
    }

    const wait = (seconds: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, seconds * 1000))
      })

    try {
      const everythingReady = Promise.all([wait(minSeconds), waitForFonts(), waitForImage(imageSrc)])
      const hardCap = wait(HARD_CAP_SECONDS)
      Promise.race([everythingReady, hardCap]).then(openGate, openGate)
    } catch {
      // Very old browser without FontFaceSet / decode(): never trap the visitor, open right away
      openGate()
    }

    return () => {
      // StrictMode runs this effect twice in dev: the first run must not open the gate
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [gate, minSeconds, imageSrc])

  return gate
}
