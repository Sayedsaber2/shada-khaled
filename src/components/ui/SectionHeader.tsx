import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE, VIEWPORT } from '@/lib/motion'
import { cn } from '@/lib/cn'
import { MaskText } from './MaskText'
import { Reveal } from './Reveal'

/* -------------------------------------------------------------------------- */
/*  Every section opens the same way (editorial rule #2):                      */
/*                                                                            */
/*   01 — ABOUT ─────────────────────────────────── (optional right meta)      */
/*   ─────────────────────────────── hairline that draws from the left         */
/*   Big Fraunces title with one *italic* word                                 */
/*                                                                            */
/*  <SectionLabel> = the mono row + hairline.                                  */
/*  <SectionHeader> = label + title (+ optional lead paragraph).               */
/* -------------------------------------------------------------------------- */

interface SectionLabelProps {
  index: string
  label: string
  /** Small mono text on the right, e.g. "(3 projects)" */
  meta?: ReactNode
  className?: string
}

export function SectionLabel({ index, label, meta, className }: SectionLabelProps) {
  return (
    <div className={className}>
      <Reveal variant="fade" className="flex items-baseline justify-between gap-6 pb-4">
        <p className="label-mono text-caption">
          <span className="text-gold">{index}</span>
          <span aria-hidden="true"> — </span>
          {label}
        </p>
        {meta ? <p className="label-mono text-caption text-end">{meta}</p> : null}
      </Reveal>
      <motion.span
        aria-hidden="true"
        className="hairline origin-left"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.1, ease: EASE.outExpo }}
      />
    </div>
  )
}

interface SectionHeaderProps extends SectionLabelProps {
  /** Wrap one phrase in *asterisks* for the violet italic. */
  title: string
  /** id for aria-labelledby on the <section> */
  titleId?: string
  lead?: ReactNode
  titleClassName?: string
}

export function SectionHeader({
  index,
  label,
  meta,
  title,
  titleId,
  lead,
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <header className={cn('mb-[clamp(3rem,6vw,6rem)]', className)}>
      <SectionLabel index={index} label={label} meta={meta} />
      <MaskText
        as="h2"
        id={titleId}
        text={title}
        className={cn('mt-[clamp(1.5rem,3vw,3rem)] text-display-lg', titleClassName)}
      />
      {lead ? (
        <Reveal delay={0.15} className="mt-6 max-w-[46ch] text-body-lg text-muted">
          {lead}
        </Reveal>
      ) : null}
    </header>
  )
}
