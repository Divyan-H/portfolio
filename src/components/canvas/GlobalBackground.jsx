import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GlobalBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    // ── Setup Three.js Scene ──
    const scene = new THREE.Scene()
    
    // We want the canvas to stay fixed behind everything
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Mount it
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
    }

    // ── Create Particles ──
    const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 10000))
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)
    
    const color1 = new THREE.Color(0x00d4ff) // Blue
    const color2 = new THREE.Color(0xb44fff) // Purple

    for (let i = 0; i < particleCount; i++) {
      // Spread them across the screen space
      positions[i * 3]     = (Math.random() - 0.5) * 120
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60

      // Mix colors
      const mixedColor = Math.random() > 0.5 ? color1 : color2
      colors[i * 3]     = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
      
      // Phase for pulsing
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

    // Custom shader material for pulsing glow effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute vec3 color;
        attribute float phase;
        varying vec3 vColor;
        varying float vPhase;
        uniform float time;
        uniform float pixelRatio;
        void main() {
          vColor = color;
          vPhase = phase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Size pulses over time
          float size = 2.0 + sin(time * 2.0 + phase) * 1.5;
          gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vPhase;
        uniform float time;
        void main() {
          // Circular particle with soft edge
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if (ll > 0.5) discard;
          
          // Glow alpha
          float alpha = (0.5 - ll) * 2.0 * (0.3 + sin(time * 2.0 + vPhase) * 0.2);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ── Mouse Interaction ──
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    const windowHalfX = window.innerWidth / 2
    const windowHalfY = window.innerHeight / 2

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.05
      mouseY = (event.clientY - windowHalfY) * 0.05
    }
    document.addEventListener('mousemove', onDocumentMouseMove)

    // ── Animation Loop ──
    const clock = new THREE.Clock()
    let animationFrameId

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      
      // Update uniform
      material.uniforms.time.value = time

      // Gentle rotation
      particles.rotation.y += 0.0005
      particles.rotation.x += 0.0002

      // Mouse parallax
      targetX = mouseX * 0.1
      targetY = mouseY * 0.1
      camera.position.x += (targetX - camera.position.x) * 0.02
      camera.position.y += (-targetY - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize Handler ──
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.pixelRatio.value = renderer.getPixelRatio()
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousemove', onDocumentMouseMove)
      cancelAnimationFrame(animationFrameId)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}
