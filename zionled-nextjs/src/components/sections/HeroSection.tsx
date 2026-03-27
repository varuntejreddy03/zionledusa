'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import type { SiteMeta, SiteStats } from '@/types/product'

const HeroCanvas = dynamic(() => import('@/components/three/HeroCanvas'), {
  ssr: false,
  loading: () => <div className="canvas-placeholder" />,
})

interface HeroSectionProps {
  meta: SiteMeta
  stats: SiteStats
}

export default function HeroSection({ meta, stats }: HeroSectionProps) {
  const floatingStats = [
    {
      value: `${stats.total_products}+`,
      label: 'Catalog Products',
      className: 'hero-floating-card hero-floating-card--one',
    },
    {
      value: `${stats.total_categories}`,
      label: 'Core Categories',
      className: 'hero-floating-card hero-floating-card--two',
    },
    {
      value: `${stats.total_images}+`,
      label: 'Real Images',
      className: 'hero-floating-card hero-floating-card--three',
    },
  ]

  return (
    <section className="hero-section">
      <div className="hero-gradient-mesh" />

      <div className="site-shell hero-inner">
        <div className="hero-copy-column">
          <div className="hero-kicker-row reveal" style={{ transitionDelay: '0.12s' }}>
            <span className="hero-live-pill">
              <span className="pulse-dot" />
              <span>Live Catalog Data</span>
            </span>
            <span className="hero-kicker-copy">Commercial LED supply desk for projects that need clean answers fast.</span>
          </div>

          <div className="hero-eyebrow reveal" style={{ transitionDelay: '0.2s' }}>
            <span className="pulse-dot" />
            <span>Dallas commercial LED supply | consultation | nationwide shipping</span>
          </div>

          <h1 className="hero-title reveal" style={{ transitionDelay: '0.35s' }}>
            LIGHTING SYSTEMS
            <br />
            BUILT FOR
            <br />
            <span className="text-gradient">REAL PROJECTS</span>
          </h1>

          <p className="hero-subtitle reveal" style={{ transitionDelay: '0.5s' }}>
            Spec-grade fixtures, pole systems, and outdoor packages presented for contractors, facilities managers, and commercial buyers who need clarity fast and product confidence immediately.
          </p>

          <div className="hero-actions reveal" style={{ transitionDelay: '0.65s' }}>
            <Link href="/#categories" className="btn-glow">
              Browse Catalog
            </Link>
            <Link href="/#contact" className="btn-outline">
              Request Consultation
            </Link>
          </div>

          <p className="hero-support-note reveal" style={{ transitionDelay: '0.72s' }}>
            Browse indoor, outdoor, and pole systems with Dallas-based support at <a href={`tel:${meta.phone_href}`}>{meta.phone}</a> or <a href={`mailto:${meta.email}`}>{meta.email}</a>.
          </p>
        </div>

        <div className="hero-3d-wrap hero-visual-column reveal" style={{ transitionDelay: '0.7s' }}>
          <div className="hero-visual-shell">
            <div className="hero-visual-chip hero-visual-chip--top">Interactive Catalog Core</div>
            <div className="hero-visual-chip hero-visual-chip--bottom">Indoor | Outdoor | Poles</div>
            <div className="hero-visual-grid" aria-hidden="true" />
            <HeroCanvas className="hero-tech-canvas" />
          </div>

          {floatingStats.map((item) => (
            <div key={item.label} className={item.className}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
