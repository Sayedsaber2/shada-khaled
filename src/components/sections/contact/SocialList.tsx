import { motion } from 'motion/react'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { RevealItem } from '@/components/ui/Reveal'
import { profile, socials } from '@/data/profile'
import type { SocialLink } from '@/data/types'
import { cn } from '@/lib/cn'
import { VIEWPORT, staggerParent } from '@/lib/motion'

/* -------------------------------------------------------------------------- */
/*  The "elsewhere" table: one 56px row per entry in `socials`                 */
/*  (src/data/profile.ts), separated by hairlines, plus a last row that is     */
/*  not a link: the location.                                                  */
/*                                                                            */
/*   ─────────────────────────────────────────────                             */
/*   [icon]  LinkedIn                 in/shada-khaled  ↗                       */
/*   ─────────────────────────────────────────────                             */
/*                                                                            */
/*  Colours are fixed (not theme tokens): the Contact panel is always dark.    */
/* -------------------------------------------------------------------------- */

/** The rows rise one after another. 4 rows × 0.07s stays well under the 0.5s budget. */
const rowsStagger = staggerParent(0.07)

const ROW_CLASSES = 'flex min-h-14 items-center gap-4 py-3'
const ROW_BORDER = 'border-b border-white/16'
const HANDLE_CLASSES = 'min-w-0 flex-1 truncate text-end font-mono text-[0.8125rem] text-violet-50/80'

interface SocialListProps {
  className?: string
}

export function SocialList({ className }: SocialListProps) {
  return (
    <motion.ul
      // role="list": Safari drops list semantics when list-style is none
      role="list"
      aria-label="Contact links"
      className={cn('border-t border-white/16', className)}
      variants={rowsStagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {socials.map((social) => (
        <RevealItem as="li" key={social.id} className={ROW_BORDER}>
          <SocialRow social={social} />
        </RevealItem>
      ))}

      {profile.location ? (
        <RevealItem as="li" className={cn(ROW_CLASSES, ROW_BORDER)}>
          <MapPin aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0" />
          <span className="shrink-0 font-medium">Based in</span>
          <span className={HANDLE_CLASSES}>{profile.location}</span>
          {/* Empty slot as wide as the arrow of the link rows, so the mono column lines up */}
          <span aria-hidden="true" className="w-4.5 shrink-0" />
        </RevealItem>
      ) : null}
    </motion.ul>
  )
}

/* ---------------------------------- Row ----------------------------------- */

function SocialRow({ social }: { social: SocialLink }) {
  // Web links open in a new tab; mailto: and tel: must stay in this tab to open their app
  const opensNewTab = social.url.startsWith('http')

  return (
    <a
      href={social.url}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer' : undefined}
      className={cn('group relative isolate', ROW_CLASSES)}
    >
      {/*
        Hover fill: a white 8% veil that sweeps in from the start edge (scale only — cheap).
        The negative inset makes it a little wider than the row, so the text never touches
        its edge; it still stays inside the panel's padding.
      */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 origin-left scale-x-0 bg-white/8 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 rtl:origin-right"
      />

      <SocialIcon id={social.id} />
      <span className="shrink-0 font-medium">{social.label}</span>
      <span className={HANDLE_CLASSES}>{social.handle}</span>
      <ArrowUpRight
        aria-hidden="true"
        size={18}
        strokeWidth={1.5}
        className="shrink-0 transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
      />
      {opensNewTab ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  )
}

/** lucide has no brand logos: email / phone come from lucide, the rest from <BrandIcon>. */
function SocialIcon({ id }: { id: SocialLink['id'] }) {
  if (id === 'email') {
    return <Mail aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0" />
  }
  if (id === 'phone') {
    return <Phone aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0" />
  }
  // Brand logos are solid shapes, so they look heavier than line icons: draw them a bit smaller
  return <BrandIcon name={id} size={18} className="mx-px shrink-0" />
}
