'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { getGroupLabel, getGroupVisuals, getProductImageSrc } from '@/lib/catalog'
import { BLUR_DATA_URL } from '@/lib/ui'
import type { HomepageCategoryTile, PrimaryCategory } from '@/types/product'

interface CategoryGridProps {
  primaryCategories: PrimaryCategory[]
  tiles: HomepageCategoryTile[]
}

interface CatalogImageProps {
  src?: string | null
  alt: string
  sizes: string
  className: string
  initials: string
}

function CatalogImage({ src, alt, sizes, className, initials }: CatalogImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <div className="catalog-image-fallback">{initials}</div>
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onError={() => setFailed(true)}
    />
  )
}

export default function CategoryGrid({ primaryCategories, tiles }: CategoryGridProps) {
  return (
    <section id="categories" className="applications-section">
      <div className="site-shell">
        <div className="catalog-head reveal">
          <div className="catalog-head-copy">
            <div className="s-label">Product Catalog</div>
            <h2 className="section-title">
              LIGHTING FOR EVERY <span className="text-accent-blue">APPLICATION</span>
            </h2>
            <p className="section-copy">From warehouse ceilings to parking lots, the right LED for your exact space.</p>
          </div>

          <Link href="/#products" className="catalog-head-action btn-outline">
            View All
          </Link>
        </div>

        <div className="application-editorial-grid">
          {primaryCategories.map((category, index) => {
            const visuals = getGroupVisuals(category.key)
            const imageSrc = getProductImageSrc(category.heroProduct)
            const initials = category.label
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')

            return (
              <article key={category.key} className={`application-card reveal ${visuals.glow}`} data-group={category.key}>
                <div className="application-topline">
                  <span className="application-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className={visuals.badge}>{category.label}</span>
                </div>

                <div className="application-copy">
                  <h3 className="application-headline">{category.headline}</h3>
                  <div className="application-meta">
                    <span>{category.productCount} products</span>
                    <span>{category.categoryCount} sub-categories</span>
                  </div>

                  <div className="application-tags">
                    {category.topCategories.map((item) => (
                      <span key={item} className="application-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`application-media ${visuals.surface}`}>
                  <div className="application-media-frame">
                    <CatalogImage
                      src={imageSrc}
                      alt={category.heroProduct?.images[0]?.alt || category.label}
                      className="application-image"
                      initials={initials}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 280px"
                    />
                  </div>
                </div>

                <Link href={category.href} className="section-link application-link">
                  Browse Category System <span aria-hidden="true">-&gt;</span>
                </Link>
              </article>
            )
          })}
        </div>

        <div className="subcategory-grid">
          {tiles.map((tile) => {
            const visuals = getGroupVisuals(tile.group)
            const imageSrc = getProductImageSrc(tile.product)
            const initials = tile.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')

            return (
              <Link key={tile.slug} href={tile.href} className={`subcategory-card reveal ${visuals.glow}`} data-group={tile.group ?? 'indoor'}>
                <div className={`subcategory-visual ${visuals.surface}`}>
                  <div className="subcategory-media-frame">
                    <CatalogImage
                      src={imageSrc}
                      alt={tile.product?.images[0]?.alt || tile.name}
                      className="subcategory-image"
                      initials={initials}
                      sizes="(max-width: 768px) 56vw, (max-width: 1024px) 34vw, 240px"
                    />
                  </div>
                </div>

                <div className="subcategory-body">
                  <span className={visuals.badge}>{getGroupLabel(tile.group)}</span>
                  <h3 className="subcategory-title">{tile.name}</h3>
                  <p className="subcategory-description">{tile.description}</p>
                  <div className="subcategory-footer">
                    <span>{tile.count} items</span>
                    <span className="view-link">View details</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
