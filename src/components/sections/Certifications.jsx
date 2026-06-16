import styles from './Certifications.module.css'
import { certifications } from '@data/certifications'

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className={styles.sectionHeader} data-reveal>
        <span className={styles.secTag}>// 05</span>
        <h2 className={styles.secTitle}>CERTIFICATIONS</h2>
        <div className={styles.secLine} />
      </div>

      <div className={styles.certsGrid} data-reveal>
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className={`${styles.certCard} glass-card`}
          >
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
          </div>
        ))}
      </div>
    </section>
  )
}
