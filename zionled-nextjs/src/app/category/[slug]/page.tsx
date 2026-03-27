import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { getGroupVisuals, getProductImageSrc, summarizeText } from '@/lib/catalog'
import { getCategoryPageData, getCategoryRouteSlugs, getNavigationGroups, getSiteMeta } from '@/lib/data'
import { BLUR_DATA_URL } from '@/lib/ui'
import type { Category, Product } from '@/types/product'

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
    title: `${page.name} | ZION LED USA`,
    description: page.description,
    openGraph: {
      images: imageSrc ? [{ url: imageSrc }] : [],
    },
  }
}

function CategoryPreviewCard({ category }: { category: Category }) {
  const visuals = getGroupVisuals(category.group)
  const imageSrc = category.image ? getProductImageSrc(category.image) : null
  const initials = category.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <Link href={`/category/${category.slug}`} className={`subcategory-card reveal ${visuals.glow}`} data-group={category.group ?? 'indoor'}>
      <div className={`subcategory-visual ${visuals.surface}`}>
        <div className="subcategory-media-frame">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={category.name}
              fill
              className="subcategory-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 34vw, 220px"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          ) : (
            <div className="catalog-image-fallback">{initials}</div>
          )}
        </div>
      </div>

      <div className="subcategory-body">
        <span className={visuals.badge}>{category.group === 'lightpoles' ? 'Light Poles' : category.group}</span>
        <h2 className="subcategory-title">{category.name}</h2>
        <p className="subcategory-description">{category.description || `${category.count} commercial products available in this category.`}</p>
        <div className="subcategory-footer">
          <span>{category.count} products</span>
          <span className="view-link">View category</span>
        </div>
      </div>
    </Link>
  )
}

function CategoryProductCard({ product }: { product: Product }) {
  const visuals = getGroupVisuals(product.group)
  const imageSrc = getProductImageSrc(product)
  const initials = product.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <article className={`product-card reveal ${visuals.glow}`} data-group={product.group ?? 'indoor'}>
      <Link href={`/products/${product.slug}`} className="product-card-shell">
        <div className={`product-card-visual ${visuals.surface}`}>
          <div className="product-card-image-frame">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.images[0]?.alt || product.name}
                fill
                className="product-card-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 280px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            ) : (
              <div className="product-card-fallback">{initials}</div>
            )}
          </div>
        </div>

        <div className="product-card-body">
          <div className="product-card-tags">
            <span className={visuals.badge}>{pageGroupLabel(product.group)}</span>
            <span className="product-card-subtag">{product.categories[0]?.name || 'Commercial LED'}</span>
          </div>

          <h2 className="product-card-title">{product.name}</h2>
          <p className="product-card-description">
            {summarizeText(product.short_desc || product.description || 'Commercial LED lighting product.', 144)}
          </p>

          <div className="product-link-row">
            <span className="product-card-status">Spec-grade detail</span>
            <span className="section-link">
              View Product <span aria-hidden="true">-&gt;</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function pageGroupLabel(group: Product['group']) {
  if (group === 'lightpoles') return 'Light Poles'
  if (group === 'outdoor') return 'Outdoor'
  return 'Indoor'
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const page = getCategoryPageData(slug)

  if (!page) {
    notFound()
  }

  const meta = getSiteMeta()
  const navigation = getNavigationGroups()

  return (
    <>
      <Navbar meta={meta} navigation={navigation} />

      <main className="category-page-main">
        <div className="product-breadcrumb">
          <Link href="/">HOME</Link>
          <span aria-hidden="true">&gt;</span>
          {page.type === 'subcategory' ? (
            <>
              <Link href={page.groupHref}>{page.groupLabel.toUpperCase()}</Link>
              <span aria-hidden="true">&gt;</span>
              <span className="is-current">{page.name.toUpperCase()}</span>
            </>
          ) : (
            <span className="is-current">{page.name.toUpperCase()}</span>
          )}
        </div>

        <div className="category-header">
          <div className="category-header-inner">
            <div className="category-header-copy">
              <div className="s-label">{page.type === 'group' ? 'Browse the Catalog' : `${page.groupLabel} Catalog`}</div>
              <h1 className="section-title">{page.title}</h1>
              <p className="section-copy">{page.description}</p>
            </div>

            <div className="category-count-pill">
              {page.products.length} {page.products.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
            </div>
          </div>
        </div>

        <div className="category-subnav">
          <div className="category-pill-row">
            <Link href={page.groupHref} className={`filter-tab ${page.type === 'group' ? 'is-active' : ''}`}>
              All {page.groupLabel}
            </Link>
            {page.subcategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`filter-tab ${page.category?.slug === category.slug ? 'is-active' : ''}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="category-page-shell">
          {page.type === 'group' ? (
            <div className="category-subcategory-grid subcategory-grid">
              {page.subcategories.map((category) => (
                <CategoryPreviewCard key={category.slug} category={category} />
              ))}
            </div>
          ) : null}

          <div className="category-results-head">
            <div>
              <div className="s-label">{page.type === 'group' ? 'All Products' : 'Category Results'}</div>
              <h2 className="section-title">
                {page.type === 'group' ? (
                  <>
                    SHOP <span className="text-accent-blue">{page.groupLabel.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    {page.name.toUpperCase()} <span className="text-accent-blue">PRODUCTS</span>
                  </>
                )}
              </h2>
            </div>
            <div className="category-results-meta">
              {page.type === 'subcategory' ? `Showing every product in ${page.name}.` : `Browse all ${page.groupLabel.toLowerCase()} products or narrow by sub-category above.`}
            </div>
          </div>

          {page.products.length > 0 ? (
            <div className="product-grid category-product-grid">
              {page.products.map((product) => (
                <CategoryProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="category-empty">
              <h2>No products found</h2>
              <p>This category does not have any catalog items yet.</p>
              <Link href={page.groupHref} className="btn-outline">
                Back to {page.groupLabel}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer meta={meta} navigation={navigation} />
    </>
  )
}
