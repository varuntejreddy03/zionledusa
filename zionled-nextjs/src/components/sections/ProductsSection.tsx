'use client'

import Image from 'next/image'
import Link from 'next/link'
import { type MouseEvent, useRef, useState, useTransition } from 'react'

import { getGroupLabel, getGroupVisuals, getProductImageSrc, summarizeText } from '@/lib/catalog'
import { BLUR_DATA_URL } from '@/lib/ui'
import type { GroupKey, PrimaryCategory, Product } from '@/types/product'

interface ProductsSectionProps {
  products: Product[]
  primaryCategories: PrimaryCategory[]
}

type FilterKey = 'all' | GroupKey

interface ProductCardImageProps {
  src?: string | null
  alt: string
  name: string
}

function ProductCardImage({ src, alt, name }: ProductCardImageProps) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  if (!src || failed) {
    return <div className="product-card-fallback">{initials}</div>
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="product-card-image"
      sizes="(max-width: 768px) 156px, 182px"
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onError={() => setFailed(true)}
    />
  )
}

export default function ProductsSection({ products, primaryCategories }: ProductsSectionProps) {
  const [active, setActive] = useState<FilterKey>('all')
  const [visibleCount, setVisibleCount] = useState(12)
  const [, startTransition] = useTransition()

  const tabs: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All Products' },
    ...primaryCategories.map((category) => ({ key: category.key, label: category.label })),
  ]

  const filteredProducts = active === 'all' ? products : products.filter((product) => product.group === active)
  const visibleProducts = filteredProducts.slice(0, visibleCount)

  return (
    <section id="products" className="featured-section products-section">
      <div className="site-shell">
        <div className="catalog-products-head reveal">
          <div className="catalog-products-copy">
            <div className="s-label">Product Catalog</div>
            <h2 className="section-title catalog-products-title">
              LIGHTING FOR EVERY <span className="text-accent-blue">APPLICATION</span>
            </h2>
            <div className="catalog-products-subrow">
              <p className="section-copy catalog-products-copy-text">
                From warehouse ceilings to parking lots, the right LED for your exact space.
              </p>
              <span className="catalog-products-orb" aria-hidden="true" />
            </div>
          </div>

          <button
            type="button"
            className="btn-outline catalog-products-cta"
            onClick={() =>
              startTransition(() => {
                setActive('all')
                setVisibleCount(12)
              })
            }
          >
            View All <span aria-hidden="true">-&gt;</span>
          </button>
        </div>

        <div className="filter-tabs catalog-filter-tabs reveal">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`filter-tab ${active === tab.key ? 'is-active' : ''}`}
              onClick={() =>
                startTransition(() => {
                  setActive(tab.key)
                  setVisibleCount(12)
                })
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {filteredProducts.length > visibleCount ? (
          <div className="product-grid-action reveal">
            <button type="button" className="btn-outline" onClick={() => setVisibleCount((count) => count + 12)}>
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const visuals = getGroupVisuals(product.group)
  const imageSrc = getProductImageSrc(product)
  const tiltRef = useRef<HTMLAnchorElement | null>(null)

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 1024) {
      return
    }

    const node = tiltRef.current
    if (!node) {
      return
    }

    const bounds = node.getBoundingClientRect()
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2

    node.style.transform = `perspective(700px) rotateY(${offsetX * 12}deg) rotateX(${-offsetY * 12}deg) translateY(-4px)`
  }

  const resetTilt = () => {
    if (!tiltRef.current) {
      return
    }

    tiltRef.current.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0)'
  }

  return (
    <article className={`product-card reveal ${visuals.glow}`} data-group={product.group ?? 'indoor'}>
      <Link
        ref={tiltRef}
        href={`/products/${product.slug}`}
        className="product-card-shell"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        <div className={`product-card-visual ${visuals.surface}`}>
          <div className="product-card-image-frame">
            <ProductCardImage src={imageSrc} alt={product.images[0]?.alt || product.name} name={product.name} />
          </div>
        </div>

        <div className="product-card-body">
          <div className="product-card-tags">
            <span className={visuals.badge}>{getGroupLabel(product.group)}</span>
            <span className="product-card-subtag">{product.categories[0]?.name || 'Commercial LED'}</span>
          </div>

          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-description">
            {summarizeText(product.short_desc || product.description || 'Commercial LED lighting product.', 144)}
          </p>

          <div className="product-link-row">
            <span className="product-card-status">Spec-grade detail</span>
            <span className="section-link">
              Shop Now <span aria-hidden="true">-&gt;</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
