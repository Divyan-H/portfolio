import { useEffect, useRef } from 'react'
import useAppStore from '@store/useAppStore'

const CFG        = { ease: 0.09, batchSize: 12 }
const TOTAL_FRAMES = 176

export default function useFrameAnimation(canvasRef) {
  const framesRef     = useRef([])
  const curFrameRef   = useRef(0)
  const smoothProgRef = useRef(0)
  const reqRef        = useRef(null)
  const lastLoopTime  = useRef(0)

  const setLoaderDone  = useAppStore((state) => state.setLoaderDone)
  const setSmoothProg  = useAppStore((state) => state.setSmoothProg)
  const setActivePhase = useAppStore((state) => state.setActivePhase)

  const isMobile    = useRef(typeof window !== 'undefined' && window.innerWidth < 768)
  const hasRevealed = useRef(false)

  // ── DRAW ──
  // Frames are pre-sized per platform (frames-sm = 960×540 for mobile, frames = 2560×1440 for desktop).
  // No JS downscale needed — draw at natural size so canvas resolution matches the source.
  const drawFrame = (idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = framesRef.current[idx]
    if (!img || !img.complete || !img.naturalWidth) return
    const w = img.naturalWidth, h = img.naturalHeight
    if (canvas.width !== w) { canvas.width = w; canvas.height = h }
    canvas.getContext('2d', { alpha: false }).drawImage(img, 0, 0, w, h)
  }

  // ── PRELOAD ──
  // Mobile: frames-sm/ (960×540, ~38 KB each) + STEP=2 → 88 frames × 38 KB ≈ 3.3 MB
  // Desktop: frames/ (2560×1440, ~86 KB each) + STEP=1 → 176 frames × 86 KB ≈ 14.8 MB
  useEffect(() => {
    const mobile = isMobile.current
    const STEP   = mobile ? 2 : 1
    const COUNT  = Math.ceil(TOTAL_FRAMES / STEP)
    const dir    = mobile ? 'frames-sm' : 'frames'
    const path   = (n) => `/${dir}/ezgif-frame-${String(n * STEP + 1).padStart(3, '0')}.jpg`

    let done = 0
    framesRef.current = new Array(COUNT)

    const onLoad = (i, img) => {
      framesRef.current[i] = img
      done++
      if (i === 0 && canvasRef.current) drawFrame(0)
      if (!hasRevealed.current && (done >= Math.floor(COUNT * 0.05) || done === COUNT)) {
        hasRevealed.current = true
        setLoaderDone()
      }
    }

    const batch = (start) => {
      const end = Math.min(start + CFG.batchSize, COUNT)
      for (let i = start; i < end; i++) {
        const img = new Image()
        const idx = i
        img.onload  = () => onLoad(idx, img)
        img.onerror = () => { done++; if (done === COUNT && !hasRevealed.current) setLoaderDone() }
        img.src = path(i)
      }
      if (end < COUNT) requestAnimationFrame(() => batch(end))
    }
    batch(0)
  }, [canvasRef, setLoaderDone])

  // ── RENDER LOOP ──
  useEffect(() => {
    const mobile = isMobile.current
    const STEP   = mobile ? 2 : 1
    const COUNT  = Math.ceil(TOTAL_FRAMES / STEP)

    const renderLoop = (t) => {
      // Throttle entire loop to ~30 fps on mobile (not just the draw call).
      if (mobile && t - lastLoopTime.current < 33) {
        reqRef.current = requestAnimationFrame(renderLoop)
        return
      }
      lastLoopTime.current = t

      const rawProg = useAppStore.getState().rawProg
      smoothProgRef.current += (rawProg - smoothProgRef.current) * CFG.ease
      setSmoothProg(smoothProgRef.current)

      const idx = Math.min(COUNT - 1, Math.floor(smoothProgRef.current * (COUNT - 1)))
      if (idx !== curFrameRef.current) {
        curFrameRef.current = idx
        drawFrame(idx)
      }

      const p = rawProg
      const newPhase = p >= 0.66 ? 2 : p >= 0.33 ? 1 : 0
      if (useAppStore.getState().activePhase !== newPhase) setActivePhase(newPhase)

      // Mobile: pause the loop when easing has settled. A scroll listener restarts it.
      if (mobile && Math.abs(rawProg - smoothProgRef.current) < 0.001) {
        reqRef.current = null
        return
      }

      reqRef.current = requestAnimationFrame(renderLoop)
    }

    // Re-arm the loop on any scroll event so the pause is invisible to the user.
    const wakeLoop = () => {
      if (!reqRef.current) reqRef.current = requestAnimationFrame(renderLoop)
    }
    if (mobile) window.addEventListener('scroll', wakeLoop, { passive: true })

    reqRef.current = requestAnimationFrame(renderLoop)

    return () => {
      cancelAnimationFrame(reqRef.current)
      reqRef.current = null
      if (mobile) window.removeEventListener('scroll', wakeLoop)
    }
  }, [setSmoothProg, setActivePhase])
}
