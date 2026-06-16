import { useEffect } from 'react'
import useLenis from '@hooks/useLenis'
import useTilt from '@hooks/useTilt'
import NebulaFlow from '@components/canvas/NebulaFlow'
import Loader from '@components/layout/Loader'
import Navbar from '@components/layout/Navbar'
import Footer from '@components/layout/Footer'
import HeroStage from '@components/hero/HeroStage'
import Experience from '@components/sections/Experience'
import Projects from '@components/sections/Projects'
import Skills from '@components/sections/Skills'
import Certifications from '@components/sections/Certifications'
import Contact from '@components/sections/Contact'
import HudCorners from '@components/ui/HudCorners'
import CustomCursor from '@components/ui/CustomCursor'

function App() {
  // Initialize smooth scrolling
  useLenis()

  // Cursor-reactive 3D tilt on glass panels
  useTilt()

  // Global scroll-reveal: fade-up any element flagged with [data-reveal]
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!els.length) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <CustomCursor />
      <Loader />
      <Navbar />

      {/* Flowing nebula — living paint behind the glass */}
      <NebulaFlow />
      
      <main>
        <HeroStage />
        
        {/* Full-width seamless gradient curtain bridges the video to solid dark sections */}
        <div className="gradientCurtain" />
        
        {/* Sections follow the hero */}
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      
      <Footer />
      <HudCorners />
    </>
  )
}

export default App
