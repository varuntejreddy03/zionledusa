'use client'

import { useMemo, useState } from 'react'

import { parseSpecsFromText } from '@/lib/parseSpecs'
import type { Product } from '@/types/product'

interface ProductTabsProps {
  product: Product
}

function stripHtml(text: string) {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|ul|ol)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildParagraphs(text: string) {
  const normalized = stripHtml(text)
  if (!normalized) {
    return []
  }

  const rawParagraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  if (rawParagraphs.length > 1) {
    return rawParagraphs
  }

  const sentences = normalized.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean)
  if (sentences.length <= 2) {
    return [normalized]
  }

  const grouped: string[] = []
  for (let index = 0; index < sentences.length; index += 2) {
    grouped.push(sentences.slice(index, index + 2).join(' ').trim())
  }

  return grouped
}

function formatSpecKey(key: string) {
  const cleaned = key.replace(/[_-]+/g, ' ').trim()
  if (!cleaned) return '-'
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

function normalizeAttributeSpecs(product: Product) {
  return Object.entries(product.attributes || {}).map(([key, value]) => ({
    key: formatSpecKey(key),
    value: Array.isArray(value) ? value.join(', ') : String(value),
  }))
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc')

  const descriptionParagraphs = useMemo(() => buildParagraphs(product.description || product.short_desc || ''), [product.description, product.short_desc])
  const attributeSpecs = useMemo(() => normalizeAttributeSpecs(product), [product])
  const parsedSpecs = useMemo(() => parseSpecsFromText(product.short_desc || product.description || ''), [product.short_desc, product.description])
  const tabSpecs = attributeSpecs.length > 0 ? attributeSpecs : parsedSpecs.map((spec) => ({ key: formatSpecKey(spec.key), value: spec.value }))

  const tabs = [
    { id: 'desc', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
  ] as const

  return (
    <div style={{ marginTop: '3rem' }}>
      <div className="product-tabs-bar" style={{ display: 'flex', borderBottom: '2px solid var(--border)', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`product-tab-button ${activeTab === tab.id ? 'is-active' : ''}`}
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: '0.88rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              padding: '0.9rem 2rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === tab.id ? 'var(--blue-bright)' : 'var(--muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--blue-bright)' : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="product-tabs-panel" style={{ padding: '2rem 0', animation: 'fadeIn 0.25s ease' }}>
        {activeTab === 'desc' ? (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--muted)',
              lineHeight: 1.85,
              fontWeight: 300,
              maxWidth: 860,
            }}
          >
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`} style={{ margin: '0 0 1.2rem' }}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p style={{ margin: 0 }}>Product details are available on request.</p>
            )}
          </div>
        ) : (
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--border)',
              maxWidth: 760,
            }}
          >
            {tabSpecs.length > 0 ? (
              tabSpecs.map((spec, index) => (
                <div
                  key={`${spec.key}-${spec.value}-${index}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '35% 65%',
                    padding: '0.75rem 1.2rem',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(13,127,212,0.04)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: '0.82rem',
                      color: 'var(--muted)',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {spec.key || '-'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'var(--off-white)',
                      fontWeight: 300,
                    }}
                  >
                    {spec.value}
                  </span>
                </div>
              ))
            ) : (
              <p
                style={{
                  padding: '2rem',
                  margin: 0,
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                }}
              >
                No specifications available.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
