import { useEffect, useRef } from 'react'
import useAppStore from '@store/useAppStore'
import Lenis from 'lenis'

export default function useLenis() {
  const lenisRef = useRef(null)
  const setRawProg = useAppStore((state) => state.setRawProg)

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })
    
    lenisRef.current = lenis

    // Listen to scroll events
    lenis.on('scroll', (e) => {
      // Calculate hero scroll progress (0 to 1) based on reduced scroll length (200vh)
      const maxScroll = window.innerHeight * 2
      const prog = Math.min(1, Math.max(0, e.animatedScroll / maxScroll))
      setRawProg(prog)
      
      // Update navbar state
      useAppStore.getState().setNavScrolled(e.animatedScroll > 50)
    })

    // Animation frame loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [setRawProg])

  return lenisRef
}
