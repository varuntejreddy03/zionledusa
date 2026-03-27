'use client'

import dynamic from 'next/dynamic'

import { useInViewOnce } from '@/components/effects/useInViewOnce'
import type { PerformanceMetric } from '@/types/product'

const EnergyCanvas = dynamic(() => import('@/components/three/EnergyCanvas'), {
  ssr: false,
  loading: () => <div className="canvas-placeholder" />,
})

interface PerformanceSectionProps {
  metrics: PerformanceMetric[]
}

export default function PerformanceSection({ metrics }: PerformanceSectionProps) {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>(0.18)

  return (
    <section className="performance-section why-led-section">
      <div ref={ref} className="site-shell split-grid">
        <div className="performance-visual reveal">
          <div className="performance-canvas-shell">
            <EnergyCanvas className="performance-tech-canvas" />
          </div>
        </div>

        <div className="performance-copy reveal">
          <div className="s-label">Performance Analysis</div>
          <h2 className="section-title">
            WHY LED <span className="text-accent-blue">WINS</span>
          </h2>
          <p className="section-copy">
            Reduced load, cleaner output, longer service life, and sharper operating economics. The bar set here is commercial performance, not generic product marketing.
          </p>

          <div className="metric-list">
            {metrics.map((metric, index) => (
              <div key={metric.label} className="metric-row">
                <div className="metric-head">
                  <span>{metric.label}</span>
                  <span>{metric.value}</span>
                </div>

                <div className="metric-track">
                  <div
                    className="metric-fill"
                    style={{
                      width: isInView ? `${metric.progress}%` : '0%',
                      transitionDelay: `${index * 150}ms`,
                    }}
                  />
                </div>

                <p className="metric-detail">{metric.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
