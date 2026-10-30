import PageShell from '@/components/PageShell'
import ApplicationsSection from '@/components/sections/ApplicationsSection'
import CategoryGrid from '@/components/sections/CategoryGrid'
import HeroSection, { type ImageTile } from '@/components/sections/HeroSection'
import ProductSlider from '@/components/sections/ProductSlider'
import TestimonialSection from '@/components/sections/TestimonialSection'
import TrustStrip from '@/components/sections/TrustStrip'
import WhySection from '@/components/sections/WhySection'
import { getAllApplications } from '@/lib/applications'
import { getProductImageSrc } from '@/lib/catalog'
import {
  getHomepageCategoryTiles,
  getPrimaryCategories,
  getProductsByCategory,
  getSiteMeta,
  getSiteStats,
  getTestimonials,
} from '@/lib/data'
import type { Product } from '@/types/product'

function tile(title: string, text: string, category: string, product = 0, image = 0): ImageTile {
  const entry = getProductsByCategory(category)[product] ?? getProductsByCategory(category)[0]
  return {
    title,
    text,
    href: `/category/${category}`,
    image: entry ? getProductImageSrc(entry.images[image] ?? entry.images[0]) : null,
  }
}

export default function HomePage() {
  const meta = getSiteMeta()
  const stats = getSiteStats()
  const primaryCategories = getPrimaryCategories()
  const categoryTiles = getHomepageCategoryTiles(60)
  // one product per category so the slider shows the full range
  const featuredProducts = categoryTiles.map((entry) => entry.product).filter((product): product is Product => Boolean(product))

  const heroTiles = [
    tile('UFO High Bays', 'Warehouses, gyms & plants', 'ufo-high-bay-lights', 0, 1),
    tile('Area & Shoebox', 'Parking lots & streets', 'led-shoebox-lights', 6),
    tile('Canopy Lights', 'Gas stations & garages', 'led-canopy-lights', 1),
  ]

  // 8 Applications linking directly to /applications/[slug]
  const applicationTiles: ImageTile[] = getAllApplications().map((app) => ({
    title: app.title,
    text: app.intro,
    href: app.href,
    image: app.image,
  }))

  const statList = [
    { value: `${stats.total_products}+`, label: 'Commercial fixtures' },
    { value: `${stats.total_categories}`, label: 'Product families' },
    { value: '5 yr', label: 'Warranty' },
    { value: '24 h', label: 'Quote turnaround' },
  ]

  const orgLocalBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://zionledusa.com/#organization',
        name: 'ZION LED USA',
        url: 'https://zionledusa.com',
        logo: meta.logo_url,
        description: meta.tagline,
        telephone: meta.phone,
        email: meta.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '2970 Blystone Lane Suite 104',
          addressLocality: 'Dallas',
          addressRegion: 'TX',
          postalCode: '75220',
          addressCountry: 'US',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: meta.phone,
          contactType: 'sales and customer support',
          areaServed: 'US',
          availableLanguage: 'en',
        },
        sameAs: Object.values(meta.social).filter(Boolean),
      },
      {
        '@type': 'LocalBusiness',
        '@id': 'https://zionledusa.com/#localbusiness',
        name: 'ZION LED USA',
        url: 'https://zionledusa.com',
        telephone: meta.phone,
        email: meta.email,
        image: meta.logo_url,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '2970 Blystone Lane Suite 104',
          addressLocality: 'Dallas',
          addressRegion: 'TX',
          postalCode: '75220',
          addressCountry: 'US',
        },
        openingHours: 'Mo-Fr 09:00-18:00',
        priceRange: '$$',
      },
    ],
  }

  return (
    <PageShell showContact>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLocalBusinessJsonLd) }}
      />
      {/* 1. Hero */}
      <HeroSection tiles={heroTiles} stats={statList} />

      {/* 2. TrustStrip */}
      <TrustStrip />

      {/* 3. Applications (8 tiles linking to dedicated application pages) */}
      <ApplicationsSection tiles={applicationTiles} />

      {/* 4. Best sellers carousel */}
      <ProductSlider
        id="featured"
        eyebrow="Popular right now"
        title="Best-selling fixtures"
        text="One standout from every product family. Swipe through the range or jump into a category."
        products={featuredProducts}
        autoplay
      />

      {/* 5. The 3 group cards only (30-family grid moved to /products) */}
      <CategoryGrid
        primaryCategories={primaryCategories}
        tiles={categoryTiles}
        showFamilies={false}
        groupImages={{
          indoor: heroTiles[0].image,
          outdoor: heroTiles[1].image,
          lightpoles: tile('', '', 'tenon-adapters', 4).image,
        }}
      />

      {/* 6. Short Why ZION band with a link to /about */}
      <WhySection
        stats={[
          { value: '50K+', label: 'Rated hours of LED life' },
          { value: '75%', label: 'Energy savings vs. HID, up to' },
          { value: '0–10V', label: 'Dimming on most fixtures' },
          { value: 'IP65', label: 'Wet-rated outdoor housings' },
        ]}
      />

      {/* 7. One testimonial row */}
      <TestimonialSection testimonials={getTestimonials()} />

      {/* 8. Quote CTA linking to /quote (rendered via PageShell showContact) */}
    </PageShell>
  )
}
