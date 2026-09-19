import { navigation } from '@/data/profile'
import type { NavItem } from '@/data/types'
import { cn } from '@/lib/cn'

/** The section links plus Contact — the same list (and numbering) the mobile menu shows. */
const footerLinks: NavItem[] = [
  ...navigation,
  { id: 'contact', index: String(navigation.length + 1).padStart(2, '0'), label: 'Contact' },
]

const LINK_COLUMNS = 2
const rowsPerColumn = Math.ceil(footerLinks.length / LINK_COLUMNS)

/**
 * `link-underline` only reacts while the pointer is on the element that carries it (the label).
 * These classes replay its hover state whenever the WHOLE link (`group`) is hovered or focused,
 * so the line also draws while the pointer rests on the index number.
 */
const underlineOnLinkHover = cn(
  'group-hover:after:origin-left group-hover:after:[transform:scaleX(1)]',
  'group-focus-visible:after:origin-left group-focus-visible:after:[transform:scaleX(1)]',
)

export function FooterNav() {
  return (
    <nav aria-label="Footer">
      {/* grid-flow-col + a fixed number of rows: column 1 fills from top to bottom first
          (01–04), then column 2 — so the reading order matches the Tab order.
          The gap equals the page grid's column gap, which keeps both link columns sitting
          on the lines of the 12-column grid. */}
      <ul
        className="grid grid-flow-col grid-cols-2 gap-x-[clamp(1rem,2vw,2rem)]"
        style={{ gridTemplateRows: `repeat(${rowsPerColumn}, auto)` }}
      >
        {footerLinks.map((item) => (
          // flex: the link keeps the width of its text instead of stretching across the column
          <li key={item.id} className="flex min-w-0">
            <FooterLink item={item} />
          </li>
        ))}
      </ul>
    </nav>
  )
}

function FooterLink({ item }: { item: NavItem }) {
  return (
    <a
      href={`#${item.id}`}
      // min-h-11: a text link still needs a 44px touch target
      className="group inline-flex min-h-11 min-w-0 items-center gap-3 text-[0.9375rem] text-muted transition-colors duration-300 ease-soft hover:text-fg"
    >
      <span
        aria-hidden="true"
        className="label-mono text-caption transition-colors duration-300 ease-soft group-hover:text-gold group-focus-visible:text-gold"
      >
        {item.index}
      </span>
      {/* The underline lives on the label, so it hugs the word and not the taller 44px link box */}
      <span className={cn('link-underline', underlineOnLinkHover)}>{item.label}</span>
    </a>
  )
}
