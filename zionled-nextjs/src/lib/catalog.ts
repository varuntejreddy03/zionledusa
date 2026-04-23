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
      'ufo-high-bay-lights',
      'down-lights',
      'led-downlights',
      'backlit-panel-lights',
      'led-panel-light',
      'led-panel-light-with-emergency-backup',
      'troffer-lights',
      'led-troffer-light',
      'linear-highbay-lights',
      'linear-highbays',
      'integrated-tube-lights',
      'led-t8-tubes',
      'exit-signs',
      'emergency-lights',
      'emergency-combo-exit-signs',
      'emergency-exit-signs',
      'emergency-backup-drivers',
      'led-linear-strip-lights',
      'led-vapor-tight-lights',
      'vapor-tight-lights',
      'led-ceiling-light',
      'led-retrofit-corn-bulbs',
    ],
    featuredSlugs: [
      'ufo-highbay-lights',
      'led-panel-light',
      'linear-highbays',
      'led-downlights',
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
      'led-shoebox-lights',
      'wallpack-lights',
      'led-wallpack-fixtures',
      'led-wall-packs',
      'canopy-lights',
      'led-canopy-lights',
      'led-flood-lights',
      'bollard-lights',
      'led-bollard-lights',
      'solar-street-light',
      'led-stadium-lights',
      'led-dock-light',
      'led-gooseneck-light',
      'hazardous-lighting',
      'led-explosion-proof-emergency-sign',
      'led-explosion-proof-jelly-jar-light',
    ],
    featuredSlugs: [
      'led-shoebox-lights',
      'led-wall-packs',
      'led-canopy-lights',
      'led-flood-lights',
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
      'poles-brackets',
      'tenon-adapters',
    ],
    featuredSlugs: [
      'poles-brackets',
      'tenon-adapters',
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
  'solar street',
  'stadium',
  'sport light',
  'dock light',
  'gooseneck',
  'hazardous',
  'explosion proof',
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
