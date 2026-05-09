'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getProductImageSrc } from '@/lib/catalog'
import { BLUR_DATA_URL } from '@/lib/ui'
import type { ProductImage } from '@/types/product'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages = useMemo(
    () =>
      images
        .map((image, index) => ({
          key: `${image.url || image.original || image.webp || index}-${index}`,
          src: getProductImageSrc(image),
          alt: image.alt || `${productName} view ${index + 1}`,
        }))
        .filter((image): image is { key: string; src: string; alt: string } => Boolean(image.src)),
    [images, productName],
  )

  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [zooming, setZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setActive(0) }, [galleryImages.length])
  useEffect(() => { setLoaded(false) }, [active])

  useEffect(() => {
    if (galleryImages.length === 0) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setActive(i => (i + 1) % galleryImages.length)
      if (e.key === 'ArrowLeft') setActive(i => (i - 1 + galleryImages.length) % galleryImages.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [galleryImages.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const currentImage = galleryImages[active] || galleryImages[0]

  if (!currentImage) {
    return (
      <div className="gallery-sticky product-gallery-shell">
        <div
          className="product-gallery-main product-gallery-empty"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--muted)',
            fontFamily: 'var(--font-head)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Image unavailable
        </div>
      </div>
    )
  }

  return (
    <div className="gallery-sticky product-gallery-shell">
      <div
        ref={containerRef}
        className="product-gallery-main"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'crosshair',
        }}
      >
        {/* Normal image */}
        <Image
          key={currentImage.key}
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          priority={active === 0}
          loading={active === 0 ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="(max-width: 768px) 100vw, 45vw"
          onLoad={() => setLoaded(true)}
          style={{
            objectFit: 'contain',
            padding: '2rem',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}
        />

        {/* Zoom overlay - follows mouse */}
        {zooming && loaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentImage.src})`,
              backgroundSize: '250%',
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundRepeat: 'no-repeat',
              opacity: 1,
              zIndex: 10,
              borderRadius: '16px',
            }}
          />
        )}
      </div>

      {galleryImages.length > 1 && (
        <div
          className="product-thumb-strip"
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '16px',
            overflowX: 'auto',
            paddingBottom: '2px',
          }}
        >
          {galleryImages.map((image, index) => (
            <button
              key={image.key}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${productName} image ${index + 1}`}
              style={{
                width: 80,
                height: 80,
                flexShrink: 0,
                position: 'relative',
                background: 'var(--bg-card)',
                border: `2px solid ${index === active ? 'var(--blue-bright)' : 'transparent'}`,
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                boxShadow: index === active ? '0 0 12px rgba(13,127,212,0.4)' : 'none',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="80px"
                style={{ objectFit: 'contain', padding: '4px' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
