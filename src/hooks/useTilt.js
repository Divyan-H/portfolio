import { useEffect } from 'react'

/**
 * Cursor-reactive 3D tilt for glass panels. Any element carrying a
 * [data-tilt] attribute gently rotates toward the pointer and lifts,
 * so the panel reads as a physical pane of glass floating in space.
 *
 * Honours an optional [data-tilt-max] (degrees, default 7) and is a
 * no-op for touch devices and reduced-motion users.
 */
export default function useTilt() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduce || noHover) return

    const cards = Array.from(document.querySelectorAll('[data-tilt]'))
    if (!cards.length) return

    const cleanups = cards.map((card) => {
      const max = parseFloat(card.dataset.tiltMax || '7')
      let raf = 0

      const onMove = (e) => {
        const rect = card.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width - 0.5
        const py = (e.clientY - rect.top) / rect.height - 0.5
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--ry', (px * max).toFixed(2) + 'deg')
          card.style.setProperty('--rx', (-py * max).toFixed(2) + 'deg')
          // glare follows the pointer
          card.style.setProperty('--mx', (px * 100 + 50).toFixed(1) + '%')
          card.style.setProperty('--my', (py * 100 + 50).toFixed(1) + '%')
        })
      }

      const onEnter = () => {
        card.style.setProperty('--lift', '-10px')
        card.style.setProperty('--glare', '1')
      }

      const onLeave = () => {
        cancelAnimationFrame(raf)
        card.style.setProperty('--rx', '0deg')
        card.style.setProperty('--ry', '0deg')
        card.style.setProperty('--lift', '0px')
        card.style.setProperty('--glare', '0')
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)

      return () => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mouseleave', onLeave)
        cancelAnimationFrame(raf)
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])
}
