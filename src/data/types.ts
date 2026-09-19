/* -------------------------------------------------------------------------- */
/*  Shared content types. All site content lives in src/data/*.ts              */
/*  Rule: every OPTIONAL field hides its UI when it is empty — never fake it.  */
/* -------------------------------------------------------------------------- */

/** Categories used by the filter pills in the Work section. */
export type ProjectCategory = 'UI/UX Concept' | 'UI/UX Case Study' | 'Desktop App' | 'Database' | 'Graphic Design'

/**
 * Which generated cover to draw when a project has no image yet:
 *  route  → curved route + pins + gauge (services / maps / mobility)
 *  chart  → bars + rising line + dots   (analytics / dashboards)
 *  ledger → table rows + capsules       (data / management systems)
 *  phone  → phone wireframe             (mobile apps)
 *  browser→ browser wireframe           (websites / web apps)
 *  image  → use `src` (a real mockup inside /public)
 */
export type CoverKind = 'route' | 'chart' | 'ledger' | 'phone' | 'browser' | 'image'

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectSection {
  heading: string
  /** A paragraph, or a list of bullet points. */
  body: string | string[]
}

export interface Project {
  /** Unique slug, used in the URL hash: #work/<slug> */
  slug: string
  title: string
  /** Short context line, e.g. "InnovEgypt Graduation Project" */
  context: string
  year: string
  categories: ProjectCategory[]
  /** One sentence shown on the card. */
  summary: string
  /** What the owner personally did. */
  role: string
  tools: string[]
  cover: { kind: CoverKind; src?: string; alt?: string }
  /** Optional gold tag on the card, e.g. "Grade A · InnovEgypt" */
  badge?: string
  /** Shown first and wider in the grid. */
  featured?: boolean
  /** The case-study body shown in the project sheet. */
  sections: ProjectSection[]
  /**
   * Optional "If I redesigned it today" — an honest UX-lens critique in the owner's
   * own words (3 short bullets work best). Hidden while empty.
   */
  retrospective?: string[]
  /** Optional extra screenshots inside /public. */
  gallery?: string[]
  /** Optional external links: Behance, Figma prototype, GitHub, live demo… */
  links?: ProjectLink[]
}

export interface SkillRow {
  id: string
  index: string
  title: string
  skills: string[]
  /** Skills still being learned get a dashed chip. Must also appear in `skills`. */
  learning?: string[]
  /** Honest level tag — never a percentage. */
  levelLabel: string
  /** 1–3 filled dots */
  level: 1 | 2 | 3
}

export type JourneyType = 'Training' | 'Work' | 'Education' | 'Certificate'

export interface JourneyItem {
  id: string
  type: JourneyType
  /** Big year shown in the sticky rail while this item is active. */
  year: string
  period: string
  title: string
  organization: string
  location?: string
  current?: boolean
  bullets: string[]
  /** Optional highlighted line, e.g. what transfers to UX. */
  highlight?: string
  tags?: string[]
  /** Optional slug of a related project — adds a "See the project" link. */
  projectSlug?: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  year: string
  /** Words on the gold seal, e.g. "TOP PERFORMER" */
  seal: string
  description: string
  /** Optional link to the credential (file in /public/certificates or external URL). */
  credentialUrl?: string
}

export interface NavItem {
  id: string
  index: string
  label: string
}

export interface SocialLink {
  id: 'linkedin' | 'email' | 'phone' | 'whatsapp' | 'behance' | 'dribbble' | 'github'
  label: string
  url: string
  handle: string
}

export interface Fact {
  label: string
  value: string
  /** Shows the green "available" dot. */
  status?: boolean
}

export interface Figure {
  id: string
  /** Numbers count up on scroll; strings (e.g. "A", "’28") are mask-revealed. */
  value: number | string
  caption: string
}

export interface NowCard {
  id: string
  label: string
  text: string
}
