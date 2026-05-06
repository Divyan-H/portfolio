import { useEffect, useRef } from 'react'
import useAppStore from '@store/useAppStore'

const CFG = {
  frameCount: 176,
  framePath: (n) => `/frames/ezgif-frame-${String(n).padStart(3, '0')}.jpg`,
  ease: 0.09,
  batchSize: 12,
}

export default function useFrameAnimation(canvasRef) {
  const framesRef = useRef([])
  const curFrameRef = useRef(0)
  const smoothProgRef = useRef(0)
  const reqRef = useRef()

  const rawProg = useAppStore((state) => state.rawProg)
  const setLoaderDone = useAppStore((state) => state.setLoaderDone)
  const setSmoothProg = useAppStore((state) => state.setSmoothProg)
  const setActivePhase = useAppStore((state) => state.setActivePhase)

  const isMobile = useRef(window.innerWidth < 768)
  const hasRevealed = useRef(false)
  const lastDrawTime = useRef(0)

  // ── PRELOAD FRAMES ──
  useEffect(() => {
    let done = 0
    framesRef.current = new Array(CFG.frameCount)

    const onLoad = (i, img) => {
      framesRef.current[i] = img
      done++
      
      // Draw first frame immediately
      if (i === 0 && canvasRef.current) {
        drawFrame(0)
      }
      
      // ULTRA-OPTIMIZATION: Immediate Reveal
      // Allow user to enter after only 5% of frames (about 10 frames)
      // This makes the site feel almost instant.
      if (!hasRevealed.current && (done >= Math.floor(CFG.frameCount * 0.05) || done === CFG.frameCount)) {
        hasRevealed.current = true
        setLoaderDone()
      }
    }

    const batch = (start) => {
      const end = Math.min(start + CFG.batchSize, CFG.frameCount)
      for (let i = start; i < end; i++) {
        const img = new Image()
        const idx = i
        img.onload = () => onLoad(idx, img)
        img.onerror = () => { 
          done++
          if (done === CFG.frameCount && !hasRevealed.current) setLoaderDone()
        }
        img.src = CFG.framePath(i + 1)
      }
      if (end < CFG.frameCount) {
        requestAnimationFrame(() => batch(end))
      }
    }

    batch(0)
  }, [canvasRef, setLoaderDone])

  // ── DRAW FRAME ──
  const drawFrame = (idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // PERFORMANCE OPTIMIZATION: Frame Throttling on Mobile
    // If mobile, only draw if 32ms has passed (max 30fps) to save GPU
    const now = performance.now()
    if (isMobile.current && now - lastDrawTime.current < 32) return
    lastDrawTime.current = now

    const ctx = canvas.getContext('2d', { alpha: false })
    const img = framesRef.current[idx]
    
    if (!img || !img.complete || !img.naturalWidth) return
    
    // PERFORMANCE OPTIMIZATION: Ultra-low res for Mobile
    const scale = isMobile.current ? 0.4 : 1.0
    const targetW = Math.floor(img.naturalWidth * scale)
    const targetH = Math.floor(img.naturalHeight * scale)

    if (canvas.width !== targetW) {
      canvas.width = targetW
      canvas.height = targetH
    }
    
    ctx.drawImage(img, 0, 0, targetW, targetH)
  }

  // ── RENDER LOOP ──
  useEffect(() => {
    const renderLoop = () => {
      // Easing logic
      smoothProgRef.current += (useAppStore.getState().rawProg - smoothProgRef.current) * CFG.ease
      setSmoothProg(smoothProgRef.current)
      
      // Calculate frame
      const idx = Math.min(CFG.frameCount - 1, Math.floor(smoothProgRef.current * (CFG.frameCount - 1)))
      
      if (idx !== curFrameRef.current) {
        curFrameRef.current = idx
        drawFrame(idx)
      }

      // Update Phase
      const p = useAppStore.getState().rawProg
      let newPhase = 0
      if (p >= 0.33 && p < 0.66) newPhase = 1
      else if (p >= 0.66) newPhase = 2
      
      if (useAppStore.getState().activePhase !== newPhase) {
        setActivePhase(newPhase)
      }

      reqRef.current = requestAnimationFrame(renderLoop)
    }

    reqRef.current = requestAnimationFrame(renderLoop)
    return () => cancelAnimationFrame(reqRef.current)
  }, [setSmoothProg, setActivePhase])

  // Handle Initial Paint
  useEffect(() => {
    if (framesRef.current[curFrameRef.current]) {
      drawFrame(curFrameRef.current)
    }
  }, [canvasRef])
}
