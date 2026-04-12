'use client'

import { useInViewOnce } from '@/components/effects/useInViewOnce'

const TRUST_BADGES = [
  {
    icon: '✓',
    code: 'UL',
    title: 'UL Certified',
    description: 'All core products meet Underwriters Laboratories safety standards for commercial and industrial use.',
    gradient: 'trust-badge--blue',
  },
  {
    icon: '🛡',
    code: 'WR',
    title: 'Industry Warranty',
    description: 'Backed by comprehensive warranties on housings, drivers, and LED systems for long-term confidence.',
    gradient: 'trust-badge--gold',
  },
  {
    icon: '⚡',
    code: 'RB',
    title: 'Utility Rebate Eligible',
    description: 'Products configured and DLC-listed to qualify for utility rebate programs, reducing total project cost.',
    gradient: 'trust-badge--green',
  },
  {
    icon: '🚚',
    code: 'SH',
    title: 'Fast Nationwide Shipping',
    description: 'Dallas-based fulfillment center with responsive coordination and expedited delivery options nationwide.',
    gradient: 'trust-badge--silver',
  },
]

export default function TrustBadgesSection() {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>(0.15)

  return (
    <section className="trust-badges-section">
      <div className="site-shell">
        <div className="section-heading reveal">
          <div className="s-label s-label--centered">Why Choose Us</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            TRUSTED <span className="text-accent-gold">STANDARDS</span>
          </h2>
          <p className="section-copy" style={{ textAlign: 'center', margin: '0 auto' }}>
            Every product in our catalog meets rigorous industry standards — giving you the confidence to specify, install, and operate with total peace of mind.
          </p>
        </div>

        <div ref={ref} className="trust-badges-grid">
          {TRUST_BADGES.map((badge, index) => (
            <article
              key={badge.code}
              className={`trust-badge-card ${badge.gradient} ${isInView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="trust-badge-icon-shell">
                <div className="trust-badge-icon">{badge.code}</div>
              </div>
              <h3 className="trust-badge-title">{badge.title}</h3>
              <p className="trust-badge-desc">{badge.description}</p>
              <div className="trust-badge-accent" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
