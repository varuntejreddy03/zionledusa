'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { SiteMeta, SiteStats } from '@/types/product'

interface HeroSectionProps {
  meta: SiteMeta
  stats: SiteStats
}

export default function HeroSection({ meta, stats }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-gradient-mesh" />

      {/* Mission & Vision - Top Left Corner */}
      <div className="hero-mission-vision">
        <div className="hero-mv-card reveal" style={{ transitionDelay: '0.15s' }}>
          <div className="hero-mv-label">Our Mission</div>
          <p className="hero-mv-text">
            To deliver premium, spec-grade LED lighting solutions that empower contractors, facilities managers, and commercial buyers with products they can trust — backed by compliance, performance, and responsive support.
          </p>
        </div>
        <div className="hero-mv-card reveal" style={{ transitionDelay: '0.35s' }}>
          <div className="hero-mv-label">Our Vision</div>
          <p className="hero-mv-text">
            To be America&apos;s most trusted commercial LED supply partner — setting the standard for quality, transparency, and project-ready solutions in the lighting industry.
          </p>
        </div>
      </div>

      {/* Center Eagle Logo Orbiter */}
      <div className="hero-center-stage">
        <div className="hero-orbit-container reveal" style={{ transitionDelay: '0.3s' }}>
          {/* Animated orbit rings */}
          <div className="hero-orbit-ring hero-orbit-ring--1" />
          <div className="hero-orbit-ring hero-orbit-ring--2" />
          <div className="hero-orbit-ring hero-orbit-ring--3" />

          {/* Orbit dots */}
          <div className="hero-orbit-dot hero-orbit-dot--1" />
          <div className="hero-orbit-dot hero-orbit-dot--2" />
          <div className="hero-orbit-dot hero-orbit-dot--3" />

          {/* Edge corner numeric markers */}
          <div className="hero-orbit-corner hero-orbit-corner--tl">01</div>
          <div className="hero-orbit-corner hero-orbit-corner--tr">02</div>
          <div className="hero-orbit-corner hero-orbit-corner--bl">03</div>
          <div className="hero-orbit-corner hero-orbit-corner--br">04</div>

          {/* Glow base */}
          <div className="hero-eagle-glow" />

          {/* Eagle Logo */}
          <div className="hero-eagle-shell">
            <Image
              src="/assets/branding/eagle-hero-logo.png"
              alt="ZION LED USA Eagle"
              width={200}
              height={200}
              className="hero-eagle-image"
              priority
            />
          </div>
        </div>

        {/* Brand name below eagle */}
        <div className="hero-brand-text reveal" style={{ transitionDelay: '0.55s' }}>
          <h1 className="hero-brand-title">
            ZION LED <span className="text-gradient">USA</span>
          </h1>
          <p className="hero-brand-tagline">
            Premium LED Lighting Solutions — Built for Real Projects
          </p>
        </div>

        {/* CTA buttons */}
        <div className="hero-actions reveal" style={{ transitionDelay: '0.7s' }}>
          <Link href="/#categories" className="btn-glow">
            Browse Catalog
          </Link>
          <Link href="/#contact" className="btn-outline">
            Request Consultation
          </Link>
        </div>

        {/* Support info */}
        <p className="hero-support-note reveal" style={{ transitionDelay: '0.8s' }}>
          Dallas-based support at <a href={`tel:${meta.phone_href}`}>{meta.phone}</a> or <a href={`mailto:${meta.email}`}>{meta.email}</a>
        </p>
      </div>
    </section>
  )
}
