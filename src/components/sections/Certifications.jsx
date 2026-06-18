import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Card3D from '@components/ui/Card3D'
import styles from './Certifications.module.css'
import { certifications } from '@data/certifications'

const EASE = [0.16, 1, 0.3, 1]

function CertCard({ cert, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.92, filter: 'blur(10px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: EASE }}
    >
      <Card3D className={`${styles.certCard} glass-card`} depth={7}>
        <span className="electric-border" aria-hidden="true" />
        <div className={styles.certIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L3.5 7V17L12 22L20.5 17V7L12 2Z" />
            <path d="M12 22V12" opacity="0.5" />
            <path d="M20.5 7L12 12L3.5 7" opacity="0.5" />
          </svg>
        </div>
        <div className={styles.certInfo}>
          <h3 className={styles.certName}>{cert.name}</h3>
          <p className={styles.certIssuer}>{cert.issuer} • {cert.year}</p>
        </div>
        <div className={styles.certBadgeWrap}>
          <span className={styles.certBadge}>{cert.badge}</span>
        </div>
      </Card3D>
    </motion.div>
  )
}

export default function Certifications() {
  const { ref: hdrRef, inView: hdrIn } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="certifications" className="section">
      <motion.div
        ref={hdrRef}
        className={styles.sectionHeader}
        initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
        animate={hdrIn ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className={`${styles.secTag} neon-tag`}>// 05</span>
        <h2 className={styles.secTitle}>CERTIFICATIONS</h2>
        <div className={styles.secLine} />
      </motion.div>

      <div className={styles.certsGrid}>
        {certifications.map((cert, i) => (
          <CertCard key={cert.name} cert={cert} index={i} />
        ))}
      </div>
    </section>
  )
}
