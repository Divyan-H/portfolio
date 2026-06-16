import { useEffect, useRef } from 'react'
import useAppStore from '@store/useAppStore'
import { metrics } from '@data/skills'
import styles from './Phases.module.css'

export default function PhaseMetrics() {
  const activePhase = useAppStore((state) => state.activePhase)
  const isActive = activePhase === 2
  
  // Animation refs
  const animatedRef = useRef(false)
  const numRefs = useRef([])

  useEffect(() => {
    if (isActive && !animatedRef.current) {
      animatedRef.current = true
      
      numRefs.current.forEach((el, i) => {
        if (!el) return
        const metric = metrics[i]
        const target = metric.num
        const isDecimal = metric.decimal
        const suffix = metric.suffix
        
        const duration = 1600
        const start = performance.now()
        
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          
          if (isDecimal) {
            el.textContent = (target * eased).toFixed(2) + suffix
          } else {
            el.textContent = Math.round(target * eased) + suffix
          }
          
          if (progress < 1) requestAnimationFrame(step)
          else el.textContent = isDecimal ? target.toFixed(2) + suffix : target + suffix
        }
        
        requestAnimationFrame(step)
      })
    }
  }, [isActive])

  return (
    <div className={`${styles.phaseContainer} ${isActive ? styles.active : styles.exit}`}>
      <div className={styles.heroTag}>[ SYSTEM METRICS ]</div>
      
      <h2 className={styles.metricsTitle}>BY THE NUMBERS</h2>
      
      <div className={styles.metricsGrid}>
        {metrics.map((m, i) => (
          <div key={m.label} className={styles.metricItem} data-tilt data-tilt-max="10">
            <div 
              className={styles.metricNum} 
              ref={el => numRefs.current[i] = el}
            >
              0{m.suffix}
            </div>
            <div className={styles.metricLabel}>{m.label}</div>
            <div className={styles.metricSub}>{m.sub}</div>
          </div>
        ))}
      </div>
      
      <p className={styles.ctaHint}>↓ CONTINUE SCROLLING FOR EXPERIENCE</p>
    </div>
  )
}
