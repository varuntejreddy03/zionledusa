import type { Metadata } from 'next'
import { Suspense } from 'react'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import ProductsCatalogView from '@/components/product/ProductsCatalogView'
import { getAllCategories, getAllProducts } from '@/lib/data'

export const metadata: Metadata = {
  title: 'All Commercial LED Fixtures & Hardware',
  description:
    'Browse all 150+ spec-grade commercial and industrial LED lighting fixtures. Filter by group, category, wattage, and CCT with fast nationwide shipping from Dallas.',
  alternates: { canonical: '/products' },
}

export default function AllProductsPage() {
  const allProducts = getAllProducts()
  const categories = getAllCategories()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'All Products' },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'All Products', url: '/products' },
  ]

  return (
    <PageShell showContact>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Spec-Grade LED Catalog"
        title="All Products"
        intro="Browse 150+ commercial fixtures engineered for warehouses, parking lots, retail, and facilities. Filter by group, category, wattage range, or color temperature."
      />

      <section className="section" style={{ paddingTop: 28 }}>
        <Suspense fallback={<div className="shell"><p>Loading catalog...</p></div>}>
          <ProductsCatalogView allProducts={allProducts} categories={categories} />
        </Suspense>
      </section>
    </PageShell>
  )
}
