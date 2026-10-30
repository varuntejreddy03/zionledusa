import Link from 'next/link'

import { getSpecChips } from '@/components/ProductCard'
import Icon from '@/components/ui/Icon'
import { parseFeatures } from '@/lib/parseSpecs'
import type { Product } from '@/types/product'

interface ProductInfoProps {
  product: Product
  phone: string
  phoneHref: string
  email: string
}

const ASSURANCES = [
  'DLC & UL listed for utility rebates',
  'Ships from stock in Dallas, Texas',
  '5-year commercial factory warranty',
  'Tiered volume & contractor pricing',
]

export default function ProductInfo({ product, phone, phoneHref }: ProductInfoProps) {
  const { features, applications } = parseFeatures(product.attributes?.['Key Features'])
  const extraApps = parseFeatures(product.attributes?.['Suitable Applications']).features.map((item) => item.value)
  const allApps = [...applications, ...extraApps]
  const chips = getSpecChips(product.name)
  const category = product.categories[0]

  return (
    <div className="pd-info">
      <div className="pd-badge-row">
        {category ? (
          <Link href={`/category/${category.slug}`} className="eyebrow" style={{ textTransform: 'uppercase' }}>
            {category.name}
          </Link>
        ) : null}
        <span className="pd-cert-tag">DLC &amp; UL Spec</span>
      </div>

      <h1>{product.name}</h1>

      <div className="pd-meta">
        {product.sku ? (
          <span>
            SKU: <b>{product.sku}</b>
          </span>
        ) : null}
        <span>
          Stocked in <b>Dallas, TX</b>
        </span>
        <span>
          Warranty: <b>5 Years</b>
        </span>
      </div>

      {chips.length ? (
        <div className="chips" style={{ marginTop: 14 }}>
          {chips.map((chip, i) => (
            <span key={chip} className={`chip ${i === 0 ? 'chip--highlight' : ''}`}>
              {chip}
            </span>
          ))}
          <span className="chip">0–10V Dimming</span>
        </div>
      ) : null}

      <div className="pd-quote">
        <div className="pd-quote-head">
          <div>
            <strong>Commercial &amp; Project Pricing</strong>
            <p style={{ fontSize: '0.86rem', color: 'var(--ink-2)', marginTop: 2 }}>
              Send fixture schedule or takeoff sheet. Official proposals returned within 24 hours.
            </p>
          </div>
        </div>

        <div className="cta-actions" style={{ marginTop: 16 }}>
          <Link href="/quote" className="btn btn--primary">
            Request Project Pricing <Icon name="arrow" size={16} />
          </Link>
          <a href={`tel:${phoneHref}`} className="btn btn--ghost">
            <Icon name="phone" size={16} /> Call {phone}
          </a>
        </div>

        <div className="pd-assure" style={{ marginTop: 20 }}>
          {ASSURANCES.map((item) => (
            <span key={item}>
              <Icon name="check" size={16} /> {item}
            </span>
          ))}
        </div>
      </div>

      {features.length ? (
        <div className="pd-section">
          <h2>Engineering Specifications</h2>
          <ul className="feature-list">
            {features.map((feature, index) => (
              <li key={`${feature.key}-${index}`}>
                <span>
                  {feature.key ? <b>{feature.key}: </b> : null}
                  {feature.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : product.short_desc ? (
        <div className="pd-section">
          <h2>Overview</h2>
          <p style={{ color: 'var(--ink-2)' }}>{product.short_desc}</p>
        </div>
      ) : null}

      {allApps.length ? (
        <div className="pd-section">
          <h2>Typical Commercial Applications</h2>
          <div className="chips">
            {allApps.map((app) => (
              <span key={app} className="chip">
                {app}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
