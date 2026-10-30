import Image from 'next/image'
import Link from 'next/link'

import Icon from '@/components/ui/Icon'
import { getProductImageSrc } from '@/lib/catalog'
import type { HomepageCategoryTile, PrimaryCategory } from '@/types/product'

interface CategoryGridProps {
  primaryCategories: PrimaryCategory[]
  tiles: HomepageCategoryTile[]
  groupImages?: Partial<Record<string, string | null>>
  showFamilies?: boolean
}

export default function CategoryGrid({
  primaryCategories,
  tiles,
  groupImages = {},
  showFamilies = false,
}: CategoryGridProps) {
  return (
    <section id="categories" className="section section--soft">
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">Catalog Overview</span>
            <h2>Primary Lighting Groups</h2>
            <p>150+ spec-grade fixtures across indoor, outdoor and pole hardware. Stocked in Texas for commercial projects.</p>
          </div>
          <Link href="/products" className="text-link">
            View all products <Icon name="arrow" size={16} />
          </Link>
        </div>

        <div className="group-tabs">
          {primaryCategories.map((group) => {
            const src = groupImages[group.key] ?? getProductImageSrc(group.heroProduct)
            return (
              <Link key={group.key} href={group.href} className="group-card">
                <div>
                  <h3>{group.label}</h3>
                  <p>{group.description}</p>
                  <span className="group-count">
                    {group.productCount} products · {group.categoryCount} families <Icon name="arrow" size={14} />
                  </span>
                </div>
                <div className="group-media">{src ? <Image src={src} alt="" fill sizes="120px" /> : null}</div>
              </Link>
            )
          })}
        </div>

        {showFamilies ? (
          <div className="cat-grid">
            {tiles.map((tile) => {
              const src = getProductImageSrc(tile.product)
              return (
                <Link key={tile.slug} href={tile.href} className="cat-tile">
                  <div className="cat-thumb">{src ? <Image src={src} alt="" fill sizes="60px" /> : null}</div>
                  <div>
                    <strong>{tile.name}</strong>
                    <span>
                      {tile.count} {tile.count === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/products" className="btn btn--ghost">
              Browse all {tiles.length} product families <Icon name="arrow" size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
