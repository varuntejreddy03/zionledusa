import Image from 'next/image'
import Link from 'next/link'

import { APPLICATION_OPTIONS } from '@/lib/applicationsData'
import type { NavigationGroup, SiteMeta } from '@/types/product'

interface FooterProps {
  meta: SiteMeta
  navigation: NavigationGroup[]
}

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', short: 'f' },
  { key: 'instagram', label: 'Instagram', short: 'ig' },
  { key: 'linkedin', label: 'LinkedIn', short: 'in' },
] as const

export default function Footer({ meta, navigation }: FooterProps) {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Image src={meta.logo_url} alt="ZION LED USA" width={200} height={20} />
          <p>Commercial and industrial LED lighting, stocked in Dallas and shipped nationwide.</p>
          <div className="footer-contact">
            <a href={`tel:${meta.phone_href}`}>{meta.phone}</a>
            <a href={`mailto:${meta.email}`}>{meta.email}</a>
            <span>{meta.address}</span>
          </div>
          <div className="socials">
            {SOCIALS.map((social) => (
              <a
                key={social.key}
                href={meta.social[social.key]}
                target="_blank"
                rel="noreferrer"
                className="icon-btn"
                aria-label={social.label}
              >
                <small>{social.short}</small>
              </a>
            ))}
          </div>
        </div>

        {navigation.map((group) => (
          <div key={group.key}>
            <h4>{group.label}</h4>
            <div className="footer-links">
              {group.items.slice(0, 8).map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              {group.items.length > 8 ? <Link href={group.href}>View all &rarr;</Link> : null}
            </div>
          </div>
        ))}

        <div>
          <h4>Applications</h4>
          <div className="footer-links">
            {APPLICATION_OPTIONS.map((app) => (
              <Link key={app.slug} href={`/applications/${app.slug}`}>
                {app.title}
              </Link>
            ))}
            <Link href="/applications">All Applications &rarr;</Link>
          </div>
        </div>

        <div>
          <h4>Company</h4>
          <div className="footer-links">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/quote">Request a quote</Link>
            <Link href="/products">All products</Link>
          </div>
        </div>
      </div>

      <div className="shell footer-bottom">
        <span>&copy; {new Date().getFullYear()} ZION LED USA. All rights reserved.</span>
        <span>{meta.business_hours} · Dallas, Texas</span>
      </div>

      {/* Halcyon-inspired Architectural Watermark */}
      <div className="footer-watermark" aria-hidden="true">
        <span className="footer-watermark-text">ZION LED USA</span>
      </div>
    </footer>
  )
}
