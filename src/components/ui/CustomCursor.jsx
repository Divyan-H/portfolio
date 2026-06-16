import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const curRef = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let glowX = mouseX
    let glowY = mouseY

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (curRef.current) {
        curRef.current.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`
      }
    }

    const render = () => {
      // Ring trails closely, glow halo trails with more lag for a soft comet effect
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      glowX += (mouseX - glowX) * 0.08
      glowY += (mouseY - glowY) * 0.08
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(calc(${glowX}px - 50%), calc(${glowY}px - 50%))`
      }
      requestAnimationFrame(render)
    }

    document.addEventListener('mousemove', onMouseMove)
    const rafId = requestAnimationFrame(render)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} id="cur-glow" />
      <div ref={curRef} id="cur" />
      <div ref={ringRef} id="cur-ring" />
    </>
  )
}
