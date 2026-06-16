import { useEffect, useRef } from 'react'
import useAppStore from '@store/useAppStore'
import styles from './Phases.module.css'

export default function PhaseAbout() {
  const activePhase = useAppStore((state) => state.activePhase)
  const isActive = activePhase === 1

  return (
    <div className={`${styles.phaseContainer} ${isActive ? styles.active : styles.exit}`}>
      <div className={styles.heroTag}>[ IDENTITY MATRIX ]</div>
      
      <div className={styles.aboutInner} data-tilt data-tilt-max="5">
        <div className={styles.avatar}>
          <div className={`${styles.avRing} ${styles.r1}`} />
          <div className={`${styles.avRing} ${styles.r2}`} />
          <div className={`${styles.avRing} ${styles.r3}`} />
          <div className={styles.avInner}>HD</div>
        </div>
        
        <div className={styles.aboutText}>
          <h2 className={styles.name}>H. DIVYAN</h2>
          <p className={styles.role}>B.Tech AI & Data Science &nbsp;·&nbsp; SRM IST</p>
          <p className={styles.bio}>
            Passionate AI/ML Engineer building systems at the intersection of deep learning, computer vision, and real-world environmental challenges. Focused on AI-driven solutions for agriculture, healthcare & sustainability.
          </p>
          <div className={styles.tags}>
            {['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'AI for Agriculture'].map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
