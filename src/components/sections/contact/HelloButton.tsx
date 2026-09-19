import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'
import { DURATION, EASE, VIEWPORT } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  "Say hello" — the last call to action of the site.                         */
/*  A single, plain pill button — the same shape on every screen size.         */
/*  Opens the visitor's mail app with a friendly subject line already filled.  */
/* -------------------------------------------------------------------------- */

const helloHref = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello ${profile.firstName}`)}`

const growIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE.outExpo },
  },
}

interface HelloButtonProps {
  className?: string
}

export function HelloButton({ className }: HelloButtonProps) {
  return (
    <motion.div
      variants={growIn}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={cn('w-full sm:w-auto', className)}
    >
      <a
        href={helloHref}
        // bg-paper / text-ink are the raw, theme-independent colours: this panel is
        // dark in both themes, so this button always stays a light pill.
        className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-paper px-8 font-semibold tracking-[-0.005em] text-ink transition-colors duration-300 ease-soft select-none hover:bg-white sm:w-auto"
      >
        Say hello
        <ArrowUpRight
          aria-hidden="true"
          strokeWidth={1.5}
          className="size-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </motion.div>
  )
}
