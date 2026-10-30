'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import SearchBar from '@/components/SearchBar'
import Icon from '@/components/ui/Icon'
import { APPLICATION_OPTIONS } from '@/lib/applicationsData'
import type { NavigationGroup, SiteMeta } from '@/types/product'

interface NavbarProps {
  meta: SiteMeta
  navigation: NavigationGroup[]
}

export default function Navbar({ meta, navigation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroup(null)
        setDrawer(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [drawer])

  const close = () => {
    setOpenGroup(null)
    setDrawer(false)
  }

  return (
    <>
      <div className="topbar">
        <div className="shell">
          <div className="topbar-group">
            <span className="topbar-live-badge">
              <span className="topbar-dot" />
              <strong className="topbar-live-tag">DALLAS HUB</strong>
              <span className="topbar-live-time">· CST DESK</span>
            </span>
            <span className="topbar-hours">
              Open {meta.business_hours} · Fast Nationwide Freight
            </span>
          </div>
          <div className="topbar-group topbar-group--hide">
            <span>Free lighting layouts &amp; rebate help</span>
            <a href={`mailto:${meta.email}`}>{meta.email}</a>
          </div>
        </div>
      </div>

      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`} onMouseLeave={() => setOpenGroup(null)}>
        <div className="shell nav-inner">
          <Link href="/" className="nav-logo" aria-label="ZION LED USA home" onClick={close}>
            <Image src={meta.logo_url} alt="ZION LED USA" width={220} height={22} priority />
          </Link>

          <nav aria-label="Primary">
            <ul className="nav-menu">
              {navigation.map((group) => (
                <li
                  key={group.key}
                  className={`nav-item ${openGroup === group.key ? 'is-open' : ''}`}
                  onMouseEnter={() => setOpenGroup(group.key)}
                >
                  <button
                    type="button"
                    className="nav-link"
                    aria-expanded={openGroup === group.key}
                    onClick={() => setOpenGroup((current) => (current === group.key ? null : group.key))}
                  >
                    {group.label} <Icon name="chevron" size={15} />
                  </button>

                  <div className="mega">
                    <div className="shell mega-inner">
                      <div>
                        <div className="mega-title">
                          <h3>{group.label} lighting</h3>
                          <Link href={group.href} className="text-link" onClick={close}>
                            Shop all {group.productCount} products <Icon name="arrow" size={15} />
                          </Link>
                        </div>
                        <div className="mega-links">
                          {group.items.map((item) => (
                            <Link key={item.href} href={item.href} onClick={close}>
                              {item.label}
                              {item.count ? <small>{item.count}</small> : null}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Link href={group.href} className="mega-feature" onClick={close}>
                        <div className="mega-feature-media">
                          {group.image ? <Image src={group.image} alt="" fill sizes="260px" /> : null}
                        </div>
                        <p>{group.description}</p>
                        <span className="text-link">
                          Browse {group.label} <Icon name="arrow" size={15} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}

              {/* Applications Mega Menu */}
              <li
                className={`nav-item ${openGroup === 'applications' ? 'is-open' : ''}`}
                onMouseEnter={() => setOpenGroup('applications')}
              >
                <button
                  type="button"
                  className="nav-link"
                  aria-expanded={openGroup === 'applications'}
                  onClick={() => setOpenGroup((current) => (current === 'applications' ? null : 'applications'))}
                >
                  Applications <Icon name="chevron" size={15} />
                </button>

                <div className="mega">
                  <div className="shell mega-inner">
                    <div>
                      <div className="mega-title">
                        <h3>Lighting Applications</h3>
                        <Link href="/applications" className="text-link" onClick={close}>
                          Explore all 8 applications <Icon name="arrow" size={15} />
                        </Link>
                      </div>
                      <div className="mega-links">
                        {APPLICATION_OPTIONS.map((app) => (
                          <Link key={app.slug} href={`/applications/${app.slug}`} onClick={close}>
                            {app.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/applications" className="mega-feature" onClick={close}>
                      <p>
                        Spec-grade fixtures tailored for optimal foot-candles, DLC qualified listings, and local code compliance.
                      </p>
                      <span className="text-link">
                        View all applications <Icon name="arrow" size={15} />
                      </span>
                    </Link>
                  </div>
                </div>
              </li>

              {/* Static Links */}
              <li className="nav-item" onMouseEnter={() => setOpenGroup(null)}>
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </li>
              <li className="nav-item" onMouseEnter={() => setOpenGroup(null)}>
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <a href={`tel:${meta.phone_href}`} className="nav-phone">
              {meta.phone}
            </a>
            <SearchBar />
            <Link href="/quote" className="btn btn--primary btn--sm">
              Get a quote
            </Link>
            <button
              type="button"
              className="icon-btn nav-burger"
              aria-label="Open menu"
              aria-expanded={drawer}
              onClick={() => setDrawer(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {drawer ? (
        <div className="drawer" onClick={close} role="dialog" aria-modal="true" aria-label="Menu">
          <div className="drawer-panel" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <Image src={meta.logo_url} alt="ZION LED USA" width={170} height={17} />
              <button type="button" className="icon-btn" aria-label="Close menu" onClick={close}>
                <Icon name="close" />
              </button>
            </div>

            {navigation.map((group) => (
              <details key={group.key}>
                <summary>
                  {group.label} <Icon name="chevron" />
                </summary>
                <div className="drawer-links">
                  <Link href={group.href} onClick={close}>
                    <b>All {group.label}</b>
                  </Link>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={close}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}

            <details>
              <summary>
                Applications <Icon name="chevron" />
              </summary>
              <div className="drawer-links">
                <Link href="/applications" onClick={close}>
                  <b>All Applications</b>
                </Link>
                {APPLICATION_OPTIONS.map((app) => (
                  <Link key={app.slug} href={`/applications/${app.slug}`} onClick={close}>
                    {app.title}
                  </Link>
                ))}
              </div>
            </details>

            <Link href="/about" className="drawer-plain" onClick={close}>
              About
            </Link>
            <Link href="/contact" className="drawer-plain" onClick={close}>
              Contact
            </Link>

            <div className="drawer-cta">
              <Link href="/quote" className="btn btn--primary" onClick={close}>
                Get a quote
              </Link>
              <a href={`tel:${meta.phone_href}`} className="btn btn--ghost">
                <Icon name="phone" /> {meta.phone}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
