import CategoryGrid from '@/components/sections/CategoryGrid'
import HeroSection from '@/components/sections/HeroSection'
import ProductsSection from '@/components/sections/ProductsSection'
import Ticker from '@/components/sections/Ticker'
import TrustRow from '@/components/sections/TrustRow'

import type { HomepageCategoryTile, PrimaryCategory, Product, SiteMeta, SiteStats } from '@/types/product'

interface HomeInteractiveProps {
  meta: SiteMeta
  stats: SiteStats
  primaryCategories: PrimaryCategory[]
  categoryTiles: HomepageCategoryTile[]
  featuredProducts: Product[]
}

export default function HomeInteractive({
  meta,
  stats,
  primaryCategories,
  categoryTiles,
  featuredProducts,
}: HomeInteractiveProps) {
  return (
    <>
      <HeroSection meta={meta} stats={stats} />
      <TrustRow phone={meta.phone} />
      <Ticker />
      <CategoryGrid primaryCategories={primaryCategories} tiles={categoryTiles} />
      <ProductsSection products={featuredProducts} primaryCategories={primaryCategories} />
    </>
  )
}
