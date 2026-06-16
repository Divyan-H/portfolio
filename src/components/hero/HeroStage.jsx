import { useRef } from 'react'
import useAppStore from '@store/useAppStore'
import useFrameAnimation from '@hooks/useFrameAnimation'
import NebulaFlow from '@components/canvas/NebulaFlow'
import PhaseIntro from './PhaseIntro'
import PhaseAbout from './PhaseAbout'
import PhaseMetrics from './PhaseMetrics'
import styles from './HeroStage.module.css'

export default function HeroStage() {
  const canvasRef = useRef(null)
  
  // Custom hook handles the frame loading and rendering loop
  useFrameAnimation(canvasRef)

  // We read the smoothed progress from Zustand to drive the depth recession effect
  const smoothProg = useAppStore((state) => state.smoothProg)

  // Calculate dynamic styles based on scroll progress
  const getStageStyles = () => {
    // Subtle breathing zoom in over the entire scroll length
    const scale = 1 + smoothProg * 0.05 // 1.0 -> 1.05
    return {
      opacity: 1,
      transform: `scale(${scale.toFixed(4)})`,
      filter: 'blur(0px)'
    }
  }

  return (
    <section className={styles.heroSection}>
      {/* 
        Sticky container holds the canvas and text overlay.
        It stays on screen while the user scrolls down the height of the section.
      */}
      <div
        className={styles.heroStage}
        style={getStageStyles()}
      >
        {/* Live nebula sits behind the video; the canvas screen-blends onto it
            so the dark room dissolves and the subject stands inside the flow. */}
        <div className={styles.heroNebula}>
          <NebulaFlow contained />
        </div>
        <canvas ref={canvasRef} className={styles.heroCanvas} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroGrid} />
        <div className={styles.vignette} />

        {/* ── Scroll Phases ── */}
        <PhaseIntro />
        <PhaseAbout />
        <PhaseMetrics />
      </div>

      {/* 
        The scroll driver creates the actual scrollable height.
        Since CFG.scrollMult is 5, we make this 500vh.
      */}
      <div className={styles.scrollDriver} />
    </section>
  )
}
