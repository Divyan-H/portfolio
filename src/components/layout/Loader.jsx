import { useEffect } from 'react'
import useAppStore from '@store/useAppStore'
import styles from './Loader.module.css'

export default function Loader() {
  const loaderDone = useAppStore((state) => state.loaderDone)

  // Block scroll while loading
  useEffect(() => {
    if (!loaderDone) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [loaderDone])

  if (loaderDone) return null

  return (
    <div className={`${styles.loaderContainer} ${loaderDone ? styles.gone : ''}`}>
      <div className={styles.loaderContent}>
        <div className={styles.sysText}>NEURAL_CORE_BOOT_SEQUENCE</div>
        <div className={styles.loaderBarWrap}>
          <div className={styles.loaderBarFill} id="ldBar" />
        </div>
        <div className={styles.ldTextWrap}>
          <span className={styles.statusLabel}>STATUS</span>
          <span className={styles.statusMsg} id="ldText">INITIALIZING...</span>
        </div>
      </div>
      <div className={styles.gridOverlay} />
    </div>
  )
}
