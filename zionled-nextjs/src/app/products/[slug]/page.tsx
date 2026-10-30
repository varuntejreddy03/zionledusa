import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageShell from '@/components/PageShell'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductSlider from '@/components/sections/ProductSlider'
import Icon from '@/components/ui/Icon'
import { getProductImageSrc } from '@/lib/catalog'
import {
  getAllProducts,
  getProductBreadcrumbItems,
  getProductBySlug,
  getProductsByCategory,
  getSiteMeta,
} from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {}
  }

  const imageSrc = getProductImageSrc(product)

  return {
    title: product.meta_title || product.name,
    description: product.meta_desc || product.short_desc || product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      images: imageSrc ? [{ url: imageSrc }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const meta = getSiteMeta()
  const allProducts = getAllProducts().filter((entry) => entry.slug !== slug)
  const sameCategory = allProducts.filter((entry) =>
    entry.categories.some((category) => product.categories.some((own) => own.slug === category.slug)),
  )
  const related = (sameCategory.length >= 4 ? sameCategory : [...sameCategory, ...allProducts.filter((entry) => entry.group === product.group)])
    .filter((entry, index, list) => list.findIndex((other) => other.slug === entry.slug) === index)
    .slice(0, 12)
  const breadcrumbItems = getProductBreadcrumbItems(product)
  const quoteHref = `/quote`

  // Prev / Next products in primary category
  const primaryCat = product.categories[0]?.slug
  const categoryProducts = primaryCat ? getProductsByCategory(primaryCat) : []
  const currentIndex = categoryProducts.findIndex((p) => p.slug === slug)
  const prevProduct = currentIndex > 0 ? categoryProducts[currentIndex - 1] : null
  const nextProduct = currentIndex >= 0 && currentIndex < categoryProducts.length - 1 ? categoryProducts[currentIndex + 1] : null

  // JSON-LD Product (Strict rule: No price or availability)
  const imageSrc = getProductImageSrc(product)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku || undefined,
    image: imageSrc ? [imageSrc] : undefined,
    description: product.short_desc || product.description || undefined,
    brand: {
      '@type': 'Brand',
      name: 'ZION LED',
    },
    category: product.categories[0]?.name || 'Commercial LED Lighting',
  }

  const breadcrumbJsonLdItems = breadcrumbItems.map((b) => ({
    name: b.label,
    url: b.href || `/products/${product.slug}`,
  }))

  return (
    <PageShell mainClassName="pd">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />

      <div className="shell">
        <nav className="crumbs" aria-label="Breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <span key={`${item.label}-${index}`} style={{ display: 'contents' }}>
              {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
              {index < breadcrumbItems.length - 1 ? <span aria-hidden="true">/</span> : null}
            </span>
          ))}
        </nav>

        <div className="pd-grid">
          <ProductGallery images={product.images} productName={product.name} />
          <div>
            <ProductInfo product={product} phone={meta.phone} phoneHref={meta.phone_href} email={meta.email} />
            <div className="pd-section">
              <h2>Documents</h2>
              <a href={`mailto:${meta.email}?subject=${encodeURIComponent(`Spec sheet: ${product.name}`)}`} className="spec-doc">
                <span className="trust-icon">
                  <Icon name="doc" />
                </span>
                <span>
                  <b>Spec sheet, IES &amp; install guide</b>
                  <br />
                  Email us and we&apos;ll send the full documentation pack.
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Prev / Next in category links */}
        <div className="pd-category-nav">
          {prevProduct ? (
            <Link href={`/products/${prevProduct.slug}`} className="pd-nav-link pd-nav-link--prev">
              <span className="pd-nav-sub">&larr; Previous in {product.categories[0]?.name}</span>
              <strong className="pd-nav-title">{prevProduct.name}</strong>
            </Link>
          ) : (
            <div className="pd-nav-spacer" />
          )}

          {nextProduct ? (
            <Link href={`/products/${nextProduct.slug}`} className="pd-nav-link pd-nav-link--next">
              <span className="pd-nav-sub">Next in {product.categories[0]?.name} &rarr;</span>
              <strong className="pd-nav-title">{nextProduct.name}</strong>
            </Link>
          ) : (
            <div className="pd-nav-spacer" />
          )}
        </div>
      </div>

      {related.length ? (
        <div className="related">
          <ProductSlider eyebrow="You may also need" title="Related products" products={related} />
        </div>
      ) : null}

      <div className="mobile-bar">
        <a href={`tel:${meta.phone_href}`} className="btn btn--ghost">
          <Icon name="phone" size={16} /> Call
        </a>
        <Link href={quoteHref} className="btn btn--primary">
          Request a quote
        </Link>
      </div>
    </PageShell>
  )
}
