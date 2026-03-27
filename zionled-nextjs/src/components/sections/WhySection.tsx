'use client'

import dynamic from 'next/dynamic'

import type { WhyFeature } from '@/types/product'

const EnergyCanvas = dynamic(() => import('@/components/three/EnergyCanvas'), {
  ssr: false,
  loading: () => <div className="canvas-placeholder" />,
})

interface WhySectionProps {
  features: WhyFeature[]
}

const ICON_CODES: Record<string, string> = {
  'High Performance': 'HP',
  'Value Pricing': 'VP',
  'Warranty Backed': 'WB',
  'Free Consultation': 'FC',
}

export default function WhySection({ features }: WhySectionProps) {
  const certifications = ['DLC Listed', 'UL Certified', 'RoHS', 'CE', 'FCC', 'IP65+']

  return (
    <section id="about" className="why-section">
      <div className="site-shell split-grid">
        <div className="reveal">
          <div className="s-label">Why ZION LED USA</div>
          <h2 className="section-title">
            BUILT TO <span className="text-accent-gold">SERVE</span>
          </h2>
          <p className="section-copy">
            Commercial buyers do not need decorative noise. They need support, compliance confidence, and products framed like systems that belong in a real project package.
          </p>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card reveal">
                <div className="feature-topline" />
                <div className="feature-icon">{ICON_CODES[feature.title] ?? 'LED'}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="why-visual reveal">
          <div className="why-canvas-shell">
            <EnergyCanvas className="why-tech-canvas" />

            <div className="why-cert-card">
              <div className="why-cert-label">Certifications &amp; Standards</div>
              <div className="why-cert-list">
                {certifications.map((badge) => (
                  <span key={badge} className="why-cert-pill">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
