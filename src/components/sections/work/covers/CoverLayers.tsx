import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/* -------------------------------------------------------------------------- */
/*  Every generated cover is drawn in a 400 × 300 box and has three layers:    */
/*                                                                            */
/*   <Backdrop>   faint context lines that bleed off the edges                 */
/*   <FillLayer>  the "hi-fi" version: soft violet / gold fills                */
/*   <WireLayer>  the wireframe: thin strokes that draw themselves             */
/*                                                                            */
/*  SAFE BOX — the covers are cropped to different shapes (4/3 card, 4/5 card, */
/*  21/9 banner), always around the centre. Everything important is drawn      */
/*  inside  x 84 → 316 · y 68 → 236  so it survives every crop. Decoration     */
/*  outside that box is allowed to be cut off.                                 */
/* -------------------------------------------------------------------------- */

/** Every cover component receives the same props. */
export interface CoverArtProps {
  /** true → the fill layer shows (card hovered / focused, touch devices, the sheet banner) */
  showFill: boolean
}

interface LayerProps {
  children: ReactNode
}

/** Faint context lines. Rendered first, so everything else sits on top of them. */
export function Backdrop({ children }: LayerProps) {
  return (
    <g fill="none" strokeWidth={1} strokeLinecap="round" className="stroke-line-strong">
      {children}
    </g>
  )
}

/** The wireframe. Children inherit the thin violet stroke and override it where needed. */
export function WireLayer({ children }: LayerProps) {
  return (
    <g
      fill="none"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-accent-strong"
    >
      {children}
    </g>
  )
}

interface FillLayerProps extends LayerProps {
  visible: boolean
}

/**
 * The hi-fi fills, underneath the wireframe. A plain CSS opacity transition (0.35s) is
 * enough here — and the global reduced-motion rule in index.css makes it instant for free.
 */
export function FillLayer({ visible, children }: FillLayerProps) {
  return (
    <g
      className={cn(
        'transition-opacity duration-350 ease-soft',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      {children}
    </g>
  )
}
