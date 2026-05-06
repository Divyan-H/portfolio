import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { skills } from '@data/skills'

export default function HoloSkillsCanvas() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000)
    camera.position.z = 800

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0x00d4ff, 2)
    pointLight.position.set(200, 200, 200)
    scene.add(pointLight)

    // Helper to create a holographic label
    const createLabel = (text) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 512
      canvas.height = 128
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Balanced font size for readability vs space
      ctx.font = 'Bold 72px Share Tech Mono, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      ctx.shadowBlur = 20
      ctx.shadowColor = '#00d4ff'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(text, 256, 64)
      
      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
      const sprite = new THREE.Sprite(material)
      // Balanced scale
      sprite.scale.set(300, 75, 1)
      return sprite
    }

    // Three Balls (Spheres)
    const balls = []
    const groups = [
      skills.slice(0, 8),
      skills.slice(8, 15),
      skills.slice(15)
    ]
    
    const colors = [0x00d4ff, 0xb44fff, 0x00ff88]
    
    // Adaptive layout based on screen width
    const isMobile = width < 768
    const spread = isMobile ? 0 : 550
    const verticalSpread = isMobile ? 400 : 0
    const camDist = isMobile ? 1300 : 800
    const labelDist = isMobile ? 240 : 280

    camera.position.z = camDist

    const positions = [
      new THREE.Vector3(-spread, verticalSpread, 0),
      new THREE.Vector3(0, 0, isMobile ? 0 : 150),
      new THREE.Vector3(spread, -verticalSpread, 0)
    ]

    groups.forEach((group, groupIdx) => {
      const ballGroup = new THREE.Group()
      ballGroup.position.copy(positions[groupIdx])
      
      // Core Sphere (Wireframe Hologram)
      const geometry = new THREE.SphereGeometry(isMobile ? 140 : 180, 16, 16)
      const material = new THREE.MeshBasicMaterial({
        color: colors[groupIdx],
        wireframe: true,
        transparent: true,
        opacity: 0.1
      })
      const sphere = new THREE.Mesh(geometry, material)
      ballGroup.add(sphere)

      // Add labels around the sphere
      group.forEach((skill, i) => {
        const label = createLabel(skill)
        const phi = Math.acos(-1 + (2 * i) / group.length)
        const theta = Math.sqrt(group.length * Math.PI) * phi
        
        label.position.setFromSphericalCoords(labelDist, phi, theta)
        ballGroup.add(label)
      })

      scene.add(ballGroup)
      balls.push({ group: ballGroup, rotationSpeed: 0.002 + groupIdx * 0.001 })
    })

    // Animation
    const animate = () => {
      balls.forEach((ball, i) => {
        ball.group.rotation.y += ball.rotationSpeed
        ball.group.rotation.x += ball.rotationSpeed * 0.5
      })

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      // Cleanup geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
