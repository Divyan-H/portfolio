import { useRef } from 'react'
import useAppStore from '@store/useAppStore'
import useFrameAnimation from '@hooks/useFrameAnimation'
import NebulaFlow from '@components/canvas/NebulaFlow'
import PhaseIntro from './PhaseIntro'
import PhaseAbout from './PhaseAbout'
import PhaseMetrics from './PhaseMetrics'
import styles from './HeroStage.module.css'

const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768

export default function HeroStage() {
  const canvasRef = useRef(null)
  useFrameAnimation(canvasRef)

  // On mobile skip the smoothProg subscription — no breathing zoom to avoid re-renders.
  const smoothProg = useAppStore((state) => isMobileDevice ? 0 : state.smoothProg)

  const getStageStyles = () => {
    if (isMobileDevice) return {}
    const scale = 1 + smoothProg * 0.05

    // Exit vortex: last 18 % of hero scroll (smoothProg 0.82 → 1.0)
    // Zoom in + blur + fade — hero "dissolves" before the curtain reveals Experience
    const exitT = Math.max(0, Math.min(1, (smoothProg - 0.82) / 0.18))
    if (exitT > 0) {
      const e = exitT * exitT  // quadratic ease-in for dramatic acceleration
      return {
        transform:  `scale(${(scale + e * 0.14).toFixed(4)})`,
        filter:     `blur(${(e * 22).toFixed(1)}px) brightness(${(1 - e * 0.55).toFixed(3)})`,
        opacity:    (1 - e * 0.97).toFixed(4),
      }
    }

    return { transform: `scale(${scale.toFixed(4)})` }
  }

  return (
    <section className={styles.heroSection}>
      <div
        className={styles.heroStage}
        style={getStageStyles()}
      >
        {/* On mobile, the global NebulaFlow (fixed, always on) handles the backdrop.
            On desktop, a contained instance sits directly behind the video so the
            screen-blend dissolves the dark room into the nebula flow. */}
        {!isMobileDevice && (
          <div className={styles.heroNebula}>
            <NebulaFlow contained />
          </div>
        )}
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
