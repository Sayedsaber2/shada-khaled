/* -------------------------------------------------------------------------- */
/*  publicUrl() — turns a root-absolute path like "/images/x.jpg" into a URL   */
/*  that also works when the site is hosted under a sub-path (for example a    */
/*  GitHub Pages project site: https://user.github.io/repo-name/…).            */
/*                                                                            */
/*  Locally (npm run dev) the site lives at the domain root, so this is a       */
/*  no-op. In production it prefixes the path with Vite's `base` (set in        */
/*  vite.config.ts) — that is the sub-path the site is actually deployed under. */
/*                                                                            */
/*  Use it for any file inside /public that is referenced from TypeScript      */
/*  (profile photo, CV, project cover images, gallery images, credential       */
/*  PDFs…). You never need it in index.html — Vite handles that file itself.   */
/* -------------------------------------------------------------------------- */

export function publicUrl(path: string): string {
  // Already a full URL (https://…) or a special scheme (mailto:, tel:) — leave it alone.
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path

  const base = import.meta.env.BASE_URL.replace(/\/$/, '') // "/shada-khaled" (no trailing slash)
  return `${base}/${path.replace(/^\//, '')}`
}
