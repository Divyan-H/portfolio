import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLine} />
      
      <div className={styles.footerInner}>
        <div className={styles.footerCopy}>
          &copy; {new Date().getFullYear()} <span className={styles.footerName}>H. DIVYAN</span>. ALL SYSTEMS NOMINAL.
        </div>
        
        <div className={styles.footerSys}>
          SYS_VER: 2.0.0 // STATUS: ONLINE
        </div>
      </div>
    </footer>
  )
}
