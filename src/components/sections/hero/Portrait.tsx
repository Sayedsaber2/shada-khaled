import { useState } from 'react'
import { motion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { Monogram } from '@/components/ui/Monogram'
import { cn } from '@/lib/cn'
import { profile } from '@/data/profile'
import { BokehOrbs } from './BokehOrbs'
import { HERO_DELAY, archReveal, photoSettle, softFadeIn } from './heroMotion'
import { RotatingBadge } from './RotatingBadge'
import type { PointerParallax } from './usePointerParallax'

interface PortraitProps {
  /** 0 → 1 while the hero scrolls out of view (from useScroll in <Hero>). */
  scrollProgress: MotionValue<number>
  /** false below lg and for reduced motion: everything stays still. */
  parallaxEnabled: boolean
  pointer: PointerParallax
  /** Grid placement, decided by <Hero>. */
  className?: string
}

/**
 * The portrait in its arch — the only big curve on the site.
 *
 * Back to front: bokeh orbs → arch (photo + colour layers) → rotating badge,
 * and from lg up a vertical figure caption in the gutter beside the arch.
 */
export function Portrait({ scrollProgress, parallaxEnabled, pointer, className }: PortraitProps) {
  // No photo in the data, or the file failed to load → show the monogram instead
  const [photoMissing, setPhotoMissing] = useState(!profile.photo)
  const isNightPhoto = profile.portraitTone === 'dark'

  // Scroll parallax: the arch drifts up a little, and the photo drifts inside it
  const archY = useTransform(scrollProgress, [0, 1], [0, -40])
  const photoY = useTransform(scrollProgress, [0, 1], ['0%', '-8%'])

  return (
    // lg:pe-10 keeps a gutter free on the end side for the vertical caption
    <div className={cn('flex justify-center lg:justify-end lg:pe-10', className)}>
      {/*
        The frame. The arch is always 4:5, so a HEIGHT limit has to be written as a
        WIDTH limit (height × 0.8):
          phones   max-height 58svh → 46.4svh wide, and never wider than 78vw / 360px
          desktop  max-height 76svh → 60.8svh wide, and never wider than 440px
        (the source photo is only 460px wide — a bigger arch would look soft)
      */}
      <div className="relative w-[min(78vw,360px,46.4svh)] lg:w-[min(100%,440px,60.8svh)]">
        <BokehOrbs
          pointer={pointer}
          scrollProgress={scrollProgress}
          parallaxEnabled={parallaxEnabled}
          soft={!isNightPhoto}
        />

        <motion.figure className="relative" style={parallaxEnabled ? { y: archY } : undefined}>
          {/* `isolate`: the soft-light layer below must blend with the photo only, not with the page */}
          <motion.div
            className="relative isolate aspect-[4/5] overflow-hidden rounded-[999px_999px_6px_6px] bg-surface-2"
            variants={archReveal}
            custom={HERO_DELAY.portrait}
          >
            {photoMissing ? (
              <div className="absolute inset-0 grid place-items-center text-accent-strong">
                <Monogram size={132} strokeWidth={5} title={profile.fullName} />
              </div>
            ) : (
              <>
                {/* 110% tall: spare photo at the bottom, so sliding it up 8% never shows a gap */}
                <motion.div
                  className="absolute inset-x-0 top-0 h-[110%]"
                  variants={photoSettle}
                  custom={HERO_DELAY.portrait}
                  style={parallaxEnabled ? { y: photoY } : undefined}
                >
                  <img
                    src={profile.photo}
                    alt={profile.photoAlt}
                    width={460}
                    height={460}
                    fetchPriority="high"
                    decoding="async"
                    className="size-full object-cover"
                    style={{ objectPosition: profile.photoPosition }}
                    onError={() => setPhotoMissing(true)}
                  />
                </motion.div>

                {/* A violet wash pulls the blue of the photo towards the brand colour */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-violet-600 opacity-[0.22] mix-blend-soft-light"
                />

                {/* Night photos melt into the page at the base */}
                {isNightPhoto ? (
                  <div aria-hidden="true" className="absolute inset-0 bg-(image:--photo-fade)" />
                ) : null}
              </>
            )}

            {/* 1px inner highlight. Its own layer, because a ring on the arch itself would sit UNDER the photo. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[inherit] ring-1 ring-white/10 ring-inset"
            />
          </motion.div>

          {profile.badgeText ? <RotatingBadge /> : null}

          {/*
            The positioned box and the vertical text are two elements on purpose: logical
            properties (start-full, ps-4) follow the element's OWN writing mode, so on a
            vertical element they would point down instead of sideways.
          */}
          {profile.photoCaption && !photoMissing ? (
            <motion.figcaption
              className="absolute start-full bottom-0 hidden ps-4 lg:block"
              variants={softFadeIn}
              custom={HERO_DELAY.caption}
            >
              <span className="label-mono block whitespace-nowrap text-caption [writing-mode:vertical-rl]">
                {profile.photoCaption}
              </span>
            </motion.figcaption>
          ) : null}
        </motion.figure>
      </div>
    </div>
  )
}
