# Shada Khaled — UI/UX Designer Portfolio

A one-page, animated portfolio — design direction **"Violet Hour"**: an editorial night folio in
ink-violet, paper white and a touch of gold.

Built with **Vite + React 19 + TypeScript + Tailwind CSS v4 + Motion + Lenis**.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Production build (output in `dist/` — upload that folder to Vercel, Netlify or GitHub Pages):

```bash
npm run build
```

## Where is the content?

**You never need to touch a component to change content.** Everything lives in `src/data/`:

| File | What it controls |
| --- | --- |
| `src/data/profile.ts` | Name, hero text, photo, CV, about manifesto & story, fact sheet, figures, the "Now" strip, nav links, social links |
| `src/data/projects.ts` | The Work grid, filter pills, counters and the case-study sheet |
| `src/data/skills.ts` | The Toolkit table |
| `src/data/journey.ts` | The Path timeline, the certificate plates and the "in progress" strip |
| `src/data/types.ts` | The shape of all the above (TypeScript will tell you if something is missing) |

Every optional field hides its UI when it is empty — nothing is ever faked.

## Add a new project (2 minutes)

1. *(Optional)* put the images in `public/projects/<slug>/` — e.g. `cover.jpg`, `1.jpg`, `2.jpg`.
2. Open `src/data/projects.ts`, copy the template from the comment at the top of the file and paste
   it as the **first item** of the `projects` array.
3. Fill it in and save. The card, the filter pill, the counters and the case-study sheet are all
   generated automatically. The project also gets its own shareable link: `#work/<slug>`.

```ts
{
  slug: 'food-delivery-app',
  title: 'Food Delivery App',
  context: 'DEPI — UI/UX Case Study',
  year: '2026',
  categories: ['UI/UX Case Study'],
  summary: 'One sentence shown on the card.',
  role: 'UX research, wireframes, UI design, prototype',
  tools: ['Figma', 'FigJam'],
  cover: { kind: 'image', src: '/projects/food-delivery-app/cover.jpg', alt: 'App screens' },
  featured: true,
  sections: [
    { heading: 'Overview', body: 'A paragraph…' },
    { heading: 'The problem', body: 'A paragraph…' },
    { heading: 'Process', body: ['Bullet one', 'Bullet two'] },
    { heading: 'Outcome', body: 'A paragraph…' },
  ],
  retrospective: ['What I would change today…'],            // optional
  gallery: ['/projects/food-delivery-app/1.jpg'],            // optional
  links: [{ label: 'View on Behance', url: 'https://…' }],   // optional
},
```

No cover image yet? Use a generated cover instead: `cover: { kind: 'phone' }`
(`route | chart | ledger | phone | browser`). Need a new category? Add it to `ProjectCategory` in
`src/data/types.ts`.

## Replace the photo / CV

- Photo: `public/images/profile.jpg` — use a sharp, high-resolution image (1000px wide or more). If
  the face is cropped badly inside the arch, tweak `photoPosition` in `src/data/profile.ts`. For a
  daylight photo set `portraitTone: 'light'`.
- CV: `public/cv/Shada_Khaled_CV.pdf`

## Add Behance / Dribbble / GitHub later

Open `src/data/profile.ts` → `socials` and add a line — it appears in the menu, contact and footer:

```ts
{ id: 'behance', label: 'Behance', url: 'https://www.behance.net/USERNAME', handle: 'USERNAME' },
```

## Colours & theme

All design tokens (colours, fonts, type scale, easings) are CSS variables at the top of
`src/index.css`. Change a value there and the whole site follows — both the dark theme (default) and
the light "paper" theme. The design rules are documented in `docs/DESIGN_SPEC.md`.

Tip: press **G** on desktop to toggle the 12-column layout grid, like in a design tool.

## Project structure

```
src/
  data/            ← all content (edit here)
  components/
    layout/        ← Preloader, Navbar, MobileMenu, Footer, SmoothScroll, Grain, ColumnGuides…
    sections/      ← Hero, About, Toolkit, Work, Path, Credentials, Contact
    ui/            ← reusable pieces: Reveal, MaskText, SectionHeader, Button, Magnetic, LaserPath…
  context/         ← AppContext: intro state, smooth scroll, scroll lock, theme
  hooks/           ← useActiveSection, useMediaQuery, useFocusTrap, useInViewFlag, useTheme
  lib/             ← motion presets (easings, springs, variants) & helpers
docs/DESIGN_SPEC.md ← the design system & motion rules
```

## Animation cheatsheet

| I want… | Use |
| --- | --- |
| Content that appears on scroll | `<Reveal>` or `<RevealGroup>` + `<RevealItem>` |
| A headline whose words rise from a mask | `<MaskText text="Selected *work*" />` |
| A section opening (label + hairline + title) | `<SectionHeader />` |
| A line that draws itself with the gold laser dot | `<LaserPath d="…" progress={motionValue} />` |
| A button that leans towards the cursor | `<Button magnetic>` or `<Magnetic>` |

People who turn animations off in their OS get a calm version automatically
(`<MotionConfig reducedMotion="user">` + CSS `prefers-reduced-motion`).
