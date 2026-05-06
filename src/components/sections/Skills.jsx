import styles from './Skills.module.css'
import HoloSkillsCanvas from '@components/canvas/HoloSkillsCanvas'

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className={styles.sectionHeader}>
        <span className={styles.secTag}>// 04</span>
        <h2 className={styles.secTitle}>CORE CAPABILITIES</h2>
        <div className={styles.secLine} />
      </div>

      <div className={styles.skillsLayout}>
        <p className={styles.skillsDesc}>
          Specialized in end-to-end AI/ML development, from training custom deep neural networks to deploying scalable computer vision models. My toolset is visualized below as three specialized holographic neural clusters.
        </p>

        {/* Three.js Hologram Stage */}
        <div className={styles.hologramStage}>
          <div className={styles.canvasContainer}>
            <HoloSkillsCanvas />
          </div>
          
          {/* Overlay UI elements for extra "HUD" feel */}
          <div className={styles.hudOverlay}>
            <div className={styles.hudLeft}>
              <span>STATUS: OPERATIONAL</span>
              <span>BUFFER: 100%</span>
            </div>
            <div className={styles.hudRight}>
              <span>NODE_COUNT: 22</span>
              <span>SCAN_MODE: ACTIVE</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
