import { useEffect, useRef } from 'react'

export default function NeuralCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h
    let nodes = []
    let animationId
    let mouse = { x: -1000, y: -1000 }

    const resize = () => {
      const parent = canvas.parentElement
      w = canvas.width = parent.clientWidth
      h = canvas.height = parent.clientHeight
    }

    const initNodes = () => {
      nodes = []
      const numNodes = Math.min(80, Math.floor((w * h) / 5000))
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2 + 1,
        })
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      
      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i]
        n.x += n.vx
        n.y += n.vy

        // Bounce
        if (n.x < 0 || n.x > w) n.vx *= -1
        if (n.y < 0 || n.y > h) n.vy *= -1

        // Mouse repel
        let dx = mouse.x - n.x
        let dy = mouse.y - n.y
        let dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          n.x -= (dx / dist) * 2
          n.y -= (dy / dist) * 2
        }

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 212, 255, 0.8)'
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].x - nodes[j].x
          let dy = nodes[i].y - nodes[j].y
          let dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${1 - dist / 120})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(render)
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => { mouse.x = -1000; mouse.y = -1000 }

    window.addEventListener('resize', () => { resize(); initNodes() })
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    resize()
    initNodes()
    render()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100%', height: '100%', display: 'block' }} 
    />
  )
}
