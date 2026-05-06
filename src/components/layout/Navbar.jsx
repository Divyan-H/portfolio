import { useState } from 'react'
import useAppStore from '@store/useAppStore'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navScrolled = useAppStore((state) => state.navScrolled)

  const links = [
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'PROJECTS',   href: '#projects' },
    { name: 'SKILLS',     href: '#skills' },
    { name: 'CONTACT',    href: '#contact' },
  ]

  return (
    <nav className={`${styles.holoDock} ${navScrolled ? styles.scrolled : ''} ${isOpen ? styles.open : ''}`}>
      <div className={styles.dockInner}>
        <a href="#" className={styles.dockLogo} onClick={() => setIsOpen(false)}>
          <span className={styles.logoMark}>HD</span>
        </a>
        
        <div className={styles.dockDivider} />
        
        {/* Mobile Toggle */}
        <button 
          className={styles.mobileToggle} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <div className={styles.hamburger}>
            <span />
            <span />
          </div>
        </button>

        <div className={styles.dockLinks}>
          {links.map((link, i) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={styles.dockLink}
              onClick={() => setIsOpen(false)}
            >
              <span className={styles.dockDot} />
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
