import { APPLICATIONS, type ApplicationConfig } from '@/lib/applicationsData'
import { getProductImageSrc } from '@/lib/catalog'
import { getProductsByCategory } from '@/lib/data'
import type { Product } from '@/types/product'

export { APPLICATIONS, type ApplicationConfig }

export interface ApplicationItem extends ApplicationConfig {
  image: string | null
  href: string
}

export function getApplicationImage(app: ApplicationConfig): string | null {
  const products = getProductsByCategory(app.sampleCategory)
  const entry = products[app.productIndex ?? 0] ?? products[0]
  if (!entry) return null
  const img = entry.images[app.imageIndex ?? 0] ?? entry.images[0]
  return img ? getProductImageSrc(img) : null
}

export function getAllApplications(): ApplicationItem[] {
  return APPLICATIONS.map((app) => ({
    ...app,
    image: getApplicationImage(app),
    href: `/applications/${app.slug}`,
  }))
}

export function getApplicationBySlug(slug: string): (ApplicationItem & { products: Product[] }) | null {
  const app = APPLICATIONS.find((a) => a.slug === slug)
  if (!app) return null

  // Collect products from its categories without duplicates
  const seen = new Set<string>()
  const products: Product[] = []
  for (const catSlug of app.categorySlugs) {
    const list = getProductsByCategory(catSlug)
    for (const p of list) {
      if (!seen.has(p.slug)) {
        seen.add(p.slug)
        products.push(p)
      }
    }
  }

  return {
    ...app,
    image: getApplicationImage(app),
    href: `/applications/${app.slug}`,
    products,
  }
}
