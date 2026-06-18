import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Card3D from '@components/ui/Card3D'
import styles from './Skills.module.css'
import { skillClusters } from '@data/skills'

const { aiml, frameworks, genai, vision, data } = skillClusters
const EASE = [0.16, 1, 0.3, 1]

/* ── Animated counter ── */
function Counter({ to, duration = 1.8 }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const raf = useRef(null)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * to))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, to, duration])

  return <span ref={ref}>{val}</span>
}

function Brackets() {
  return (
    <>
      <i className={styles.cTL} aria-hidden="true" />
      <i className={styles.cBR} aria-hidden="true" />
    </>
  )
}

function ClusterHead({ id, title, layer }) {
  return (
    <header className={styles.head}>
      <span className={styles.headId}>{id} · CLUSTER</span>
      <h3 className={styles.headTitle}>{title}</h3>
      <span className={styles.headLayer}>{layer}</span>
    </header>
  )
}

function Pills({ tags, variant = 'teal' }) {
  return (
    <ul className={`${styles.pills} ${variant === 'violet' ? styles.pillsViolet : ''}`}>
      {tags.map((t) => <li key={t} className={styles.pill}>{t}</li>)}
    </ul>
  )
}

function Radar() {
  return (
    <div className={styles.radar}>
      <svg viewBox="0 0 200 200" className={styles.radarSvg} aria-hidden="true">
        <circle cx="100" cy="100" r="82" className={styles.radarRing} />
        <circle cx="100" cy="100" r="56" className={styles.radarRing} />
        <circle cx="100" cy="100" r="30" className={styles.radarRing} />
        <path d="M100 18 A82 82 0 0 1 173 60" className={styles.radarArc} />
        <path d="M100 44 A56 56 0 0 1 148 74" className={styles.radarArcDim} />
        <g className={styles.radarSweep}>
          <line x1="100" y1="100" x2="100" y2="18" className={styles.radarSweepLine} />
        </g>
      </svg>
      <div className={styles.radarCore}>AI/ML<br />ENGINE</div>
    </div>
  )
}

function NeuralNet() {
  const cols = [{ x:28,n:4},{x:98,n:5},{x:168,n:4},{x:238,n:5},{x:308,n:4}]
  const H = 190, pad = 26
  const pts = cols.map((c) =>
    Array.from({ length: c.n }, (_, i) => ({
      x: c.x,
      y: pad + (H - 2*pad) * (c.n === 1 ? 0.5 : i / (c.n - 1)),
    }))
  )
  const lines = []
  for (let c = 0; c < pts.length - 1; c++) {
    pts[c].forEach((p, i) => {
      const nxt = pts[c+1]
      ;[i % nxt.length, (i+1) % nxt.length].forEach((j) => lines.push([p, nxt[j]]))
    })
  }
  return (
    <div className={styles.neural}>
      <svg viewBox="0 0 336 190" className={styles.neuralSvg} aria-hidden="true">
        {lines.map(([a,b],i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.nLine} />)}
        {pts.flat().map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2+(i%3)}
            className={i%3===0 ? styles.nNodeAlt : styles.nNode} />
        ))}
        <text x="150" y="46" className={styles.nGlyph}>1</text>
        <text x="206" y="150" className={styles.nGlyph}>1</text>
      </svg>
      <span className={styles.statusPill}>NEURAL ARCH. ACTIVE</span>
    </div>
  )
}

function VisionFeed() {
  return (
    <div className={styles.vision}>
      <div className={styles.visionFloor} />
      <div className={`${styles.bbox} ${styles.bboxA}`}><span>OBJECT_01 97%</span></div>
      <div className={`${styles.bbox} ${styles.bboxB}`}><span>OBJECT_02 94%</span></div>
      <div className={`${styles.bbox} ${styles.bboxC}`}><span>OBJECT_03 88%</span></div>
      <span className={styles.statusPill}>VISION PIPELINE ACTIVE</span>
    </div>
  )
}

function HexMap() {
  const rows = [3, 3, 2]; let n = 0
  return (
    <div className={styles.skillMap}>
      <span className={styles.mapLabel}>SKILL MAP</span>
      <div className={styles.hive}>
        {rows.map((count, r) => (
          <div key={r} className={styles.hiveRow}>
            {Array.from({ length: count }).map(() => {
              const alt = n++ % 3 === 1
              return <span key={n} className={`${styles.hex} ${alt ? styles.hexAlt : ''}`} />
            })}
          </div>
        ))}
      </div>
      <span className={styles.mapStat}>8 / 8 ACTIVE</span>
    </div>
  )
}

function Orbit() {
  return (
    <div className={styles.orbit}>
      <svg viewBox="0 0 260 200" className={styles.orbitSvg} aria-hidden="true">
        <circle cx="130" cy="100" r="48" className={styles.orbitRing} />
        <circle cx="130" cy="100" r="80" className={styles.orbitRing} />
      </svg>
      <span className={styles.orbitCore}>DEPLOY<br />CORE</span>
      <span className={styles.orbNode} style={{top:'24%',left:'46%'}} data-label="FastAPI" />
      <span className={styles.orbNode} style={{top:'18%',left:'70%'}} data-label="Pandas" />
      <span className={styles.orbNodeAlt} style={{top:'74%',left:'40%'}} data-label="Firebase" />
      <span className={styles.orbNodeAlt} style={{top:'80%',left:'82%'}} data-label="REST API" />
    </div>
  )
}

/* ── Animated bento card ── */
function BentoCard({ className, delay = 0, depth = 10, children }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 55, rotateX: 14, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      transition={{ duration: 0.85, delay, ease: EASE }}
      style={{ perspective: '1100px', transformStyle: 'preserve-3d' }}
    >
      <Card3D className={`${styles.card} ${className || ''}`} depth={depth}>
        <span className="electric-border" aria-hidden="true" />
        {children}
      </Card3D>
    </motion.div>
  )
}

export default function Skills() {
  const { ref: kickerRef, inView: kickerIn } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: titleRef, inView: titleIn } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: statusRef, inView: statusIn } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section id="skills" className="section">
      <motion.div
        ref={kickerRef}
        className={styles.kicker}
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={kickerIn ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className={`${styles.kickerNum} neon-tag`}>//04</span>
        <span className={styles.kickerLabel}>CORE CAPABILITIES</span>
        <div className={styles.kickerLine} />
      </motion.div>

      <motion.div
        ref={titleRef}
        className={styles.titleWrap}
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(18px)' }}
        animate={titleIn ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 1.0, ease: EASE }}
      >
        <div className={styles.blobA} />
        <div className={styles.blobB} />
        <h2 className={`${styles.bigTitle} chroma-text`} data-text="SKILLS">SKILLS</h2>
      </motion.div>

      {/* Row 1 — staggered 3D bento cards */}
      <div className={styles.rowTop}>
        <BentoCard delay={0}>
          <Brackets />
          <ClusterHead {...aiml} />
          <Radar />
          <Pills tags={aiml.tags} />
        </BentoCard>

        <BentoCard delay={0.12}>
          <Brackets />
          <NeuralNet />
          <ClusterHead {...frameworks} />
          <Pills tags={frameworks.tags} />
        </BentoCard>

        <BentoCard delay={0.24}>
          <Brackets />
          <ClusterHead {...genai} />
          <Pills tags={genai.tags} variant="violet" />
        </BentoCard>
      </div>

      {/* Row 2 */}
      <div className={styles.rowBottom}>
        <BentoCard className={styles.cardCv} delay={0} depth={8}>
          <Brackets />
          <VisionFeed />
          <div className={styles.cvBody}>
            <div className={styles.cvLeft}>
              <ClusterHead {...vision} />
              <Pills tags={vision.tags} />
            </div>
            <div className={styles.cvRight}><HexMap /></div>
          </div>
          <span className={styles.watermark}>04</span>
        </BentoCard>

        <BentoCard className={styles.cardData} delay={0.15} depth={8}>
          <Brackets />
          <ClusterHead {...data} />
          <Orbit />
          <Pills tags={data.tags} />
          <div className={styles.dataFooter}>
            <div className={styles.totalNodes}>
              <strong><Counter to={22} /></strong>
              <span>TOTAL<br />SKILL<br />NODES</span>
            </div>
            <span className={styles.openPill}>OPEN<br />TO<br />WORK</span>
          </div>
          <span className={styles.watermark}>05</span>
        </BentoCard>
      </div>

      <motion.div
        ref={statusRef}
        className={styles.statusBar}
        initial={{ opacity: 0, y: 20 }}
        animate={statusIn ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className={styles.statusItem}><i className={styles.dot} />STATUS: <b>OPERATIONAL</b></span>
        <span className={styles.statusItem}>CLUSTERS: <b>05</b></span>
        <span className={styles.statusItem}>NODE_COUNT: <b><Counter to={22} duration={1.4} /></b></span>
        <span className={styles.statusItem}>BUILD: <b>OPEN_TO_WORK</b></span>
      </motion.div>
    </section>
  )
}
