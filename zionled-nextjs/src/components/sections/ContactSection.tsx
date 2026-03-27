'use client'

import dynamic from 'next/dynamic'

import type { SiteMeta } from '@/types/product'

const CTARingsCanvas = dynamic(() => import('@/components/three/CTARingsCanvas'), {
  ssr: false,
  loading: () => <div className="canvas-placeholder" />,
})

interface ContactSectionProps {
  meta: SiteMeta
}

export default function ContactSection({ meta }: ContactSectionProps) {
  return (
    <section id="contact" className="cta-section">
      <div className="cta-canvas-layer">
        <CTARingsCanvas className="cta-tech-canvas" />
      </div>

      <div className="site-shell">
        <div className="cta-content reveal">
          <div className="s-label s-label--centered">Get Started Today</div>
          <h2 className="cta-title">
            READY TO <span className="text-accent-gold">UPGRADE</span>
            <br />
            YOUR PROJECT?
          </h2>
          <p className="cta-copy">
            Bring the fixture list, retrofit target, or site problem. The next step should feel like talking to a project team, not dropping into a generic contact void.
          </p>

          <div className="cta-actions">
            <a href={`tel:${meta.phone_href}`} className="btn-glow">
              Call {meta.phone}
            </a>
            <a href={`mailto:${meta.email}`} className="btn-outline">
              Email the Team
            </a>
          </div>

          <div className="cta-info-row">
            <span className="cta-info-item">{meta.address}</span>
            <span className="cta-info-item">{meta.email}</span>
            <span className="cta-info-item">{meta.business_hours}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
