'use client'

import { useEffect, useState } from 'react'

import { useInViewOnce } from '@/components/effects/useInViewOnce'
import type { SiteStats } from '@/types/product'

interface StatsSectionProps {
  stats: SiteStats
}

interface AnimatedValueProps {
  active: boolean
  value: number
  prefix?: string
  suffix?: string
}

function AnimatedValue({ active, value, prefix = '', suffix = '' }: AnimatedValueProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) {
      return
    }

    let frameId = 0
    const startedAt = performance.now()
    const duration = 2000

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - (1 - progress) ** 3

      setDisplay(Math.round(value * eased))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [active, value])

  return (
    <span>
      {prefix}
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>(0.2)

  const items = [
    { value: stats.total_products, suffix: '+', label: 'Products in Catalog' },
    { value: stats.total_categories, suffix: '', label: 'Catalog Categories' },
    { value: stats.total_pages, suffix: '', label: 'Site Pages Captured' },
    { value: stats.total_images, suffix: '+', label: 'Product Images' },
  ]

  return (
    <section className="stats-section">
      <div className="site-shell">
        <div ref={ref} className="stats-band reveal">
          {items.map((item) => (
            <div key={item.label} className="stats-cell">
              <div className="stat-big">
                <AnimatedValue active={isInView} value={item.value} suffix={item.suffix} />
              </div>
              <div className="stat-lbl">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
