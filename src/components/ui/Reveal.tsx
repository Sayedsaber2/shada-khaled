import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { DURATION, EASE, VIEWPORT, VIEWPORT_TALL } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  <Reveal> — content starts hidden and animates in when scrolled into view.  */
/*                                                                            */
/*  <Reveal>…</Reveal>                       fade + rise (default)             */
/*  <Reveal variant="left" delay={0.1}>      slide in from the right           */
/*  <Reveal variant="clip">                  wipe from the bottom (images)     */
/*  <Reveal tall>                            for blocks taller than the screen */
/*                                                                            */
/*  Reduced motion is handled globally by <MotionConfig reducedMotion="user">: */
/*  transforms are skipped and only opacity fades.                             */
/* -------------------------------------------------------------------------- */

type RevealVariant = 'up' | 'fade' | 'left' | 'scale' | 'clip'

const variantsMap: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 32 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.reveal, ease: EASE.outExpo, delay },
    }),
  },
  fade: {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: { duration: 0.8, ease: EASE.soft, delay },
    }),
  },
  left: {
    hidden: { opacity: 0, x: 24 },
    visible: (delay: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: EASE.outExpo, delay },
    }),
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94, y: 24 },
    visible: (delay: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: DURATION.reveal, ease: EASE.outExpo, delay },
    }),
  },
  clip: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    visible: (delay: number) => ({
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: DURATION.hero, ease: EASE.inOutQuart, delay },
    }),
  },
}

const tags = {
  div: motion.div,
  span: motion.span,
  li: motion.li,
  article: motion.article,
  p: motion.p,
  figure: motion.figure,
  dl: motion.dl,
}

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  /** seconds */
  delay?: number
  as?: keyof typeof tags
  className?: string
  /** Use for blocks that can be taller than the viewport. */
  tall?: boolean
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  as = 'div',
  className,
  tall = false,
}: RevealProps) {
  const Tag = tags[as]
  const viewport = tall ? VIEWPORT_TALL : VIEWPORT

  if (variant === 'clip') {
    // An element that is fully hidden by its OWN clip-path is reported as "not in view" by the
    // browser, so it could never trigger its own reveal. The unclipped wrapper watches the
    // scroll position; the inner element inherits "hidden" / "visible" and does the wipe.
    return (
      <Tag className={className} initial="hidden" whileInView="visible" viewport={viewport}>
        <motion.div className="h-full w-full" variants={variantsMap.clip} custom={delay}>
          {children}
        </motion.div>
      </Tag>
    )
  }

  return (
    <Tag
      className={className}
      variants={variantsMap[variant]}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  <RevealGroup> + <RevealItem> — children appear one after another.          */
/*                                                                            */
/*  <RevealGroup className="grid …" stagger={0.08}>                            */
/*    <RevealItem>…</RevealItem>                                               */
/*    <RevealItem>…</RevealItem>                                               */
/*  </RevealGroup>                                                             */
/* -------------------------------------------------------------------------- */

interface RevealGroupProps {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: 'div' | 'ul' | 'ol' | 'dl'
  tall?: boolean
}

const groupTags = { div: motion.div, ul: motion.ul, ol: motion.ol, dl: motion.dl }

export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0.05,
  as = 'div',
  tall = false,
}: RevealGroupProps) {
  const Tag = groupTags[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={tall ? VIEWPORT_TALL : VIEWPORT}
    >
      {children}
    </Tag>
  )
}

interface RevealItemProps {
  children: ReactNode
  className?: string
  variant?: Exclude<RevealVariant, 'clip'>
  as?: 'div' | 'li' | 'span' | 'article'
}

const itemVariants: Record<Exclude<RevealVariant, 'clip'>, Variants> = {
  up: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE.outExpo } },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7, ease: EASE.soft } },
  },
  left: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE.outExpo } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE.outExpo } },
  },
}

/** Must be a direct or nested child of <RevealGroup>. */
export function RevealItem({ children, className, variant = 'up', as = 'div' }: RevealItemProps) {
  const Tag = tags[as]
  return (
    <Tag className={className} variants={itemVariants[variant]}>
      {children}
    </Tag>
  )
}
