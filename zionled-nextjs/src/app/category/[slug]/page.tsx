import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import ProductCard from '@/components/ProductCard'
import { getProductImageSrc } from '@/lib/catalog'
import { getCategoryPageData, getCategoryRouteSlugs } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getCategoryRouteSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getCategoryPageData(slug)

  if (!page) {
    return {}
  }

  const imageSrc = page.image ? getProductImageSrc(page.image) : null

  return {
    title: page.name,
    description: page.description,
    alternates: { canonical: page.href },
    openGraph: {
      images: imageSrc ? [{ url: imageSrc }] : [],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const page = getCategoryPageData(slug)

  if (!page) {
    notFound()
  }

  const heroImage = page.products[0] ? getProductImageSrc(page.products[0]) : page.image ? getProductImageSrc(page.image) : null
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(page.type === 'subcategory' ? [{ label: page.groupLabel, href: page.groupHref }] : []),
    { label: page.name },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    ...(page.type === 'subcategory' ? [{ name: page.groupLabel, url: page.groupHref }] : []),
    { name: page.name, url: page.href },
  ]

  return (
    <PageShell showContact>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow={`${page.products.length} ${page.products.length === 1 ? 'product' : 'products'} · ${page.groupLabel}`}
        title={page.name}
        intro={page.description}
        image={heroImage}
        imagePriority
      />

      <div className="subnav">
        <div className="shell pill-row">
          <Link href={page.groupHref} className={`pill ${page.type === 'group' ? 'is-active' : ''}`}>
            All {page.groupLabel}
          </Link>
          {page.subcategories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className={`pill ${page.category?.slug === category.slug ? 'is-active' : ''}`}>
              {category.name}
              <small>{category.count}</small>
            </Link>
          ))}
        </div>
      </div>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="shell">
          <div className="results-head">
            <h2>{page.type === 'group' ? `All ${page.groupLabel.toLowerCase()} products` : page.name}</h2>
            <span>
              Showing {page.products.length} {page.products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {page.products.length > 0 ? (
            <div className="product-grid">
              {page.products.map((product, index) => (
                <ProductCard key={product.slug} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>No products here yet</h2>
              <p>Call us and we can source it for your project.</p>
              <Link href={page.groupHref} className="btn btn--ghost" style={{ marginTop: 20 }}>
                Back to {page.groupLabel}
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  )
}
