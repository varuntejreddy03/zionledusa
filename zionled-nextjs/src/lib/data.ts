import 'server-only'

import { cache } from 'react'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

import {
  CATALOG_GROUPS,
  formatCategoryName,
  getGroupConfig,
  getProductImageSrc,
  groupFromProduct,
  groupFromSlug,
  summarizeText,
} from '@/lib/catalog'
import type {
  Category,
  GroupKey,
  HomepageCategoryTile,
  NavigationGroup,
  PerformanceMetric,
  PrimaryCategory,
  Product,
  ProductCategoryRef,
  ProductImage,
  SiteData,
  SiteMeta,
  SitePage,
  SiteStats,
  Testimonial,
  TrustSignal,
  WhyFeature,
} from '@/types/product'

const ROOT_CATEGORY_SLUGS = new Set(['catalogue', 'indoor', 'outdoor', 'lightpoles', 'uncategorized'])
const DEFAULT_PHONE = '(817) 938-2959'
const DEFAULT_PHONE_HREF = '+18179382959'
const DEFAULT_EMAIL = 'contact@zionledusa.com'
const DEFAULT_ADDRESS = '2970 Blystone Lane Suite 104, Dallas, Texas 75220'
const DEFAULT_BUSINESS_HOURS = 'Mon-Fri: 9AM-6PM CST'
const DEFAULT_TAGLINE =
  'Your one-stop destination for brilliant lighting, serving residential, office and commercial clients nationwide.'
const CATEGORY_ROUTE_ROOT = '/category'
const PHONE_PATTERN = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface CategoryPageData {
  type: 'group' | 'subcategory'
  slug: string
  name: string
  title: string
  description: string
  href: string
  group: GroupKey
  groupLabel: string
  groupHref: string
  category?: Category
  subcategories: Category[]
  products: Product[]
  image: ProductImage | null
}

const TRUST_SIGNALS: TrustSignal[] = [
  { title: 'DLC & UL Certified', detail: 'Commercial-grade compliance across core product lines' },
  { title: 'Industry Warranties', detail: 'Backed by durable housings, drivers and support' },
  { title: 'Utility Rebate Eligible', detail: 'Configured to support lower total project cost' },
  { title: 'Fast Nationwide Shipping', detail: 'Dallas-based fulfillment with responsive coordination' },
  { title: 'Free Consultation', detail: 'Fixture selection and layout guidance before you buy' },
]

const WHY_FEATURES: WhyFeature[] = [
  {
    title: 'High Performance',
    text: 'Premium LEDs, efficient drivers and commercial housings designed for dependable output over long operating hours.',
  },
  {
    title: 'Value Pricing',
    text: 'A direct, no-nonsense offer structure that keeps project budgets tight without stepping down in quality.',
  },
  {
    title: 'Warranty Backed',
    text: 'The catalogue is positioned around durable fixtures and support that stays available after the order ships.',
  },
  {
    title: 'Free Consultation',
    text: 'Lighting guidance, category selection and quote support tailored to the site rather than generic bundles.',
  },
]

const PERFORMANCE_METRICS: PerformanceMetric[] = [
  { label: 'Energy Use', value: '25%', progress: 25, detail: 'LED systems draw a fraction of traditional fixture load.' },
  { label: 'Heat Output', value: '15%', progress: 15, detail: 'Lower wasted energy means cooler operation and less strain.' },
  { label: 'Lifespan', value: '50K+', progress: 95, detail: 'Longer rated life reduces replacement cycles and downtime.' },
  { label: 'Light Quality', value: '98%', progress: 98, detail: 'Consistent output, tighter control and cleaner visibility.' },
  { label: 'Annual Savings', value: '80%', progress: 80, detail: 'Typical LED retrofits unlock major long-term operating savings.' },
]

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Switched our entire warehouse over to Zion LED highbay fixtures. The energy reduction was immediate and the light quality was noticeably cleaner.',
    name: 'Robert K.',
    role: 'Warehouse Operations Manager',
    initials: 'RK',
  },
  {
    quote:
      'The exterior package came in on time, on budget and with better support than most distributors we have worked with.',
    name: 'Sandra L.',
    role: 'Commercial Property Manager',
    initials: 'SL',
  },
  {
    quote:
      'Product guidance was direct, pricing was competitive and the team clearly understood commercial applications instead of guessing through them.',
    name: 'Marcus T.',
    role: 'Facilities Director',
    initials: 'MT',
  },
]

function resolveDataPath() {
  const candidates = [
    path.join(process.cwd(), 'data', 'export.json'),
    path.join(process.cwd(), '..', 'data', 'export.json'),
    path.join(process.cwd(), '..', '..', 'data', 'export.json'),
  ]

  const resolved = candidates.find((candidate) => existsSync(candidate))

  if (!resolved) {
    throw new Error(`Unable to locate export.json. Checked: ${candidates.join(', ')}`)
  }

  return resolved
}

const loadSiteData = cache((): SiteData => {
  const dataPath = resolveDataPath()
  const raw = JSON.parse(readFileSync(dataPath, 'utf8')) as SiteData

  const pages = (raw.pages ?? []).map(normalizePage)
  const siteMeta = normalizeSiteMeta(raw.site_meta, pages)

  const products = (raw.products ?? [])
    .map(normalizeProduct)
    .filter((product): product is Product => Boolean(product))
    .filter((product) => !isCollectionPlaceholder(product))

  const categories = deriveCategories(products)
  const stats = buildSiteStats(raw.stats, products, categories, pages)

  return {
    generated_at: raw.generated_at,
    source: raw.source,
    site_meta: siteMeta,
    categories,
    products,
    pages,
    stats,
  }
})

function normalizePage(page: SitePage): SitePage {
  return {
    ...page,
    title: repairText(page.title),
    slug: repairText(page.slug),
    content: repairText(page.content),
    url: repairText(page.url ?? ''),
    template: repairText(page.template ?? ''),
    status: repairText(page.status ?? ''),
  }
}

function normalizeSiteMeta(meta: Partial<SiteMeta>, pages: SitePage[]): SiteMeta {
  const contactPage = pages.find((page) => page.slug === 'contact')
  const aboutPage = pages.find((page) => page.slug === 'about-us')
  const homePage = pages.find((page) => page.slug === 'home')
  const contactText = repairText(contactPage?.content ?? '')
  const aboutText = repairText(aboutPage?.content ?? '')
  const homeText = repairText(homePage?.content ?? '')
  const safePhone = pickStructuredField(meta.phone)
  const safeEmail = pickStructuredField(meta.email)
  const safeAddress = pickStructuredField(meta.address)
  const safeLogo = normalizeExternalUrl(pickStructuredField(meta.logo_url))
  const safeBusinessHours = pickStructuredField(meta.business_hours)
  const safeTagline = pickStructuredField(meta.tagline)

  const phoneRaw = extractFirstMatch([safePhone, contactText, aboutText, homeText].filter(Boolean).join(' '), PHONE_PATTERN)
  const phone = formatPhone(phoneRaw || DEFAULT_PHONE)
  const email = pickPreferredEmail([safeEmail, safeAddress, contactText, aboutText]) || DEFAULT_EMAIL
  const address = normalizeAddress(
    extractAddress(contactText) || extractAddress(safeAddress) || extractLabeledValue(safeAddress, 'Address') || DEFAULT_ADDRESS,
  )
  const tagline = safeTagline || extractSummary(aboutText) || extractSummary(homeText) || DEFAULT_TAGLINE

  return {
    phone,
    phone_href: buildPhoneHref(phoneRaw || phone) || DEFAULT_PHONE_HREF,
    email: repairText(email),
    address: address || DEFAULT_ADDRESS,
    business_hours: safeBusinessHours || DEFAULT_BUSINESS_HOURS,
    tagline,
    logo_url: safeLogo || '/assets/branding/ZION-LED-USA-HEADER-LOGO-TM-scaled.webp',
    social: {
      facebook: normalizeExternalUrl(repairText(meta.social?.facebook ?? 'https://www.facebook.com/zionledusa')),
      instagram: normalizeExternalUrl(repairText(meta.social?.instagram ?? 'https://www.instagram.com/zionledusa')),
      linkedin: normalizeExternalUrl(repairText(meta.social?.linkedin ?? 'https://www.linkedin.com/in/zionledusa')),
    },
  }
}

function normalizeProduct(product: Product): Product | null {
  const categories = (product.categories ?? [])
    .map(normalizeCategoryRef)
    .filter((category): category is ProductCategoryRef => Boolean(category))

  const images = (product.images ?? [])
    .map(normalizeImage)
    .filter((image): image is ProductImage => Boolean(image))

  const normalized: Product = {
    ...product,
    name: repairText(product.name),
    slug: repairText(product.slug),
    url: repairText(product.url),
    sku: repairText(product.sku ?? ''),
    description: repairText(product.description),
    short_desc: repairText(product.short_desc || product.description),
    price: repairText(product.price ?? ''),
    regular_price: repairText(product.regular_price ?? ''),
    sale_price: repairText(product.sale_price ?? ''),
    categories,
    images,
    attributes: normalizeAttributes(product.attributes ?? {}),
    meta_title: repairText(product.meta_title ?? ''),
    meta_desc: repairText(product.meta_desc ?? ''),
    scraped_at: repairText(product.scraped_at ?? ''),
    group: null,
  }

  normalized.group = groupFromProduct(normalized)
  return normalized.slug ? normalized : null
}

function normalizeCategoryRef(category?: ProductCategoryRef | null): ProductCategoryRef | null {
  if (!category?.slug && !category?.name) return null

  return {
    id: category.id,
    slug: repairText(category.slug),
    name: formatCategoryName(repairText(category.name)),
  }
}

function normalizeImage(image?: ProductImage | null): ProductImage | null {
  if (!image) return null

  const normalized: ProductImage = {
    url: repairText(image.url),
    original: repairText(image.original ?? ''),
    webp: repairText(image.webp ?? ''),
    alt: repairText(image.alt ?? ''),
    filename: repairText(image.filename ?? ''),
  }

  return normalized.url || normalized.webp || normalized.original ? normalized : null
}

function normalizeAttributes(attributes: Record<string, string | string[]>) {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [
      repairText(key),
      Array.isArray(value) ? value.map((entry) => repairText(entry)).filter(Boolean) : repairText(value),
    ]),
  )
}

export function getCategoryHref(slug: string) {
  return `${CATEGORY_ROUTE_ROOT}/${slug}`
}

function deriveCategories(products: Product[]): Category[] {
  const bySlug = new Map<string, Category>()

  for (const product of products) {
    for (const category of product.categories) {
      if (!category.slug || ROOT_CATEGORY_SLUGS.has(category.slug)) continue

      const current = bySlug.get(category.slug)
      if (current) {
        current.count += 1
        continue
      }

      bySlug.set(category.slug, {
        id: null,
        name: category.name,
        slug: category.slug,
        parent: 0,
        count: 1,
        description: buildCategoryDescription(category.name, product),
        image: product.images[0] ?? null,
        link: getCategoryHref(category.slug),
        group: groupFromSlug(category.slug),
      })
    }
  }

  return Array.from(bySlug.values()).sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
}

function buildSiteStats(
  rawStats: Partial<SiteStats> | undefined,
  products: Product[],
  categories: Category[],
  pages: SitePage[],
): SiteStats {
  const totalImages = products.reduce((count, product) => count + product.images.length, 0)

  return {
    total_products: products.length || rawStats?.total_products || 0,
    total_categories: categories.length || rawStats?.total_categories || 0,
    total_pages: pages.length || rawStats?.total_pages || 0,
    total_images: totalImages || rawStats?.total_images || 0,
    average_energy_savings: 0,
    rated_lifespan_hours: 0,
    satisfaction_rate: 0,
  }
}

function isCollectionPlaceholder(product: Product) {
  if (product.slug === 'catalogue' || product.slug.endsWith('-catalogue')) {
    return true
  }

  if (product.categories.length === 0) {
    return false
  }

  return product.categories.every((category) => ROOT_CATEGORY_SLUGS.has(category.slug))
}

function repairText(value: unknown) {
  if (typeof value !== 'string') return ''

  const compact = value.replace(/\u00a0/g, ' ').trim()
  if (!compact) return ''

  const repaired = attemptEncodingRepair(compact)
  return repaired.replace(/\s+/g, ' ').trim()
}

function pickStructuredField(value: string | undefined) {
  const cleaned = repairText(value)

  if (!cleaned) return ''
  if (cleaned.length > 260) return ''
  if (/(?:#start-resizable-editor-section|sourceURL|--stk-|@media|\{|\})/i.test(cleaned)) {
    return ''
  }

  return cleaned
}

function attemptEncodingRepair(value: string) {
  if (!/[ÃÂâð]/.test(value)) {
    return value
  }

  try {
    const repaired = Buffer.from(value, 'latin1').toString('utf8')
    const originalArtifacts = (value.match(/[ÃÂâð]/g) ?? []).length
    const repairedArtifacts = (repaired.match(/[ÃÂâð]/g) ?? []).length

    if (repairedArtifacts < originalArtifacts) {
      return repaired
    }
  } catch {
    return value
  }

  return value
}

function extractFirstMatch(text: string | undefined, pattern: RegExp) {
  if (!text) return ''
  const match = text.match(pattern)
  return match?.[0] ?? ''
}

function extractAllMatches(text: string | undefined, pattern: RegExp) {
  if (!text) return []
  return [...text.matchAll(pattern)].map((match) => repairText(match[0])).filter(Boolean)
}

function extractLabeledValue(text: string | undefined, label: string) {
  if (!text) return ''

  const pattern = new RegExp(`${label}:\\s*([^\\n]+)`, 'i')
  const match = text.match(pattern)
  return match?.[1] ?? ''
}

function pickPreferredEmail(sources: string[]) {
  const matches = sources.flatMap((source) => extractAllMatches(source, EMAIL_PATTERN))
  const preferred = matches.find((entry) => /^contact@zionledusa\.com$/i.test(entry))
  return preferred || matches[0] || ''
}

function extractAddress(text: string | undefined) {
  if (!text) return ''

  return (
    extractFirstMatch(text, /\d{3,6}\s+[^+]+?Dallas,\s*Texas(?:\s*[–-]\s*|\s+)\d{5}/i) ||
    extractFirstMatch(text, /\d{3,6}\s+[^+]+?Dallas,\s*Texas/i)
  )
}

function normalizeAddress(address: string) {
  return repairText(address)
    .replace(/\s*[–-]\s*(\d{5})$/, ', $1')
    .replace(/\s*,\s*/g, ', ')
}

function normalizeExternalUrl(url: string) {
  if (!url) return ''
  return url.replace(/^http:\/\//i, 'https://')
}

function extractSummary(text: string) {
  if (!text) return ''

  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return summarizeText(sentences.slice(0, 2).join(' '), 180)
}

function buildCategoryDescription(categoryName: string, product?: Product) {
  const summary = summarizeText(product?.short_desc || product?.description || '', 160)
  return summary || `${categoryName} commercial LED lighting products.`
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  const normalized = digits.slice(-10)
  if (normalized.length !== 10) return DEFAULT_PHONE
  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`
}

function buildPhoneHref(raw: string) {
  const digits = raw.replace(/\D/g, '')
  const normalized = digits.length > 10 ? digits.slice(-10) : digits
  if (normalized.length !== 10) return ''
  return `+1${normalized}`
}

function compareByFeaturedCategory(left: Product, right: Product, group: GroupKey) {
  const config = CATALOG_GROUPS.find((entry) => entry.key === group)
  if (!config) return 0

  const leftRank = Math.min(
    ...left.categories
      .map((category) => config.featuredSlugs.indexOf(category.slug))
      .filter((index) => index >= 0)
      .concat(Number.MAX_SAFE_INTEGER),
  )
  const rightRank = Math.min(
    ...right.categories
      .map((category) => config.featuredSlugs.indexOf(category.slug))
      .filter((index) => index >= 0)
      .concat(Number.MAX_SAFE_INTEGER),
  )

  return leftRank - rightRank
}

function compareCategoryByGroup(left: Category, right: Category, group: GroupKey) {
  const config = CATALOG_GROUPS.find((entry) => entry.key === group)
  if (!config) {
    return right.count - left.count || left.name.localeCompare(right.name)
  }

  const leftRank = config.featuredSlugs.indexOf(left.slug)
  const rightRank = config.featuredSlugs.indexOf(right.slug)
  const normalizedLeftRank = leftRank >= 0 ? leftRank : Number.MAX_SAFE_INTEGER
  const normalizedRightRank = rightRank >= 0 ? rightRank : Number.MAX_SAFE_INTEGER

  return normalizedLeftRank - normalizedRightRank || right.count - left.count || left.name.localeCompare(right.name)
}

export function getAllProducts(): Product[] {
  return loadSiteData().products
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find((product) => product.slug === slug)
}

export function getAllCategories(): Category[] {
  return loadSiteData().categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getAllCategories().find((category) => category.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return getAllProducts().filter((product) => product.categories.some((category) => category.slug === categorySlug))
}

export function getProductsByGroup(group: GroupKey): Product[] {
  return getAllProducts()
    .filter((product) => product.group === group)
    .sort((left, right) => compareByFeaturedCategory(left, right, group) || left.name.localeCompare(right.name))
}

export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []

  return getAllProducts().filter((product) => {
    const fingerprint = [product.name, product.description, product.short_desc, ...product.categories.map((category) => category.name)]
      .join(' ')
      .toLowerCase()

    return fingerprint.includes(normalizedQuery)
  })
}

export function getSiteMeta() {
  return loadSiteData().site_meta
}

export function getSiteStats() {
  return loadSiteData().stats
}

export function getTickerItems(limit = 12) {
  return getAllCategories()
    .slice(0, limit)
    .map((category) => category.name)
}

export function getNavigationGroups(): NavigationGroup[] {
  return CATALOG_GROUPS.map((group) => {
    const items = getAllCategories()
      .filter((category) => category.group === group.key)
      .sort((left, right) => compareCategoryByGroup(left, right, group.key))
      .map((category) => {
        return {
          label: category.name,
          href: getCategoryHref(category.slug),
        }
      })

    return {
      key: group.key,
      label: group.label,
      href: getCategoryHref(group.key),
      description: group.description,
      items,
    }
  })
}

export function getPrimaryCategories(): PrimaryCategory[] {
  return CATALOG_GROUPS.map((group) => {
    const products = getProductsByGroup(group.key)
    const categories = getAllCategories()
      .filter((category) => category.group === group.key)
      .sort((left, right) => compareCategoryByGroup(left, right, group.key))

    return {
      key: group.key,
      label: group.label,
      headline: group.headline,
      description: group.description,
      href: getCategoryHref(group.key),
      productCount: products.length,
      categoryCount: categories.length,
      statsLabel: group.statsLabel,
      topCategories: categories.slice(0, 3).map((category) => category.name),
      heroProduct: products.find((product) => getProductImageSrc(product)) ?? products[0],
    }
  })
}

export function getHomepageCategoryTiles(limit = 6): HomepageCategoryTile[] {
  return getAllCategories()
    .slice(0, limit)
    .map((category) => {
      const product = getProductsByCategory(category.slug).find((entry) => getProductImageSrc(entry)) ?? getProductsByCategory(category.slug)[0]

      return {
        slug: category.slug,
        name: category.name,
        count: category.count,
        group: category.group ?? null,
        description: buildCategoryDescription(category.name, product),
        href: getCategoryHref(category.slug),
        product,
      }
    })
}

export function getCategoryRouteSlugs() {
  return Array.from(new Set([...CATALOG_GROUPS.map((group) => group.key), ...getAllCategories().map((category) => category.slug)]))
}

export function getCategoryPageData(slug: string): CategoryPageData | undefined {
  const groupConfig = CATALOG_GROUPS.find((group) => group.key === slug)

  if (groupConfig) {
    const subcategories = getAllCategories()
      .filter((category) => category.group === groupConfig.key)
      .sort((left, right) => compareCategoryByGroup(left, right, groupConfig.key))
    const products = getProductsByGroup(groupConfig.key)

    return {
      type: 'group',
      slug: groupConfig.key,
      name: groupConfig.label,
      title: groupConfig.label.toUpperCase(),
      description: extractSummary(products[0]?.short_desc || products[0]?.description || '') || groupConfig.description,
      href: getCategoryHref(groupConfig.key),
      group: groupConfig.key,
      groupLabel: groupConfig.label,
      groupHref: getCategoryHref(groupConfig.key),
      subcategories,
      products,
      image: subcategories.find((category) => category.image)?.image ?? products.find((product) => product.images[0])?.images[0] ?? null,
    }
  }

  const category = getCategoryBySlug(slug)
  if (!category || !category.group) {
    return undefined
  }

  const resolvedGroup = getGroupConfig(category.group)
  const products = getProductsByCategory(category.slug).sort((left, right) => left.name.localeCompare(right.name))

  return {
    type: 'subcategory',
    slug: category.slug,
    name: category.name,
    title: category.name.toUpperCase(),
    description: category.description || buildCategoryDescription(category.name, products[0]),
    href: getCategoryHref(category.slug),
    group: category.group,
    groupLabel: resolvedGroup.label,
    groupHref: getCategoryHref(resolvedGroup.key),
    category,
    subcategories: getAllCategories()
      .filter((entry) => entry.group === category.group)
      .sort((left, right) => compareCategoryByGroup(left, right, resolvedGroup.key)),
    products,
    image: category.image ?? products.find((product) => product.images[0])?.images[0] ?? null,
  }
}

export function getProductBreadcrumbItems(product: Product): BreadcrumbItem[] {
  const primaryCategory = product.categories.find((category) => category.slug && !ROOT_CATEGORY_SLUGS.has(category.slug))
  const groupKey = primaryCategory ? groupFromSlug(primaryCategory.slug) ?? product.group ?? null : product.group ?? null

  const items: BreadcrumbItem[] = [{ label: 'HOME', href: '/' }]

  if (groupKey) {
    const group = getGroupConfig(groupKey)
    items.push({
      label: group.label.toUpperCase(),
      href: getCategoryHref(group.key),
    })
  }

  if (primaryCategory) {
    items.push({
      label: primaryCategory.name.toUpperCase(),
      href: getCategoryHref(primaryCategory.slug),
    })
  }

  items.push({ label: product.name.toUpperCase() })

  return items
}

export function getFeaturedProducts(limitPerGroup = 4): Product[] {
  const featured: Product[] = []

  for (const group of CATALOG_GROUPS) {
    const products = getProductsByGroup(group.key).filter(
      (product) => product.categories.length > 0 && (product.short_desc || product.description),
    )

    featured.push(...products.slice(0, limitPerGroup))
  }

  return featured
}

export function getTrustSignals() {
  return TRUST_SIGNALS
}

export function getWhyFeatures() {
  return WHY_FEATURES
}

export function getPerformanceMetrics() {
  return PERFORMANCE_METRICS
}

export function getTestimonials() {
  return TESTIMONIALS
}
