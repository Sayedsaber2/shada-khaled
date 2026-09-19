import { publicUrl } from '@/lib/asset'
import type { Fact, Figure, NavItem, NowCard, SocialLink } from './types'

/* -------------------------------------------------------------------------- */
/*  Personal info — edit this file to change any text about the owner.         */
/* -------------------------------------------------------------------------- */

export const profile = {
  firstName: 'Shada',
  lastName: 'Khaled',
  fullName: 'Shada Khaled Ebrahim',
  role: 'UI/UX Designer',
  /** Mono line above the name in the hero */
  eyebrow: 'UI/UX Designer in training — DEPI · Giza, Egypt',
  /** Hero statement (max ~40 characters per line reads best) */
  statement:
    'I design calm, clear interfaces — with the precision I learned in three years of laser-cut production and vector work.',
  location: 'Giza, Egypt',
  availability: 'Open to internships & junior UI/UX roles',
  /** Words around the rotating hero badge. Keep the trailing " · ". */
  badgeText: 'OPEN TO INTERNSHIPS · UI/UX · 2026 · ',
  email: 'shadakhaled07@gmail.com',
  phone: '+201115530374',
  phoneDisplay: '0111 553 0374',
  linkedin: 'https://www.linkedin.com/in/shada-khaled',

  /** Photo: public/images/profile.jpg — replace it with a high-res version any time. */
  photo: publicUrl('/images/profile.jpg'),
  photoAlt: 'Portrait of Shada Khaled in a blue hijab, city lights glowing behind at night',
  /** Focus point so the face stays visible inside the arch crop ("x% y%"). */
  photoPosition: '74% 30%',
  /**
   * 'dark'  = night photo → bottom fade into the page + glowing bokeh orbs
   * 'light' = daylight photo → no fade, softer orbs
   */
  portraitTone: 'dark' as 'dark' | 'light',
  photoCaption: 'Fig. 01 — Giza by night',

  cvUrl: publicUrl('/cv/Shada_Khaled_CV.pdf'),
  cvFileName: 'Shada_Khaled_CV.pdf',

  /**
   * The About manifesto. It is revealed word by word while scrolling.
   * Wrap ONE word in *asterisks* — it turns into the violet italic.
   */
  manifesto:
    'For three years I turned vectors into physical objects, where a misplaced anchor point means wasted material. Now I’m bringing that same care to screens — learning to research, structure and design interfaces that feel *obvious* to the people using them.',

  /** Two short columns under the manifesto */
  story: [
    {
      title: 'From the workshop',
      text: 'Three years as a laser cutting specialist and graphic designer: preparing production-ready vector files in Adobe Illustrator, working to tight tolerances, and turning briefs into personalised products with real attention to detail.',
    },
    {
      title: 'To the screen',
      text: 'Now training in the DEPI UI/UX track while studying Management Information Systems. A programming foundation — Java, C++, OOP, databases — keeps my designs realistic to build and lets me speak the same language as developers.',
    },
  ],
} as const

/** Fact sheet in the About section (definition list). */
export const facts: Fact[] = [
  { label: 'Name', value: 'Shada Khaled Ebrahim' },
  { label: 'Based', value: 'Giza, Egypt' },
  { label: 'Training', value: 'DEPI — UI/UX Design Track' },
  { label: 'Studying', value: 'MIS — Higher Institute for Advanced Studies, El Haram (’28)' },
  { label: 'Background', value: '3 yrs Laser Cutting & Graphic Design' },
  { label: 'Status', value: 'Open to internships & junior roles', status: true },
]

/** Four TRUE figures. Numbers count up; strings are revealed. */
export const figures: Figure[] = [
  { id: 'years', value: 3, caption: 'Years in production design' },
  { id: 'projects', value: 3, caption: 'Projects delivered so far' },
  { id: 'grade', value: 'A', caption: 'InnovEgypt project grade' },
  { id: 'graduation', value: '’28', caption: 'MIS graduation' },
]

/** The "Now" strip — what is happening at the moment. Update it every month or two. */
export const now = {
  updated: 'September 2026',
  cards: [
    {
      id: 'learning',
      label: 'Learning',
      text: 'The full UX process at DEPI — research, user flows, wireframes and prototyping.',
    },
    {
      id: 'building',
      label: 'Building',
      text: 'My first end-to-end UI/UX case studies, to be published right here.',
    },
    {
      id: 'looking',
      label: 'Looking for',
      text: 'A UI/UX internship or junior role where I can learn from a real product team.',
    },
  ] satisfies NowCard[],
}

/** Small strip under the hero */
export const heroStrip = [
  { label: 'Based in', value: 'Giza, EG' },
  { label: 'Training', value: 'DEPI UI/UX Track' },
  { label: 'Studying', value: 'MIS, Class of 2028' },
]

/** Section ids MUST match the `id` attribute of each <section>. */
export const navigation: NavItem[] = [
  { id: 'about', index: '01', label: 'About' },
  { id: 'toolkit', index: '02', label: 'Toolkit' },
  { id: 'work', index: '03', label: 'Work' },
  { id: 'path', index: '04', label: 'Path' },
  { id: 'credentials', index: '05', label: 'Credentials' },
]

export const socials: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/shada-khaled',
    handle: 'in/shada-khaled',
  },
  {
    id: 'email',
    label: 'Email',
    url: 'mailto:shadakhaled07@gmail.com',
    handle: 'shadakhaled07@gmail.com',
  },
  {
    id: 'phone',
    label: 'Phone',
    url: 'tel:+201115530374',
    handle: '0111 553 0374',
  },
  // Add more when the accounts are ready — they appear automatically:
  // { id: 'behance', label: 'Behance', url: 'https://www.behance.net/USERNAME', handle: 'USERNAME' },
  // { id: 'dribbble', label: 'Dribbble', url: 'https://dribbble.com/USERNAME', handle: 'USERNAME' },
]
