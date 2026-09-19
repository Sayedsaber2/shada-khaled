import { Mail, Phone } from 'lucide-react'
import { BrandIcon } from '@/components/ui/BrandIcon'
import { socials } from '@/data/profile'
import type { SocialLink } from '@/data/types'

/**
 * Icon-only social links (the Contact section right above already shows them with full labels).
 * Renders nothing while `socials` in src/data/profile.ts is empty.
 */
export function FooterSocials() {
  if (socials.length === 0) return null

  return (
    <ul className="flex flex-wrap items-center">
      {socials.map((social) => (
        <li key={social.id}>
          <SocialIconLink social={social} />
        </li>
      ))}
    </ul>
  )
}

function SocialIconLink({ social }: { social: SocialLink }) {
  // mailto: and tel: open an app; only real web links need a new tab
  const opensNewTab = social.url.startsWith('http')

  return (
    <a
      href={social.url}
      aria-label={opensNewTab ? `${social.label} (opens in a new tab)` : social.label}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer' : undefined}
      // The link is 44px (comfortable touch target) while the visible ring is 36px — the same
      // recipe as <ThemeToggle>, so the whole row reads as one family of controls.
      // outline-offset-0: the focus ring hugs the 44px circle instead of floating far from the ring.
      className="group flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-offset-0"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line-control text-fg transition-colors duration-300 ease-soft group-hover:border-accent-strong group-hover:text-accent-strong">
        <SocialIcon id={social.id} />
      </span>
    </a>
  )
}

/** lucide-react has no brand logos, so brands come from <BrandIcon>. */
function SocialIcon({ id }: { id: SocialLink['id'] }) {
  if (id === 'email') return <Mail size={16} strokeWidth={1.5} aria-hidden="true" />
  if (id === 'phone') return <Phone size={16} strokeWidth={1.5} aria-hidden="true" />
  return <BrandIcon name={id} size={15} />
}
