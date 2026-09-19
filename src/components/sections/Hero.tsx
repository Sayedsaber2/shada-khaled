import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { ArrowLink, Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { profile } from '@/data/profile'
import { useInViewFlag } from '@/hooks/useInViewFlag'
import { useFinePointer, useMediaQuery } from '@/hooks/useMediaQuery'
import { HeroName } from './hero/HeroName'
import { HeroStrip } from './hero/HeroStrip'
import { Portrait } from './hero/Portrait'
import { COPY_STAGGER, HERO_DELAY, copyFadeUp, lineDraw } from './hero/heroMotion'
import { usePointerParallax } from './hero/usePointerParallax'

/** Same width as Tailwind's `lg`: from here the hero is two columns and gets scroll parallax. */
const DESKTOP_QUERY = '(min-width: 64rem)'

/* -------------------------------------------------------------------------- */
/*  HERO                                                                       */
/*                                                                            */
/*  Layout — ONE grid, three blocks, so the order can differ per screen        */
/*  without duplicating any markup:                                            */
/*                                                                            */
/*    phones / tablets (stacked)        lg and up                              */
/*    1  eyebrow + name                 1 | 2     1 = cols 1–7, row 1          */
/*    2  portrait                       3 | 2     2 = cols 8–12, rows 1–2      */
/*    3  statement + buttons                      3 = cols 1–7, row 2          */
/*                                                                            */
/*  Entrance — driven by `introDone`, not by scrolling: this <section> is the  */
/*  only element with `initial` / `animate`. Everything inside just declares   */
/*  variants and a delay (see hero/heroMotion.ts).                             */
/* -------------------------------------------------------------------------- */

export function Hero() {
  const { introDone } = useApp()
  const heroRef = useRef<HTMLElement>(null)

  // Pauses the CSS loops (orb drift, badge spin, arrow bob) while the hero is off-screen
  useInViewFlag(heroRef)

  const reducedMotion = useReducedMotion()
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const finePointer = useFinePointer()
  const parallaxEnabled = isDesktop && !reducedMotion
  const pointerEnabled = finePointer && !reducedMotion

  // 0 when the hero's top touches the top of the window → 1 when its bottom leaves the top.
  // The motion values below go straight into `style`: no React state, no re-render per frame.
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const nameOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.25])

  const pointer = usePointerParallax(heroRef, pointerEnabled)

  return (
    <motion.section
      ref={heroRef}
      id="home"
      aria-labelledby="hero-title"
      initial="hidden"
      animate={introDone ? 'visible' : 'hidden'}
      // pt-24 = the 72px fixed navbar + breathing room. overflow-x-clip: the orbs may poke
      // past the screen edge on phones (`clip`, unlike `hidden`, creates no scroll container).
      className="relative flex min-h-svh flex-col overflow-x-clip pt-24"
    >
      <div className="container-page flex flex-1 flex-col">
        {/* content-center: the rows keep their natural height and sit in the middle of the free space */}
        <div className="grid-editorial flex-1 content-center gap-y-10 py-8 lg:py-10">
          {/*
            Block 1 — eyebrow + name. It moves away faster than the portrait on scroll (parallax).
            grid-cols-subgrid hands the page's column lines down to <HeroName> for its indent.
            lg:self-end + lg:self-start on block 3 keep the two text blocks together while the
            taller portrait stretches their rows.
          */}
          <motion.div
            className="col-span-full grid min-w-0 grid-cols-subgrid gap-y-6 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:gap-y-8 lg:self-end"
            style={parallaxEnabled ? { y: nameY, opacity: nameOpacity } : undefined}
          >
            <p className="label-mono col-span-full flex items-start gap-3 text-caption">
              {/* mt centres the 1px line on the first text line, also when the eyebrow wraps */}
              <motion.span
                aria-hidden="true"
                className="mt-[0.65em] h-px w-6 shrink-0 origin-left bg-caption"
                variants={lineDraw}
                custom={HERO_DELAY.copy}
              />
              <motion.span variants={copyFadeUp} custom={HERO_DELAY.copy}>
                {profile.eyebrow}
              </motion.span>
            </p>

            <HeroName />
          </motion.div>

          {/* Block 2 — portrait */}
          <Portrait
            scrollProgress={scrollYProgress}
            parallaxEnabled={parallaxEnabled}
            pointer={pointer}
            className="col-span-full min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center"
          />

          {/* Block 3 — statement + buttons, on the same indent as the second line of the name */}
          <div className="col-span-full grid min-w-0 grid-cols-subgrid gap-y-8 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:self-start">
            <motion.p
              className="col-span-full max-w-[40ch] text-body-lg text-muted sm:col-start-2"
              variants={copyFadeUp}
              custom={HERO_DELAY.copy + COPY_STAGGER}
            >
              {profile.statement}
            </motion.p>

            {/* Stacked on very narrow phones, side by side from 400px */}
            <motion.div
              className="col-span-full flex flex-col items-start gap-4 xs:flex-row xs:items-center xs:gap-8 sm:col-start-2"
              variants={copyFadeUp}
              custom={HERO_DELAY.copy + COPY_STAGGER * 2}
            >
              <Button
                variant="primary"
                size="lg"
                magnetic
                href="#work"
                icon={<ArrowDown size={18} strokeWidth={1.5} />}
              >
                View work
              </Button>

              {profile.cvUrl ? (
                <ArrowLink
                  href={profile.cvUrl}
                  download={profile.cvFileName}
                  icon={<ArrowUpRight size={18} strokeWidth={1.5} />}
                  // min-h-11: a text link still needs a 44px touch target
                  className="min-h-11"
                >
                  Download CV
                </ArrowLink>
              ) : null}
            </motion.div>
          </div>
        </div>

        <HeroStrip />
      </div>
    </motion.section>
  )
}
