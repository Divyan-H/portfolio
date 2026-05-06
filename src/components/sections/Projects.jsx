import { useEffect } from 'react'
import styles from './Projects.module.css'
import { projects } from '@data/projects'
import useAppStore from '@store/useAppStore'

export default function Projects() {
  const openModal = useAppStore(state => state.openModal)

  return (
    <section id="projects" className="section">
      <div className={styles.sectionHeader}>
        <span className={styles.secTag}>// 03</span>
        <h2 className={styles.secTitle}>PROJECTS</h2>
        <div className={styles.secLine} />
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeTrack}>
          {/* Double the array to create a seamless infinite loop */}
          {[...projects, ...projects].map((project, index) => (
            <div key={`${project.id}-${index}`} className={`${styles.projCard} glass-card`}>
              <div className={styles.projHead}>
                <span className={styles.projNum}>{project.num}</span>
              </div>
              
              <h3 className={styles.projTitle}>{project.title}</h3>
              <p className={styles.projDesc}>{project.short}</p>
              
              <div className={styles.projTags}>
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              
              <button 
                className={styles.projBtn}
                onClick={() => openModal(project)}
              >
                System Details <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
