'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  alpha: number
  vx: number
  vy: number
}

function createParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random(),
    alpha: 0.3 + Math.random() * 0.3,
    vx: 0.03 + Math.random() * 0.06,
    vy: 0.01 + Math.random() * 0.04,
  }))
}

export default function GlobalEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let frameId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let running = true

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight

      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.floor(width * ratio))
      canvas.height = Math.max(1, Math.floor(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      particles = createParticles(width, height, width < 768 ? 60 : 150)
    }

    const tick = () => {
      frameId = window.requestAnimationFrame(tick)

      if (!running) {
        return
      }

      context.clearRect(0, 0, width, height)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x > width + 2) particle.x = -2
        if (particle.y > height + 2) particle.y = -2

        context.beginPath()
        context.fillStyle = `rgba(255,255,255,${particle.alpha})`
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    const handleVisibility = () => {
      running = !document.hidden
    }

    resize()
    tick()

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        visibleEntries.forEach((entry, index) => {
          const element = entry.target as HTMLElement
          const existingDelay = element.style.transitionDelay
          if (!existingDelay) {
            element.style.transitionDelay = `${(index % 4) * 80}ms`
          }

          element.classList.add('visible')
          observer.unobserve(element)
        })
      },
      { threshold: 0.12 },
    )

    const bind = () => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((element) => {
        if (element.dataset.revealBound === 'true') {
          return
        }

        element.dataset.revealBound = 'true'
        observer.observe(element)
      })
    }

    bind()

    const mutationObserver = new MutationObserver(bind)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [])

  return (
    <div className="global-effects" aria-hidden="true">
      <canvas ref={canvasRef} className="starfield-canvas" />
      <div className="global-scanline" />
    </div>
  )
}
