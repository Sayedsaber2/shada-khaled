/**
 * Film grain over the whole page — the "printed at night" texture.
 * A tiny SVG noise tile repeated on one fixed layer. Static and with NO blend mode,
 * so it costs nothing while scrolling.
 */
const NOISE_TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        backgroundImage: NOISE_TILE,
        backgroundSize: '220px 220px',
        opacity: 'var(--grain-opacity)',
      }}
    />
  )
}
