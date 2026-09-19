import { MotionConfig } from 'motion/react'
import { AppProvider, useApp } from '@/context/AppContext'
import { ColumnGuides } from '@/components/layout/ColumnGuides'
import { Footer } from '@/components/layout/Footer'
import { Grain } from '@/components/layout/Grain'
import { Navbar } from '@/components/layout/Navbar'
import { Preloader } from '@/components/layout/Preloader'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Credentials } from '@/components/sections/Credentials'
import { Hero } from '@/components/sections/Hero'
import { Path } from '@/components/sections/Path'
import { Toolkit } from '@/components/sections/Toolkit'
import { Work } from '@/components/sections/Work'

function Page() {
  const { introDone } = useApp()

  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Grain />
      <ColumnGuides />

      {/* `inert` until the intro ends: Tab must not reach the link behind the preloader */}
      <a
        href="#main"
        inert={!introDone}
        className="fixed top-3 left-3 z-[90] -translate-y-20 rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-transform focus-visible:translate-y-0"
      >
        Skip to content
      </a>

      <Navbar />

      {/* `inert` keeps keyboard & screen readers out of the page while the preloader is up */}
      <main id="main" inert={!introDone}>
        <Hero />
        <About />
        <Toolkit />
        <Work />
        <Path />
        <Credentials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    // reducedMotion="user": people who turn animations off in their OS get opacity-only reveals
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <Page />
      </AppProvider>
    </MotionConfig>
  )
}
