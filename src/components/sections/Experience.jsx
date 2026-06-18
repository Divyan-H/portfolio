import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Card3D from '@components/ui/Card3D'
import styles from './Experience.module.css'
import { experience } from '@data/experience'

const EASE = [0.16, 1, 0.3, 1]

function TimelineItem({ item, index }) {
  const isLeft = index % 2 === 0
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: '0px 0px -6% 0px' })

  return (
    <div className={styles.tlItem} ref={ref}>
      <div className={styles.tlNode}>
        <motion.div
          className={styles.tlRing}
          animate={inView ? { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className={styles.tlDot} />
      </div>

      {/* Deco side */}
      <motion.div
        className={styles.tlDeco}
        initial={{ opacity: 0, x: isLeft ? 40 : -40, rotateY: isLeft ? 20 : -20 }}
        animate={inView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        style={{ perspective: '600px' }}
      >
        <div className={styles.decoHex}>
          <div className={styles.hexPart} />
          <div className={styles.hexPart} />
          <div className={styles.hexPart} />
        </div>
      </motion.div>

      {/* 3D Card */}
      <motion.div
        className={styles.tlCardWrap}
        initial={{ opacity: 0, y: 70, scale: 0.88, filter: 'blur(14px)' }}
        animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <Card3D className={`${styles.tlCard} glass-card`} depth={8}>
          {/* Electric border */}
          <span className="electric-border" aria-hidden="true" />

          <div className={styles.cardHeaderDeco}>
            <span>NODE_ID: {1024 + index * 128}</span>
            <span>SEQ: 00{index + 1}</span>
          </div>
          <div className={styles.tlHead}>
            <div>
              <h3 className={styles.tlRole}>{item.role}</h3>
              <p className={styles.tlCo}>{item.company}</p>
            </div>
            <span className={styles.tlBadge}>{item.badge}</span>
          </div>

          <p className={styles.tlDate}>[ DATE: {item.year} ]</p>
          <p className={styles.tlDesc}>{item.description}</p>

          <div className={styles.tlTags}>
            {item.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="tag"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.07, ease: 'backOut' }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </Card3D>
      </motion.div>
    </div>
  )
}

export default function Experience() {
  const { ref: hdrRef, inView: hdrIn } = useInView({ triggerOnce: true, threshold: 0.2 })

  return (
    <section id="experience" className="section" style={{ position: 'relative' }}>

      {/* Floating 3D decorations */}
      <div className={styles.decoContainer}>
        <div className={`${styles.holoCube} ${styles.float1}`}>
          {['rotateY(0deg)','rotateY(90deg)','rotateY(180deg)','rotateY(-90deg)','rotateX(90deg)','rotateX(-90deg)'].map((t, i) => (
            <div key={i} className={styles.cubeFace} style={{ transform: `${t} translateZ(30px)` }} />
          ))}
        </div>
        <div className={`${styles.octahedron} ${styles.float2}`} style={{ top: '20%', left: '10%' }}>
          {[...Array(8)].map((_, i) => <div key={i} className={styles.octaFace} />)}
        </div>
        <div className={`${styles.octahedron} ${styles.float3}`} style={{ top: '60%', right: '10%' }}>
          {[...Array(8)].map((_, i) => <div key={i} className={styles.octaFace} />)}
        </div>
        <div className={`${styles.hologramRing} ${styles.float1}`} style={{ top: '40%', right: '5%' }} />
      </div>

      <motion.div
        ref={hdrRef}
        className={styles.sectionHeader}
        initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
        animate={hdrIn ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className={`${styles.secTag} neon-tag`}>// 02</span>
        <h2 className={styles.secTitle}>EXPERIENCE</h2>
        <div className={styles.secLine} />
      </motion.div>

      <div className={styles.timeline}>
        <div className={styles.tlSpine} />
        {experience.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
