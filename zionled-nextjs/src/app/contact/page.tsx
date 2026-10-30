import type { Metadata } from 'next'
import Link from 'next/link'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import Icon from '@/components/ui/Icon'
import { getSiteMeta } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Contact Our Dallas Project Desk',
  description:
    'Reach the ZION LED USA lighting team in Dallas, Texas. Call (817) 938-2959 or email contact@zionledusa.com for commercial pricing, photometrics, and order status.',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  const meta = getSiteMeta()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact' },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(meta.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  return (
    <PageShell showContact={false}>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Direct Project Desk"
        title="Contact ZION LED USA"
        intro="Questions about fixture specifications, photometrics, or lead times? Connect directly with our lighting specialists in Dallas."
      />

      <section className="section" style={{ paddingTop: 36, paddingBottom: 64 }}>
        <div className="shell">
          <div className="contact-page-layout">
            <div className="contact-info-col">
              <h2>Dallas Headquarters &amp; Warehouse</h2>
              <p style={{ marginTop: 12, color: 'var(--ink-2)' }}>
                Our central Dallas facility handles engineering consultation, fixture assembly, and daily nationwide freight dispatches.
              </p>

              <div className="contact-cards" style={{ marginTop: 24, gridTemplateColumns: '1fr' }}>
                <a href={`tel:${meta.phone_href}`} className="contact-card">
                  <span className="trust-icon">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <small>Direct Phone</small>
                    <strong>{meta.phone}</strong>
                  </div>
                </a>

                <a href={`mailto:${meta.email}`} className="contact-card">
                  <span className="trust-icon">
                    <Icon name="mail" />
                  </span>
                  <div>
                    <small>Quotes &amp; Project Support</small>
                    <strong>{meta.email}</strong>
                  </div>
                </a>

                <div className="contact-card">
                  <span className="trust-icon">
                    <Icon name="pin" />
                  </span>
                  <div>
                    <small>Physical Address</small>
                    <strong>{meta.address}</strong>
                  </div>
                </div>

                <div className="contact-card">
                  <span className="trust-icon">
                    <Icon name="clock" />
                  </span>
                  <div>
                    <small>Operating Hours</small>
                    <strong>{meta.business_hours}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn btn--primary">
                  Request a project quote <Icon name="arrow" size={16} />
                </Link>
                <a href={`tel:${meta.phone_href}`} className="btn btn--ghost">
                  Call desk
                </a>
              </div>
            </div>

            <div className="contact-map-col">
              <div className="map-frame-box">
                <iframe
                  title="ZION LED USA Location Map"
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
