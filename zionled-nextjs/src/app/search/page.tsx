import type { Metadata } from 'next'
import Link from 'next/link'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import ProductCard from '@/components/ProductCard'
import SearchBar from '@/components/SearchBar'
import Icon from '@/components/ui/Icon'
import { searchProducts } from '@/lib/search'

type Props = { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  const query = (q || '').trim()

  return {
    title: query ? `Search: "${query}"` : 'Search Commercial LED Fixtures',
    description: query
      ? `View search results for "${query}" across 150+ commercial LED lighting fixtures stocked in Dallas.`
      : 'Search 150+ spec-grade commercial and industrial LED lighting fixtures by wattage, category, or SKU.',
    alternates: { canonical: '/search' },
  }
}

export default async function SearchResultsPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = (q || '').trim()
  const results = query ? searchProducts(query, 100) : []

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Search' },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' },
  ]

  return (
    <PageShell showContact>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Product Search"
        title={query ? `Results for "${query}"` : 'Search Products'}
        intro={
          query
            ? `Found ${results.length} ${results.length === 1 ? 'matching fixture' : 'matching fixtures'} for your search query.`
            : 'Type a fixture type, wattage, or SKU into the search box below.'
        }
      />

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="shell">
          <div style={{ maxWidth: 640, marginBottom: 36 }}>
            <SearchBar variant="inline" />
          </div>

          {query ? (
            results.length > 0 ? (
              <>
                <div className="results-head">
                  <h2>Matching Fixtures</h2>
                  <span>
                    Showing {results.length} {results.length === 1 ? 'product' : 'products'}
                  </span>
                </div>

                <div className="product-grid" style={{ marginTop: 24 }}>
                  {results.map(({ product }, index) => (
                    <ProductCard key={product.slug} product={product} priority={index < 4} />
                  ))}
                </div>
              </>
            ) : (
              <div className="empty">
                <h2>No products found for &ldquo;{query}&rdquo;</h2>
                <p>
                  We might have what you need in our unlisted warehouse stock or can source custom configurations.
                </p>
                <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/products" className="btn btn--primary">
                    Browse All Products
                  </Link>
                  <Link href="/quote" className="btn btn--ghost">
                    Request a Custom Quote <Icon name="arrow" size={16} />
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="empty">
              <h2>Ready to search</h2>
              <p>Try searching for terms like &ldquo;150W high bay&rdquo;, &ldquo;shoebox&rdquo;, or &ldquo;canopy&rdquo;.</p>
              <Link href="/products" className="btn btn--primary" style={{ marginTop: 20 }}>
                Explore Full Catalog
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  )
}
