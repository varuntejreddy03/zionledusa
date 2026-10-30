import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import PageHeader from '@/components/PageHeader'
import PageShell from '@/components/PageShell'
import Icon from '@/components/ui/Icon'
import { getAllApplications } from '@/lib/applications'

export const metadata: Metadata = {
  title: 'Commercial Lighting Applications',
  description:
    'Explore spec-grade LED lighting fixtures tailored by application: warehouses, parking lots, gas stations, sports arenas, offices, and hazardous locations.',
  alternates: { canonical: '/applications' },
}

export default function ApplicationsIndexPage() {
  const applications = getAllApplications()

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Applications' },
  ]

  const breadcrumbJsonLdItems = [
    { name: 'Home', url: '/' },
    { name: 'Applications', url: '/applications' },
  ]

  return (
    <PageShell showContact>
      <BreadcrumbJsonLd items={breadcrumbJsonLdItems} />
      <PageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Commercial & Industrial Lighting"
        title="Lighting Applications"
        intro="Select your facility or project type. We configure DLC and UL listed fixtures tailored for optimal foot-candle levels, beam angles, and local code compliance."
      />

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="shell">
          <div className="app-grid">
            {applications.map((app, index) => (
              <Link key={app.slug} href={app.href} className="app-card">
                <div className="app-media">
                  <span className="app-num">{String(index + 1).padStart(2, '0')}</span>
                  {app.image ? (
                    <Image
                      src={app.image}
                      alt={app.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 300px"
                    />
                  ) : null}
                </div>
                <div className="app-body">
                  <h3>{app.title}</h3>
                  <p>{app.intro}</p>
                  <span className="text-link">
                    Explore fixtures <Icon name="arrow" size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
