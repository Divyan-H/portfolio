import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useAppStore from '@store/useAppStore'
import styles from './Loader.module.css'

export default function Loader() {
  const loaderDone = useAppStore((state) => state.loaderDone)

  useEffect(() => {
    if (!loaderDone) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [loaderDone])

  return (
    <AnimatePresence>
      {!loaderDone && (
        <motion.div
          className={styles.loaderContainer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
