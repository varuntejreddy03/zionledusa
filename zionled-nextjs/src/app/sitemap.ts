import type { MetadataRoute } from 'next'

import { APPLICATIONS } from '@/lib/applicationsData'
import { getAllProducts, getCategoryRouteSlugs } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://zionledusa.com'
  const now = new Date()

  // 1. Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/applications`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // 2. Application pages
  const applicationRoutes: MetadataRoute.Sitemap = APPLICATIONS.map((app) => ({
    url: `${baseUrl}/applications/${app.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. Category pages
  const categoryRoutes: MetadataRoute.Sitemap = getCategoryRouteSlugs().map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 4. Product pages
  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...applicationRoutes, ...categoryRoutes, ...productRoutes]
}
