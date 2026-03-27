'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { BLUR_DATA_URL } from '@/lib/ui'
import type { NavigationGroup, SiteMeta } from '@/types/product'

interface NavbarProps {
  meta: SiteMeta
  navigation: NavigationGroup[]
}

export default function Navbar({ meta, navigation }: NavbarProps) {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const projectDeskLabel = meta.address.toLowerCase().includes('dallas') ? 'Dallas Project Desk' : 'Project Desk'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroup(null)
        setMobileOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeAllMenus = () => {
    setOpenGroup(null)
    setMobileOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileOpen((value) => !value)
  }

  return (
    <header ref={navRef} className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-shell nav-inner">
        <Link href="/" className="nav-logo" aria-label="ZION LED USA home" onClick={closeAllMenus}>
          <Image
            src={meta.logo_url}
            alt="ZION LED USA"
            width={212}
            height={58}
            className="nav-logo-image"
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </Link>

        <nav className="nav-desktop nav-links" aria-label="Primary">
          <div className="nav-links-shell">
            <ul className="nav-list">
              <li className="nav-group nav-group--static">
                <Link href="/" className="nav-link" onClick={closeAllMenus}>
                  Home
                </Link>
              </li>

              {navigation.map((group) => (
                <li
                  key={group.key}
                  className={`nav-group ${openGroup === group.key ? 'is-open' : ''}`}
                  onMouseEnter={() => setOpenGroup(group.key)}
                  onMouseLeave={() => setOpenGroup((current) => (current === group.key ? null : current))}
                >
                  <div className="nav-link-row">
                    <Link href={group.href} className="nav-link nav-link--group" onClick={closeAllMenus}>
                      <span>{group.label}</span>
                    </Link>

                    <button
                      type="button"
                      className="nav-link-trigger"
                      aria-expanded={openGroup === group.key}
                      aria-label={`Toggle ${group.label} menu`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setOpenGroup((current) => (current === group.key ? null : group.key))
                      }}
                    >
                      <span className="nav-link-caret" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="nav-dropdown">
                    <div className="nav-dropdown-label">Browse {group.label}</div>
                    <p className="nav-dropdown-copy">{group.description}</p>
                    <div className="nav-dropdown-list">
                      {group.items.map((item) => (
                        <Link key={`${group.key}-${item.label}`} href={item.href} className="nav-dropdown-link" onClick={closeAllMenus}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <Link href={group.href} className="nav-dropdown-cta" onClick={closeAllMenus}>
                      View All {group.label} <span aria-hidden="true">-&gt;</span>
                    </Link>
                  </div>
                </li>
              ))}

              <li className="nav-group nav-group--static">
                <Link href="/#about" className="nav-link" onClick={closeAllMenus}>
                  About Us
                </Link>
              </li>

              <li className="nav-group nav-group--static">
                <Link href="/#contact" className="nav-link" onClick={closeAllMenus}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="nav-utility">
          <div className="nav-status-chip">
            <span className="nav-status-dot" aria-hidden="true" />
            <span>{projectDeskLabel}</span>
          </div>

          <a href={`tel:${meta.phone_href}`} className="nav-phone-pill">
            <span className="nav-phone-label">Call</span>
            <span className="nav-phone-number">{meta.phone}</span>
          </a>

          <Link href="/#contact" className="nav-cta btn-glow" onClick={closeAllMenus}>
            Free Quote
          </Link>

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle menu"
          >
            {mobileOpen ? '\u2715' : '\u2630'}
          </button>
        </div>
      </div>

      {mounted && mobileOpen
        ? createPortal(
            <div id="mobile-navigation" className="nav-mobile is-open" role="dialog" aria-modal="true" aria-label="Mobile navigation">
              <div className="site-shell nav-mobile-panel">
                <div className="nav-mobile-utility">
                  <a href={`tel:${meta.phone_href}`} className="nav-mobile-phone" onClick={closeAllMenus}>
                    {meta.phone}
                  </a>
                  <Link href="/#contact" className="btn-glow nav-mobile-cta" onClick={closeAllMenus}>
                    Free Quote
                  </Link>
                </div>

                <div className="nav-mobile-footer">
                  <Link href="/" className="nav-mobile-link" onClick={closeAllMenus}>
                    Home
                  </Link>
                  <Link href="/#about" className="nav-mobile-link" onClick={closeAllMenus}>
                    About Us
                  </Link>
                  <Link href="/#contact" className="nav-mobile-link" onClick={closeAllMenus}>
                    Contact
                  </Link>
                </div>

                {navigation.map((group) => (
                  <div key={group.key} className="nav-mobile-group">
                    <div className="nav-mobile-group-head">
                      <Link href={group.href} className="nav-mobile-heading" onClick={closeAllMenus}>
                        {group.label}
                      </Link>
                      <Link href={group.href} className="nav-mobile-viewall" onClick={closeAllMenus}>
                        View all
                      </Link>
                    </div>

                    <div className="nav-mobile-links">
                      {group.items.map((item) => (
                        <Link key={`${group.key}-${item.label}`} href={item.href} className="nav-mobile-link" onClick={closeAllMenus}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </header>
  )
}
