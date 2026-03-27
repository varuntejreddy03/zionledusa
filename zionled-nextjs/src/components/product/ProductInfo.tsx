'use client'

import Link from 'next/link'

import { getGroupConfig, groupFromSlug } from '@/lib/catalog'
import { getHighlights, parseSpecsFromText } from '@/lib/parseSpecs'
import type { Product } from '@/types/product'

interface ProductInfoProps {
  product: Product
  phone: string
  phoneHref: string
  email: string
}

function formatSpecKey(key: string) {
  const cleaned = key.replace(/[_-]+/g, ' ').trim()
  if (!cleaned) return ''

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function formatAttributeValue(value: string | string[]) {
  return Array.isArray(value) ? value.join(', ') : String(value)
}

export default function ProductInfo({ product, phone, phoneHref, email }: ProductInfoProps) {
  const rawText = product.short_desc || product.description || ''
  const specs = parseSpecsFromText(rawText)
  const highlights = getHighlights(specs)
  const attributeEntries = Object.entries(product.attributes || {})
  const displayPrice = product.sale_price || product.price || product.regular_price || ''
  const primaryCategory = product.categories[0]
  const primaryGroup = getGroupConfig(primaryCategory?.slug ? groupFromSlug(primaryCategory.slug) ?? product.group ?? 'indoor' : product.group ?? 'indoor')

  return (
    <div className="product-info-panel" style={{ paddingTop: '0.5rem' }}>
      <div className="product-info-tags" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        <Link href={`/category/${primaryGroup.key}`}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-head)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '100px',
              background: 'rgba(13,127,212,0.15)',
              border: '1px solid rgba(13,127,212,0.25)',
              color: 'var(--blue-glow)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
          >
            {primaryGroup.label}
          </span>
        </Link>

        {product.categories.map((category, index) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-head)',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '100px',
                background: index === 0 ? 'rgba(13,127,212,0.08)' : 'rgba(13,127,212,0.08)',
                border: '1px solid rgba(13,127,212,0.15)',
                color: 'var(--muted)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
            >
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)',
          fontWeight: 700,
          color: 'var(--off-white)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {product.name}
      </h1>

      {product.sku ? (
        <p
          style={{
            margin: '0.75rem 0 0',
            fontFamily: 'var(--font-head)',
            fontSize: '0.8rem',
            color: 'var(--dim)',
          }}
        >
          SKU: {product.sku}
        </p>
      ) : null}

      <p
        style={{
          margin: '1rem 0 0',
          fontFamily: 'var(--font-head)',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: displayPrice ? 'var(--gold)' : 'var(--muted)',
        }}
      >
        {displayPrice ? displayPrice : 'Contact for Pricing'}
      </p>

      <div style={{ height: 1, background: 'var(--border)', margin: '1.2rem 0' }} />

      <div className="s-label" style={{ marginBottom: '1rem' }}>
        Product Highlights
      </div>

      {highlights.length > 0 ? (
        <div className="product-highlight-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {highlights.map((spec, index) => (
            <div key={`${spec.key}-${spec.value}-${index}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--blue-core)',
                  boxShadow: '0 0 8px rgba(13,127,212,0.6)',
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--off-white)',
                  fontWeight: 300,
                }}
              >
                {spec.key ? (
                  <>
                    <strong style={{ fontWeight: 600, color: 'var(--off-white)' }}>{formatSpecKey(spec.key)}:</strong>{' '}
                    <span style={{ color: 'var(--muted)' }}>{spec.value}</span>
                  </>
                ) : (
                  spec.value
                )}
              </p>
            </div>
          ))}
        </div>
      ) : product.short_desc ? (
        <p
          style={{
            margin: '0 0 1.5rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          {product.short_desc}
        </p>
      ) : null}

      {attributeEntries.length > 0 ? (
        <>
          <div style={{ height: 1, background: 'var(--border)', margin: '1.2rem 0' }} />
          <div className="s-label" style={{ marginBottom: '1rem' }}>
            Specifications
          </div>

          <div
            className="product-quick-specs"
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              marginBottom: '1.5rem',
            }}
          >
            {attributeEntries.map(([key, value], index) => (
              <div
                key={key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '35% 65%',
                  padding: '0.7rem 1rem',
                  background: index % 2 === 0 ? 'transparent' : 'rgba(13,127,212,0.04)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: '0.82rem',
                    color: 'var(--muted)',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    letterSpacing: '0.5px',
                  }}
                >
                  {formatSpecKey(key)}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--off-white)',
                    fontWeight: 300,
                  }}
                >
                  {formatAttributeValue(value)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div style={{ height: 1, background: 'var(--border)', margin: '1.2rem 0' }} />

      <div className="product-stock-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: product.in_stock === false ? 'rgba(240,165,0,0.12)' : 'rgba(16,185,129,0.12)',
            border: product.in_stock === false ? '1px solid rgba(240,165,0,0.3)' : '1px solid rgba(16,185,129,0.3)',
            color: product.in_stock === false ? 'var(--gold)' : '#10b981',
            fontFamily: 'var(--font-head)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '0.3rem 0.9rem',
            borderRadius: '100px',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: product.in_stock === false ? 'var(--gold)' : '#10b981',
              boxShadow: product.in_stock === false ? '0 0 0 0 rgba(240,165,0,0.4)' : '0 0 0 0 rgba(16,185,129,0.4)',
              animation: 'pulseDot 2s ease-in-out infinite',
            }}
          />
          {product.in_stock === false ? 'Contact for Availability' : 'In Stock'}
        </span>
      </div>

      <div className="product-info-actions">
        <a href={`tel:${phoneHref}`} className="btn-glow product-info-button">
          Get a Quote
        </a>
        <a href={`mailto:${email}`} className="btn-outline product-info-button">
          Email for Quote
        </a>
      </div>

      <div className="product-trust-badges" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1.2rem' }}>
        {['DLC Certified', 'UL Listed', '5-Year Warranty', 'Free Shipping'].map((badge) => (
          <span
            key={badge}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '0.25rem 0.7rem',
              fontFamily: 'var(--font-head)',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--muted)',
              letterSpacing: '0.5px',
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      <div
        className="product-contact-strip"
        style={{
          marginTop: '1.5rem',
          padding: '1rem 1.2rem',
          background: 'rgba(13,127,212,0.05)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <a
          href={`tel:${phoneHref}`}
          style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: 'var(--gold)',
            textDecoration: 'none',
          }}
        >
          {phone}
        </a>
        <a
          href={`mailto:${email}`}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '0.85rem',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          {email}
        </a>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '0.82rem',
            color: 'var(--dim)',
          }}
        >
          Mon-Fri: 9AM-6PM CST
        </span>
      </div>
    </div>
  )
}
