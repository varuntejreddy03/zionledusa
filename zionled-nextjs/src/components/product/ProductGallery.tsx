'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import { getProductImageSrc } from '@/lib/catalog'
import type { ProductImage } from '@/types/product'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const gallery = useMemo(
    () =>
      images
        .map((image, index) => ({ src: getProductImageSrc(image), alt: image.alt || `${productName} view ${index + 1}` }))
        .filter((image): image is { src: string; alt: string } => Boolean(image.src)),
    [images, productName],
  )
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (gallery.length < 2) return
    const onKey = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '')) return
      if (event.key === 'ArrowRight') setActive((i) => (i + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setActive((i) => (i - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gallery.length])

  const current = gallery[active] ?? gallery[0]

  return (
    <div className="gallery">
      <div
        className="gallery-main"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          setZoom({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {current ? (
          <Image key={current.src} src={current.src} alt={current.alt} fill priority sizes="(max-width: 960px) 100vw, 640px" />
        ) : (
          <div className="empty" style={{ border: 0 }}>
            Image coming soon
          </div>
        )}
        {current && zoom ? (
          <div
            className="gallery-zoom"
            aria-hidden="true"
            style={{ backgroundImage: `url(${current.src})`, backgroundPosition: `${zoom.x}% ${zoom.y}%` }}
          />
        ) : null}
        {gallery.length > 1 ? (
          <span className="gallery-count">
            {active + 1} / {gallery.length}
          </span>
        ) : null}
      </div>

      {gallery.length > 1 ? (
        <div className="gallery-thumbs">
          {gallery.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`gallery-thumb ${index === active ? 'is-active' : ''}`}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Image src={image.src} alt="" fill sizes="78px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
