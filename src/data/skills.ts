import type { SkillRow } from './types'

/* -------------------------------------------------------------------------- */
/*  Toolkit table. No percentage bars — honest level tags instead.             */
/*  `learning` = skills still being studied (shown as dashed chips).           */
/* -------------------------------------------------------------------------- */

export const skillRows: SkillRow[] = [
  {
    id: 'ux',
    index: '01',
    title: 'UX Foundations',
    skills: ['UI/UX Principles', 'User Flows', 'Wireframing', 'Prototyping', 'User Research'],
    learning: ['Wireframing', 'Prototyping', 'User Research'],
    levelLabel: 'Learning — DEPI',
    level: 1,
  },
  {
    id: 'ui',
    index: '02',
    title: 'UI & Visual',
    skills: ['Visual Hierarchy', 'Layout & Spacing', 'Typography', 'Color', 'Figma'],
    learning: ['Figma'],
    levelLabel: 'Practicing',
    level: 2,
  },
  {
    id: 'vector',
    index: '03',
    title: 'Vector & Production',
    skills: ['Adobe Illustrator', 'Vector Design', 'Laser-cut File Prep', 'Graphic Design', 'Custom Products'],
    levelLabel: '3 yrs daily',
    level: 3,
  },
  {
    id: 'technical',
    index: '04',
    title: 'Technical Roots',
    skills: ['Java', 'C++', 'OOP', 'Data Structures & Algorithms', 'SQL (Intro)', 'Unit Testing', 'Agile', 'Front-end'],
    learning: ['Front-end'],
    levelLabel: 'Academic',
    level: 2,
  },
  {
    id: 'soft',
    index: '05',
    title: 'Working With People',
    skills: ['Problem Solving', 'Teamwork', 'Team Leadership', 'Adaptability', 'Attention to Detail'],
    levelLabel: 'Every day',
    level: 3,
  },
]
