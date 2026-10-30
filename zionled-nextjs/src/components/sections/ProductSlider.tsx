'use client'

import { useEffect, useRef, useState } from 'react'

import ProductCard from '@/components/ProductCard'
import Icon from '@/components/ui/Icon'
import type { Product } from '@/types/product'

interface ProductSliderProps {
  id?: string
  products: Product[]
  eyebrow?: string
  title: string
  text?: string
  autoplay?: boolean
}

const COLLECTION_TABS = [
  { id: 'all', label: 'All Standouts' },
  { id: 'high-bays', label: 'High Bays', match: ['high-bay', 'ufo', 'linear-highbay'] },
  { id: 'area-lights', label: 'Area & Shoebox', match: ['shoebox', 'area', 'flood', 'street'] },
  { id: 'canopy', label: 'Canopy & Garage', match: ['canopy', 'garage'] },
  { id: 'wall-packs', label: 'Wall Packs', match: ['wall-pack', 'wall'] },
  { id: 'downlights', label: 'Panels & Downlights', match: ['panel', 'downlight', 'troffer'] },
]

export default function ProductSlider({ id, products, eyebrow, title, text, autoplay = false }: ProductSliderProps) {
  const track = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState({ start: 0, size: 1 })

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter((p) => {
        const tab = COLLECTION_TABS.find((t) => t.id === activeTab)
        if (!tab || !tab.match) return true
        const catSlug = (p.categories[0]?.slug || '').toLowerCase()
        const pName = p.name.toLowerCase()
        return tab.match.some((keyword) => catSlug.includes(keyword) || pName.includes(keyword))
      })

  const updateProgress = () => {
    const el = track.current
    if (!el || el.scrollWidth === 0) return
    setProgress({ start: el.scrollLeft / el.scrollWidth, size: el.clientWidth / el.scrollWidth })
  }

  const step = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const atEnd = dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
    const atStart = dir === -1 && el.scrollLeft <= 8
    const left = atEnd ? 0 : atStart ? el.scrollWidth : el.scrollLeft + dir * el.clientWidth
    el.scrollTo({ left, behavior: 'smooth' })
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (track.current) {
      track.current.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }

  useEffect(updateProgress, [activeTab])

  useEffect(() => {
    if (!autoplay || paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => step(1), 5000)
    return () => clearInterval(timer)
  }, [autoplay, paused, activeTab])

  return (
    <section id={id} className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h2>{title}</h2>
            {text ? <p>{text}</p> : null}
          </div>
          <div className="carousel-controls">
            <button type="button" className="icon-btn" aria-label="Previous products" onClick={() => step(-1)}>
              <Icon name="arrowLeft" />
            </button>
            <button type="button" className="icon-btn" aria-label="Next products" onClick={() => step(1)}>
              <Icon name="arrow" />
            </button>
          </div>
        </div>

        {/* Halcyon-inspired Collection Filter Tabs */}
        <div className="collection-tabs-bar" role="tablist" aria-label="Product family collections">
          {COLLECTION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`collection-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && tab.id !== 'all' ? (
                <span className="collection-tab-count">{filteredProducts.length}</span>
              ) : null}
            </button>
          ))}
        </div>

        <div
          className="carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="carousel-track" ref={track} onScroll={updateProgress}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="carousel-progress" aria-hidden="true">
            <span style={{ width: `${progress.size * 100}%`, marginLeft: `${progress.start * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
