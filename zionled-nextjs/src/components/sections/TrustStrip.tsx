import Icon, { type IconName } from '@/components/ui/Icon'

export interface TrustBox {
  icon: IconName
  tag: string
  title: string
  description: string
  spec: string
}

const TRUST_BOXES: TrustBox[] = [
  {
    icon: 'shield',
    tag: 'Safety Verified',
    title: 'UL & ETL Certified',
    description: 'Rigorously tested to UL 1598 & UL 8750 commercial safety standards for dry, damp, and wet industrial environments.',
    spec: 'UL Listed · ETL Intertek Verified',
  },
  {
    icon: 'check',
    tag: 'Commercial Guarantee',
    title: '5-Year Industry Warranty',
    description: 'Comprehensive manufacturer coverage with hassle-free advance fixture replacement managed directly from Dallas.',
    spec: '50,000+ Hr L70 · 5-Year Term',
  },
  {
    icon: 'dollar',
    tag: 'Energy Incentive',
    title: 'Utility Rebate Eligible',
    description: 'DLC 5.1 Premium qualified fixtures engineered to unlock maximum cash-back rebates across US local power utilities.',
    spec: 'DLC 5.1 Premium · Up to 75% Savings',
  },
  {
    icon: 'truck',
    tag: 'Dallas, TX Hub',
    title: 'Fast Nationwide Shipping',
    description: 'High-volume commercial stock ready for same-day dispatch from our central Dallas distribution facility to job sites nationwide.',
    spec: 'Same-Day Dispatch · Direct Freight',
  },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip-section" aria-label="Commercial Certifications and Guarantees">
      <div className="shell">
        <div className="trust-section-head">
          <span className="eyebrow">
            <span className="eyebrow-pip" /> Specification Standards &amp; Guarantees
          </span>
          <h2 className="trust-section-title">Engineered to Spec. Backed by Solid Guarantees.</h2>
          <p className="trust-section-sub">
            Contractors, electrical distributors, and facility engineers trust ZION LED USA for verified commercial compliance, energy savings, and rapid delivery.
          </p>
        </div>

        <div className="trust-boxes-grid">
          {TRUST_BOXES.map((box) => (
            <div key={box.title} className="trust-box">
              <div className="trust-box-header">
                <span className="trust-box-icon">
                  <Icon name={box.icon} size={22} />
                </span>
                <span className="trust-box-tag">{box.tag}</span>
              </div>
              <h3 className="trust-box-title">{box.title}</h3>
              <p className="trust-box-desc">{box.description}</p>
              <div className="trust-box-footer">
                <span className="trust-box-spec">
                  <Icon name="check" size={14} /> {box.spec}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
