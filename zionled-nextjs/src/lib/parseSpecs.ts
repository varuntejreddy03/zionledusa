export interface FeatureItem {
  key: string
  value: string
}

const HEADINGS = new Set(['features', 'key features', 'specifications', 'applications', 'ideal applications', 'suitable applications'])

/**
 * Scraped "Key Features" come in two shapes:
 *   ["150W, 21,000 lumens", ...]                    plain bullets
 *   ["High Efficiency", ": 150 lm/W ...", ...]      label followed by ": value"
 * Anything after an "Applications" heading is an application tag.
 */
export function parseFeatures(list: string | string[] | undefined) {
  const items = (Array.isArray(list) ? list : list ? [list] : []).map((item) => item.trim()).filter(Boolean)
  const features: FeatureItem[] = []
  const applications: string[] = []
  let inApplications = false

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const heading = item.replace(/:$/, '').toLowerCase()

    if (HEADINGS.has(heading)) {
      inApplications = heading.includes('application')
      continue
    }

    if (inApplications) {
      applications.push(item)
      continue
    }

    const next = items[i + 1]
    if (next?.startsWith(':')) {
      features.push({ key: item, value: next.slice(1).trim().replace(/\.+$/, '.') })
      i++
    } else if (!item.startsWith(':')) {
      features.push({ key: '', value: item })
    }
  }

  return { features, applications }
}
