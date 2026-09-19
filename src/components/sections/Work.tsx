import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { projectFilters, projects } from '@/data/projects'
import type { Project } from '@/data/types'
import { cn } from '@/lib/cn'
import { EASE, SPRING } from '@/lib/motion'
import { FilterBar } from './work/FilterBar'
import type { FilterOption, ProjectFilter } from './work/FilterBar'
import { ProjectCard } from './work/ProjectCard'
import { ProjectSheet } from './work/ProjectSheet'
import { SPAN_CLASSES, getCardSpan } from './work/gridLayout'
import { useProjectHash } from './work/useProjectHash'

/* -------------------------------------------------------------------------- */
/*  03 — SELECTED WORK                                                         */
/*                                                                            */
/*  Everything here is generated from src/data/projects.ts: add a project      */
/*  there and the card, the filter pills, the counters and the case-study      */
/*  sheet follow.                                                              */
/*                                                                            */
/*   work/FilterBar     the category pills                                     */
/*   work/gridLayout    which card is wide / narrow (the editorial rhythm)     */
/*   work/ProjectCard   one project: cover + title + summary                   */
/*   work/ProjectCover  the generated cover art (work/covers/*)                */
/*   work/ProjectSheet  the case study that slides up over the page            */
/*   work/useProjectHash keeps the open project in the URL (#work/<slug>)      */
/* -------------------------------------------------------------------------- */

/** Featured projects first, then the rest. Both groups keep the order of the data file. */
const orderedProjects: Project[] = [
  ...projects.filter((project) => project.featured),
  ...projects.filter((project) => !project.featured),
]

/** 1 → "01" */
function formatNumber(value: number): string {
  return String(value).padStart(2, '0')
}

/** A project keeps its number ("P/02") whatever the filter shows. */
const projectNumbers = new Map(
  orderedProjects.map((project, index) => [project.slug, formatNumber(index + 1)]),
)

function countProjects(filter: ProjectFilter): number {
  if (filter === 'All') return projects.length
  return projects.filter((project) => project.categories.includes(filter)).length
}

const filterOptions: FilterOption[] = projectFilters.map((filter) => ({
  value: filter,
  count: countProjects(filter),
}))

/** "All" plus a single category would filter nothing — the bar only appears from two categories. */
const showsFilterBar = filterOptions.length > 2

/** "(3 projects)" — the mono note on the end side of the section label. */
const HEADER_META = `(${projects.length} project${projects.length === 1 ? '' : 's'})`

function visibleProjects(filter: ProjectFilter): Project[] {
  return filter === 'All'
    ? orderedProjects
    : orderedProjects.filter((project) => project.categories.includes(filter))
}

/* ---------------------------- Card transitions ---------------------------- */

const ENTER_STAGGER = 0.05
/** Keeps the total wait short, however many cards come in at once. */
const MAX_ENTER_DELAY = 0.3
/** Reduced motion: filtering swaps the cards without any animation. */
const INSTANT = { duration: 0 }

export function Work() {
  const [filter, setFilter] = useState<ProjectFilter>('All')
  // Turns true with the first filter click and stays true — see `initial` on the cards below
  const [hasFiltered, setHasFiltered] = useState(false)
  const { openSlug, openProject, switchProject, closeProject } = useProjectHash()
  const reducedMotion = useReducedMotion() === true

  const isFiltered = filter !== 'All'
  const shownProjects = visibleProjects(filter)

  const handleFilterChange = (nextFilter: ProjectFilter) => {
    if (nextFilter === filter) return
    setFilter(nextFilter)
    setHasFiltered(true)
  }

  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          index="03"
          label="Selected Work"
          title="Selected *work*"
          titleId="work-title"
          meta={HEADER_META}
          lead="Academic and training projects so far — each one built with care."
        />

        {showsFilterBar ? (
          <Reveal className="mb-[clamp(2.5rem,5vw,4.5rem)]">
            <FilterBar options={filterOptions} active={filter} onChange={handleFilterChange} />
          </Reveal>
        ) : null}

        {/* Tells screen-reader users what a filter click just did */}
        <p role="status" className="sr-only">
          Showing {shownProjects.length} {shownProjects.length === 1 ? 'project' : 'projects'}
          {isFiltered ? ` in ${filter}` : ''}
        </p>

        {/* LayoutGroup: when one card leaves, the others know they have to re-flow together */}
        <LayoutGroup>
          {/* `relative`: popLayout pins a leaving card in place with position: absolute,
              and it needs this grid as its reference box */}
          <div className="grid-editorial relative gap-y-[clamp(3rem,6vw,6rem)]">
            {/* popLayout: a leaving card is taken out of the flow at once, so the cards
                that stay can glide to their new place WHILE it fades out */}
            <AnimatePresence mode="popLayout">
              {shownProjects.map((project, position) => {
                const span = getCardSpan(position, shownProjects.length, isFiltered)
                const enterDelay = Math.min(position * ENTER_STAGGER, MAX_ENTER_DELAY)

                return (
                  <motion.article
                    key={project.slug}
                    // "position": only the MOVE is animated. Animating the size too would
                    // stretch the text and the cover art while a card changes its span.
                    layout="position"
                    className={cn('min-w-0', SPAN_CLASSES[span])}
                    // First page load: no entrance here — the scroll reveals inside the card
                    // do that job. Cards that (re)appear after a filter click rise in.
                    initial={hasFiltered ? { opacity: 0, y: 24 } : false}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: reducedMotion
                        ? INSTANT
                        : { duration: 0.5, ease: EASE.outExpo, delay: enterDelay },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      transition: reducedMotion ? INSTANT : { duration: 0.3, ease: EASE.soft },
                    }}
                    transition={{ layout: reducedMotion ? INSTANT : SPRING.layout }}
                  >
                    <ProjectCard
                      project={project}
                      number={projectNumbers.get(project.slug) ?? ''}
                      span={span}
                      revealOnScroll={!hasFiltered}
                      onOpen={openProject}
                    />
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>

      <ProjectSheet
        projects={orderedProjects}
        openSlug={openSlug}
        onClose={closeProject}
        onSwitch={switchProject}
      />
    </section>
  )
}
