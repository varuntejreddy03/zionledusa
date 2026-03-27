export interface SpecItem {
  key: string
  value: string
}

const SECTION_LABELS = [
  'Key Features',
  'Specifications',
  'Features',
  'Product Attributes',
  'Ideal Applications',
  'Recommended Applications',
  'Applications',
  'Perfect For',
  'Measurements',
  'Durable Construction',
  'Features/Accessories',
]

function normalizeSpecSource(text: string) {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|ul|ol)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .replace(new RegExp(`\\b(?:${SECTION_LABELS.join('|')})\\b:?`, 'gi'), ' ')
    .trim()
}

function dedupeSpecs(items: SpecItem[]) {
  const seen = new Set<string>()

  return items.filter((item) => {
    const fingerprint = `${item.key.toLowerCase()}::${item.value.toLowerCase()}`
    if (seen.has(fingerprint)) {
      return false
    }

    seen.add(fingerprint)
    return true
  })
}

export function parseSpecsFromText(text: string): SpecItem[] {
  if (!text) return []

  const normalized = normalizeSpecSource(text)
  const pattern = /([A-Z][A-Za-z0-9\s\/&()+.-]+?):\s*([^:]+?)(?=\s+[A-Z][A-Za-z0-9\s\/&()+.-]+:|$)/g
  const specs: SpecItem[] = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(normalized)) !== null) {
    const key = match[1].trim()
    const value = match[2].trim()

    if (key.length > 1 && key.length < 50 && value.length > 0) {
      specs.push({ key, value })
    }
  }

  if (specs.length === 0) {
    const lines = normalized
      .split(/[|*\n]/)
      .flatMap((line) => line.split(/\s+[•-]\s+/))
      .map((line) => line.trim())
      .filter((line) => line.length > 3)

    return dedupeSpecs(
      lines.map((line) => {
        const colonIdx = line.indexOf(':')

        if (colonIdx > 0 && colonIdx < 40) {
          return {
            key: line.slice(0, colonIdx).trim(),
            value: line.slice(colonIdx + 1).trim(),
          }
        }

        return { key: '', value: line }
      }),
    )
  }

  return dedupeSpecs(specs)
}

export function getHighlights(specs: SpecItem[]): SpecItem[] {
  const priority = [
    'wattage',
    'watts',
    'lumens',
    'lumens per watt',
    'color temperature',
    'cct',
    'voltage',
    'ip rating',
    'dimming',
    'lifespan',
    'warranty',
    'certifications',
    'mounting',
    'cri',
    'replaces',
    'beam angle',
    'color',
    'housing',
    'material',
  ]

  const highlights: SpecItem[] = []
  const rest: SpecItem[] = []

  for (const spec of specs) {
    const keyLower = spec.key.toLowerCase()

    if (priority.some((entry) => keyLower.includes(entry))) {
      highlights.push(spec)
    } else {
      rest.push(spec)
    }
  }

  return [...highlights.slice(0, 10), ...rest.slice(0, 2)]
}
