import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/search'

export function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const scored = searchProducts(q, 10)

  const results = scored.map((x) => ({
    name: x.product.name,
    slug: x.product.slug,
    category: x.product.categories[0]?.name || '',
    sku: x.product.sku || '',
  }))

  return NextResponse.json({ results })
}
