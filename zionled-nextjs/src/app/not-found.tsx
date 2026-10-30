import Link from 'next/link'

import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import SearchBar from '@/components/SearchBar'
import Icon from '@/components/ui/Icon'

export default function NotFound() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: '404 - Page Not Found' },
  ]

  const groups = [
    {
      title: 'Indoor Lighting',
      desc: 'High bays, troffers, flat panels, and commercial downlights.',
      href: '/category/indoor',
    },
    {
      title: 'Outdoor Lighting',
      desc: 'Area shoebox lights, wall packs, floodlights, and canopy fixtures.',
      href: '/category/outdoor',
    },
    {
      title: 'Light Poles & Hardware',
      desc: 'Square steel poles, round poles, tenon adapters, and bullhorns.',
      href: '/category/lightpoles',
    },
  ]

  return (
    <PageShell showContact={false}>
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Error 404"
        title="Page Not Found"
        intro="The page or fixture you were looking for doesn't exist or may have moved. Use the search bar below or explore our primary catalog groups."
      />

      <section className="section" style={{ paddingTop: 36, paddingBottom: 64 }}>
        <div className="shell">
          <div style={{ maxWidth: 640, margin: '0 auto 48px' }}>
            <SearchBar variant="inline" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2>Or Browse by Catalog Group</h2>
          </div>

          <div className="app-grid" style={{ maxWidth: 960, margin: '0 auto' }}>
            {groups.map((g) => (
              <Link key={g.href} href={g.href} className="app-card">
                <div className="app-body">
                  <h3>{g.title}</h3>
                  <p>{g.desc}</p>
                  <span className="text-link">
                    Browse group <Icon name="arrow" size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: 40, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn btn--primary">
              Browse All 150+ Products
            </Link>
            <Link href="/contact" className="btn btn--ghost">
              Contact Dallas Project Desk
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
