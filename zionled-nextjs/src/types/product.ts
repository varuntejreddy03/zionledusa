export type GroupKey = 'indoor' | 'outdoor' | 'lightpoles'

export interface ProductImage {
  url: string
  original?: string
  webp?: string
  alt?: string
  filename?: string
}

export interface ProductCategoryRef {
  id?: number
  name: string
  slug: string
}

export interface Category {
  id: number | null
  name: string
  slug: string
  parent: number
  count: number
  description: string
  image: ProductImage | null
  link: string
  group?: GroupKey | null
}

export interface Product {
  id?: number
  name: string
  slug: string
  sku?: string
  url: string
  status?: string
  description: string
  short_desc: string
  price?: string
  regular_price?: string
  sale_price?: string
  categories: ProductCategoryRef[]
  tags?: string[]
  images: ProductImage[]
  attributes: Record<string, string | string[]>
  meta_title?: string
  meta_desc?: string
  in_stock?: boolean
  stock_qty?: number
  weight?: string
  dimensions?: { length?: string; width?: string; height?: string }
  scraped_at?: string
  group?: GroupKey | null
}

export interface SiteMeta {
  phone: string
  phone_href: string
  email: string
  address: string
  business_hours: string
  tagline: string
  logo_url: string
  social: Record<string, string>
}

export interface SiteStats {
  total_products: number
  total_categories: number
  total_pages: number
  total_images: number
  average_energy_savings: number
  rated_lifespan_hours: number
  satisfaction_rate: number
}

export interface SitePage {
  id: number
  title: string
  slug: string
  content: string
  url?: string
  template?: string
  status?: string
}

export interface NavigationItem {
  label: string
  href: string
}

export interface NavigationGroup {
  key: GroupKey
  label: string
  href: string
  description: string
  items: NavigationItem[]
}

export interface PrimaryCategory {
  key: GroupKey
  label: string
  headline: string
  description: string
  href: string
  productCount: number
  categoryCount: number
  statsLabel: string
  topCategories: string[]
  heroProduct?: Product
}

export interface HomepageCategoryTile {
  slug: string
  name: string
  count: number
  group: GroupKey | null
  description: string
  href: string
  product?: Product
}

export interface TrustSignal {
  title: string
  detail: string
}

export interface WhyFeature {
  title: string
  text: string
}

export interface PerformanceMetric {
  label: string
  value: string
  progress: number
  detail: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
}

export interface SiteData {
  generated_at: string
  source: string
  site_meta: SiteMeta
  categories: Category[]
  products: Product[]
  pages: SitePage[]
  stats: SiteStats
}
