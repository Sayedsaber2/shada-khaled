/* -------------------------------------------------------------------------- */
/*  The editorial rhythm of the Work grid.                                     */
/*                                                                            */
/*  Filter "All" (12 columns on lg):        A specific filter:                 */
/*    ┌───── 7 ─────┐ ┌─── 5 ───┐             ┌──── 6 ────┐ ┌──── 6 ────┐      */
/*    │    wide     │ │ narrow  │             │   half    │ │   half    │      */
/*    ┌─── 5 ───┐ ┌───── 7 ─────┐                                              */
/*    │ narrow  │ │    wide     │                                              */
/*                                                                            */
/*  An odd number of cards would leave the last one alone beside an empty      */
/*  half-row, so that last card stretches into a full-width banner instead.    */
/*                                                                            */
/*  Tablets (8 columns) always show two equal cards per row, phones one.       */
/*  Project cards and studio slots use the same spans, so they mix freely.     */
/* -------------------------------------------------------------------------- */

export type CardSpan = 'wide' | 'narrow' | 'half' | 'full'

/** Repeats every four cards: 7 + 5 columns, then 5 + 7. Both rows add up to 12. */
const EDITORIAL_PATTERN: CardSpan[] = ['wide', 'narrow', 'narrow', 'wide']

/**
 * `position` = index of the card inside the grid, counting studio slots too.
 * `total` = how many cards the grid shows right now.
 */
export function getCardSpan(position: number, total: number, isFiltered: boolean): CardSpan {
  const isLonelyLastCard = total > 1 && total % 2 === 1 && position === total - 1
  if (isLonelyLastCard) return 'full'
  if (isFiltered) return 'half'
  return EDITORIAL_PATTERN[position % EDITORIAL_PATTERN.length]
}

/**
 * Grid columns of each span. Narrow cards drop by 6rem on lg: the editorial stagger.
 * The drop is PADDING, not margin, on purpose: when a card is filtered out, AnimatePresence
 * pins it with `position: absolute; top: …`, and a margin would be added on top of that —
 * the card would jump down 6rem while it fades out. Padding is part of the box, so it stays put.
 */
export const SPAN_CLASSES: Record<CardSpan, string> = {
  wide: 'col-span-full md:col-span-4 lg:col-span-7',
  narrow: 'col-span-full md:col-span-4 lg:col-span-5 lg:pt-24',
  half: 'col-span-full md:col-span-4 lg:col-span-6',
  full: 'col-span-full',
}

/** Shape of the cover. Narrow cards turn portrait on lg, so both cards of a row carry similar weight. */
export const COVER_ASPECT_CLASSES: Record<CardSpan, string> = {
  wide: 'aspect-[4/3]',
  narrow: 'aspect-[4/3] lg:aspect-[4/5]',
  half: 'aspect-[4/3]',
  full: 'aspect-[4/3] md:aspect-[21/8]',
}
