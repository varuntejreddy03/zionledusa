import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import ProductCard from '@/components/ProductCard'
import Icon from '@/components/ui/Icon'
import { APPLICATIONS, getApplicationBySlug } from '@/lib/applications'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return APPLICATIONS.map((app) => ({ slug: app.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const app = getApplicationBySlug(slug)

  if (!app) {
    return {}
  }

  return {
    title: `${app.title} Lighting Fixtures`,
    description: `${app.intro} ${app.description}`,
    alternates: { canonical: `/applications/${app.slug}` },
    openGraph: {
      images: app.image ? [{ url: app.image }] : [],
    },
  }
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { slug } = await params
  const app = getApplicationBySlug(slug)

  if (!app) {
    notFound()
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Applications', href: '/applications' },
    { label: app.title },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'Applications', url: '/applications' },
    { name: app.title, url: `/applications/${app.slug}` },
  ]

  return (
    <PageShell showContact>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Commercial Application"
        title={app.title}
        intro={app.description}
        image={app.image}
        imagePriority
      />

      <section className="section" style={{ paddingTop: 36, paddingBottom: 20 }}>
        <div className="shell">
          <div className="app-why-box">
            <div className="section-head" style={{ marginBottom: 20 }}>
              <div>
                <span className="eyebrow">Engineering &amp; Compliance</span>
                <h2>Why these fixtures for {app.title.toLowerCase()}</h2>
                <p>Performance benchmarks and spec-grade requirements for this application.</p>
              </div>
            </div>

            <ul className="app-bullets">
              {app.benefits.map((benefit, i) => (
                <li key={i} className="app-bullet-item">
                  <span className="trust-icon" style={{ flexShrink: 0, marginTop: 2 }}>
                    <Icon name="check" size={16} />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/quote" className="btn btn--primary">
                Get a project quote <Icon name="arrow" size={16} />
              </Link>
              <Link href="/contact" className="btn btn--ghost">
                Speak with an engineer
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="shell">
          <div className="results-head">
            <div>
              <span className="eyebrow">Recommended Fixtures</span>
              <h2>Matching fixtures for {app.title.toLowerCase()}</h2>
            </div>
            <span>
              Showing {app.products.length} {app.products.length === 1 ? 'fixture' : 'fixtures'}
            </span>
          </div>

          {app.products.length > 0 ? (
            <div className="product-grid" style={{ marginTop: 24 }}>
              {app.products.map((product, index) => (
                <ProductCard key={product.slug} product={product} priority={index < 4} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>Custom lighting available</h2>
              <p>We stock full custom configurations for {app.title.toLowerCase()} in our Dallas warehouse.</p>
              <Link href="/quote" className="btn btn--primary" style={{ marginTop: 20 }}>
                Request layout &amp; pricing
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  )
}
