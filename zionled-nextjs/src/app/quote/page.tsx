import type { Metadata } from 'next'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import QuoteForm from '@/components/quote/QuoteForm'
import Icon from '@/components/ui/Icon'

export const metadata: Metadata = {
  title: 'Request a Commercial LED Lighting Quote',
  description:
    'Send your fixture list, takeoff, or site plan to our Dallas project desk. Receive spec-grade fixture schedules, photometric layouts, and tiered contractor pricing within 24 hours.',
  alternates: { canonical: '/quote' },
}

const QUOTE_PERKS = [
  {
    icon: 'clock' as const,
    title: '24-Hour Turnaround',
    desc: 'Rapid photometric calculations and official written project proposals.',
  },
  {
    icon: 'dollar' as const,
    title: 'Tiered Contractor Pricing',
    desc: 'Manufacturer-direct volume discounts tailored for project quantities.',
  },
  {
    icon: 'shield' as const,
    title: 'Rebate & DLC Verified',
    desc: 'Fixtures qualified for local utility incentives with all compliance paperwork.',
  },
  {
    icon: 'truck' as const,
    title: 'Ships from Dallas, TX',
    desc: 'Reliable freight logistics dispatched directly to your job site.',
  },
]

export default function QuotePage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Request a Quote' },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'Request a Quote', url: '/quote' },
  ]

  return (
    <PageShell showContact={false}>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Direct Project Desk"
        title="Request a Lighting Quote"
        intro="Retrofit, ground-up new build, or large replacement package: send us your requirements. Our Dallas engineers provide fixture schedules, photometric layouts, and contractor pricing."
      />

      <section className="section" style={{ paddingTop: 36, paddingBottom: 64 }}>
        <div className="shell">
          <div className="quote-page-layout">
            <div className="quote-form-col">
              <QuoteForm />
            </div>

            <div className="quote-sidebar-col">
              <div className="quote-perks-card">
                <h3>What happens next?</h3>
                <div className="quote-perks-list">
                  {QUOTE_PERKS.map((perk) => (
                    <div key={perk.title} className="quote-perk-item">
                      <span className="trust-icon" style={{ flexShrink: 0 }}>
                        <Icon name={perk.icon} size={18} />
                      </span>
                      <div>
                        <strong>{perk.title}</strong>
                        <p>{perk.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="quote-direct-card">
                  <small>Need immediate assistance?</small>
                  <strong>(817) 938-2959</strong>
                  <span>Mon-Fri: 9AM-6PM CST</span>
                  <a href="tel:+18179382959" className="btn btn--ghost btn--sm" style={{ marginTop: 12 }}>
                    <Icon name="phone" size={14} /> Call project desk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
