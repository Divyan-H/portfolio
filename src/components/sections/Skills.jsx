import styles from './Skills.module.css'
import { skillClusters } from '@data/skills'

const { aiml, frameworks, genai, vision, data } = skillClusters

/* HUD corner brackets dropped into every card */
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
      {tags.map((t) => (
        <li key={t} className={styles.pill}>{t}</li>
      ))}
    </ul>
  )
}

/* ── 01 · radar / sonar ── */
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

/* ── 02 · neural architecture ── */
function NeuralNet() {
  const cols = [
    { x: 28, n: 4 }, { x: 98, n: 5 }, { x: 168, n: 4 },
    { x: 238, n: 5 }, { x: 308, n: 4 },
  ]
  const H = 190, pad = 26
  const pts = cols.map((c) =>
    Array.from({ length: c.n }, (_, i) => ({
      x: c.x,
      y: pad + (H - 2 * pad) * (c.n === 1 ? 0.5 : i / (c.n - 1)),
    }))
  )
  const lines = []
  for (let c = 0; c < pts.length - 1; c++) {
    pts[c].forEach((p, i) => {
      const nxt = pts[c + 1]
      ;[i % nxt.length, (i + 1) % nxt.length].forEach((j) =>
        lines.push([p, nxt[j]])
      )
    })
  }
  return (
    <div className={styles.neural}>
      <svg viewBox="0 0 336 190" className={styles.neuralSvg} aria-hidden="true">
        {lines.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={styles.nLine} />
        ))}
        {pts.flat().map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2 + (i % 3)}
            className={i % 3 === 0 ? styles.nNodeAlt : styles.nNode}
          />
        ))}
        <text x="150" y="46" className={styles.nGlyph}>1</text>
        <text x="206" y="150" className={styles.nGlyph}>1</text>
      </svg>
      <span className={styles.statusPill}>NEURAL ARCH. ACTIVE</span>
    </div>
  )
}

/* ── 04 · object-detection feed ── */
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

/* ── 04 · skill-map honeycomb (8 nodes) ── */
function HexMap() {
  // rows of 3 / 3 / 2 = 8, alternating accent
  const rows = [3, 3, 2]
  let n = 0
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

/* ── 05 · deployment orbit ── */
function Orbit() {
  return (
    <div className={styles.orbit}>
      <svg viewBox="0 0 260 200" className={styles.orbitSvg} aria-hidden="true">
        <circle cx="130" cy="100" r="48" className={styles.orbitRing} />
        <circle cx="130" cy="100" r="80" className={styles.orbitRing} />
      </svg>
      <span className={styles.orbitCore}>DEPLOY<br />CORE</span>
      <span className={styles.orbNode} style={{ top: '24%', left: '46%' }} data-label="FastAPI" />
      <span className={styles.orbNode} style={{ top: '18%', left: '70%' }} data-label="Pandas" />
      <span className={styles.orbNodeAlt} style={{ top: '74%', left: '40%' }} data-label="Firebase" />
      <span className={styles.orbNodeAlt} style={{ top: '80%', left: '82%' }} data-label="REST API" />
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section">
      {/* Header */}
      <div className={styles.kicker} data-reveal>
        <span className={styles.kickerNum}>//04</span>
        <span className={styles.kickerLabel}>CORE CAPABILITIES</span>
        <div className={styles.kickerLine} />
      </div>
      <div className={styles.titleWrap} data-reveal>
        <div className={styles.blobA} />
        <div className={styles.blobB} />
        <h2 className={styles.bigTitle}>SKILLS</h2>
      </div>

      {/* Row 1 */}
      <div className={styles.rowTop} data-reveal>
        {/* 01 AI/ML Core */}
        <article className={styles.card}>
          <Brackets />
          <ClusterHead {...aiml} />
          <Radar />
          <Pills tags={aiml.tags} />
        </article>

        {/* 02 Frameworks */}
        <article className={styles.card}>
          <Brackets />
          <NeuralNet />
          <ClusterHead {...frameworks} />
          <Pills tags={frameworks.tags} />
        </article>

        {/* 03 GenAI & LLMs */}
        <article className={styles.card}>
          <Brackets />
          <ClusterHead {...genai} />
          <Pills tags={genai.tags} variant="violet" />
        </article>
      </div>

      {/* Row 2 */}
      <div className={styles.rowBottom} data-reveal>
        {/* 04 Computer Vision */}
        <article className={`${styles.card} ${styles.cardCv}`}>
          <Brackets />
          <VisionFeed />
          <div className={styles.cvBody}>
            <div className={styles.cvLeft}>
              <ClusterHead {...vision} />
              <Pills tags={vision.tags} />
            </div>
            <div className={styles.cvRight}>
              <HexMap />
            </div>
          </div>
          <span className={styles.watermark}>04</span>
        </article>

        {/* 05 Data & Deployment */}
        <article className={`${styles.card} ${styles.cardData}`}>
          <Brackets />
          <ClusterHead {...data} />
          <Orbit />
          <Pills tags={data.tags} />
          <div className={styles.dataFooter}>
            <div className={styles.totalNodes}>
              <strong>22</strong>
              <span>TOTAL<br />SKILL<br />NODES</span>
            </div>
            <span className={styles.openPill}>OPEN<br />TO<br />WORK</span>
          </div>
          <span className={styles.watermark}>05</span>
        </article>
      </div>

      {/* Footer status bar */}
      <div className={styles.statusBar} data-reveal>
        <span className={styles.statusItem}><i className={styles.dot} />STATUS: <b>OPERATIONAL</b></span>
        <span className={styles.statusItem}>CLUSTERS: <b>05</b></span>
        <span className={styles.statusItem}>NODE_COUNT: <b>22</b></span>
        <span className={styles.statusItem}>BUILD: <b>OPEN_TO_WORK</b></span>
      </div>
    </section>
  )
}
