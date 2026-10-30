import Link from 'next/link'

import Icon, { type IconName } from '@/components/ui/Icon'

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: 'DLC & UL listed', text: 'Spec-grade fixtures that pass inspection and qualify for utility rebates.' },
  { icon: 'truck', title: 'Ships from Dallas', text: 'Stock on hand in Texas with fast, tracked freight to job sites nationwide.' },
  { icon: 'layout', title: 'Free lighting layouts', text: 'Send a floor plan or site map. We return fixture counts and a photometric plan.' },
  { icon: 'dollar', title: 'Rebate & pricing help', text: 'Contractor pricing on project quantities, and we help you claim local rebates.' },
]

export default function WhySection({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section id="why" className="section night">
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">Why ZION LED</span>
            <h2>A lighting partner, not just a catalog</h2>
            <p>Contractors, facility managers and property owners buy from us because the order is the easy part. The support is what they come back for.</p>
          </div>
          <Link href="/about" className="text-link" style={{ color: '#ffffff' }}>
            Our story &amp; team <Icon name="arrow" size={16} />
          </Link>
        </div>

        <div className="why-grid">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="why-card">
              <span className="trust-icon">
                <Icon name={feature.icon} size={20} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>

        <div className="stat-row">
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
