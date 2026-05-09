import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts } from '@/lib/data'

export function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const products = getAllProducts()
  const queryLower = q.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length >= 2)

  const scored = products.map(p => {
    const name = p.name.toLowerCase()
    const sku = (p.sku || '').toLowerCase()
    const cat = p.categories.map(c => c.name).join(' ').toLowerCase()

    let score = 0

    // Exact SKU match (highest priority)
    if (sku && sku === queryLower) score += 100
    // SKU contains query
    else if (sku && sku.includes(queryLower)) score += 50
    // Query contains SKU
    else if (sku && queryLower.includes(sku)) score += 40

    // Exact name match
    if (name === queryLower) score += 80
    // Name starts with query
    else if (name.startsWith(queryLower)) score += 30
    // Name contains full query
    else if (name.includes(queryLower)) score += 20

    // Category match
    if (cat.includes(queryLower)) score += 15

    // Word-by-word matching (for multi-word queries)
    if (queryWords.length > 1) {
      const matchedWords = queryWords.filter(w => name.includes(w) || sku.includes(w) || cat.includes(w))
      if (matchedWords.length === queryWords.length) score += 25 // all words match
      else score += matchedWords.length * 5
    }

    // Wattage/number matching (e.g. "150w" or "300")
    const numMatch = queryLower.match(/(\d+)\s*w?/)
    if (numMatch) {
      const num = numMatch[1]
      if (name.includes(num + 'w') || name.includes(num + ' w')) score += 10
      if (sku.includes(num)) score += 8
    }

    return { product: p, score }
  })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  const results = scored.map(x => ({
    name: x.product.name,
    slug: x.product.slug,
    category: x.product.categories[0]?.name || '',
    sku: x.product.sku || '',
  }))

  return NextResponse.json({ results })
}
