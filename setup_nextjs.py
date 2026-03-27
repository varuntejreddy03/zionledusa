#!/usr/bin/env python3
"""
Run this AFTER zionled_scraper.py to scaffold the Next.js project.
Usage: python setup_nextjs.py
"""

import os, json
from pathlib import Path

PROJ = Path("zionled-nextjs")

FILES = {

# ── package.json ──────────────────────────────────────────
"package.json": json.dumps({
  "name": "zionled-usa",
  "version": "1.0.0",
  "private": True,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "three": "^0.168.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.112.0",
    "framer-motion": "^11.0.0",
    "clsx": "^2.1.0",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/react": "^18.3.0",
    "@types/node": "^22.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}, indent=2),

# ── next.config.ts ────────────────────────────────────────
"next.config.ts": """\
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'zionledusa.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig
""",

# ── tailwind.config.ts ────────────────────────────────────
"tailwind.config.ts": """\
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-void':    '#040810',
        'bg-deep':    '#060c1a',
        'bg-surface': '#0b1426',
        'bg-card':    '#0f1d35',
        'blue-core':  '#0d7fd4',
        'blue-bright':'#1a9fe8',
        'blue-glow':  '#38bdf8',
        'gold':       '#f0a500',
        'gold-light': '#fbbf24',
        'muted':      '#6b8db5',
      },
      fontFamily: {
        head: ['Rajdhani', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
      },
      animation: {
        'float-y':  'floatY 4s ease-in-out infinite',
        'ticker':   'ticker 35s linear infinite',
        'pulse-dot':'pulseDot 2s ease-in-out infinite',
        'scan-line':'scanLine 8s linear infinite',
        'rise-in':  'riseIn 0.9s cubic-bezier(.22,1,.36,1) forwards',
      },
      keyframes: {
        floatY: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseDot: { '0%,100%': { boxShadow: '0 0 0 0 rgba(56,189,248,0.7)' }, '50%': { boxShadow: '0 0 0 8px rgba(56,189,248,0)' } },
        riseIn: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
""",

# ── tsconfig.json ─────────────────────────────────────────
"tsconfig.json": json.dumps({
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": True,
    "skipLibCheck": True,
    "strict": True,
    "noEmit": True,
    "esModuleInterop": True,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": True,
    "isolatedModules": True,
    "jsx": "preserve",
    "incremental": True,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}, indent=2),

# ── src/types/product.ts ──────────────────────────────────
"src/types/product.ts": """\
export interface ProductImage {
  url: string
  original?: string
  webp?: string
  alt?: string
  filename?: string
}

export interface Category {
  id: number | null
  name: string
  slug: string
  parent: number
  count: number
  description: string
  image: ProductImage | null
  link: string
}

export interface Product {
  id?: number
  name: string
  slug: string
  sku?: string
  url: string
  status?: string
  description: string
  short_desc: string
  price?: string
  regular_price?: string
  sale_price?: string
  categories: Array<{ id?: number; name: string; slug: string }>
  tags?: string[]
  images: ProductImage[]
  attributes: Record<string, string | string[]>
  meta_title?: string
  meta_desc?: string
  in_stock?: boolean
  stock_qty?: number
  weight?: string
  dimensions?: { length?: string; width?: string; height?: string }
  scraped_at?: string
}

export interface SiteData {
  generated_at: string
  source: string
  site_meta: {
    phone: string
    email: string
    address: string
    social: Record<string, string>
    tagline: string
    logo_url: string
  }
  categories: Category[]
  products: Product[]
  pages: Array<{ id: number; title: string; slug: string; content: string }>
  stats: {
    total_products: number
    total_categories: number
    total_pages: number
    total_images: number
  }
}
""",

# ── src/lib/data.ts ───────────────────────────────────────
"src/lib/data.ts": """\
import type { Product, Category, SiteData } from '@/types/product'
// Place export.json at: src/data/export.json  (from scraper output)
import rawData from '@/data/export.json'

const data = rawData as SiteData

export function getAllProducts(): Product[] {
  return data.products
}

export function getProductBySlug(slug: string): Product | undefined {
  return data.products.find(p => p.slug === slug)
}

export function getAllCategories(): Category[] {
  return data.categories
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return data.categories.find(c => c.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return data.products.filter(p =>
    p.categories.some(c => c.slug === categorySlug)
  )
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase()
  return data.products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.short_desc?.toLowerCase().includes(q)
  )
}

export function getSiteMeta() {
  return data.site_meta
}

export function getSiteStats() {
  return data.stats
}
""",

# ── src/app/layout.tsx ────────────────────────────────────
"src/app/layout.tsx": """\
import type { Metadata } from 'next'
import { Rajdhani, Exo_2 } from 'next/font/google'
import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-head',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ZION LED USA — Premium LED Lighting Solutions',
    template: '%s | ZION LED USA',
  },
  description: 'High-performance LED lighting for commercial & industrial applications. DLC & UL certified. Fast nationwide shipping.',
  openGraph: {
    siteName: 'ZION LED USA',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL('https://zionledusa.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${exo2.variable}`}>
      <body className="font-body bg-bg-void text-off-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
""",

# ── src/app/globals.css ───────────────────────────────────
"src/app/globals.css": """\
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-void:    #040810;
  --bg-deep:    #060c1a;
  --bg-surface: #0b1426;
  --bg-card:    #0f1d35;
  --blue-core:  #0d7fd4;
  --blue-bright:#1a9fe8;
  --blue-glow:  #38bdf8;
  --gold:       #f0a500;
  --gold-light: #fbbf24;
  --off-white:  #e8f4fd;
  --muted:      #6b8db5;
  --border:     rgba(13,127,212,0.18);
}

html { scroll-behavior: smooth; }

@layer components {
  .btn-glow {
    @apply inline-flex items-center gap-2.5 font-head text-sm font-bold tracking-widest uppercase px-9 py-4 rounded-lg text-white relative overflow-hidden transition-all duration-300;
    background: linear-gradient(135deg, var(--blue-core), var(--blue-bright));
    box-shadow: 0 0 36px rgba(13,127,212,0.35);
  }
  .btn-glow:hover {
    @apply -translate-y-1;
    box-shadow: 0 0 60px rgba(13,127,212,0.55), 0 12px 30px rgba(0,0,0,0.4);
  }
  .btn-outline {
    @apply inline-flex items-center gap-2.5 font-head text-sm font-semibold tracking-widest uppercase px-9 py-4 rounded-lg bg-transparent text-off-white transition-all duration-300;
    border: 1px solid rgba(13,127,212,0.45);
  }
  .btn-outline:hover {
    @apply -translate-y-1;
    background: rgba(13,127,212,0.1);
    border-color: var(--blue-glow);
  }
  .s-label {
    @apply inline-flex items-center gap-2.5 font-head text-xs font-bold tracking-widest uppercase mb-2;
    color: var(--blue-glow);
  }
  .s-label::before {
    content: '';
    @apply block w-7 h-px;
    background: linear-gradient(90deg, var(--blue-core), var(--blue-glow));
  }
  .s-title {
    @apply font-head text-3xl md:text-5xl font-bold tracking-widest uppercase leading-tight text-white mb-4;
  }
  .prod-card {
    background: var(--bg-card);
    @apply border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300;
    border-color: rgba(255,255,255,0.05);
  }
  .prod-card:hover {
    border-color: rgba(13,127,212,0.4);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(13,127,212,0.08);
  }
}
""",

# ── src/app/page.tsx ──────────────────────────────────────
"src/app/page.tsx": """\
import { Suspense } from 'react'
import { getAllProducts, getAllCategories, getSiteMeta, getSiteStats } from '@/lib/data'
import HeroSection from '@/components/sections/HeroSection'
import TrustRow from '@/components/sections/TrustRow'
import ProductsSection from '@/components/sections/ProductsSection'
import StatsSection from '@/components/sections/StatsSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function HomePage() {
  const products   = getAllProducts()
  const categories = getAllCategories()
  const meta       = getSiteMeta()
  const stats      = getSiteStats()

  return (
    <>
      <Navbar meta={meta} />
      <main>
        <HeroSection stats={stats} />
        <TrustRow phone={meta.phone} />
        <StatsSection stats={stats} />
        <Suspense fallback={<div className="py-20 text-center text-muted">Loading products...</div>}>
          <ProductsSection products={products} categories={categories} />
        </Suspense>
      </main>
      <Footer meta={meta} categories={categories} />
    </>
  )
}
""",

# ── src/app/products/[slug]/page.tsx ──────────────────────
"src/app/products/[slug]/page.tsx": """\
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { getAllProducts, getProductBySlug } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSiteMeta, getAllCategories } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.meta_title || product.name,
    description: product.meta_desc || product.short_desc,
    openGraph: {
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const meta       = getSiteMeta()
  const categories = getAllCategories()

  return (
    <>
      <Navbar meta={meta} />
      <main className="pt-24 pb-20 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Images */}
          <div className="space-y-4">
            {product.images[0] && (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-bg-card border border-blue-core/20">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-contain p-8"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.categories.map(c => (
                <span key={c.slug} className="text-xs font-head font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                  style={{ background: 'rgba(13,127,212,0.15)', color: 'var(--blue-glow)', borderColor: 'rgba(13,127,212,0.25)' }}>
                  {c.name}
                </span>
              ))}
            </div>
            <h1 className="font-head text-4xl font-bold text-white tracking-wider uppercase mb-4">{product.name}</h1>
            {product.sku && <p className="text-sm text-muted mb-4">SKU: {product.sku}</p>}
            {product.short_desc && (
              <p className="text-muted leading-relaxed mb-8 font-light">{product.short_desc}</p>
            )}

            {/* Specs table */}
            {Object.keys(product.attributes).length > 0 && (
              <div className="rounded-xl overflow-hidden border mb-8" style={{ borderColor: 'var(--border)' }}>
                <div className="px-4 py-3 font-head font-bold text-sm tracking-widest uppercase text-blue-glow"
                  style={{ background: 'rgba(13,127,212,0.1)' }}>Specifications</div>
                {Object.entries(product.attributes).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 px-4 py-2.5 text-sm border-t" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-muted capitalize">{k}</span>
                    <span className="text-off-white">{Array.isArray(v) ? v.join(', ') : v}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 flex-wrap">
              <a href={`tel:${meta.phone}`} className="btn-glow">📞 Get Quote</a>
              <a href="/contact" className="btn-outline">Contact Us →</a>
            </div>
          </div>
        </div>

        {/* Full description */}
        {product.description && (
          <div className="mt-16 prose prose-invert max-w-none">
            <h2 className="s-title">Product Details</h2>
            <p className="text-muted leading-relaxed font-light">{product.description}</p>
          </div>
        )}
      </main>
      <Footer meta={meta} categories={categories} />
    </>
  )
}
""",

# ── src/components/Navbar.tsx ─────────────────────────────
"src/components/Navbar.tsx": """\
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface NavbarProps {
  meta: { phone: string; logo_url: string }
}

export default function Navbar({ meta }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-[74px] flex items-center justify-between px-14 transition-all duration-300
      ${scrolled ? 'bg-bg-void/97 shadow-2xl' : 'bg-bg-void/78 backdrop-blur-xl'}`}
      style={{ borderBottom: '1px solid var(--border)' }}>

      <Link href="/" className="flex items-center">
        {meta.logo_url
          ? <Image src={meta.logo_url} alt="ZION LED USA" width={140} height={46} className="h-[46px] w-auto object-contain" />
          : <span className="font-head text-2xl font-bold tracking-widest text-white">ZION <span style={{ color: 'var(--blue-bright)' }}>LED</span></span>
        }
      </Link>

      <ul className="hidden md:flex items-center gap-7 list-none">
        {[
          { label: 'Indoor',      href: '/category/indoor-lights' },
          { label: 'Outdoor',     href: '/category/outdoor-lights' },
          { label: 'Light Poles', href: '/category/light-poles' },
          { label: 'About',       href: '/about' },
          { label: 'Contact',     href: '/contact' },
        ].map(item => (
          <li key={item.label}>
            <Link href={item.href}
              className="font-head text-sm font-semibold tracking-widest uppercase transition-colors duration-200"
              style={{ color: 'var(--muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
              {item.label}
            </Link>
          </li>
        ))}
        {meta.phone && (
          <li>
            <a href={`tel:${meta.phone}`} className="font-head text-sm font-bold"
              style={{ color: 'var(--gold-light)' }}>{meta.phone}</a>
          </li>
        )}
        <li>
          <Link href="/contact" className="btn-glow text-xs py-2.5 px-6">Get Quote</Link>
        </li>
      </ul>
    </nav>
  )
}
""",

# ── src/components/sections/ProductsSection.tsx ───────────
"src/components/sections/ProductsSection.tsx": """\
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Product, Category } from '@/types/product'

interface Props {
  products: Product[]
  categories: Category[]
}

export default function ProductsSection({ products, categories }: Props) {
  const [active, setActive] = useState('all')

  const tabs = [
    { id: 'all', label: 'All Products' },
    ...categories.slice(0, 5).map(c => ({ id: c.slug, label: c.name })),
  ]

  const visible = active === 'all'
    ? products
    : products.filter(p => p.categories.some(c => c.slug === active))

  return (
    <section className="py-28 px-14" style={{ background: 'var(--bg-deep)' }}>
      <div className="flex justify-between items-end mb-12 gap-8 flex-wrap">
        <div>
          <div className="s-label">Product Catalog</div>
          <h2 className="s-title">LIGHTING FOR EVERY <span style={{ color: 'var(--blue-bright)' }}>APPLICATION</span></h2>
          <p className="text-muted max-w-xl leading-relaxed font-light">
            From warehouse ceilings to parking lots — the right LED for your exact space.
          </p>
        </div>
        <Link href="/products" className="btn-outline whitespace-nowrap">View All →</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className="font-head text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full border transition-all duration-200"
            style={{
              background:   active === t.id ? 'rgba(13,127,212,0.15)' : 'transparent',
              borderColor:  active === t.id ? 'var(--blue-bright)' : 'var(--border)',
              color:        active === t.id ? 'white' : 'var(--muted)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {visible.slice(0, 12).map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const thumb = product.images[0]
  const catName = product.categories[0]?.name || ''
  const isOutdoor = catName.toLowerCase().includes('outdoor')
  const isPole    = catName.toLowerCase().includes('pole')

  return (
    <Link href={`/products/${product.slug}`} className="prod-card group block">
      <div className="h-44 flex items-center justify-center relative overflow-hidden"
        style={{ background: isOutdoor ? 'linear-gradient(135deg,#0a1820,#0d2535)' : isPole ? 'linear-gradient(135deg,#120d1f,#1a0d2e)' : 'linear-gradient(135deg,#0a1830,#0d2247)' }}>
        {thumb?.url ? (
          <Image
            src={thumb.url}
            alt={thumb.alt || product.name}
            width={140}
            height={140}
            className="object-contain h-32 w-32 transition-transform duration-500 group-hover:scale-110"
            sizes="140px"
          />
        ) : (
          <div className="w-24 h-24 rounded-full opacity-20" style={{ background: 'var(--blue-core)' }} />
        )}
      </div>
      <div className="p-6">
        <span className="inline-block font-head text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 border"
          style={{ background: 'rgba(13,127,212,0.15)', color: 'var(--blue-glow)', borderColor: 'rgba(13,127,212,0.25)' }}>
          {catName}
        </span>
        <h3 className="font-head text-lg font-bold text-white mb-2 leading-tight">{product.name}</h3>
        <p className="text-xs font-light mb-4 line-clamp-2" style={{ color: 'var(--muted)' }}>
          {product.short_desc}
        </p>
        <span className="font-head text-sm font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-all duration-200"
          style={{ color: 'var(--blue-bright)' }}>
          Shop Now →
        </span>
      </div>
    </Link>
  )
}
""",

# ── .env.local ────────────────────────────────────────────
".env.local": """\
# WooCommerce API (optional — for live data sync)
WC_CONSUMER_KEY=ck_your_key_here
WC_CONSUMER_SECRET=cs_your_secret_here

# Cloudinary (for production image hosting)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Site
NEXT_PUBLIC_SITE_URL=https://zionledusa.com
""",

}

def main():
    print("📁 Scaffolding Next.js project structure...\n")
    for filepath, content in FILES.items():
        full = PROJ / filepath
        full.parent.mkdir(parents=True, exist_ok=True)
        full.write_text(content, encoding="utf-8")
        print(f"  ✓ {filepath}")

    # Create placeholder dirs
    for d in ["src/components/sections", "src/app/category/[slug]",
              "src/app/products", "src/data", "public/scraped"]:
        (PROJ / d).mkdir(parents=True, exist_ok=True)
        print(f"  ✓ {d}/")

    print(f"\n✅ Done! Project scaffolded at: {PROJ.resolve()}")
    print("\nNext steps:")
    print("  1. cd zionled-nextjs && npm install")
    print("  2. cp ../data/export.json src/data/export.json")
    print("  3. cp -r ../data/images_optimized public/images")
    print("  4. npm run dev → http://localhost:3000")

if __name__ == "__main__":
    main()
