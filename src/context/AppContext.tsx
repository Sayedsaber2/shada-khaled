import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type Lenis from 'lenis'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/hooks/useTheme'

/** Height of the fixed navbar — used as the offset for anchor scrolling. */
export const NAV_OFFSET = 72

interface AppContextValue {
  /**
   * false while the preloader is on screen. Flips to true the moment the curtain
   * starts lifting — the hero entrance animation waits for this.
   */
  introDone: boolean
  finishIntro: () => void
  /** Registers the Lenis instance (called once by <SmoothScroll>). */
  registerLenis: (lenis: Lenis | null) => void
  /** Smooth-scrolls to '#id', an element or a y position. Falls back to native scrolling. */
  scrollTo: (target: string | number | HTMLElement, options?: { immediate?: boolean }) => void
  /**
   * Freeze / release page scrolling (preloader, mobile menu, project sheet).
   * Calls are counted, so nested locks are safe: lock, lock, unlock → still locked.
   */
  lockScroll: () => void
  unlockScroll: () => void
  /** 'dark' (the brand look) or 'light' (warm paper). Remembered in localStorage. */
  theme: Theme
  toggleTheme: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const lenisRef = useRef<Lenis | null>(null)
  const lockCount = useRef(0)

  const finishIntro = useCallback(() => {
    // index.html paints the page ink-dark while the preloader is up (class="intro")
    document.documentElement.classList.remove('intro')
    setIntroDone(true)
  }, [])

  const applyLock = useCallback(() => {
    const locked = lockCount.current > 0
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    if (locked) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [])

  const registerLenis = useCallback(
    (lenis: Lenis | null) => {
      lenisRef.current = lenis
      applyLock()
    },
    [applyLock],
  )

  const lockScroll = useCallback(() => {
    lockCount.current += 1
    applyLock()
  }, [applyLock])

  const unlockScroll = useCallback(() => {
    lockCount.current = Math.max(0, lockCount.current - 1)
    applyLock()
  }, [applyLock])

  const scrollTo = useCallback<AppContextValue['scrollTo']>((target, options) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, {
        offset: typeof target === 'number' ? 0 : -NAV_OFFSET,
        duration: 1.4,
        immediate: options?.immediate,
      })
      return
    }
    // Native fallback (reduced motion / Lenis not running)
    if (typeof target === 'number') {
      window.scrollTo({ top: target })
      return
    }
    const element = typeof target === 'string' ? document.querySelector(target) : target
    if (element instanceof HTMLElement) {
      const top = element.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
      window.scrollTo({ top })
    }
  }, [])

  const value = useMemo(
    () => ({
      introDone,
      finishIntro,
      registerLenis,
      scrollTo,
      lockScroll,
      unlockScroll,
      theme,
      toggleTheme,
    }),
    [introDone, finishIntro, registerLenis, scrollTo, lockScroll, unlockScroll, theme, toggleTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside <AppProvider>')
  return context
}
