import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Card3D from '@components/ui/Card3D'
import styles from './Contact.module.css'

const EASE = [0.16, 1, 0.3, 1]

const LINKS = [
  { href: 'mailto:h.divyan7@gmail.com',               icon: '✉',    label: 'h.divyan7@gmail.com' },
  { href: 'https://github.com/Divyan-H',              icon: '</>',  label: 'github.com/Divyan-H',     external: true },
  { href: 'https://linkedin.com/in/h-divyan',         icon: 'in',   label: 'linkedin.com/in/h-divyan', external: true },
]

export default function Contact() {
  const [cmdText, setCmdText] = useState('')
  const [outputLines, setOutputLines] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const { ref: hdrRef,  inView: hdrIn  } = useInView({ triggerOnce: true, threshold: 0.2 })
  const { ref: wrapRef, inView: wrapIn  } = useInView({ triggerOnce: true, threshold: 0.08 })
  const { ref: linksRef,inView: linksIn } = useInView({ triggerOnce: true, threshold: 0.3 })
  const { ref: termRef, inView: termIn  } = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!termIn) return
    let alive = true
    const lines = [
      { t: '> Establishing secure connection...', c: '' },
      { t: '> Auth: SUCCESS ✓',                  c: 'ok' },
      { t: '> name: H. Divyan',                   c: 'hl' },
      { t: '> role: AI/ML Engineer',              c: 'hl' },
      { t: '> email: h.divyan7@gmail.com',        c: 'hl' },
      { t: '> location: Chennai, India',          c: 'hl' },
      { t: '> STATUS: Available for Opportunities ✓', c: 'ok' },
    ]

    const type = async (text, speed = 52) => {
      setIsTyping(true)
      for (let i = 0; i <= text.length; i++) {
        if (!alive) return
        setCmdText(text.slice(0, i))
        await new Promise(r => setTimeout(r, speed))
      }
      setIsTyping(false)
    }

    const run = async () => {
      if (!alive) return
      setCmdText(''); setOutputLines([])
      await type('connect --divyan')
      for (const line of lines) {
        if (!alive) return
        await new Promise(r => setTimeout(r, 290))
        if (!alive) return
        setOutputLines(p => [...p, line])
      }
      if (alive) setTimeout(run, 3200)
    }

    run()
    return () => { alive = false }
  }, [termIn])

  return (
    <section id="contact" className="section">
      <motion.div
        ref={hdrRef}
        className={styles.sectionHeader}
        initial={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
        animate={hdrIn ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span className={`${styles.secTag} neon-tag`}>// 06</span>
        <h2 className={styles.secTitle}>CONTACT</h2>
        <div className={styles.secLine} />
      </motion.div>

      <motion.div
        ref={wrapRef}
        initial={{ opacity: 0, y: 60, scale: 0.94, filter: 'blur(14px)' }}
        animate={wrapIn ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
        transition={{ duration: 0.95, ease: EASE }}
      >
        <Card3D
          className={`${styles.contactWrap} glass-card`}
          depth={6}
        >
          <span className="electric-border" aria-hidden="true" />

          <div className={styles.contactGrid}>
            {/* Left — info + links */}
            <div className={styles.contactInfo}>
              <h3 className={styles.contactTitle}>INITIALIZE CONNECTION</h3>
              <p className={styles.contactDesc}>
                Currently open for full-time opportunities, collaborations, and freelance projects.
                Let's build intelligent systems together.
              </p>

              <div ref={linksRef} className={styles.contactLinks}>
                {LINKS.map(({ href, icon, label, external }, i) => (
                  <motion.a
                    key={href}
                    href={href}
                    className={styles.cLink}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    initial={{ opacity: 0, x: -28 }}
                    animate={linksIn ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.11, ease: EASE }}
                    whileHover={{ x: 8, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
                  >
                    <span className={styles.cIcon}>{icon}</span> {label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Right — 3D terminal */}
            <motion.div
              ref={termRef}
              initial={{ opacity: 0, rotateY: -12, rotateX: 6, filter: 'blur(10px)' }}
              animate={termIn ? { opacity: 1, rotateY: 0, rotateX: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
              style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
            >
              <div className={`${styles.terminal} glass-scan`} data-tilt data-tilt-max="6">
                <div className={styles.termTop}>
                  <div className={styles.termDots}>
                    <span style={{ background: '#ff5f56' }} />
                    <span style={{ background: '#ffbd2e' }} />
                    <span style={{ background: '#27c93f' }} />
                  </div>
                  <div className={styles.termTitle}>root@divyan: ~</div>
                </div>
                <div className={styles.termBody}>
                  <div className={styles.tRow}>
                    <span className={styles.prompt}>$</span>
                    <span className={styles.typedCmd}>{cmdText}</span>
                    <span className={`${styles.cursor} ${isTyping ? styles.solid : ''}`} />
                  </div>
                  <div className={styles.termOutput}>
                    {outputLines.map((line, i) => (
                      <div key={i} className={`${styles.tRow} ${styles[line.c] || ''}`}>{line.t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Card3D>
      </motion.div>
    </section>
  )
}
