import { useInView } from 'react-intersection-observer'
import styles from './Experience.module.css'
import { experience } from '@data/experience'

function TimelineItem({ item, index }) {
  const { ref, inView } = useInView({
    triggerOnce: false, // Allows the animation to trigger every time you scroll past it
    threshold: 0.1, 
    rootMargin: '0px 0px -10% 0px' 
  })

  const animClass = inView ? styles.cardVisible : styles.cardHidden

  return (
    <div className={styles.tlItem} ref={ref}>
      <div className={styles.tlNode}>
        <div className={styles.tlRing} />
        <div className={styles.tlDot} />
      </div>
      
      {/* Decorative partner shape on the opposite side of the card */}
      <div className={`${styles.tlDeco} ${animClass}`}>
        <div className={styles.decoHex}>
          <div className={styles.hexPart} />
          <div className={styles.hexPart} />
          <div className={styles.hexPart} />
        </div>
      </div>

      <div className={`${styles.tlCard} glass-card ${animClass}`}>
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
          {item.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="section" style={{ position: 'relative' }}>
      
      {/* Floating 3D Decorations */}
      <div className={styles.decoContainer}>
        {/* Main Cube */}
        <div className={`${styles.holoCube} ${styles.float1}`}>
          <div className={styles.cubeFace} style={{ transform: 'rotateY(0deg) translateZ(30px)' }} />
          <div className={styles.cubeFace} style={{ transform: 'rotateY(90deg) translateZ(30px)' }} />
          <div className={styles.cubeFace} style={{ transform: 'rotateY(180deg) translateZ(30px)' }} />
          <div className={styles.cubeFace} style={{ transform: 'rotateY(-90deg) translateZ(30px)' }} />
          <div className={styles.cubeFace} style={{ transform: 'rotateX(90deg) translateZ(30px)' }} />
          <div className={styles.cubeFace} style={{ transform: 'rotateX(-90deg) translateZ(30px)' }} />
        </div>

        {/* Floating Octahedron 1 */}
        <div className={`${styles.octahedron} ${styles.float2}`} style={{ top: '20%', left: '10%' }}>
          {[...Array(8)].map((_, i) => <div key={i} className={styles.octaFace} />)}
        </div>

        {/* Floating Octahedron 2 */}
        <div className={`${styles.octahedron} ${styles.float3}`} style={{ top: '60%', right: '10%' }}>
          {[...Array(8)].map((_, i) => <div key={i} className={styles.octaFace} />)}
        </div>

        {/* Holographic Ring */}
        <div className={`${styles.hologramRing} ${styles.float1}`} style={{ top: '40%', right: '5%' }} />
      </div>

      <div className={styles.sectionHeader}>
        <span className={styles.secTag}>// 02</span>
        <h2 className={styles.secTitle}>EXPERIENCE</h2>
        <div className={styles.secLine} />
      </div>

      <div className={styles.timeline}>
        <div className={styles.tlSpine} />

        {experience.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
