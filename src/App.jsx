import { useEffect } from 'react'
import useLenis from '@hooks/useLenis'
import GlobalBackground from '@components/canvas/GlobalBackground'
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
import DataBackground from '@components/layout/DataBackground'

function App() {
  // Initialize smooth scrolling
  useLenis()

  return (
    <>
      <CustomCursor />
      <Loader />
      <Navbar />
      
      {/* Background layer */}
      <DataBackground />
      <GlobalBackground />
      
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
