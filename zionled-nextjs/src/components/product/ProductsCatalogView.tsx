'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import ProductCard, { getSpecChips } from '@/components/ProductCard'
import Icon from '@/components/ui/Icon'
import { getProductImageSrc } from '@/lib/catalog'
import type { Category, Product } from '@/types/product'

interface ProductsCatalogViewProps {
  allProducts: Product[]
  categories: Category[]
}

const GROUPS = [
  { key: 'indoor', label: 'Indoor Lighting' },
  { key: 'outdoor', label: 'Outdoor Lighting' },
  { key: 'lightpoles', label: 'Light Poles & Hardware' },
] as const

const WATTAGE_RANGES = [
  { key: 'under-50', label: 'Under 50W', min: 0, max: 49 },
  { key: '50-100', label: '50W – 100W', min: 50, max: 100 },
  { key: '101-200', label: '101W – 200W', min: 101, max: 200 },
  { key: '201-300', label: '201W – 300W', min: 201, max: 300 },
  { key: 'over-300', label: '300W+', min: 301, max: 99999 },
] as const

const CCT_OPTIONS = [
  { key: '3000K', label: '3000K Warm' },
  { key: '4000K', label: '4000K Neutral' },
  { key: '5000K', label: '5000K Cool White' },
  { key: 'selectable', label: 'Color Selectable / 3CCT' },
] as const

function parseProductWattage(name: string): number {
  const wattExpr = name.match(/\b\d+(?:\s*[/&-]\s*\d+)*\s*W(?:atts?)?\b/i)?.[0]
  if (!wattExpr) return 0
  const numbers = wattExpr.match(/\d+/g)?.map(Number) || []
  return numbers.length ? Math.max(...numbers) : 0
}

function parseProductCct(name: string): string[] {
  const chips = getSpecChips(name)
  const chipsText = chips.join(' ')
  const result: string[] = []
  if (/3000K/i.test(name) || /3000K/i.test(chipsText)) result.push('3000K')
  if (/4000K/i.test(name) || /4000K/i.test(chipsText)) result.push('4000K')
  if (/5000K/i.test(name) || /5000K/i.test(chipsText)) result.push('5000K')
  if (/CCT/i.test(name) || /Selectable/i.test(name) || /–|-/.test(chips[1] || '')) {
    result.push('selectable')
  }
  return result
}

export default function ProductsCatalogView({ allProducts, categories }: ProductsCatalogViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchFilter, setSearchFilter] = useState('')

  const activeGroup = searchParams.get('group') || ''
  const activeCategory = searchParams.get('cat') || ''
  const activeWattage = searchParams.get('wattage') || ''
  const activeCct = searchParams.get('cct') || ''
  const activeSort = searchParams.get('sort') || 'name-asc'

  // Update query params helper
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!value || params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    if (key === 'group') {
      params.delete('cat')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const clearAllFilters = () => {
    setSearchFilter('')
    router.replace(pathname, { scroll: false })
  }

  // Active filter count
  const filterCount = [activeGroup, activeCategory, activeWattage, activeCct].filter(Boolean).length

  // Filter categories by selected group
  const availableCategories = useMemo(() => {
    if (!activeGroup) return categories
    return categories.filter((c) => c.group === activeGroup)
  }, [categories, activeGroup])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Text search filter
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase().trim()
          const matchName = product.name.toLowerCase().includes(q)
          const matchSku = (product.sku || '').toLowerCase().includes(q)
          const matchCat = product.categories.some((c) => c.name.toLowerCase().includes(q))
          if (!matchName && !matchSku && !matchCat) return false
        }

        // Group filter
        if (activeGroup && product.group !== activeGroup) {
          return false
        }

        // Category filter
        if (activeCategory && !product.categories.some((c) => c.slug === activeCategory)) {
          return false
        }

        // Wattage filter
        if (activeWattage) {
          const range = WATTAGE_RANGES.find((r) => r.key === activeWattage)
          if (range) {
            const watts = parseProductWattage(product.name)
            if (watts < range.min || watts > range.max) return false
          }
        }

        // CCT filter
        if (activeCct) {
          const ccts = parseProductCct(product.name)
          if (!ccts.includes(activeCct)) return false
        }

        return true
      })
      .sort((a, b) => {
        if (activeSort === 'name-asc') return a.name.localeCompare(b.name)
        if (activeSort === 'name-desc') return b.name.localeCompare(a.name)
        if (activeSort === 'wattage-asc') return parseProductWattage(a.name) - parseProductWattage(b.name)
        if (activeSort === 'wattage-desc') return parseProductWattage(b.name) - parseProductWattage(a.name)
        return 0
      })
  }, [allProducts, activeGroup, activeCategory, activeWattage, activeCct, activeSort, searchFilter])

  const renderFilterContent = () => (
    <div className="filter-panel-inner">
      <div className="filter-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="search" size={16} />
          <strong>Filter Catalog</strong>
        </div>
        {filterCount > 0 ? (
          <button type="button" onClick={clearAllFilters} className="text-link" style={{ fontSize: '0.82rem' }}>
            Clear all ({filterCount})
          </button>
        ) : null}
      </div>

      {/* Group */}
      <div className="filter-group">
        <span className="filter-label">Primary Group</span>
        <div className="filter-options">
          {GROUPS.map((group) => {
            const count = allProducts.filter((p) => p.group === group.key).length
            return (
              <button
                key={group.key}
                type="button"
                className={`filter-chip ${activeGroup === group.key ? 'is-active' : ''}`}
                onClick={() => updateFilter('group', group.key)}
              >
                {group.label} <small className="chip-count">({count})</small>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category */}
      <div className="filter-group">
        <span className="filter-label">Product Family ({availableCategories.length})</span>
        <div className="filter-select-wrap">
          <select
            className="filter-select"
            value={activeCategory}
            onChange={(e) => updateFilter('cat', e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All Categories ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Wattage Range */}
      <div className="filter-group">
        <span className="filter-label">Wattage Rating</span>
        <div className="filter-options">
          {WATTAGE_RANGES.map((range) => (
            <button
              key={range.key}
              type="button"
              className={`filter-chip ${activeWattage === range.key ? 'is-active' : ''}`}
              onClick={() => updateFilter('wattage', range.key)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* CCT */}
      <div className="filter-group">
        <span className="filter-label">Color Temperature (CCT)</span>
        <div className="filter-options">
          {CCT_OPTIONS.map((cct) => (
            <button
              key={cct.key}
              type="button"
              className={`filter-chip ${activeCct === cct.key ? 'is-active' : ''}`}
              onClick={() => updateFilter('cct', cct.key)}
            >
              {cct.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="catalog-wrapper">
      <div className="shell">
        {/* Top Controls bar */}
        <div className="catalog-controls">
          <div className="catalog-status">
            <button
              type="button"
              className="btn btn--ghost catalog-drawer-trigger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open product filters"
            >
              <Icon name="menu" size={16} /> Filters {filterCount > 0 ? `(${filterCount})` : ''}
            </button>
            <span className="catalog-count">
              Showing <b>{filteredProducts.length}</b> of {allProducts.length} commercial fixtures
            </span>
          </div>

          <div className="catalog-tools">
            {/* Quick in-catalog text filter */}
            <div className="catalog-search-inline">
              <input
                type="search"
                placeholder="Filter by keyword or SKU..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="catalog-search-input"
                aria-label="Filter products by text"
              />
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="view-mode-toggle" role="group" aria-label="View layout">
              <button
                type="button"
                className={`view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <span>Grid</span>
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Spec table view"
                aria-pressed={viewMode === 'table'}
              >
                <span>Spec Table</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="catalog-sort">
              <label htmlFor="catalog-sort-select">Sort:</label>
              <select
                id="catalog-sort-select"
                className="sort-select"
                value={activeSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="wattage-asc">Wattage: Low to High</option>
                <option value="wattage-desc">Wattage: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {(filterCount > 0 || searchFilter) ? (
          <div className="active-filters-bar">
            <span className="active-filters-label">Active filters:</span>
            {activeGroup ? (
              <span className="active-chip">
                Group: {GROUPS.find((g) => g.key === activeGroup)?.label}
                <button type="button" onClick={() => updateFilter('group', '')} aria-label="Remove group filter">
                  &times;
                </button>
              </span>
            ) : null}
            {activeCategory ? (
              <span className="active-chip">
                Family: {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
                <button type="button" onClick={() => updateFilter('cat', '')} aria-label="Remove category filter">
                  &times;
                </button>
              </span>
            ) : null}
            {activeWattage ? (
              <span className="active-chip">
                Wattage: {WATTAGE_RANGES.find((w) => w.key === activeWattage)?.label}
                <button type="button" onClick={() => updateFilter('wattage', '')} aria-label="Remove wattage filter">
                  &times;
                </button>
              </span>
            ) : null}
            {activeCct ? (
              <span className="active-chip">
                CCT: {CCT_OPTIONS.find((c) => c.key === activeCct)?.label}
                <button type="button" onClick={() => updateFilter('cct', '')} aria-label="Remove CCT filter">
                  &times;
                </button>
              </span>
            ) : null}
            {searchFilter ? (
              <span className="active-chip">
                Search: &ldquo;{searchFilter}&rdquo;
                <button type="button" onClick={() => setSearchFilter('')} aria-label="Clear search text">
                  &times;
                </button>
              </span>
            ) : null}
            <button type="button" onClick={clearAllFilters} className="clear-all-btn">
              Reset all
            </button>
          </div>
        ) : null}

        <div className="catalog-layout">
          {/* Desktop Sidebar */}
          <aside className="catalog-sidebar">{renderFilterContent()}</aside>

          {/* Results Grid / Table */}
          <div className="catalog-results">
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="product-grid">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.slug} product={product} priority={index < 4} />
                  ))}
                </div>
              ) : (
                /* Contractor Spec Table View */
                <div className="spec-table-wrap">
                  <table className="spec-table">
                    <thead>
                      <tr>
                        <th style={{ width: 68 }}>Photo</th>
                        <th>Fixture Model</th>
                        <th>SKU</th>
                        <th>Category</th>
                        <th>Wattage</th>
                        <th>CCT</th>
                        <th>Compliance</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const img = getProductImageSrc(product)
                        const chips = getSpecChips(product.name)
                        return (
                          <tr key={product.slug}>
                            <td>
                              <div className="table-thumb">
                                {img ? <Image src={img} alt="" fill sizes="48px" /> : null}
                              </div>
                            </td>
                            <td>
                              <Link href={`/products/${product.slug}`} className="table-product-title">
                                {product.name}
                              </Link>
                            </td>
                            <td>
                              <span className="table-sku">{product.sku || 'Spec'}</span>
                            </td>
                            <td>
                              <span className="table-cat">{product.categories[0]?.name || 'Commercial'}</span>
                            </td>
                            <td>
                              <span className="table-spec-val">{chips[0] || '—'}</span>
                            </td>
                            <td>
                              <span className="table-spec-val">{chips[1] || '—'}</span>
                            </td>
                            <td>
                              <span className="table-badge">DLC &amp; UL</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <Link href={`/products/${product.slug}`} className="btn btn--sm btn--ghost">
                                View Specs
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="empty">
                <h2>No products match your filters</h2>
                <p>Try clearing some filters or searching for different keywords.</p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="btn btn--primary"
                  style={{ marginTop: 20 }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen ? (
        <div className="drawer" onClick={() => setDrawerOpen(false)} role="dialog" aria-modal="true" aria-label="Filters">
          <div className="drawer-panel filter-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <strong>Filter Products</strong>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close filters"
                onClick={() => setDrawerOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            {renderFilterContent()}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <button
                type="button"
                className="btn btn--primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setDrawerOpen(false)}
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
