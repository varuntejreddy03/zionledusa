'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface SearchResult {
  name: string
  slug: string
  category: string
  sku: string
}

export default function SearchBar() {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
        setOpen(data.results?.length > 0)
      } catch { setResults([]); setOpen(false) }
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setExpanded(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus()
  }, [expanded])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !expanded && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        setExpanded(true)
      }
      if (e.key === 'Escape') { setExpanded(false); setOpen(false); setQuery('') }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [expanded])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Search products (press /)" 
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted)',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      ) : (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998, background: 'rgba(0,0,0,0.5)' }} onClick={() => { setExpanded(false); setQuery(''); setOpen(false) }}>
          <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(6,12,26,0.98)',
              border: '1px solid var(--blue-bright, #0d7fd4)',
              borderRadius: '12px',
              padding: '8px 16px',
              gap: '10px',
              boxShadow: '0 4px 30px rgba(13,127,212,0.3)',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1rem',
                  width: '100%',
                  outline: 'none',
                  padding: '8px 0',
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); inputRef.current?.focus() }}
                  style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
                >
                  ×
                </button>
              )}
              <kbd style={{ fontSize: '0.65rem', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 5px' }}>ESC</kbd>
            </div>

            {results.length > 0 && (
              <div style={{
                marginTop: '8px',
                background: 'rgba(6,12,26,0.98)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}>
                {results.map(r => (
                  <Link
                    key={r.slug}
                    href={`/products/${r.slug}`}
                    onClick={() => { setOpen(false); setExpanded(false); setQuery('') }}
                    style={{
                      display: 'block',
                      padding: '12px 16px',
                      color: '#fff',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,127,212,0.1)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{r.name}</div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '3px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{r.category}</span>
                      {r.sku && <span style={{ fontSize: '0.75rem', color: 'rgba(13,127,212,0.8)' }}>SKU: {r.sku}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div style={{
                marginTop: '8px',
                background: 'rgba(6,12,26,0.98)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                color: 'var(--muted)',
                fontSize: '0.9rem',
              }}>
                No products found for &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
