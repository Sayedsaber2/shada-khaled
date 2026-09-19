# Design spec — "Violet Hour", an editorial night folio

Portfolio of **Shada Khaled Ebrahim**, a UI/UX designer in training (DEPI), Giza, Egypt.

## The idea

A printed design magazine read at night: ink-violet blacks, warm paper-white type, a very large soft
serif (Fraunces) for headlines, mono "figure captions", 1px hairlines as the structure.

- **Purple is the brand colour** — links, emphasis italics, focus rings, progress lines, the preloader
  curtain, stroke art, the Contact panel. It is used with intent, never as a wash over everything.
- **Gold is the complement**, sampled from the bokeh lights in the portrait — the laser dot, stamps,
  section indices, tiny accents. Ration it (≈3% of the UI).
- **The motif is the laser**: Shada spent 3 years cutting vector paths with a laser. A thin line that
  *draws itself* with a small glowing gold dot riding its tip appears in the preloader (monogram), the
  toolkit (bezier study), the process path and the timeline. Use `<LaserPath>`.
- **One gradient moment**: the purple→rose→gold "violet hour" gradient belongs to the Contact panel
  (and tiny echoes: progress line, footer wordmark fill). Everything else stays calm.
- **Honest for a beginner**: no percentage bars, no fake clients/testimonials/metrics. Academic work is
  labelled as academic. Empty optional data hides its UI.

## Motion language — "traced, then settled"

Things are revealed precisely (masks, path draws, clip wipes) and decelerate. Never bouncy — the ONE
allowed overshoot is the certificate stamp.

- Default reveal: `opacity 0→1, y 32→0, 0.9s, ease outExpo` via `<Reveal>` / `<RevealGroup>`.
- Headlines: word-level mask rise via `<MaskText>`.
- Hairlines draw `scaleX 0→1` from the left.
- Stagger 0.05–0.09s between siblings, total stagger span ≤ 0.5s.
- Scroll-linked animation = `useScroll` + `useTransform` on motion values only. NEVER React state in a
  scroll handler, never read layout per frame. Do not add `useSpring` on top of scroll-linked
  transforms (Lenis already smooths scrolling) — springs only for progress lines / pointer effects.
- Animate only `transform`, `opacity`, `clip-path`, `pathLength`. Never width/height/top/left/box-shadow/filter.
- Ambient loops are CSS keyframes (see `--animate-*` in index.css) and must pause off-screen: put
  `useInViewFlag(ref)` on the section wrapper.
- Pointer effects (magnetic, tilt, parallax) only when `useFinePointer()` is true and
  `useReducedMotion()` is false.
- `prefers-reduced-motion`: `<MotionConfig reducedMotion="user">` already strips transforms. Anything
  scroll-scrubbed or looping must ALSO render a sensible static state (path fully drawn, text fully
  opaque, no parallax). Nothing may depend on animation to become visible.
- Content taller than the viewport must use `<Reveal tall>` / `VIEWPORT_TALL`, or it may never trigger.

## Tokens (src/index.css)

Tailwind v4, CSS-first. Theme-aware colour utilities (they flip in light mode automatically):

| Utility | Meaning |
| --- | --- |
| `bg-bg` `bg-surface` `bg-surface-2` `bg-surface-3` | ink surfaces |
| `text-fg` `text-muted` `text-caption` | text · muted 7.8:1 · small informational labels 5.4:1 |
| `text-deco` | decorative / aria-hidden ONLY (fails AA) |
| `border-line` `border-line-strong` | hairlines (decorative dividers) |
| `border-line-control` | 3:1 border for interactive controls (inputs, ghost buttons, chips that act as buttons) |
| `text-accent` `text-accent-strong` `bg-accent-fill` `bg-accent-soft` | purple roles |
| `text-gold` `border-gold-deco` | gold text (AA) · gold decoration |
| `text-status` | green "available" dot |
| `bg-violet-50…950`, `bg-ink`, `bg-paper`, `bg-night` | raw, theme-independent |

Never hard-code a hex colour in a component unless it is inside the always-dark Contact panel or the
always-dark preloader. `text-violet-500` (#8250F0) is for LARGE text / fills only (4.1:1).

Type utilities: `text-display-xl` (hero name, contact headline), `text-display-lg` (section titles),
`text-display-md` (manifesto, sheet titles), `text-h3`, `text-h4`, `text-body-lg`, `text-numeral`.
Fonts: `font-display` (Fraunces — never below 1.25rem), `font-sans` (Inter), `font-mono` (JetBrains Mono).

Custom utilities: `container-page`, `grid-editorial` (4/8/12 cols), `section-y`, `label-mono`,
`emphasis` (the violet Fraunces italic — ONE phrase per headline), `text-violet-hour` (gradient text,
decorative), `text-outline` (stroke-only type, always `aria-hidden`), `hairline`, `hairline-glow`,
`plate` (editorial card: surface + hairline + 6px radius, no shadow), `link-underline`
(+`link-underline-on`), `focus-corners` (gold corner ticks on focus — project cards & filter pills
only), `bg-hatch`.
Easings as utilities: `ease-out-expo`, `ease-in-out-cubic`, `ease-in-out-quart`, `ease-soft`.
Animations: `animate-spin-slow` (24s), `animate-spin-slower` (120s), `animate-bob`,
`animate-pulse-dot`, `animate-ping-ring`, `animate-sheen`, `animate-indeterminate`, `animate-blink`,
`animate-drift-a|b|c`.

Shape: plates/cards/inputs radius 6px (`rounded-plate` → use `rounded-plate` or the `plate`
utility). `rounded-full` ONLY on pills/buttons/dots. The portrait arch
(`border-radius: 999px 999px 6px 6px`) is the only big curve on the site. Timeline / process nodes
are 9px squares rotated 45° (diamonds). No box-shadows in dark theme.

Z-index: content 0 · navbar 40 · project sheet 50 · grain 60 · preloader 100.

## Shared building blocks (already written — USE them, do not re-implement)

- `@/lib/motion` — `EASE`, `SPRING`, `DURATION`, `VIEWPORT`, `VIEWPORT_TALL`, variants
  (`fadeUp`, `fadeIn`, `fadeLeft`, `maskRise`, `drawLine`, `clipReveal`, `staggerParent()`).
- `@/lib/cn` — `cn()` class joiner.
- `@/context/AppContext` — `useApp()` → `{ introDone, finishIntro, scrollTo, lockScroll, unlockScroll,
  theme, toggleTheme }`, and `NAV_OFFSET`.
  - `introDone` is false while the preloader covers the page; hero entrance waits for it.
  - `lockScroll()/unlockScroll()` freeze the page (counted; safe to nest). Use for menu / sheet.
  - In-page links `<a href="#work">` are smooth-scrolled automatically (SmoothScroll handles clicks).
- `@/components/ui/Reveal` — `<Reveal variant="up|fade|left|scale|clip" delay tall as>`;
  `<RevealGroup stagger delay as tall>` + `<RevealItem variant as>`.
- `@/components/ui/MaskText` — `<MaskText as="h2" text="Selected *work*" />`; `animate="hidden|visible"`
  for manual control.
- `@/components/ui/SectionHeader` — `<SectionHeader index="04" label="Selected Work" title="Selected *work*"
  titleId meta lead />` and `<SectionLabel>` (label row + drawing hairline only).
- `@/components/ui/Button` — `<Button variant="primary|accent|ghost" size="md|lg" icon magnetic href? />`
  and `<ArrowLink href icon>`.
- `@/components/ui/Magnetic`, `TextRoll` (parent needs `group`), `Chip` (`tone="default|accent|gold|dashed"`),
  `BrandIcon` (`linkedin|behance|dribbble|github|whatsapp` — lucide has NO brand icons),
  `Monogram` (+ `MONOGRAM_PATH`, `MONOGRAM_VIEWBOX`, `MONOGRAM_DOT`), `LaserPath`.
- `@/hooks` — `useMediaQuery`, `useFinePointer`, `useActiveSection(ids)`, `useFocusTrap(ref, active, onEscape)`,
  `useInViewFlag(ref)`.
- Icons: `lucide-react` (tree-shaken named imports). Stroke width 1.5 looks right with this design.
- All content comes from `src/data/*` — never hard-code personal content in components.

## Section map

`<section id>` values are fixed (the navbar depends on them):
`home` (Hero) · `about` · `toolkit` · `work` · `path` · `credentials` · `contact`.
Every section: `aria-labelledby` its title id, `className="section-y"` + `container-page` inside
(Hero, Contact and Footer manage their own spacing). Section indices: About 01, Toolkit 02,
Work 03, Path 04, Credentials 05, Contact 06.

## Responsive & accessibility rules

- Must work from 360px to 1920px with NO horizontal scroll. Use `min-w-0` on grid children, allow long
  values to wrap, wrap wide decorative things in `overflow-x-clip`.
- NEVER `overflow: hidden` on an ancestor of a `position: sticky` element (use `overflow-x: clip`).
- Touch targets ≥ 44px. Visible `:focus-visible` everywhere (global style exists — do not remove outlines).
- Decorative SVG/marquee/outline text: `aria-hidden="true"`. Rotating / scrubbed text needs a static
  accessible equivalent (`sr-only` or `aria-label`).
- Colour-coded things always carry a text label too.
- Use logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`, `end-*`, `text-start/end`,
  `border-s/e`) so an Arabic/RTL version is cheap later.
- Images: explicit `width`/`height`, `loading="lazy"` below the fold, `decoding="async"`.
