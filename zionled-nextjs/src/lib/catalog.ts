import type { GroupKey, Product, ProductImage } from '@/types/product'

export interface CatalogGroupConfig {
  key: GroupKey
  label: string
  headline: string
  href: string
  description: string
  statsLabel: string
  heroCopy: string
  slugs: string[]
  featuredSlugs: string[]
}

export const CATALOG_GROUPS: CatalogGroupConfig[] = [
  {
    key: 'indoor',
    label: 'Indoor',
    headline: 'High-output interior lighting for warehouses, offices, retail and retrofit projects.',
    href: '/category/indoor',
    description: 'From highbay fixtures to downlights, tuned for efficiency, consistency and fast installation.',
    statsLabel: 'Warehouse, office and commercial interior solutions',
    heroCopy: 'High-performance LED solutions for residential, office and commercial interiors.',
    slugs: [
      'ufo-highbay-lights',
      'down-lights',
      'backlit-panel-lights',
      'troffer-lights',
      'linear-highbay-lights',
      'integrated-tube-lights',
      'exit-signs',
      'emergency-lights',
      'strip-lights',
      'a19-a21-led-bulbs',
      'par-led-bulbs',
      'br-led-bulbs',
      'mr-16-led-bulbs',
      'gu10-led-bulbs',
      'recessed-downlights',
      'ultra-thin-downlight-with-j-box',
    ],
    featuredSlugs: [
      'ufo-highbay-lights',
      'backlit-panel-lights',
      'linear-highbay-lights',
      'down-lights',
    ],
  },
  {
    key: 'outdoor',
    label: 'Outdoor',
    headline: 'Exterior-ready fixtures built for parking lots, facades, canopies and wet environments.',
    href: '/category/outdoor',
    description: 'Commercial-grade outdoor LED ranges engineered for visibility, safety and lower operating cost.',
    statsLabel: 'Parking lot, perimeter and exterior building illumination',
    heroCopy: 'Outdoor lighting engineered for durability, coverage and long-term savings.',
    slugs: [
      'shoebox-lights',
      'wallpack-lights',
      'led-wallpack-fixtures',
      'canopy-lights',
      'flood-lights',
      'vapor-tight-lights',
      'bollard-lights',
      'rope-lights',
      'module-lights',
      'power-supplies-drivers',
    ],
    featuredSlugs: [
      'shoebox-lights',
      'wallpack-lights',
      'canopy-lights',
      'flood-lights',
    ],
  },
  {
    key: 'lightpoles',
    label: 'Light Poles',
    headline: 'Steel poles, adapters and mounting hardware for complete site lighting packages.',
    href: '/category/lightpoles',
    description: 'Square poles, round poles and bullhorn hardware matched to commercial site conditions.',
    statsLabel: 'Pole systems, brackets and mounting accessories',
    heroCopy: 'Structural pole systems and adapters designed to complete the install, not complicate it.',
    slugs: [
      'square-light-poles',
      'round-light-poles',
      'brackets-bullhorns',
      'lightpoles',
    ],
    featuredSlugs: [
      'square-light-poles',
      'round-light-poles',
      'brackets-bullhorns',
    ],
  },
]

const GROUP_VISUALS: Record<GroupKey, { badge: string; glow: string; surface: string }> = {
  indoor: {
    badge: 'group-badge group-badge--indoor',
    glow: 'group-glow group-glow--indoor',
    surface: 'group-surface group-surface--indoor',
  },
  outdoor: {
    badge: 'group-badge group-badge--outdoor',
    glow: 'group-glow group-glow--outdoor',
    surface: 'group-surface group-surface--outdoor',
  },
  lightpoles: {
    badge: 'group-badge group-badge--lightpoles',
    glow: 'group-glow group-glow--lightpoles',
    surface: 'group-surface group-surface--lightpoles',
  },
}

const GROUP_LABELS: Record<GroupKey, string> = {
  indoor: 'Indoor',
  outdoor: 'Outdoor',
  lightpoles: 'Light Poles',
}

const OUTDOOR_KEYWORDS = [
  'wall pack',
  'shoebox',
  'flood',
  'canopy',
  'bollard',
  'vapor tight',
  'rope',
  'module',
  'outdoor',
]

export function getGroupConfig(group: GroupKey | null | undefined) {
  return CATALOG_GROUPS.find((entry) => entry.key === group) ?? CATALOG_GROUPS[0]
}

export function getGroupLabel(group: GroupKey | null | undefined) {
  return group ? GROUP_LABELS[group] : 'Featured'
}

export function getGroupVisuals(group: GroupKey | null | undefined) {
  return GROUP_VISUALS[group ?? 'indoor']
}

export function groupFromSlug(slug: string | undefined): GroupKey | null {
  if (!slug) return null

  for (const group of CATALOG_GROUPS) {
    if (group.slugs.includes(slug)) {
      return group.key
    }
  }

  return null
}

export function groupFromProduct(product: Product): GroupKey | null {
  for (const category of product.categories) {
    const matched = groupFromSlug(category.slug)
    if (matched) return matched
  }

  const fingerprint = `${product.slug} ${product.name}`.toLowerCase()

  if (fingerprint.includes('pole') || fingerprint.includes('bullhorn') || fingerprint.includes('tenon')) {
    return 'lightpoles'
  }

  if (OUTDOOR_KEYWORDS.some((keyword) => fingerprint.includes(keyword))) {
    return 'outdoor'
  }

  return 'indoor'
}

export function getProductImageSrc(input?: Product | ProductImage | null): string | null {
  if (!input) return null

  const image = 'images' in input ? input.images[0] : input
  if (!image) return null

  const candidate = image.webp ?? image.original ?? image.url
  if (!candidate) return null

  if (/^https?:\/\//.test(candidate)) {
    return candidate
  }

  const normalized = candidate
    .replace(/\\/g, '/')
    .replace(/^\.?\//, '')
    .replace(/^images_optimized\//, '')
    .replace(/^images\//, '')

  const encoded = normalized
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `/assets/${encoded}`
}

export function formatCategoryName(name: string) {
  if (!name) return ''

  const compact = name.replace(/\s+/g, ' ').trim()
  if (/[a-z]/.test(compact)) return compact

  return compact
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bLed\b/g, 'LED')
    .replace(/\bDlc\b/g, 'DLC')
    .replace(/\bUl\b/g, 'UL')
    .replace(/\bIp/g, 'IP')
}

export function summarizeText(text: string, limit = 140) {
  const compact = text.replace(/\s+/g, ' ').trim()
  if (compact.length <= limit) return compact
  return `${compact.slice(0, limit).trimEnd()}...`
}
