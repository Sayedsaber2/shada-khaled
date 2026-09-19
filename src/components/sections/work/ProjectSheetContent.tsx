import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import type { Variants } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { ArrowLink } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import type { Project, ProjectSection } from '@/data/types'
import { publicUrl } from '@/lib/asset'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { ProjectCover } from './ProjectCover'

/* -------------------------------------------------------------------------- */
/*  The case study inside the project sheet.                                   */
/*                                                                            */
/*   ┌──────────────────────── banner (cover art) ─────────────────────────┐   */
/*   └─────────────────────────────────────────────────────────────────────┘   */
/*   ROLE   …          Project title                                           */
/*   YEAR   …          Summary                                                 */
/*   TYPE   …          ───────────────────────────────                         */
/*   TOOLS  …          OVERVIEW      paragraph                                 */
/*   (sticky on lg)    WHAT I DID    ◆ bullet  ◆ bullet                         */
/*                     If I redesigned it today · gallery · links (optional)   */
/*                                                                            */
/*  Every block uses the `blockRise` variant. The parent in ProjectSheet.tsx   */
/*  switches 'hidden' → 'visible' and staggers them, so the blocks rise one    */
/*  after another once the panel has landed.                                   */
/*  They are NOT scroll-triggered on purpose: the sheet has its own scroller,   */
/*  and nothing in it may stay hidden waiting for a scroll position.           */
/* -------------------------------------------------------------------------- */

const blockRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE.outExpo } },
}

interface ProjectSheetContentProps {
  project: Project
  /** id of the <h2> — the dialog points at it with aria-labelledby */
  titleId: string
}

export function ProjectSheetContent({ project, titleId }: ProjectSheetContentProps) {
  const retrospective = project.retrospective ?? []
  const gallery = project.gallery ?? []
  const links = project.links ?? []

  return (
    <div className="container-page pt-6 pb-[clamp(3rem,6vw,6rem)] lg:pt-10">
      {/* Banner: the same cover as the card, in its hi-fi state, drawing itself again */}
      <motion.div
        variants={blockRise}
        className="relative aspect-[16/10] overflow-hidden rounded-plate border border-line bg-surface-2 md:aspect-[21/9]"
      >
        <div className="absolute inset-0">
          <ProjectCover cover={project.cover} title={project.title} active />
        </div>
      </motion.div>

      {/*
        Reading order (and the order on phones): title → facts → case study.
        From lg the facts move into a rail on the start side (columns 1–4) that spans
        both rows and sticks while the text on the end side (columns 5–12) scrolls.
      */}
      <article className="grid-editorial mt-[clamp(2.5rem,5vw,5rem)] gap-y-10 lg:gap-y-14">
        <motion.header
          variants={blockRise}
          className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5 lg:row-start-1"
        >
          <h2 id={titleId} className="text-display-md">
            {project.title}
          </h2>
          <p className="mt-5 max-w-[58ch] text-body-lg text-muted">{project.summary}</p>
        </motion.header>

        {/* top-24 = the sheet's sticky top bar (56px) + breathing room */}
        <motion.div
          variants={blockRise}
          className="col-span-full min-w-0 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start lg:pe-[clamp(1rem,3vw,3rem)]"
        >
          <ProjectFacts project={project} />
        </motion.div>

        <div className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5 lg:row-start-2">
          {project.sections.map((section) => (
            <CaseStudySection key={section.heading} section={section} />
          ))}
          {/* Closes the list of sections, like the last rule of a table */}
          <span aria-hidden="true" className="hairline" />

          {retrospective.length > 0 ? (
            <motion.section variants={blockRise} className="mt-12 border-s-2 border-accent ps-6 lg:mt-16">
              <h3 className="text-h3">
                If I redesigned it <em className="emphasis">today</em>
              </h3>
              <DiamondList items={retrospective} className="mt-5" />
            </motion.section>
          ) : null}

          {gallery.length > 0 ? (
            <motion.ul
              variants={blockRise}
              role="list"
              aria-label="Project screens"
              className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16"
            >
              {gallery.map((src, index) => (
                <li key={src} className="overflow-hidden rounded-plate border border-line bg-surface-2">
                  <img
                    src={publicUrl(src)}
                    alt={`${project.title} — screen ${index + 1}`}
                    // Only hints for the browser's layout: the 4/3 frame sets the real size
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] h-auto w-full object-cover"
                  />
                </li>
              ))}
            </motion.ul>
          ) : null}

          {links.length > 0 ? (
            <motion.ul
              variants={blockRise}
              role="list"
              aria-label="Project links"
              className="mt-10 flex flex-wrap gap-x-8 gap-y-1 lg:mt-12"
            >
              {links.map((link) => (
                <li key={link.url}>
                  <ArrowLink
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-11"
                    icon={<ArrowUpRight size={16} strokeWidth={1.5} />}
                  >
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </ArrowLink>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </div>
      </article>
    </div>
  )
}

/* ---------------------------------- Facts --------------------------------- */

function ProjectFacts({ project }: { project: Project }) {
  return (
    <dl className="border-b border-line">
      <FactRow label="Role">{project.role}</FactRow>
      <FactRow label="Year">{project.year}</FactRow>
      <FactRow label="Type">{project.categories.join(', ')}</FactRow>

      {project.tools.length > 0 ? (
        <FactRow label="Tools">
          <ul role="list" className="flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <li key={tool}>
                <Chip>{tool}</Chip>
              </li>
            ))}
          </ul>
        </FactRow>
      ) : null}

      {project.badge ? (
        <FactRow label="Result">
          <Chip tone="gold">{project.badge}</Chip>
        </FactRow>
      ) : null}
    </dl>
  )
}

interface FactRowProps {
  label: string
  children: ReactNode
}

/** One fact: mono label on the start side, value on the end side, hairline above. */
function FactRow({ label, children }: FactRowProps) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 border-t border-line py-4">
      {/* pt-1: lines the small mono label up with the first line of the larger value */}
      <dt className="label-mono pt-1 text-caption">{label}</dt>
      <dd className="min-w-0 text-fg">{children}</dd>
    </div>
  )
}

/* -------------------------------- Sections -------------------------------- */

/** One chapter of the case study: gold mono heading, then a paragraph or a bullet list. */
function CaseStudySection({ section }: { section: ProjectSection }) {
  return (
    <motion.section
      variants={blockRise}
      className="grid gap-x-8 gap-y-3 border-t border-line py-8 md:grid-cols-[10rem_minmax(0,1fr)] lg:py-10"
    >
      {/* pt-1.5: puts the small heading on the first baseline of the larger body text */}
      <h3 className="label-mono text-gold md:pt-1.5">{section.heading}</h3>
      {Array.isArray(section.body) ? (
        <DiamondList items={section.body} />
      ) : (
        <p className="max-w-[62ch] text-body-lg">{section.body}</p>
      )}
    </motion.section>
  )
}

interface DiamondListProps {
  items: string[]
  className?: string
}

/** Bullet list with the site's diamond (a small square turned 45°) instead of a dot. */
function DiamondList({ items, className }: DiamondListProps) {
  return (
    <ul role="list" className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="relative max-w-[62ch] ps-6 text-body-lg">
          {/* top-[0.62em]: centres the diamond on the first line of text */}
          <span
            aria-hidden="true"
            className="absolute start-0 top-[0.62em] size-1.5 rotate-45 bg-accent-strong"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}
