import ContactSection from '@/components/sections/ContactSection'
import HomeInteractive from '@/components/sections/HomeInteractive'
import PerformanceSection from '@/components/sections/PerformanceSection'
import StatsSection from '@/components/sections/StatsSection'
import TestimonialSection from '@/components/sections/TestimonialSection'
import WhySection from '@/components/sections/WhySection'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import {
  getFeaturedProducts,
  getHomepageCategoryTiles,
  getNavigationGroups,
  getPerformanceMetrics,
  getPrimaryCategories,
  getSiteMeta,
  getSiteStats,
  getTestimonials,
  getWhyFeatures,
} from '@/lib/data'

export default function HomePage() {
  const meta = getSiteMeta()
  const stats = getSiteStats()
  const navigation = getNavigationGroups()
  const primaryCategories = getPrimaryCategories()
  const categoryTiles = getHomepageCategoryTiles(9)
  const featuredProducts = getFeaturedProducts(8)
  const whyFeatures = getWhyFeatures()
  const performanceMetrics = getPerformanceMetrics()
  const testimonials = getTestimonials()

  return (
    <>
      <Navbar meta={meta} navigation={navigation} />
      <main className="site-main">
        <HomeInteractive
          meta={meta}
          stats={stats}
          primaryCategories={primaryCategories}
          categoryTiles={categoryTiles}
          featuredProducts={featuredProducts}
        />
        <StatsSection stats={stats} />
        <WhySection features={whyFeatures} />
        <PerformanceSection metrics={performanceMetrics} />
        <TestimonialSection testimonials={testimonials} />
        <ContactSection meta={meta} />
      </main>
      <Footer meta={meta} navigation={navigation} />
    </>
  )
}
