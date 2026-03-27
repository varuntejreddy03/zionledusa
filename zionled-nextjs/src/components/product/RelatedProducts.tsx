'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef } from 'react'

import { getProductImageSrc } from '@/lib/catalog'
import { BLUR_DATA_URL } from '@/lib/ui'
import type { Product } from '@/types/product'

interface RelatedProductsProps {
  products: Product[]
  currentSlug: string
}

function getCardBackground(product: Product) {
  const fingerprint = `${product.group ?? ''} ${product.categories.map((category) => category.slug).join(' ')}`.toLowerCase()

  if (fingerprint.includes('pole') || fingerprint.includes('lightpole')) {
    return 'linear-gradient(135deg,#120d1f,#1a0d2e)'
  }

  if (fingerprint.includes('outdoor') || fingerprint.includes('shoebox') || fingerprint.includes('wallpack') || fingerprint.includes('flood')) {
    return 'linear-gradient(135deg,#0a1820,#0d2535)'
  }

  return 'linear-gradient(135deg,#0a1830,#0d2247)'
}

export default function RelatedProducts({ products, currentSlug }: RelatedProductsProps) {
  const rowRef = useRef<HTMLDivElement>(null)

  const related = useMemo(
    () =>
      products
        .filter((product) => product.slug !== currentSlug)
        .slice(0, 8),
    [products, currentSlug],
  )

  const scroll = (direction: 1 | -1) => {
    rowRef.current?.scrollBy({ left: direction * 240, behavior: 'smooth' })
  }

  if (related.length === 0) {
    return null
  }

  return (
    <section
      style={{
        marginTop: '4rem',
        paddingTop: '3rem',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="s-label">You may also need</div>
      <h2
        style={{
          fontFamily: 'var(--font-head)',
          fontSize: 'clamp(1.6rem,3vw,2.4rem)',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--off-white)',
          margin: '0 0 2rem',
        }}
      >
        Related <span style={{ color: 'var(--blue-bright)' }}>Products</span>
      </h2>

      <div style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Scroll related products left"
          onClick={() => scroll(-1)}
          className="related-scroll-arrow related-scroll-arrow--left"
        >
          &lt;
        </button>
        <button
          type="button"
          aria-label="Scroll related products right"
          onClick={() => scroll(1)}
          className="related-scroll-arrow related-scroll-arrow--right"
        >
          &gt;
        </button>

        <div ref={rowRef} className="related-row">
          {related.map((product) => {
            const imageSrc = getProductImageSrc(product)
            const category = product.categories[0]?.name || ''

            return (
              <Link key={product.slug} href={`/products/${product.slug}`} className="related-card">
                <div
                  style={{
                    height: 160,
                    background: getCardBackground(product),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {imageSrc ? (
                    <div style={{ position: 'relative', width: 120, height: 120 }}>
                      <Image
                        src={imageSrc}
                        alt={product.images[0]?.alt || product.name}
                        fill
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        sizes="120px"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(13,127,212,0.2)',
                      }}
                    />
                  )}
                </div>

                <div style={{ padding: '1rem 1.1rem' }}>
                  {category ? (
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-head)',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '100px',
                        background: 'rgba(13,127,212,0.12)',
                        border: '1px solid rgba(13,127,212,0.2)',
                        color: 'var(--blue-glow)',
                        marginBottom: '0.6rem',
                      }}
                    >
                      {category}
                    </span>
                  ) : null}

                  <p
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: 'var(--off-white)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      lineHeight: 1.2,
                      margin: '0 0 0.6rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.name}
                  </p>
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--blue-bright)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    View Product -&gt;
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
