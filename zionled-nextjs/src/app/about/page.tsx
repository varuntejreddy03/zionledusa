import type { Metadata } from 'next'
import Link from 'next/link'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import Icon, { type IconName } from '@/components/ui/Icon'
import { getSiteMeta, getSiteStats } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About ZION LED USA - Commercial Lighting Partner',
  description:
    'Born with one belief: Serve First. Delivering spec-grade commercial & industrial LED fixtures, custom lighting layouts, and nationwide shipping from Dallas, Texas.',
  alternates: { canonical: '/about' },
}

const WHY_FEATURES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'shield',
    title: 'DLC & UL Listed',
    text: 'Spec-grade commercial fixtures rigorously tested to pass local electrical inspections and qualify for maximum utility rebates.',
  },
  {
    icon: 'truck',
    title: 'Stocked in Dallas, TX',
    text: 'Centralized Texas warehouse stocking high bays, area lights, poles, and panels for rapid, tracked freight to jobsites nationwide.',
  },
  {
    icon: 'layout',
    title: 'Complimentary Photometrics',
    text: 'Send floor plans or site drawings. Our application team delivers point-by-point foot-candle models and recommended fixture schedules.',
  },
  {
    icon: 'dollar',
    title: 'Direct Contractor Pricing',
    text: 'Transparent pricing structured for electrical contractors, facility managers, and distributors, plus utility rebate filing assistance.',
  },
]

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Submit Project or Fixture List',
    desc: 'Send your fixture schedules, architectural drawings, or existing fixture counts. Retrofits and new builds welcome.',
  },
  {
    num: '02',
    title: 'Photometric Layout & Specs',
    desc: 'Our project desk models target foot-candles, verifies DLC compliance, and recommends exact wattages, optics, and mounts.',
  },
  {
    num: '03',
    title: 'Tiered Pricing & Rebate Support',
    desc: 'Receive competitive contractor pricing with volume tier discounts and full documentation for utility incentive rebates.',
  },
  {
    num: '04',
    title: 'Fast Jobsite Delivery',
    desc: 'Orders are packed and dispatched directly from Dallas, Texas with real-time freight tracking to your job site or warehouse.',
  },
]

export default function AboutPage() {
  const meta = getSiteMeta()
  const stats = getSiteStats()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About Us' },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ]

  return (
    <PageShell showContact={false}>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Our Company"
        title="Built on Service. Engineered for Performance."
        intro="At ZION LED USA, we didn’t step into the market just to sell — we came to serve. Spec-grade commercial and industrial LED fixtures backed by engineers who understand job site deadlines."
      />

      {/* Company Story Section */}
      <section className="section" style={{ paddingTop: 44, paddingBottom: 44 }}>
        <div className="shell">
          <div className="about-grid">
            <div>
              <span className="eyebrow">The ZION Story</span>
              <h2>A Partner on the Other End of the Phone</h2>
              <div className="about-story" style={{ marginTop: 20 }}>
                <p>
                  At <strong>ZION LED USA</strong>, we believe commercial lighting should never be a bottleneck on a construction schedule.
                  Delivering high-quality lighting solutions for commercial, industrial, and exterior environments, we built our business on one foundational principle: <em>Serve First</em>.
                </p>
                <p style={{ marginTop: 16 }}>
                  Every fixture in our catalog reflects honest pricing, stringent compliance certifications, and responsive engineering support.
                  From single replacement fixtures to multi-acre logistics parks and automotive dealerships, we stand behind every shipment.
                </p>
                {/* TODO: Client company history details and founder statement to be reviewed by client team */}
                <div className="about-todo-note" style={{ marginTop: 20 }}>
                  <small>
                    <b>Note for Editorial Review:</b> Comprehensive executive team profiles and historical milestone timeline will be added upon client confirmation.
                  </small>
                </div>
              </div>
            </div>

            <div className="about-stats-card">
              <h3>By the Numbers</h3>
              <div className="about-stat-list">
                <div className="about-stat-item">
                  <strong>{stats.total_products}+</strong>
                  <span>Commercial &amp; industrial fixtures</span>
                </div>
                <div className="about-stat-item">
                  <strong>{stats.total_categories}</strong>
                  <span>Engineered product families</span>
                </div>
                <div className="about-stat-item">
                  <strong>5 Years</strong>
                  <span>Standard commercial warranty</span>
                </div>
                <div className="about-stat-item">
                  <strong>24 Hours</strong>
                  <span>Lighting layout turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ZION Features */}
      <section className="section section--soft">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Why Choose ZION</span>
              <h2>Engineered for Contractors and Facility Teams</h2>
              <p>We combine manufacturer-direct value with the agility and responsiveness of a dedicated project partner.</p>
            </div>
          </div>

          <div className="why-grid">
            {WHY_FEATURES.map((feature) => (
              <div key={feature.title} className="why-card">
                <span className="trust-icon">
                  <Icon name={feature.icon} size={20} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section" id="process">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">How Ordering Works</span>
              <h2>Simple, Fast, and Project-Ready</h2>
              <p>From initial takeoff to jobsite delivery, here is how our Dallas team gets fixtures to your project.</p>
            </div>
          </div>

          <div className="process-grid">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="process-card">
                <span className="process-num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, textAlign: 'center' }}>
            <Link href="/quote" className="btn btn--primary">
              Start your project quote <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information Block */}
      <section className="section section--soft" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Project Desk</span>
              <h2>Direct Contact Information</h2>
              <p>Speak directly with our commercial lighting specialists in Dallas, Texas.</p>
            </div>
          </div>

          <div className="contact-cards" style={{ marginTop: 24 }}>
            <a href={`tel:${meta.phone_href}`} className="contact-card">
              <span className="trust-icon">
                <Icon name="phone" />
              </span>
              <div>
                <small>Phone Support</small>
                <strong>{meta.phone}</strong>
              </div>
            </a>
            <a href={`mailto:${meta.email}`} className="contact-card">
              <span className="trust-icon">
                <Icon name="mail" />
              </span>
              <div>
                <small>Project Email</small>
                <strong>{meta.email}</strong>
              </div>
            </a>
            <div className="contact-card">
              <span className="trust-icon">
                <Icon name="pin" />
              </span>
              <div>
                <small>Office &amp; Warehouse</small>
                <strong>{meta.address}</strong>
              </div>
            </div>
            <div className="contact-card">
              <span className="trust-icon">
                <Icon name="clock" />
              </span>
              <div>
                <small>Desk Hours</small>
                <strong>{meta.business_hours}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
