import type { Certificate, JourneyItem } from './types'

/* -------------------------------------------------------------------------- */
/*  Path: experience + education timeline (newest first)                       */
/* -------------------------------------------------------------------------- */

export const journey: JourneyItem[] = [
  {
    id: 'depi',
    type: 'Training',
    year: '2026',
    period: '2026 — Present',
    title: 'UI/UX Design Trainee',
    organization: 'DEPI — Digital Egypt Pioneers Initiative',
    location: 'Egypt',
    current: true,
    bullets: [
      'Hands-on scholarship by the Ministry of Communications & Information Technology, focused on practical UI/UX design.',
      'Learning the full design process: research, wireframing, UI design and prototyping.',
    ],
    tags: ['UI/UX', 'Design Thinking', 'Prototyping'],
  },
  {
    id: 'innovegypt',
    type: 'Training',
    year: '2026',
    period: '2026',
    title: 'InnovEgypt Program — Grade A',
    organization: 'TIEC & ITIDA · in collaboration with iSpark',
    bullets: [
      'Tech-entrepreneurship and innovation program with hands-on training in building tech solutions.',
      'Graduation project: Car Service & Maintenance Platform — awarded Grade A.',
    ],
    tags: ['Innovation', 'Entrepreneurship', 'Teamwork'],
    projectSlug: 'car-service-platform',
  },
  {
    id: 'route',
    type: 'Certificate',
    year: '2026',
    period: '2026',
    title: 'Computer Science Fundamentals Diploma',
    organization: 'Route Academy',
    bullets: [
      'Recognised as a “Top Performer” in programming fundamentals and core computer science concepts.',
    ],
    tags: ['Programming Fundamentals', 'Computer Science'],
  },
  {
    id: 'laser-graphic',
    type: 'Work',
    year: '2023',
    period: '2023 — Present',
    title: 'Laser Cutting Specialist & Graphic Designer',
    organization: 'Custom products & models production',
    location: 'Giza, Egypt',
    current: true,
    bullets: [
      'Operate laser cutting machines for precise cutting and production of customised items and models.',
      'Prepare, structure and edit vector design files in Adobe Illustrator for clean, production-ready execution.',
      'Create personalised products with strong attention to minute details and high quality standards.',
    ],
    highlight: 'What transfers to UX: precision, iteration, and turning a brief into something people actually use.',
    tags: ['Adobe Illustrator', 'Vector Design', 'Production'],
  },
  {
    id: 'mis',
    type: 'Education',
    year: '2028',
    period: 'Expected 2028',
    title: 'Management Information Systems (MIS)',
    organization: 'Higher Institute for Advanced Studies — El Haram',
    location: 'Giza, Egypt',
    bullets: [
      'Consistently achieved outstanding evaluations in academic projects.',
      'Strong interest in software development, front-end development and UI/UX design.',
    ],
    tags: ['Information Systems', 'Software', 'Databases'],
  },
]

/* -------------------------------------------------------------------------- */
/*  Credentials: certificate plates                                            */
/* -------------------------------------------------------------------------- */

export const certificates: Certificate[] = [
  {
    id: 'route-cs',
    title: 'Computer Science Fundamentals Diploma',
    issuer: 'Route Academy',
    year: '2026',
    seal: 'TOP PERFORMER',
    description:
      'Recognised as a “Top Performer” for exceptional performance in programming fundamentals and core computer science concepts.',
    // credentialUrl: '/certificates/route-cs.pdf',
  },
  {
    id: 'innovegypt',
    title: 'InnovEgypt Program Certificate',
    issuer: 'TIEC & ITIDA · with iSpark',
    year: '2026',
    seal: 'GRADE A',
    description:
      'Graduated with Grade A in Tech-Entrepreneurship and Innovation, with hands-on training in building tech solutions.',
    // credentialUrl: '/certificates/innovegypt.pdf',
  },
]

/** The slim "in progress" strip under the plates. Set to null to hide it. */
export const credentialInProgress: { title: string; note: string } | null = {
  title: 'DEPI — UI/UX Design Track',
  note: 'In progress',
}
