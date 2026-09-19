import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Dark / light switch. Self-contained: it reads and flips the theme through useApp(),
 * so it can be dropped anywhere (navbar, mobile menu, footer).
 *
 * The <button> is 44px (comfortable touch target) while the visible ring is 36px.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useApp()
  const isDark = theme === 'dark'

  // The icon shows where the click takes you: a sun while it is dark, a moon while it is light
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      // outline-offset-0: the focus ring hugs the 44px circle instead of floating far from the 36px ring
      className={cn(
        'group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-offset-0',
        className,
      )}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-control text-fg transition-colors duration-300 ease-soft group-hover:border-accent-strong group-hover:text-accent-strong">
        {/* mode="wait": the old icon spins out completely before the new one spins in.
            initial={false}: no animation on first paint, only when the theme really changes. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            className="inline-flex"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE.outExpo }}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
