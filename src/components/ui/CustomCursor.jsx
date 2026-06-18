import { useEffect, useRef } from 'react'

const HOVER_SEL = 'a, button, [data-tilt], .card3d-wrap, label, input, textarea, select'

export default function CustomCursor() {
  const curRef  = useRef(null)
  const ringRef = useRef(null)
  const glowRef = useRef(null)

  useEffect(() => {
    let mx = window.innerWidth / 2,  my = window.innerHeight / 2
    let rx = mx, ry = my
    let gx = mx, gy = my
    let vx = 0, vy = 0      // raw velocity
    let svx = 0, svy = 0    // smoothed velocity (for stretch)
    let hovering = false
    let rafId

    // ── Instant dot position ──
    const onMove = (e) => {
      vx = e.clientX - mx
      vy = e.clientY - my
      mx = e.clientX
      my = e.clientY
      // Dot follows the real cursor instantly
      if (curRef.current) {
        curRef.current.style.transform =
          `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`
      }
    }

    // ── Hover detection (delegated) ──
    const onOver = (e) => {
      if (!hovering && e.target.closest(HOVER_SEL)) {
        hovering = true
        ringRef.current?.classList.add('cur-hover')
        curRef.current?.classList.add('cur-hover')
        glowRef.current?.classList.add('cur-hover')
      }
    }
    const onOut = (e) => {
      if (hovering && !e.relatedTarget?.closest(HOVER_SEL)) {
        hovering = false
        ringRef.current?.classList.remove('cur-hover')
        curRef.current?.classList.remove('cur-hover')
        glowRef.current?.classList.remove('cur-hover')
      }
    }

    // ── rAF loop: lag + stretch ──
    const render = () => {
      // Ring trails the cursor closely
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      // Glow halo lags more for a soft comet feel
      gx += (mx - gx) * 0.07
      gy += (my - gy) * 0.07

      // Smooth velocity for stretch (prevents jitter)
      svx += (vx - svx) * 0.28
      svy += (vy - svy) * 0.28
      vx *= 0.75; vy *= 0.75

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`
      }
      if (glowRef.current) {
        glowRef.current.style.transform =
          `translate(calc(${gx}px - 50%), calc(${gy}px - 50%))`
      }

      // Squash-and-stretch the dot based on movement speed (only when not hovering)
      if (curRef.current && !hovering) {
        const speed   = Math.sqrt(svx * svx + svy * svy)
        const stretch = Math.min(speed * 0.055, 0.72)   // capped elongation
        const angle   = Math.atan2(svy, svx) * (180 / Math.PI)
        curRef.current.style.transform =
          `translate(calc(${mx}px - 50%), calc(${my}px - 50%)) ` +
          `rotate(${angle}deg) scaleX(${1 + stretch})`
      }

      rafId = requestAnimationFrame(render)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)
    rafId = requestAnimationFrame(render)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} id="cur-glow" />
      <div ref={curRef}  id="cur" />
      <div ref={ringRef} id="cur-ring" />
    </>
  )
}
