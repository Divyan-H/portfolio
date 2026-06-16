import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Flowing nebula backdrop — a full-screen WebGL shader.
 *
 * Domain-warped fractal noise pushes colour around like ink drifting
 * through deep space: slow, organic, never repeating. The palette stays
 * in our blue / violet / teal tone over a deep void. Because it is vivid
 * and sharp, the frosted glass panels above it refract real colour, which
 * is what makes the glassmorphism read as premium rather than flat.
 */
const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;

  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++){
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    p *= 2.3;

    float t = uTime * 0.05;

    // mouse warps the flow gently
    vec2 mp = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) * 2.3;
    float md = length(p - mp);
    p += normalize(p - mp + 0.0001) * 0.15 * smoothstep(1.4, 0.0, md);

    // two-stage domain warp
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.8));
    vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.5),
                  fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.6));
    float f = fbm(p + 3.0 * r);

    // deep, dark palette tuned to match the hero's near-black blue,
    // with extra hues from the same family for richer flow
    vec3 cVoid    = vec3(0.006, 0.014, 0.038);
    vec3 cBlue    = vec3(0.0,   0.32,  0.60);
    vec3 cViolet  = vec3(0.28,  0.09,  0.62);
    vec3 cTeal    = vec3(0.0,   0.52,  0.44);
    vec3 cIndigo  = vec3(0.10,  0.16,  0.55);
    vec3 cMagenta = vec3(0.46,  0.07,  0.40);
    vec3 cCyan    = vec3(0.0,   0.42,  0.58);

    vec3 col = cVoid;
    col = mix(col, cBlue,    clamp(f * f * 1.6, 0.0, 1.0));
    col = mix(col, cViolet,  clamp(dot(q, q) * 0.85, 0.0, 1.0));
    col = mix(col, cTeal,    clamp(r.x * r.x * 1.0, 0.0, 1.0) * 0.5);
    col = mix(col, cIndigo,  clamp(q.x * q.x * 0.9, 0.0, 1.0) * 0.55);
    col = mix(col, cMagenta, clamp(r.y * r.y * 0.9, 0.0, 1.0) * 0.45);
    col = mix(col, cCyan,    clamp(f * r.x * 1.4, 0.0, 1.0) * 0.4);

    // luminous veins — concentrated & dim, so most of the field stays dark
    col += 0.10 * vec3(0.3, 0.65, 1.0) * pow(clamp(f, 0.0, 1.0), 4.0);
    col += 0.06 * vec3(0.6, 0.3, 0.9) * pow(clamp(r.y, 0.0, 1.0), 4.0);

    // deep space — pull the whole field down to match the hero
    col *= 0.6;

    // sparse, dim drifting stars
    vec2 sg = floor(gl_FragCoord.xy * 0.4);
    float s = hash(sg);
    s = step(0.9986, s) * (0.5 + 0.5 * sin(uTime * 2.5 + s * 120.0));
    col += s * 0.4;

    // subtle cursor halo
    col += 0.05 * smoothstep(0.4, 0.0, distance(uv, uMouse)) * vec3(0.3, 0.65, 1.0);

    // strong vignette → dark edges, matching the hero vignette
    float vig = smoothstep(1.2, 0.3, length((uv - 0.5) * vec2(1.12, 1.0)));
    col *= mix(0.3, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function NebulaFlow({ contained = false }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const mobile = window.innerWidth < 768
    // Mobile: 35% res (shader is soft, upscaling is invisible) + 3 FBM octaves instead of 5
    const renderScale = mobile ? 0.35 : 0.7
    const octaves = mobile ? 3 : 5

    // Build fragment shader with platform-appropriate octave count
    const FRAG_MOBILE = FRAG.replace('for (int i = 0; i < 5; i++){', `for (int i = 0; i < ${octaves}; i++){`)

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * renderScale)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(renderer.domElement.width, renderer.domElement.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }

    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG_MOBILE, uniforms, depthTest: false, depthWrite: false })
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)

    const target = new THREE.Vector2(0.5, 0.5)
    const onMove = (e) => {
      target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    if (!coarse) window.addEventListener('mousemove', onMove, { passive: true })

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let raf = 0
    let last = 0
    let inView = true // a contained instance pauses when scrolled off-screen

    const renderFrame = () => {
      // ease mouse for a fluid feel
      uniforms.uMouse.value.lerp(target, 0.05)
      uniforms.uTime.value = clock.getElapsedTime()
      renderer.render(scene, camera)
    }

    const loop = (t) => {
      raf = requestAnimationFrame(loop)
      if (mobile && t - last < 50) return // ~20fps cap on mobile
      last = t
      renderFrame()
    }

    const start = () => { if (!raf) raf = requestAnimationFrame(loop) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const update = () => {
      if (!document.hidden && inView && !reduce) start()
      else stop()
    }

    const onVisibility = () => update()
    document.addEventListener('visibilitychange', onVisibility)

    // Only the contained (hero) instance pauses on scroll; the fixed global
    // instance is always on screen, so its observer would never fire anyway.
    let io = null
    if (contained && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting
        update()
      }, { threshold: 0 })
      io.observe(mount)
    }

    if (reduce) {
      uniforms.uTime.value = 12.0
      renderer.render(scene, camera)
    } else {
      start()
    }

    return () => {
      stop()
      if (io) io.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      quad.geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [contained])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: contained ? 'absolute' : 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
