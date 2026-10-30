import Image from 'next/image'
import Link from 'next/link'

import SearchBar from '@/components/SearchBar'
import Icon from '@/components/ui/Icon'

export interface ImageTile {
  title: string
  text: string
  href: string
  image: string | null
}

interface HeroSectionProps {
  tiles?: ImageTile[]
  stats: { value: string; label: string }[]
}

const QUICK_CATEGORIES = [
  { label: 'UFO High Bays', href: '/category/ufo-high-bay-lights' },
  { label: 'Shoebox Area Lights', href: '/category/led-shoebox-lights' },
  { label: 'Canopy Lights', href: '/category/led-canopy-lights' },
  { label: 'Wall Packs', href: '/category/led-wall-packs' },
  { label: 'Flat Panels', href: '/category/led-panel-light' },
  { label: 'Light Poles', href: '/category/lightpoles' },
]

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="shell hero-grid">
        {/* Left Column: Eyebrow + Headline + Search + Actions + Stats + Mission/Vision */}
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="hero-badge-dot" />
            <span>DLC 5.1 Premium · UL Listed · Stocked in Dallas, TX Hub</span>
          </div>

          <h1 className="hero-main-title">
            Commercial LED Lighting. <span className="hero-highlight">Built to Spec.</span>
          </h1>

          <p className="hero-lead">
            High bays, area lights, wall packs, canopies, and poles engineered for warehouses, commercial properties, and parking structures. Direct contractor pricing with complimentary AGi32 photometric layout studies.
          </p>

          <div className="hero-search">
            <SearchBar variant="inline" />
            <div className="hero-quick-links">
              <span className="quick-label">Popular Categories:</span>
              <div className="quick-tags">
                {QUICK_CATEGORIES.map((cat) => (
                  <Link key={cat.href} href={cat.href} className="quick-tag">
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <Link href="/products" className="btn btn--primary">
              Browse All 150+ Fixtures <Icon name="arrow" size={16} />
            </Link>
            <Link href="/quote" className="btn btn--ghost">
              Request a Free Project Quote
            </Link>
          </div>

          <dl className="hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat-card">
                <dt>
                  <strong>{stat.value}</strong>
                </dt>
                <dd style={{ margin: 0 }}>
                  <span>{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          {/* Mission & Vision Statements */}
          <div className="hero-statements">
            <div className="statement-card statement-card--mission">
              <div className="statement-head">
                <span className="statement-dot statement-dot--blue" />
                <span className="statement-tag">Our Mission</span>
              </div>
              <p className="statement-text">
                To deliver spec-grade, DLC &amp; UL-certified commercial LED lighting that empowers contractors with verified photometric efficiency, direct factory pricing, and same-day Dallas dispatch.
              </p>
            </div>
            <div className="statement-card statement-card--vision">
              <div className="statement-head">
                <span className="statement-dot statement-dot--red" />
                <span className="statement-tag">Our Vision</span>
              </div>
              <p className="statement-text">
                To be America&apos;s most trusted commercial lighting supply partner — setting the national standard for compliance transparency, photometric speed, and project reliability.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Concentric Circle with Zion LED Eagle Logo */}
        <div className="hero-emblem-wrapper" aria-label="ZION LED Brand Emblem">
          <div className="optic-system">
            {/* Ambient Conic & Radial Light Beam Glow */}
            <div className="optic-beam-glow" />

            {/* Concentric Photometric Optical Distribution Rings */}
            <div className="optic-ring optic-ring--outer" />
            <div className="optic-ring optic-ring--dashed animate-optic-spin" />
            <div className="optic-ring optic-ring--middle" />
            <div className="optic-ring optic-ring--pulse animate-optic-pulse" />

            {/* Polar Candela Reticle Axes */}
            <div className="optic-axis optic-axis--horizontal" />
            <div className="optic-axis optic-axis--vertical" />
            <span className="optic-tick optic-tick--top">0°</span>
            <span className="optic-tick optic-tick--right">90°</span>
            <span className="optic-tick optic-tick--bottom">180°</span>
            <span className="optic-tick optic-tick--left">270°</span>

            {/* Center Medallion with Zion LED Eagle Emblem */}
            <div className="eagle-circle-medallion">
              <div className="medallion-rim">
                <div className="medallion-inner">
                  <div className="eagle-image-wrap animate-eagle-float">
                    <Image
                      src="/assets/branding/eagle-icon.png"
                      alt="ZION LED Eagle Emblem"
                      width={175}
                      height={175}
                      priority
                      className="eagle-logo-img"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Technical Specification Orbit Badges (Desktop) */}
            <div className="orbit-badge orbit-badge--top">
              <span className="orbit-dot orbit-dot--green" />
              <div className="orbit-badge-text">
                <strong>DLC 5.1 Premium</strong>
                <span>Utility Rebate Qualified</span>
              </div>
            </div>

            <div className="orbit-badge orbit-badge--left">
              <span className="orbit-dot orbit-dot--blue" />
              <div className="orbit-badge-text">
                <strong>UL 1598 &amp; ETL</strong>
                <span>Commercial Safety Listed</span>
              </div>
            </div>

            <div className="orbit-badge orbit-badge--right">
              <span className="orbit-dot orbit-dot--amber" />
              <div className="orbit-badge-text">
                <strong>Dallas, TX Hub</strong>
                <span>Same-Day Fast Dispatch</span>
              </div>
            </div>
          </div>

          {/* Mobile Technical Specification Tray (<= 640px) */}
          <div className="optic-mobile-tray" aria-hidden="true">
            <span className="mobile-spec-pill">
              <span className="orbit-dot orbit-dot--green" />
              <strong>DLC 5.1 Premium</strong>
            </span>
            <span className="mobile-spec-pill">
              <span className="orbit-dot orbit-dot--blue" />
              <strong>UL 1598 &amp; ETL</strong>
            </span>
            <span className="mobile-spec-pill">
              <span className="orbit-dot orbit-dot--amber" />
              <strong>Dallas, TX Hub</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
