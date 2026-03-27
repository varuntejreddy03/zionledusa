import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductTabs from '@/components/product/ProductTabs'
import RelatedProducts from '@/components/product/RelatedProducts'
import { getProductImageSrc } from '@/lib/catalog'
import { getAllProducts, getNavigationGroups, getProductBreadcrumbItems, getProductBySlug, getSiteMeta } from '@/lib/data'

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
  const navigation = getNavigationGroups()
  const allProducts = getAllProducts()

  const relatedProducts = allProducts.filter(
    (entry) =>
      entry.slug !== slug &&
      entry.categories.some((category) => product.categories.some((productCategory) => productCategory.slug === category.slug)),
  )

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : allProducts.filter((entry) => entry.slug !== slug && entry.group && entry.group === product.group)
  const breadcrumbItems = getProductBreadcrumbItems(product)

  return (
    <>
      <Navbar meta={meta} navigation={navigation} />

      <main className="product-detail-main">
        <div className="product-breadcrumb breadcrumb">
          {breadcrumbItems.map((item, index) => (
            <div key={`${item.label}-${index}`} style={{ display: 'contents' }}>
              {item.href ? <Link href={item.href}>{item.label}</Link> : <span className="is-current">{item.label}</span>}
              {index < breadcrumbItems.length - 1 ? <span aria-hidden="true">&gt;</span> : null}
            </div>
          ))}
        </div>

        <div className="product-detail-shell">
          <div className="product-detail-grid">
            <ProductGallery images={product.images} productName={product.name} />

            <ProductInfo product={product} phone={meta.phone} phoneHref={meta.phone_href} email={meta.email} />
          </div>

          <ProductTabs product={product} />
          <RelatedProducts products={fallbackRelated} currentSlug={slug} />
        </div>

        <div className="mobile-cta-bar">
          <div className="mobile-cta-copy">
            <span className="mobile-cta-meta">{product.categories[0]?.name || 'Commercial LED'}</span>
            <strong className="mobile-cta-title">{product.name}</strong>
          </div>

          <div className="mobile-cta-actions">
            <a href={`tel:${meta.phone_href}`} className="mobile-cta-button mobile-cta-button--primary">
              Call for Quote
            </a>
            <a href={`mailto:${meta.email}`} className="mobile-cta-button mobile-cta-button--secondary">
              Email Us
            </a>
          </div>
        </div>
      </main>

      <Footer meta={meta} navigation={navigation} />
    </>
  )
}
