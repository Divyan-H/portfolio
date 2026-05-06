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
      
      // Fake loading progress could hook in here
      if (done === CFG.frameCount) {
        setTimeout(() => setLoaderDone(), 1000) // Give it a sec for effect
      }
    }

    const batch = (start) => {
      const end = Math.min(start + CFG.batchSize, CFG.frameCount)
      for (let i = start; i < end; i++) {
        const img = new Image()
        const idx = i
        img.onload = () => onLoad(idx, img)
        img.onerror = () => { const b = new Image(); onLoad(idx, b) }
        img.src = CFG.framePath(i + 1)
      }
      if (end < CFG.frameCount) {
        requestAnimationFrame(() => batch(end))
      }
    }

    // Failsafe: force loader done after 5s regardless of frame status
    const failsafe = setTimeout(() => {
      if (done < CFG.frameCount) {
        console.warn('Loader timed out, forcing visibility...')
        setLoaderDone()
      }
    }, 5000)

    batch(0)

    return () => clearTimeout(failsafe)
  }, [canvasRef, setLoaderDone])

  // ── DRAW FRAME ──
  const drawFrame = (idx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = framesRef.current[idx]
    
    if (!img || !img.complete || !img.naturalWidth) return
    
    // Set canvas internal resolution to match the frame exactly once
    if (canvas.width !== img.naturalWidth) {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
    }
    
    // Draw the image filling the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
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
