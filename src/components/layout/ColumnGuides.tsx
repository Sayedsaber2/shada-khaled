import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * Editorial column guides: four faint vertical hairlines aligned to the container.
 * Easter egg for designers — press "G" to toggle the full 12-column layout grid,
 * exactly like a design tool.
 */
export function ColumnGuides() {
  const [showGrid, setShowGrid] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'g' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))) return
      setShowGrid((current) => !current)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 hidden lg:block">
      <div className="container-page relative h-full">
        <div className="grid-editorial h-full">
          {Array.from({ length: 12 }, (_, column) => (
            <div
              key={column}
              className={cn(
                'h-full transition-colors duration-500',
                showGrid ? 'bg-accent-soft' : 'bg-transparent',
                // hairlines on the left edge of columns 1, 5, 9 …
                column % 4 === 0 && 'border-s border-(--guide-line)',
                // … and on the right edge of the last column
                column === 11 && 'border-e border-(--guide-line)',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
