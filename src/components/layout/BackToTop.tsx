import { ArrowUp } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Magnetic } from '@/components/ui/Magnetic'
import { cn } from '@/lib/cn'

/** The first <section> of the page. It receives the keyboard focus after the jump. */
const TOP_SECTION_ID = 'home'

/** Both arrows share this transition, so they always travel together like one strip of film. */
const arrowSlide = 'transition-transform duration-[350ms] ease-out-expo'

/**
 * The 48px round "Back to top" button in the footer.
 * <Magnetic> pulls it towards the cursor (real mouse only, never under reduced motion).
 */
export function BackToTop({ className }: { className?: string }) {
  const { scrollTo } = useApp()

  const handleClick = () => {
    scrollTo(0)

    // Take the keyboard focus along (the same trick SmoothScroll uses for anchor links).
    // Without it the focus stays down here, and the next Tab press would pull the page
    // straight back to the footer.
    const topSection = document.getElementById(TOP_SECTION_ID)
    if (!topSection) return
    topSection.setAttribute('tabindex', '-1')
    topSection.focus({ preventScroll: true })
  }

  return (
    <Magnetic className={className}>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Back to top"
        // `group`: hovering or focusing the button drives the two arrows inside it
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-line-control text-fg transition-[border-color,color,scale] duration-300 ease-soft hover:border-accent-strong hover:text-accent-strong active:scale-95"
      >
        {/* The mask: exactly one icon tall, so only one of the two arrows is visible at a time.
            On hover the first arrow leaves through the top while its copy, parked right below
            the mask, rises into place — a vertical <TextRoll>, for an icon instead of a label. */}
        <span aria-hidden="true" className="relative block h-5 w-5 overflow-hidden">
          <ArrowUp
            size={20}
            strokeWidth={1.5}
            className={cn(
              'block',
              arrowSlide,
              'group-hover:-translate-y-full group-focus-visible:-translate-y-full',
            )}
          />
          <ArrowUp
            size={20}
            strokeWidth={1.5}
            className={cn(
              'absolute inset-0 translate-y-full',
              arrowSlide,
              'group-hover:translate-y-0 group-focus-visible:translate-y-0',
            )}
          />
        </span>
      </button>
    </Magnetic>
  )
}
