import type { MouseEvent } from 'react'
import { motion } from 'motion/react'
import type { ProjectCategory } from '@/data/types'
import { cn } from '@/lib/cn'
import { SPRING } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  <FilterBar> — the category pills above the Work grid.                      */
/*                                                                            */
/*  They are toggle buttons (aria-pressed) inside a labelled group — not tabs, */
/*  because they filter ONE list instead of switching between panels.          */
/*  On phones the row scrolls sideways inside itself; the page never does.     */
/* -------------------------------------------------------------------------- */

export type ProjectFilter = 'All' | ProjectCategory

export interface FilterOption {
  value: ProjectFilter
  /** How many projects this filter shows — the small number next to the label. */
  count: number
}

interface FilterBarProps {
  options: FilterOption[]
  active: ProjectFilter
  onChange: (filter: ProjectFilter) => void
}

export function FilterBar({ options, active, onChange }: FilterBarProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>, filter: ProjectFilter) => {
    // On phones the chosen pill may be half outside the row: bring it fully into view.
    // 'nearest' means "move only if needed", so the page itself never jumps.
    event.currentTarget.scrollIntoView({ inline: 'nearest', block: 'nearest' })
    onChange(filter)
  }

  return (
    <div
      role="group"
      aria-label="Filter projects"
      // p-2 / -m-2: a scrolling box clips whatever pokes out of it. The padding leaves room
      // for the focus ring, the negative margin gives the space back so nothing shifts.
      // The two arbitrary classes hide the scrollbar (Firefox · Chrome and Safari).
      className="-m-2 flex snap-x snap-proximity scroll-px-2 gap-2 overflow-x-auto p-2 [scrollbar-width:none] md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {options.map((option) => (
        <FilterPill
          key={option.value}
          option={option}
          isActive={option.value === active}
          onClick={handleClick}
        />
      ))}
    </div>
  )
}

/* ---------------------------------- Pill ---------------------------------- */

interface FilterPillProps {
  option: FilterOption
  isActive: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>, filter: ProjectFilter) => void
}

function FilterPill({ option, isActive, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={(event) => onClick(event, option.value)}
      className={cn(
        'focus-corners relative h-11 shrink-0 snap-start rounded-full border border-line-control px-5 transition-colors duration-300 ease-soft',
        isActive ? 'text-bg' : 'text-muted hover:border-accent-strong hover:text-fg',
      )}
    >
      {/* ONE shared element (layoutId) that is rendered by whichever pill is active:
          Motion animates it from the old pill to the new one, so the fill slides across.
          -inset-px also covers the pill's 1px border. */}
      {isActive ? (
        <motion.span
          layoutId="filter-pill"
          aria-hidden="true"
          className="absolute -inset-px rounded-full bg-fg"
          transition={SPRING.ui}
        />
      ) : null}

      {/* `relative` lifts the text above the sliding fill */}
      <span className="relative flex items-start gap-1.5">
        <span className="text-[0.875rem] leading-5 font-medium whitespace-nowrap">{option.value}</span>
        <span aria-hidden="true" className="font-mono text-[0.625rem] leading-none tabular-nums">
          {option.count}
        </span>
        <span className="sr-only">
          , {option.count} {option.count === 1 ? 'project' : 'projects'}
        </span>
      </span>
    </button>
  )
}
