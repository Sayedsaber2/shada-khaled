import type { Project, ProjectCategory } from './types'

/* -------------------------------------------------------------------------- */
/*  ADD A NEW PROJECT                                                          */
/*                                                                            */
/*  Copy this template, paste it at the TOP of the `projects` array below,     */
/*  fill it in. The card, filter and case study are made for you.              */
/*                                                                            */
/*  {                                                                          */
/*    slug: 'my-project',       // for the URL, use dashes                     */
/*    title: 'My Project',                                                     */
/*    context: 'DEPI — UI/UX Case Study',                                      */
/*    year: '2026',                                                            */
/*    categories: ['UI/UX Case Study'],                                        */
/*    summary: 'One short sentence.',                                          */
/*    role: 'What YOU did.',                                                   */
/*    tools: ['Figma'],                                                        */
/*    cover: { kind: 'phone' }, // route | chart | ledger | phone | browser    */
/*    // or use your own image: cover: { kind: 'image', src: '/…', alt: '…' }  */
/*    sections: [                                                              */
/*      { heading: 'Overview', body: 'One paragraph.' },                       */
/*    ],                                                                       */
/*  },                                                                         */
/*                                                                            */
/*  Optional fields (leave them out to hide their UI):                         */
/*    badge: 'Grade A · InnovEgypt'                                            */
/*    featured: true                                                           */
/*    gallery: ['/projects/…/1.jpg']                                           */
/*    links: [{ label: 'Behance', url: 'https://…' }]                          */
/*                                                                            */
/*  New category? Add it to `ProjectCategory` in src/data/types.ts.            */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: 'car-service-platform',
    title: 'Car Service & Maintenance Platform',
    context: 'InnovEgypt Graduation Project',
    year: '2026',
    categories: ['UI/UX Concept'],
    summary:
      'A platform concept that brings transparency and trust to car maintenance through smart, data-driven insights.',
    role: 'Product concept, user workflows & prototype — inside a cross-functional team',
    tools: ['User Flows', 'Prototyping', 'Product Thinking', 'Teamwork'],
    cover: { kind: 'route' },
    badge: 'Grade A · InnovEgypt',
    featured: true,
    sections: [
      {
        heading: 'Overview',
        body: 'A tech-driven platform concept designed to enhance transparency and trust in car maintenance through smart, data-driven insights. Built as the graduation project of the InnovEgypt program by TIEC & ITIDA.',
      },
      {
        heading: 'What I did',
        body: [
          'Developed the platform concept together with a cross-functional team.',
          'Helped build the initial prototype and map the core user workflows.',
          'Took part in presenting the concept and prototype to the evaluation panel.',
        ],
      },
      {
        heading: 'Outcome',
        body: 'Awarded Grade A for project execution and presentation by TIEC & ITIDA.',
      },
    ],
  },
  {
    slug: 'student-analyzer',
    title: 'Student Analyzer Application',
    context: 'Academic Project',
    year: '2026',
    categories: ['Desktop App'],
    summary:
      'A desktop application with a complete graphical interface for analysing student data — clean, responsive and friendly to use.',
    role: 'Interface design & full development',
    tools: ['Java', 'GUI Design', 'Authentication', 'Data Validation'],
    cover: { kind: 'chart' },
    sections: [
      {
        heading: 'Overview',
        body: 'A desktop-based Student Analyzer application designed and developed in Java, featuring a complete Graphical User Interface (GUI).',
      },
      {
        heading: 'What I built',
        body: [
          'A complete GUI focused on being clean, responsive and user-friendly, aligned with core UI/UX principles.',
          'Secure user authentication logic.',
          'Strict data validation techniques to keep the application reliable.',
        ],
      },
    ],
  },
  {
    slug: 'pharmacy-management-system',
    title: 'Pharmacy Management System',
    context: 'Database Project',
    year: '2025',
    categories: ['Database'],
    summary:
      'A complete management system that streamlines pharmacy operations, inventory tracking and sales reporting.',
    role: 'Database design, forms & interface, documentation, presentation',
    tools: ['Microsoft Access', 'Relational Design', 'SQL Queries', 'Interactive Forms'],
    cover: { kind: 'ledger' },
    sections: [
      {
        heading: 'Overview',
        body: 'A comprehensive management system built with Microsoft Access to streamline pharmacy operations, inventory tracking and sales reporting.',
      },
      {
        heading: 'What I built',
        body: [
          'A secure user login system that enforces access control, so only authorised personnel can view sensitive data.',
          'Structured relational tables with clear entity relationships.',
          'Optimised queries paired with interactive forms.',
        ],
      },
      {
        heading: 'Outcome',
        body: 'Wrote the technical documentation and presented the system architecture to an academic panel.',
      },
    ],
  },
]

/** Filter pills — "All" plus every category actually used by a project. */
export const projectFilters: Array<'All' | ProjectCategory> = [
  'All',
  ...Array.from(new Set(projects.flatMap((project) => project.categories))),
]
