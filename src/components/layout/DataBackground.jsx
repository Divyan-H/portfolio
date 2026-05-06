import { useEffect, useState } from 'react'
import styles from './DataBackground.module.css'

const DATA_POINTS = 40

export default function DataBackground() {
  const [points, setPoints] = useState([])

  useEffect(() => {
    const newPoints = Array.from({ length: DATA_POINTS }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      val: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : (Math.random() * 0xffffff << 0).toString(16).toUpperCase().substring(0, 4),
      size: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 20
    }))
    setPoints(newPoints)
  }, [])

  return (
    <div className={styles.container}>
      {points.map(p => (
        <div 
          key={p.id}
          className={styles.dataPoint}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}rem`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        >
          {p.val}
        </div>
      ))}
    </div>
  )
}
