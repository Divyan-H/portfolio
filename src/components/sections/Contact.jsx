import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import styles from './Contact.module.css'

export default function Contact() {
  const [cmdText, setCmdText] = useState('')
  const [outputLines, setOutputLines] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  
  const { ref: termRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.4
  })

  useEffect(() => {
    if (!inView) return

    let isMounted = true
    const terminalLines = [
      { t: '> Establishing secure connection...', c: '' },
      { t: '> Auth: SUCCESS ✓', c: 'ok' },
      { t: '> name: H. Divyan', c: 'hl' },
      { t: '> role: AI/ML Engineer', c: 'hl' },
      { t: '> email: h.divyan7@gmail.com', c: 'hl' },
      { t: '> location: Chennai, India', c: 'hl' },
      { t: '> STATUS: Available for Opportunities ✓', c: 'ok' },
    ]

    const typeCommand = async (text, speed = 55) => {
      setIsTyping(true)
      for (let i = 0; i <= text.length; i++) {
        if (!isMounted) return
        setCmdText(text.substring(0, i))
        await new Promise(r => setTimeout(r, speed))
      }
      setIsTyping(false)
    }

    const runSequence = async () => {
      if (!isMounted) return
      setCmdText('')
      setOutputLines([])
      
      await typeCommand('connect --divyan')
      
      let delay = 300
      for (let i = 0; i < terminalLines.length; i++) {
        if (!isMounted) return
        await new Promise(r => setTimeout(r, delay))
        if (!isMounted) return
        setOutputLines(prev => [...prev, terminalLines[i]])
        delay = 280
      }
      
      if (!isMounted) return
      setTimeout(() => {
        if (isMounted) runSequence()
      }, 3200)
    }

    runSequence()

    return () => { isMounted = false }
  }, [inView])

  return (
    <section id="contact" className="section">
      <div className={styles.sectionHeader} data-reveal>
        <span className={styles.secTag}>// 06</span>
        <h2 className={styles.secTitle}>CONTACT</h2>
        <div className={styles.secLine} />
      </div>

      <div className={`${styles.contactWrap} glass-card`} data-reveal>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>INITIALIZE CONNECTION</h3>
            <p className={styles.contactDesc}>
              Currently open for full-time opportunities, collaborations, and freelance projects. Let's build intelligent systems together.
            </p>
            
            <div className={styles.contactLinks}>
              <a href="mailto:h.divyan7@gmail.com" className={styles.cLink}>
                <span className={styles.cIcon}>✉</span> h.divyan7@gmail.com
              </a>
              <a href="https://github.com/Divyan-H" target="_blank" rel="noreferrer" className={styles.cLink}>
                <span className={styles.cIcon}>&lt;/&gt;</span> github.com/Divyan-H
              </a>
              <a href="https://linkedin.com/in/h-divyan" target="_blank" rel="noreferrer" className={styles.cLink}>
                <span className={styles.cIcon}>in</span> linkedin.com/in/h-divyan
              </a>
            </div>
          </div>
          
          <div className={styles.terminal} id="terminal" ref={termRef} data-tilt data-tilt-max="6">
            <div className={styles.termTop}>
              <div className={styles.termDots}>
                <span style={{background: '#ff5f56'}} />
                <span style={{background: '#ffbd2e'}} />
                <span style={{background: '#27c93f'}} />
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
                  <div key={i} className={`${styles.tRow} ${styles[line.c] || ''}`}>
                    {line.t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
