import Image from 'next/image'
import Link from 'next/link'

import { BLUR_DATA_URL } from '@/lib/ui'
import type { NavigationGroup, SiteMeta } from '@/types/product'

interface FooterProps {
  meta: SiteMeta
  navigation: NavigationGroup[]
}

const SOCIALS = [
  { key: 'facebook', short: 'F', label: 'Facebook' },
  { key: 'instagram', short: 'I', label: 'Instagram' },
  { key: 'linkedin', short: 'L', label: 'LinkedIn' },
] as const

export default function Footer({ meta, navigation }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-top">
        <div className="footer-brand reveal">
          <Image
            src={meta.logo_url}
            alt="ZION LED USA"
            width={186}
            height={52}
            className="footer-logo"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          <p className="footer-tagline">{meta.tagline}</p>

          <div className="footer-contact-stack">
            <a href={`tel:${meta.phone_href}`} className="footer-contact-pill">
              {meta.phone}
            </a>
            <a href={`mailto:${meta.email}`} className="footer-contact-pill">
              {meta.email}
            </a>
            <span className="footer-contact-pill">{meta.address}</span>
          </div>
        </div>

        {navigation.map((group) => (
          <div key={group.key} className="footer-column reveal">
            <div className="footer-column-title">{group.label}</div>
            <div className="footer-links">
              {group.items.map((item) => (
                <Link key={`${group.key}-${item.label}`} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="footer-column reveal">
          <div className="footer-column-title">Company</div>
          <div className="footer-links">
            <Link href="/#about">About Us</Link>
            <Link href="/#categories">Browse Catalog</Link>
            <Link href="/#products">Featured Products</Link>
            <Link href="/#contact">Request Quote</Link>
          </div>

          <div className="footer-socials">
            {SOCIALS.map((social) => (
              <a key={social.key} href={meta.social[social.key]} target="_blank" rel="noreferrer" className="footer-social" aria-label={social.label}>
                {social.short}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="site-shell footer-bottom">
        <span>&copy; 2026 ZION LED USA</span>
        <span>Premium LED catalog built for commercial buyers and project teams.</span>
        <span>{meta.business_hours}</span>
        <span>Dallas, Texas</span>
      </div>
    </footer>
  )
}
