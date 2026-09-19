import { useCallback, useEffect, useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { projects } from '@/data/projects'

/* -------------------------------------------------------------------------- */
/*  DEEP LINKS — the open project lives in the URL hash:  #work/<slug>         */
/*                                                                            */
/*  Why the URL and not only React state?                                      */
/*   • a case study can be shared / bookmarked,                                */
/*   • the browser Back button closes the sheet (what people expect on phones),*/
/*   • any other section can open a project with a plain link:                 */
/*       <a href="#work/car-service-platform">See the project</a>              */
/* -------------------------------------------------------------------------- */

const SECTION_HASH = '#work'
const PROJECT_HASH_PREFIX = '#work/'

/** The slug in the address bar — or null when the hash is not a known project. */
function readSlugFromHash(): string | null {
  const { hash } = window.location
  if (!hash.startsWith(PROJECT_HASH_PREFIX)) return null

  const slug = hash.slice(PROJECT_HASH_PREFIX.length)
  return projects.some((project) => project.slug === slug) ? slug : null
}

interface ProjectHashControls {
  /** Slug of the project shown in the sheet, or null while the sheet is closed. */
  openSlug: string | null
  /** A card was clicked: adds a history entry, so Back closes the sheet. */
  openProject: (slug: string) => void
  /** Previous / Next inside the sheet: swaps the entry, so Back still closes in ONE step. */
  switchProject: (slug: string) => void
  /** Close button, backdrop or Esc. */
  closeProject: () => void
}

export function useProjectHash(): ProjectHashControls {
  const { introDone, scrollTo } = useApp()
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  // true while the open sheet was opened by a LINK (not by a card) — see the second effect
  const openedByLinkRef = useRef(false)

  // The address bar is the source of truth: read it on first load and every time it changes.
  useEffect(() => {
    // The preloader is still covering the page: wait, then open on top of the finished intro
    if (!introDone) return

    const syncWithHash = () => {
      const slug = readSlugFromHash()
      if (slug) {
        // The visitor came from a link somewhere else on the page (or from outside), so bring
        // the Work section under the sheet. `immediate`: the sheet covers the page anyway,
        // and a smooth scroll would be cancelled the moment the sheet locks scrolling.
        openedByLinkRef.current = true
        scrollTo(SECTION_HASH, { immediate: true })
      }
      // No project in the hash (for example after pressing Back) → this closes the sheet
      setOpenSlug(slug)
    }

    syncWithHash()
    // 'hashchange' = a link was clicked or the hash was typed · 'popstate' = Back / Forward
    window.addEventListener('hashchange', syncWithHash)
    window.addEventListener('popstate', syncWithHash)
    return () => {
      window.removeEventListener('hashchange', syncWithHash)
      window.removeEventListener('popstate', syncWithHash)
    }
  }, [introDone, scrollTo])

  // After a sheet that was opened by a link has CLOSED, finish the move to the Work section:
  //  1. Scroll again. Smooth scrolling ignores requests while the page is locked, and on a
  //     first load the preloader still holds the lock when the sheet opens. If the first
  //     request already worked this does nothing visible — the page could not move meanwhile.
  //  2. Move keyboard focus to the section (the same thing SmoothScroll does for in-page
  //     links). Otherwise focus would go back to the link the visitor came from, which is
  //     now far off-screen, and the next Tab would drag the page back there.
  // This effect runs after the sheet's own cleanup (scroll unlock, focus restore): React
  // runs all cleanups of an update before it runs any new effect.
  useEffect(() => {
    if (openSlug !== null || !openedByLinkRef.current) return
    openedByLinkRef.current = false

    scrollTo(SECTION_HASH, { immediate: true })
    const section = document.querySelector<HTMLElement>(SECTION_HASH)
    section?.setAttribute('tabindex', '-1')
    section?.focus({ preventScroll: true })
  }, [openSlug, scrollTo])

  const openProject = useCallback((slug: string) => {
    // pushState changes the URL without firing 'hashchange', so nothing scrolls or jumps
    if (readSlugFromHash() !== slug) {
      history.pushState(null, '', `${PROJECT_HASH_PREFIX}${slug}`)
    }
    setOpenSlug(slug)
  }, [])

  const switchProject = useCallback((slug: string) => {
    history.replaceState(null, '', `${PROJECT_HASH_PREFIX}${slug}`)
    setOpenSlug(slug)
  }, [])

  const closeProject = useCallback(() => {
    // Leave a clean "#work" behind. replaceState (not location.hash = …) → no scroll jump
    if (readSlugFromHash() !== null) {
      history.replaceState(null, '', SECTION_HASH)
    }
    setOpenSlug(null)
  }, [])

  return { openSlug, openProject, switchProject, closeProject }
}
