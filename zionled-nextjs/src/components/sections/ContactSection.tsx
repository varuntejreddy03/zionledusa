import Link from 'next/link'

import Icon from '@/components/ui/Icon'
import type { SiteMeta } from '@/types/product'

export default function ContactSection({ meta }: { meta: SiteMeta }) {
  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="cta">
          <div>
            <span className="eyebrow">Get a quote</span>
            <h2>Send us your fixture list. We&apos;ll handle the rest.</h2>
            <p className="cta-lead">
              Retrofit, new build or a single replacement: tell us what you&apos;re lighting and get product picks, a layout and project
              pricing from our Dallas team.
            </p>
            <div className="cta-actions">
              <Link href="/quote" className="btn btn--light">
                Request a quote <Icon name="arrow" size={16} />
              </Link>
              <a href={`tel:${meta.phone_href}`} className="btn btn--outline-light">
                <Icon name="phone" size={16} /> Call {meta.phone}
              </a>
            </div>
          </div>

          <div className="contact-cards">
            <a href={`tel:${meta.phone_href}`} className="contact-card">
              <span className="trust-icon">
                <Icon name="phone" />
              </span>
              <div>
                <small>Phone</small>
                <strong>{meta.phone}</strong>
              </div>
            </a>
            <a href={`mailto:${meta.email}`} className="contact-card">
              <span className="trust-icon">
                <Icon name="mail" />
              </span>
              <div>
                <small>Email</small>
                <strong>{meta.email}</strong>
              </div>
            </a>
            <div className="contact-card">
              <span className="trust-icon">
                <Icon name="pin" />
              </span>
              <div>
                <small>Warehouse &amp; office</small>
                <strong>{meta.address}</strong>
              </div>
            </div>
            <div className="contact-card">
              <span className="trust-icon">
                <Icon name="clock" />
              </span>
              <div>
                <small>Hours</small>
                <strong>{meta.business_hours}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
