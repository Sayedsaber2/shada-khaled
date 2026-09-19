import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { flushSync } from 'react-dom'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { Mail, Phone } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { navigation, profile, socials } from '@/data/profile'
import type { NavItem, SocialLink } from '@/data/types'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { EASE, fadeIn, maskRise } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { ThemeToggle } from './ThemeToggle'

/* -------------------------------------------------------------------------- */
/*  Mobile menu (below the `lg` breakpoint).                                   */
/*                                                                            */
/*  <BurgerButton> lives inside the navbar bar.                                */
/*  <MobileMenu>   is the full-screen panel. It is rendered NEXT TO the header */
/*                 (not inside it): the header is moved with `transform`, and  */
/*                 a transformed parent would trap a `position: fixed` child   */
/*                 inside its own 72px box.                                    */
/* -------------------------------------------------------------------------- */

/** Links the burger (aria-controls) to the panel (id). */
const MENU_ID = 'mobile-menu'

/** Tailwind's `lg` breakpoint — from here up the desktop navigation takes over. */
const DESKTOP_QUERY = '(min-width: 64rem)'

/** The section links plus Contact, which the desktop bar shows as the "Let's talk" pill instead. */
const menuItems: NavItem[] = [
  ...navigation,
  { id: 'contact', index: String(navigation.length + 1).padStart(2, '0'), label: 'Contact' },
]

/* ------------------------------ Burger button ----------------------------- */

interface BurgerButtonProps {
  open: boolean
  onToggle: () => void
}

const burgerLine = 'block h-px w-full bg-fg transition-transform duration-500 ease-out-expo'

export function BurgerButton({ open, onToggle }: BurgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={MENU_ID}
      aria-label={open ? 'Close menu' : 'Open menu'}
      // -me-2.5: the 24px lines sit inside a 44px touch target; the negative margin lines
      // them up with the page edge instead of leaving a 10px dent.
      className="-me-2.5 flex h-11 w-11 shrink-0 items-center justify-center lg:hidden"
    >
      {/* The lines are 8px apart (1px + 7px gap). To form the X each one travels 4px to
          the middle and turns 45°. Only transforms change, so the morph stays smooth. */}
      <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
        <span className={cn(burgerLine, open && 'translate-y-1 rotate-45')} />
        <span className={cn(burgerLine, open && '-translate-y-1 -rotate-45')} />
      </span>
    </button>
  )
}

/* --------------------------------- Variants ------------------------------- */

const PANEL_SECONDS = 0.7

/**
 * The panel is a curtain dropping from the top edge; closing plays it in reverse.
 * The exit state is called `exit` (not `hidden`) on purpose: the links only know
 * `hidden` / `visible`, so they stay put while the curtain lifts.
 */
const slidePanel: Variants = {
  hidden: { y: '-100%' },
  visible: {
    y: '0%',
    transition: {
      duration: PANEL_SECONDS,
      ease: EASE.inOutQuart,
      // The links wait until the curtain has (almost) landed, then rise one by one
      delayChildren: 0.5,
      staggerChildren: 0.06,
    },
  },
  exit: { y: '-100%', transition: { duration: PANEL_SECONDS, ease: EASE.inOutQuart } },
}

/** Reduced motion: no travelling curtain — a short fade instead. */
const fadePanel: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

/* ---------------------------------- Menu ---------------------------------- */

interface MobileMenuProps {
  open: boolean
  /** Must be a stable function (useCallback): the focus trap re-runs when it changes. */
  onClose: () => void
  /** id of the section currently on screen — highlights the matching link. */
  activeId: string
}

export function MobileMenu({ open, onClose, activeId }: MobileMenuProps) {
  const { lockScroll, unlockScroll } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)

  // Freeze the page behind the menu. The cleanup runs when `open` turns false (or on
  // unmount), so every lockScroll() is paired with exactly one unlockScroll().
  useEffect(() => {
    if (!open) return
    lockScroll()
    return () => unlockScroll()
  }, [open, lockScroll, unlockScroll])

  // Rotating a tablet / widening the window brings the desktop nav back: close the menu,
  // otherwise the page would stay locked behind a panel nobody can see.
  useEffect(() => {
    if (open && isDesktop) onClose()
  }, [open, isDesktop, onClose])

  // Tab stays inside the panel, Esc closes, focus returns to the burger afterwards
  useFocusTrap(panelRef, open, onClose)

  // A menu link does two things: close the menu, then scroll to its section (SmoothScroll
  // listens for clicks on <a href="#…"> at document level, which runs AFTER this handler).
  // Lenis ignores scroll requests while the page is locked, so the close has to be applied
  // right now: flushSync makes React re-render and run the unlock cleanup above before
  // this function returns. We do not call preventDefault, so the anchor then works as usual.
  const handleNavigate = () => {
    flushSync(onClose)
  }

  return (
    <AnimatePresence>
      {open ? (
        <MenuPanel
          key="mobile-menu"
          panelRef={panelRef}
          activeId={activeId}
          onNavigate={handleNavigate}
          onClose={onClose}
        />
      ) : null}
    </AnimatePresence>
  )
}

/* ---------------------------------- Panel --------------------------------- */

interface MenuPanelProps {
  panelRef: RefObject<HTMLDivElement | null>
  activeId: string
  onNavigate: () => void
  onClose: () => void
}

function MenuPanel({ panelRef, activeId, onNavigate, onClose }: MenuPanelProps) {
  const reducedMotion = useReducedMotion()
  // false while the exit animation plays: the panel is still in the DOM, but must not be usable
  const isPresent = useIsPresent()

  return (
    <motion.div
      ref={panelRef}
      id={MENU_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      inert={!isPresent}
      // Lets the panel scroll natively on short screens (Lenis would swallow the wheel otherwise)
      data-lenis-prevent
      variants={reducedMotion ? fadePanel : slidePanel}
      initial="hidden"
      animate="visible"
      exit="exit"
      // z-30: above the page, just under the navbar (z-40) so the burger stays clickable
      className="fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-bg lg:hidden"
    >
      {/* Top padding = height of the navbar bar that floats above the panel */}
      <div className="container-page flex min-h-full flex-col pt-[60px] md:pt-[72px]">
        <nav aria-label="Primary" className="flex flex-1 flex-col justify-center py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <MenuLink item={item} active={item.id === activeId} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          variants={fadeIn}
          // The bottom padding grows on phones with a home indicator (iOS safe area)
          className="border-t border-line pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <p className="label-mono text-caption">Get in touch</p>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 max-w-full items-center text-body-lg text-fg wrap-anywhere transition-colors duration-300 ease-soft hover:text-accent-strong"
          >
            <span className="link-underline link-underline-on">{profile.email}</span>
          </a>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {socials.length > 0 ? (
              // -ms-1: optically aligns the 36px rings (inside 44px targets) with the text above
              <ul className="-ms-1 flex flex-wrap items-center">
                {socials.map((social) => (
                  <li key={social.id}>
                    <SocialIconLink social={social} />
                  </li>
                ))}
              </ul>
            ) : null}

            {/* The burger sits outside this modal dialog, so screen-reader and keyboard users
                get their own way out. It stays visually hidden until it receives keyboard focus. */}
            <button
              type="button"
              onClick={onClose}
              className="label-mono sr-only text-fg focus-visible:not-sr-only focus-visible:min-h-11 focus-visible:px-2"
            >
              Close menu
            </button>

            <ThemeToggle className="-me-1 ms-auto" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ---------------------------------- Links --------------------------------- */

interface MenuLinkProps {
  item: NavItem
  active: boolean
  onNavigate: () => void
}

function MenuLink({ item, active, onNavigate }: MenuLinkProps) {
  return (
    <a
      href={`#${item.id}`}
      onClick={onNavigate}
      aria-current={active ? 'true' : undefined}
      // Font size follows the screen WIDTH (9vw) but is capped by the screen HEIGHT (5svh),
      // so all seven links plus the contact block fit a short phone (360×640: 2rem) without
      // scrolling. With py-2 every row stays taller than the 44px touch minimum.
      className={cn(
        'group block py-2 text-[length:clamp(1.75rem,min(9vw,5svh),3.5rem)] leading-[1.1] transition-colors duration-300 ease-soft',
        active ? 'text-accent-strong' : 'text-fg hover:text-accent-strong',
      )}
    >
      {/* The mask: the row waits below this clipped box and rises into it. The mask is
          inside the <a> (not around it) so the focus ring is never cut off. The small
          bottom padding keeps descenders (g, p, y) from being clipped. */}
      <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
        <motion.span variants={maskRise} className="flex origin-bottom-left items-baseline gap-4">
          <span
            aria-hidden="true"
            className={cn(
              'label-mono w-7 shrink-0 transition-colors duration-300 ease-soft',
              active ? 'text-gold' : 'text-caption group-hover:text-gold',
            )}
          >
            {item.index}
          </span>
          <span className={cn('font-display-soft min-w-0 tracking-[-0.02em]', active && 'italic')}>
            {item.label}
          </span>
        </motion.span>
      </span>
    </a>
  )
}

function SocialIconLink({ social }: { social: SocialLink }) {
  // mailto: and tel: open an app; only real web links need a new tab
  const opensNewTab = social.url.startsWith('http')

  return (
    <a
      href={social.url}
      aria-label={opensNewTab ? `${social.label} (opens in a new tab)` : social.label}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer' : undefined}
      className="group flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-offset-0"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line-control text-fg transition-colors duration-300 ease-soft group-hover:border-accent-strong group-hover:text-accent-strong">
        <SocialIcon id={social.id} />
      </span>
    </a>
  )
}

/** lucide-react has no brand logos, so brands come from <BrandIcon>. */
function SocialIcon({ id }: { id: SocialLink['id'] }) {
  if (id === 'email') return <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
  if (id === 'phone') return <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
  return <BrandIcon name={id} size={15} />
}
