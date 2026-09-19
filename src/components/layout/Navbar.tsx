import { useCallback, useRef, useState } from 'react'
import type { FocusEvent } from 'react'
import { flushSync } from 'react-dom'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import type { Variants } from 'motion/react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'
import { Monogram } from '@/components/ui/Monogram'
import { TextRoll } from '@/components/ui/TextRoll'
import { navigation, profile } from '@/data/profile'
import type { NavItem } from '@/data/types'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useInViewFlag } from '@/hooks/useInViewFlag'
import { EASE, SPRING } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { BurgerButton, MobileMenu } from './MobileMenu'
import { ThemeToggle } from './ThemeToggle'

/** After this much scrolling (px) the bar has fully gained its frosted background. */
const SOLID_AFTER = 80
/** Scrolling DOWN beyond this point (px) tucks the bar away; any upward scroll brings it back. */
const HIDE_AFTER = 400

/** Every section the navbar tracks. Declared once out here so the array never changes identity. */
const SECTION_IDS = ['home', ...navigation.map((item) => item.id), 'contact']

const displayName = `${profile.firstName} ${profile.lastName}`

/** The bar waits above the screen during the preloader, then drops in after the hero text. */
const entrance: Variants = {
  waiting: { y: '-100%', opacity: 0 },
  landed: {
    y: '0%',
    opacity: 1,
    transition: { duration: 0.7, ease: EASE.outExpo, delay: 0.75 },
  },
}

export function Navbar() {
  const { introDone } = useApp()
  const reducedMotion = useReducedMotion()
  const activeId = useActiveSection(SECTION_IDS)

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolledAway, setScrolledAway] = useState(false)
  const [hasKeyboardFocus, setHasKeyboardFocus] = useState(false)

  // The "Let's talk" dot pulses with a CSS loop — this pauses it while the bar is tucked off-screen
  const barRef = useRef<HTMLDivElement>(null)
  useInViewFlag(barRef)

  const { scrollY } = useScroll()

  // Frosted background: we fade the OPACITY of a layer that is already blurred.
  // Animating backdrop-filter itself would repaint the blur on every frame.
  const backgroundOpacity = useTransform(scrollY, [0, SOLID_AFTER], [0, 1])

  // Hide on scroll down, show on scroll up. This runs on every scroll event, but React
  // skips the re-render unless the boolean really flips — so no per-frame rendering.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    // The browser restores the scroll position during the preloader; do not let that hide the bar
    if (!introDone) return
    const previous = scrollY.getPrevious() ?? 0
    const isScrollingDown = latest > previous
    setScrolledAway(isScrollingDown && latest > HIDE_AFTER)
  })

  // The bar never leaves while the menu is open, while someone is tabbing through it,
  // or for people who asked for reduced motion (it simply stays put).
  const isPinned = menuOpen || hasKeyboardFocus || reducedMotion === true
  const isTucked = scrolledAway && !isPinned

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = () => setMenuOpen((current) => !current)

  const handleLogoClick = () => {
    // Same reason as the menu links (explained in MobileMenu): the page must be unlocked
    // BEFORE SmoothScroll starts scrolling to #home, so the close is applied synchronously.
    if (menuOpen) flushSync(closeMenu)
  }

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    // Only keyboard focus counts. A mouse click on the theme toggle also focuses it,
    // and that must not pin the bar for the rest of the visit.
    if (event.target.matches(':focus-visible')) setHasKeyboardFocus(true)
  }

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    const focusStaysInside = event.currentTarget.contains(event.relatedTarget)
    if (!focusStaysInside) setHasKeyboardFocus(false)
  }

  return (
    <>
      <motion.header
        // layoutRoot: the header is position: fixed, so Motion must ignore page scroll
        // when it measures the gold dot travelling between links.
        layoutRoot
        variants={entrance}
        initial="waiting"
        animate={introDone ? 'landed' : 'waiting'}
        // Not reachable by keyboard / screen readers while the preloader covers the page
        inert={!introDone}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="fixed inset-x-0 top-0 z-40"
      >
        {/* A second wrapper for hide / show, so it never fights with the entrance above */}
        <motion.div
          ref={barRef}
          initial={false}
          animate={{ y: isTucked ? '-100%' : '0%' }}
          transition={{ duration: 0.4, ease: EASE.soft }}
          className="relative"
        >
          <motion.div
            aria-hidden="true"
            style={{ opacity: backgroundOpacity }}
            className="absolute inset-0 border-b border-line bg-(--nav-bg) backdrop-blur-[14px]"
          />

          {/* Gaps are tighter at lg than at xl: at 1024px the logo, six links and the pill
              only just fit on one line. */}
          <div className="container-page relative flex h-[60px] items-center justify-between gap-4 md:h-[72px] lg:gap-5 xl:gap-10">
            <a
              href="#home"
              onClick={handleLogoClick}
              aria-label={`${displayName} — home`}
              className="flex h-11 shrink-0 items-center gap-3 text-fg transition-colors duration-300 ease-soft hover:text-accent-strong"
            >
              <Monogram size={26} />
              <span className="hidden text-base font-[520] tracking-[-0.01em] xs:inline">
                {displayName}
              </span>
            </a>

            <nav aria-label="Primary" className="ms-auto hidden lg:block">
              <ul className="flex items-center gap-x-5 xl:gap-x-8">
                {navigation.map((item) => (
                  <li key={item.id}>
                    <NavLink item={item} active={item.id === activeId} />
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-1 lg:gap-2">
              <ThemeToggle />

              {/* max-lg:hidden (not `hidden lg:inline-flex`): the Button already sets
                  inline-flex, and a plain `hidden` would lose against it in the stylesheet.
                  ps-4 + the wrapper's ps-1 keep the pill's side paddings optically equal. */}
              <Button variant="ghost" size="md" href="#contact" className="ps-4 max-lg:hidden">
                {/* ps-1: room for the dot to pulse (it scales up) inside the TextRoll mask */}
                <span className="inline-flex items-center gap-2.5 ps-1">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-status"
                  />
                  Let’s talk
                </span>
              </Button>

              <BurgerButton open={menuOpen} onToggle={toggleMenu} />
            </div>
          </div>

        </motion.div>
      </motion.header>

      {/* Rendered beside the header, not inside it — see the note at the top of MobileMenu */}
      <MobileMenu open={menuOpen} onClose={closeMenu} activeId={activeId} />
    </>
  )
}

/* ------------------------------ Desktop link ------------------------------ */

interface NavLinkProps {
  item: NavItem
  active: boolean
}

function NavLink({ item, active }: NavLinkProps) {
  return (
    <a
      href={`#${item.id}`}
      aria-current={active ? 'true' : undefined}
      // `group` drives both hover effects: the index turns gold and <TextRoll> rolls the label
      className={cn(
        'group relative flex h-11 items-center gap-2 text-[0.875rem] transition-colors duration-300 ease-soft',
        active ? 'text-fg' : 'text-muted hover:text-fg',
      )}
    >
      <span
        aria-hidden="true"
        className="label-mono text-caption transition-colors duration-300 ease-soft group-hover:text-gold group-focus-visible:text-gold"
      >
        {item.index}
      </span>
      <TextRoll>{item.label}</TextRoll>

      {/* Only the active link renders the dot. Because every dot shares layoutId="nav-dot",
          Motion animates it from the previous link to this one instead of popping. */}
      {active ? (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-1 flex justify-center">
          <motion.span
            layoutId="nav-dot"
            transition={SPRING.ui}
            className="block h-1 w-1 rounded-full bg-gold"
          />
        </span>
      ) : null}
    </a>
  )
}
