import { motion } from 'motion/react'
import { DURATION, EASE, VIEWPORT } from '@/lib/motion'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  <MaskText> — the headline reveal: every word rises out of its own mask.    */
/*                                                                            */
/*  Wrap ONE phrase in *asterisks* to set it in the violet Fraunces italic:    */
/*    <MaskText as="h2" text="Selected *work*" className="text-display-lg" />  */
/*                                                                            */
/*  By default it plays when scrolled into view. Pass `animate` to drive it    */
/*  yourself (the hero waits for the preloader):                               */
/*    <MaskText text="Shada" animate={introDone ? 'visible' : 'hidden'} />     */
/* -------------------------------------------------------------------------- */

interface Word {
  text: string
  emphasis: boolean
}

function parse(text: string): Word[] {
  const words: Word[] = []
  // Split into emphasised (*…*) and normal segments, then into words
  for (const segment of text.split(/(\*[^*]+\*)/g)) {
    if (!segment) continue
    const emphasis = segment.startsWith('*') && segment.endsWith('*')
    const clean = emphasis ? segment.slice(1, -1) : segment
    for (const word of clean.split(/\s+/)) {
      if (word) words.push({ text: word, emphasis })
    }
  }
  return words
}

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span, div: motion.div }

interface MaskTextProps {
  text: string
  as?: keyof typeof tags
  className?: string
  /** Extra classes for the emphasised words (defaults to the violet italic). */
  emphasisClassName?: string
  /** seconds between words */
  stagger?: number
  delay?: number
  /** Control it manually instead of whileInView. */
  animate?: 'hidden' | 'visible'
  id?: string
}

export function MaskText({
  text,
  as = 'h2',
  className,
  emphasisClassName = 'emphasis',
  stagger = 0.06,
  delay = 0,
  animate,
  id,
}: MaskTextProps) {
  const Tag = tags[as]
  const words = parse(text)
  const plainText = text.replace(/\*/g, '')

  const controlProps =
    animate === undefined
      ? { initial: 'hidden', whileInView: 'visible', viewport: VIEWPORT }
      : { initial: 'hidden', animate }

  return (
    <Tag
      id={id}
      className={className}
      aria-label={plainText}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...controlProps}
    >
      {words.map((word, index) => (
        <span key={`${word.text}-${index}`} aria-hidden="true">
          {/* The mask. Extra bottom padding keeps descenders & italics from being clipped. */}
          <span className="-mx-[0.08em] -mb-[0.14em] inline-block overflow-hidden px-[0.08em] pb-[0.14em] align-bottom">
            <motion.span
              className={cn('inline-block origin-bottom-left', word.emphasis && emphasisClassName)}
              variants={{
                hidden: { y: '115%', rotate: 3 },
                visible: {
                  y: '0%',
                  rotate: 0,
                  transition: { duration: DURATION.hero, ease: EASE.outExpo },
                },
              }}
            >
              {word.text}
            </motion.span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
