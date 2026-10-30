'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import Icon from '@/components/ui/Icon'

interface SearchResult {
  name: string
  slug: string
  category: string
  sku: string
}

function useProductSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch {
        setResults([])
      }
    }, 180)
    return () => clearTimeout(timer)
  }, [query])

  return results
}

function SearchPanel({ autoFocus, onPick }: { autoFocus?: boolean; onPick?: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const results = useProductSearch(query)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) setFocused(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      e.preventDefault()
      onPick?.()
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const showResults = focused && query.trim().length > 0

  return (
    <div className="search-box" ref={boxRef}>
      <label className="search-field">
        <Icon name="search" />
        <input
          type="search"
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          placeholder="Search by product, wattage or SKU, e.g. 150W high bay"
          aria-label="Search products"
        />
        {autoFocus ? <kbd>ESC</kbd> : null}
      </label>

      {showResults ? (
        <div className="search-results" role="listbox">
          {results.length ? (
            <>
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/products/${result.slug}`}
                  onClick={() => {
                    setQuery('')
                    onPick?.()
                  }}
                >
                  <strong>{result.name}</strong>
                  <span>
                    {result.category}
                    {result.sku ? ` · ${result.sku}` : ''}
                  </span>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={() => {
                  setQuery('')
                  onPick?.()
                }}
                style={{
                  display: 'block',
                  padding: '10px 14px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: 'var(--brand)',
                  background: 'var(--bg-soft)',
                  borderTop: '1px solid var(--line)',
                  textAlign: 'center',
                }}
              >
                View all results for &ldquo;{query.trim()}&rdquo; &rarr;
              </Link>
            </>
          ) : query.trim().length >= 2 ? (
            <div className="search-empty">No products match &ldquo;{query}&rdquo;. Call us and we can likely source it.</div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default function SearchBar({ variant = 'icon' }: { variant?: 'icon' | 'inline' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (variant !== 'icon') return
    const handler = (event: KeyboardEvent) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '')
      if (event.key === '/' && !typing) {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [variant])

  if (variant === 'inline') return <SearchPanel />

  return (
    <>
      <button type="button" className="icon-btn" aria-label="Search products (press /)" onClick={() => setOpen(true)}>
        <Icon name="search" />
      </button>
      {open ? (
        <div className="search-overlay" onClick={() => setOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <SearchPanel autoFocus onPick={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  )
}
