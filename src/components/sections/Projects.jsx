import { useEffect, useRef } from 'react'
import styles from './Projects.module.css'
import { projects } from '@data/projects'
import useAppStore from '@store/useAppStore'

// Double the list to fill a 6-slot cylinder (60° between cards).
// backface-visibility:hidden removes the back 3, leaving front + 2 side cards always visible.
const list        = [...projects, ...projects]
const N           = list.length                                            // 6
const ANGLE_STEP  = 360 / N                                               // 60°
const MOBILE      = typeof window !== 'undefined' && window.innerWidth < 768
const CARD_W      = MOBILE ? 300 : 460
const GAP         = MOBILE ? 80  : 160
const RADIUS      = Math.round((CARD_W + GAP) / (2 * Math.tan(Math.PI / N)))  // ≈537 desktop / ≈329 mobile
// Softer perspective so the front-facing card isn't blown up past the scene box
const PERSP       = Math.max(RADIUS * 5.5, 1900)                         // front card ≈1.22× (was 1.55×)

export default function Projects() {
  const openModal = useAppStore((s) => s.openModal)
  const sceneRef  = useRef(null)
  const trackRef  = useRef(null)
  const st        = useRef({
    angle: 0, velocity: 0,
    dragging: false, startX: 0, dragDist: 0,
    paused: false, snapping: false, snapTarget: 0,
  })

  useEffect(() => {
    const scene = sceneRef.current
    const track = trackRef.current
    if (!scene || !track) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = st.current
    const AUTO = 0.025 // deg per frame (~1.5°/s at 60fps)

    const apply = () => { track.style.transform = `rotateY(${-s.angle}deg)` }

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (s.snapping) {
        s.angle += (s.snapTarget - s.angle) * 0.1
        if (Math.abs(s.snapTarget - s.angle) < 0.06) {
          s.angle = s.snapTarget
          s.snapping = false
          s.paused = false
        }
      } else if (!s.dragging) {
        if (Math.abs(s.velocity) > 0.01) {
          s.angle += s.velocity
          s.velocity *= 0.92 // momentum friction
        } else if (!s.paused) {
          s.angle += AUTO
        }
      }
      apply()
    }

    // ── pointer drag ──
    const onDown = (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return
      s.dragging = true; s.paused = true; s.snapping = false
      s.startX = e.clientX; s.dragDist = 0; s.velocity = 0
      scene.classList.add(styles.dragging)
      try { scene.setPointerCapture(e.pointerId) } catch (_) {}
    }
    const onMove = (e) => {
      if (!s.dragging) return
      const dx = e.clientX - s.startX
      s.startX = e.clientX
      s.dragDist += Math.abs(dx)
      const delta = -dx * (ANGLE_STEP / CARD_W) * 0.85
      s.angle += delta
      s.velocity = delta
      apply()
    }
    const onUp = () => {
      if (!s.dragging) return
      s.dragging = false
      scene.classList.remove(styles.dragging)
      // snap to nearest card after meaningful drag
      if (s.dragDist > 5) {
        s.snapTarget = Math.round(s.angle / ANGLE_STEP) * ANGLE_STEP
        s.snapping = true
        s.velocity = 0
      } else {
        s.paused = false
      }
    }
    const onClick = (e) => {
      if (s.dragDist > 8) { e.preventDefault(); e.stopPropagation(); s.dragDist = 0 }
    }

    scene.addEventListener('pointerdown', onDown)
    scene.addEventListener('pointermove', onMove, { passive: true })
    scene.addEventListener('pointerup',   onUp)
    scene.addEventListener('pointercancel', onUp)
    scene.addEventListener('click', onClick, true)

    if (!reduce) raf = requestAnimationFrame(tick)
    else apply()

    return () => {
      cancelAnimationFrame(raf)
      scene.removeEventListener('pointerdown',   onDown)
      scene.removeEventListener('pointermove',   onMove)
      scene.removeEventListener('pointerup',     onUp)
      scene.removeEventListener('pointercancel', onUp)
      scene.removeEventListener('click',         onClick, true)
    }
  }, [])

  const nudge = (dir) => {
    const s = st.current
    s.velocity = 0; s.dragging = false; s.paused = true
    const snapped = Math.round(s.angle / ANGLE_STEP) * ANGLE_STEP
    s.snapTarget  = snapped + dir * ANGLE_STEP
    s.snapping    = true
  }

  return (
    <section id="projects" className="section">
      <div className={styles.sectionHeader} data-reveal>
        <span className={styles.secTag}>// 03</span>
        <h2 className={styles.secTitle}>PROJECTS</h2>
        <div className={styles.secLine} />
      </div>

      <div className={styles.carousel}>
        <button className={`${styles.navArrow} ${styles.navPrev}`} onClick={() => nudge(-1)} aria-label="Previous project">‹</button>
        <button className={`${styles.navArrow} ${styles.navNext}`} onClick={() => nudge(1)}  aria-label="Next project">›</button>

        <div
          className={styles.cylinderScene}
          ref={sceneRef}
          style={{ '--persp': `${PERSP}px` }}
        >
          <div className={styles.cylinderTrack} ref={trackRef}>
            {list.map((project, i) => (
              <div
                key={`${project.id}-${i}`}
                className={styles.cardSlot}
                style={{ transform: `rotateY(${i * ANGLE_STEP}deg) translateZ(${RADIUS}px)` }}
              >
                <div className={`${styles.projCard} glass-card`}>
                  <span className="electric-border" aria-hidden="true" />

                  <div className={styles.projHead}>
                    <span className={styles.projNum}>{project.num}</span>
                  </div>

                  <h3 className={styles.projTitle}>{project.title}</h3>
                  <p className={styles.projDesc}>{project.short}</p>

                  <div className={styles.projTags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <button className={styles.projBtn} onClick={() => openModal(project)}>
                    System Details <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.scrollHint}>‹ DRAG · SWIPE · OR USE ARROWS ›</div>
      </div>
    </section>
  )
}
