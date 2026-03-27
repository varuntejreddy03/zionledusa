'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import * as THREE from 'three'

type TechCanvasVariant = 'hero' | 'ambient' | 'rings'

interface TechCanvasProps {
  className?: string
  variant?: TechCanvasVariant
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((entry) => entry.dispose())
    return
  }

  material.dispose()
}

function buildHeroScene(scene: THREE.Scene) {
  const root = new THREE.Group()
  scene.add(root)

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.2, 1),
    new THREE.MeshPhongMaterial({
      color: 0x1a9fe8,
      emissive: 0x0d7fd4,
      emissiveIntensity: 0.45,
      shininess: 110,
      specular: 0x38bdf8,
      transparent: true,
      opacity: 0.94,
    }),
  )

  const middle = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.7, 1)),
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    }),
  )

  const outer = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.25, 1)),
    new THREE.LineBasicMaterial({
      color: 0x1a9fe8,
      transparent: true,
      opacity: 0.34,
    }),
  )

  root.add(core, middle, outer)

  const rings: THREE.Mesh[] = []

  for (let index = 0; index < 6; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.45 + index * 0.18, 0.015, 12, 160),
      new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0x1a9fe8 : 0x38bdf8,
        transparent: true,
        opacity: 0.16,
      }),
    )

    ring.rotation.set(index * 0.55, index * 0.4, index * 0.28)
    root.add(ring)
    rings.push(ring)
  }

  const particleCount = 300
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 2.8 + Math.random() * 1.8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[index * 3 + 2] = radius * Math.cos(phi)

    const color = new THREE.Color(index % 3 === 0 ? 0xf0a500 : 0x38bdf8)
    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
  }

  const particles = new THREE.Points(
    new THREE.BufferGeometry()
      .setAttribute('position', new THREE.BufferAttribute(positions, 3))
      .setAttribute('color', new THREE.BufferAttribute(colors, 3)),
    new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )

  root.add(particles)

  const ambientLight = new THREE.AmbientLight(0x07111e, 1.3)
  const fillLight = new THREE.PointLight(0x0d7fd4, 10, 24, 2)
  const accentLight = new THREE.PointLight(0xf0a500, 8, 24, 2)

  scene.add(ambientLight, fillLight, accentLight)

  return (elapsed: number, delta: number) => {
    root.rotation.y += delta * 0.18
    root.rotation.x = 0.45 + Math.sin(elapsed * 0.4) * 0.08

    core.rotation.x += delta * 0.28
    core.rotation.y += delta * 0.38
    middle.rotation.x -= delta * 0.22
    middle.rotation.z += delta * 0.18
    outer.rotation.y -= delta * 0.14

    rings.forEach((ring, index) => {
      ring.rotation.x += delta * (0.05 + index * 0.01)
      ring.rotation.y -= delta * (0.04 + index * 0.008)
    })

    particles.rotation.y += delta * 0.04
    particles.rotation.x -= delta * 0.03

    fillLight.position.set(Math.cos(elapsed * 0.7) * 4.6, Math.sin(elapsed * 0.55) * 2.4, 3.8)
    accentLight.position.set(Math.sin(elapsed * 0.6) * -4.4, Math.cos(elapsed * 0.45) * 2.8, 4.2)
  }
}

function buildAmbientScene(scene: THREE.Scene) {
  const root = new THREE.Group()
  scene.add(root)

  const ambientLight = new THREE.AmbientLight(0x020810, 1)
  const light1 = new THREE.PointLight(0x0d7fd4, 15, 20)
  const light2 = new THREE.PointLight(0x38bdf8, 8, 15)
  const light3 = new THREE.PointLight(0xffffff, 3, 10)

  light1.position.set(3, 3, 3)
  light2.position.set(-3, -2, 2)
  light3.position.set(0, 5, 5)

  scene.add(ambientLight, light1, light2, light3)

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 5),
    new THREE.MeshPhongMaterial({
      color: 0x0d7fd4,
      emissive: 0x0a3a6e,
      emissiveIntensity: 0.4,
      shininess: 120,
      specular: 0x38bdf8,
    }),
  )

  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.35, 3),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    }),
  )

  root.add(core, shell)

  const rings: THREE.Line[] = []

  for (let i = 0; i < 4; i += 1) {
    const points: THREE.Vector3[] = []

    for (let j = 0; j <= 100; j += 1) {
      const angle = (j / 100) * Math.PI * 2
      points.push(new THREE.Vector3(Math.cos(angle) * (1.8 + i * 0.2), Math.sin(angle) * (1.8 + i * 0.2), 0))
    }

    const ring = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.08 + i * 0.04,
      }),
    )

    ring.rotation.x = (i * Math.PI) / 5
    ring.rotation.z = (i * Math.PI) / 7
    ring.userData.speed = 0.004 + i * 0.002

    root.add(ring)
    rings.push(ring)
  }

  const particleCount = 180
  const positions = new Float32Array(particleCount * 3)

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 1.65 + Math.random() * 1.65
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[index * 3 + 2] = radius * Math.cos(phi)
  }

  const particles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)),
    new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )

  root.add(particles)

  return (elapsed: number, _delta: number) => {
    core.rotation.y = elapsed * 0.4
    core.rotation.x = elapsed * 0.16
    shell.rotation.y = -elapsed * 0.24
    shell.rotation.x = elapsed * 0.08
    particles.rotation.y = elapsed * 0.06
    particles.rotation.x = -elapsed * 0.03

    rings.forEach((ring, index) => {
      ring.rotation.y += ring.userData.speed ?? 0.004 + index * 0.002
    })

    light1.position.x = Math.cos(elapsed * 0.7) * 4
    light1.position.z = Math.sin(elapsed * 0.7) * 4
    light2.position.x = Math.sin(elapsed * 0.45) * -3.4
    light2.position.y = Math.cos(elapsed * 0.55) * 2.6
  }
}

function buildRingScene(scene: THREE.Scene) {
  const root = new THREE.Group()
  root.rotation.x = 1.05
  scene.add(root)

  const rings: THREE.Mesh[] = []

  for (let index = 0; index < 12; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.9 + index * 0.16, 0.035, 16, 120),
      new THREE.MeshBasicMaterial({
        color: index % 4 === 0 ? 0xf0a500 : 0x0d7fd4,
        transparent: true,
        opacity: 0.22,
      }),
    )

    root.add(ring)
    rings.push(ring)
  }

  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let index = 0; index < particleCount; index += 1) {
    const radius = 1.5 + Math.random() * 4.5
    const theta = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 5

    positions[index * 3] = Math.cos(theta) * radius
    positions[index * 3 + 1] = y
    positions[index * 3 + 2] = Math.sin(theta) * radius

    const color = new THREE.Color(index % 9 === 0 ? 0xf0a500 : 0x38bdf8)
    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
  }

  const particles = new THREE.Points(
    new THREE.BufferGeometry()
      .setAttribute('position', new THREE.BufferAttribute(positions, 3))
      .setAttribute('color', new THREE.BufferAttribute(colors, 3)),
    new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.82,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )

  scene.add(particles)

  const ambientLight = new THREE.AmbientLight(0xb4d9ff, 0.9)
  const pointLight = new THREE.PointLight(0x0d7fd4, 5, 24, 2)
  const accentLight = new THREE.PointLight(0xf0a500, 4, 24, 2)

  scene.add(ambientLight, pointLight, accentLight)

  return (elapsed: number, _delta: number) => {
    root.rotation.z = elapsed * 0.08
    particles.rotation.y = elapsed * 0.05

    rings.forEach((ring, index) => {
      const phase = (elapsed * 0.14 + index * 0.12) % 1
      const scale = 0.85 + phase * 1.35
      const material = ring.material as THREE.MeshBasicMaterial

      ring.scale.setScalar(scale)
      material.opacity = 0.08 + (1 - phase) * 0.22
    })

    pointLight.position.set(Math.cos(elapsed * 0.35) * 4.5, Math.sin(elapsed * 0.45) * 2.6, 3.6)
    accentLight.position.set(Math.sin(elapsed * 0.28) * -4.2, Math.cos(elapsed * 0.32) * 2.4, 3.2)
  }
}

export default function TechCanvas({ className, variant = 'hero' }: TechCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')

    const sync = () => setIsMobile(mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)

    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (isMobile || !canvasRef.current) {
      return
    }

    const parent = canvasRef.current.parentElement

    if (!parent) {
      return
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect

      setSize({
        w: Math.floor(width),
        h: Math.floor(height),
      })
    })

    resizeObserver.observe(parent)

    return () => resizeObserver.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (isMobile || size.w === 0 || size.h === 0 || !canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(size.w, size.h, false)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(variant === 'rings' ? 48 : 45, size.w / size.h, 0.1, 200)
    camera.position.z = variant === 'hero' ? 8.2 : variant === 'rings' ? 7.2 : 5

    const animateScene =
      variant === 'hero' ? buildHeroScene(scene) : variant === 'ambient' ? buildAmbientScene(scene) : buildRingScene(scene)

    let running = true
    let animationId = 0
    let lastTime = performance.now()

    const parent = canvas.parentElement
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (parent) {
      visibilityObserver.observe(parent)
    }

    const loop = (now: number) => {
      if (running && !document.hidden) {
        const delta = Math.min((now - lastTime) / 1000, 0.05)
        const elapsed = now / 1000

        lastTime = now
        animateScene(elapsed, delta)
        renderer.render(scene, camera)
      } else {
        lastTime = now
      }

      animationId = window.requestAnimationFrame(loop)
    }

    loop(lastTime)

    return () => {
      window.cancelAnimationFrame(animationId)
      visibilityObserver.disconnect()

      scene.traverse((child) => {
        const renderable = child as THREE.Mesh | THREE.Line | THREE.Points

        if ('geometry' in renderable && renderable.geometry instanceof THREE.BufferGeometry) {
          renderable.geometry.dispose()
        }

        if ('material' in renderable && renderable.material) {
          disposeMaterial(renderable.material as THREE.Material | THREE.Material[])
        }
      })

      renderer.dispose()
    }
  }, [isMobile, size, variant])

  return (
    <div className={clsx('tech-canvas-frame', `tech-canvas-frame--${variant}`, className)}>
      {isMobile ? (
        <div className={clsx('tech-canvas-placeholder', `tech-canvas-placeholder--${variant}`)}>
          <span className="tech-placeholder-ring tech-placeholder-ring--one" />
          <span className="tech-placeholder-ring tech-placeholder-ring--two" />
          <span className="tech-placeholder-core" />
        </div>
      ) : (
        <canvas ref={canvasRef} className="tech-canvas-element" style={{ width: '100%', height: '100%', display: 'block' }} />
      )}
    </div>
  )
}
