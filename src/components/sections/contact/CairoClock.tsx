import { useEffect, useState } from 'react'
import { profile } from '@/data/profile'

/* -------------------------------------------------------------------------- */
/*  "GIZA — 21:42 EET": a small live clock, so a visitor in another time zone  */
/*  knows whether it is a sensible hour to expect a reply.                     */
/* -------------------------------------------------------------------------- */

/** Giza follows Cairo time. The browser's Intl API does the time-zone maths (summer time included). */
const TIME_ZONE = 'Africa/Cairo'

/** The clock only shows minutes, so checking twice a minute is plenty. */
const REFRESH_MS = 30_000

// Created once, outside the component: building a formatter is relatively slow
const clockFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  // "EET" in winter, "EEST" while Egypt is on summer time — never hard-code it
  timeZoneName: 'short',
})

/** "Giza, Egypt" → "Giza" */
const city = profile.location.split(',')[0].trim()

interface ClockReading {
  hours: string
  minutes: string
  zone: string
}

function readClock(date: Date): ClockReading {
  // formatToParts gives the hours and the minutes separately, so the colon between
  // them can be its own (blinking) element.
  const parts = clockFormatter.formatToParts(date)
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return { hours: valueOf('hour'), minutes: valueOf('minute'), zone: valueOf('timeZoneName') }
}

export function CairoClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), REFRESH_MS)
    return () => window.clearInterval(interval)
  }, [])

  const { hours, minutes, zone } = readClock(now)
  const time = `${hours}:${minutes}`

  return (
    <p className="label-mono text-end text-violet-50/80">
      {city}
      <span aria-hidden="true"> — </span>
      {/* The label reads as one sentence; without it a screen reader would spell out "21", ":", "42" */}
      <time dateTime={time} aria-label={`Local time in ${city}: ${time} ${zone}`}>
        {hours}
        {/* A CSS loop (visibility only, so nothing moves). <Contact> pauses it off-screen. */}
        <span aria-hidden="true" className="animate-blink">
          :
        </span>
        {minutes} {zone}
      </time>
    </p>
  )
}
