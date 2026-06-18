import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * Reusable 3D perspective-tilt card with cursor-tracked glare.
 * Wraps children in a perspective container so CSS preserve-3d works.
 * Gracefully disables on touch devices (handled by parent via media query).
 */
export default function Card3D({ children, className, depth = 10, style }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const cfg = { stiffness: 380, damping: 32, mass: 0.4 }
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [depth, -depth]), cfg)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-depth, depth]), cfg)

  const glare = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%,
      rgba(255,255,255,0.10) 0%,
      rgba(0,212,255,0.04) 30%,
      transparent 60%)`
  )

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onLeave = () => { mx.set(0); my.set(0) }

  return (
    <div className="card3d-wrap" style={{ perspective: '1100px', ...style }}>
      <motion.div
        ref={ref}
        className={className}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
        {/* Cursor-tracked specular glare */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            borderRadius: 'inherit',
            background: glare,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      </motion.div>
    </div>
  )
}
