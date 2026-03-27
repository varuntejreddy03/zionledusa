'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

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
  const [lightbox, setLightbox] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setActive(0)
  }, [galleryImages.length])

  useEffect(() => {
    setLoaded(false)
  }, [active])

  useEffect(() => {
    if (galleryImages.length === 0) {
      return
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setActive((index) => (index + 1) % galleryImages.length)
      }

      if (event.key === 'ArrowLeft') {
        setActive((index) => (index - 1 + galleryImages.length) % galleryImages.length)
      }

      if (event.key === 'Escape') {
        setLightbox(false)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [galleryImages.length])

  useEffect(() => {
    if (!lightbox) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [lightbox])

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
        className="product-gallery-main"
        onClick={() => setLightbox(true)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'zoom-in',
        }}
      >
        <Image
          key={currentImage.key}
          src={currentImage.src}
          alt={currentImage.alt}
          fill
          priority
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          sizes="(max-width: 768px) 100vw, 45vw"
          onLoad={() => setLoaded(true)}
          style={{
            objectFit: 'contain',
            padding: '2rem',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        <button
          type="button"
          aria-label="Open image gallery"
          className="product-gallery-zoom"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(6,12,26,0.85)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          +
        </button>
      </div>

      {galleryImages.length > 1 ? (
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
                transition: 'border-color 0.2s ease, transform 0.15s ease',
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
      ) : null}

      {lightbox ? (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} image gallery`}
            className="product-lightbox-dialog"
            style={{
              position: 'relative',
              width: '90vw',
              height: '90vh',
              maxWidth: 900,
            }}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              sizes="90vw"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => setLightbox(false)}
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            x
          </button>

          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation()
                  setActive((index) => (index - 1 + galleryImages.length) % galleryImages.length)
                }}
                className="product-lightbox-arrow product-lightbox-arrow--left"
              >
                &lt;
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation()
                  setActive((index) => (index + 1) % galleryImages.length)
                }}
                className="product-lightbox-arrow product-lightbox-arrow--right"
              >
                &gt;
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
