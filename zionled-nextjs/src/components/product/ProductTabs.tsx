'use client'

import type { Product } from '@/types/product'

interface ProductTabsProps {
  product: Product
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <div style={{ marginTop: '3rem' }}>
      <div className="product-tabs-bar" style={{ display: 'flex', borderBottom: '2px solid var(--border)', overflowX: 'auto' }}>
        <button
          type="button"
          className="product-tab-button is-active"
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
            color: 'var(--blue-bright)',
            borderBottom: '2px solid var(--blue-bright)',
            marginBottom: '-2px',
            whiteSpace: 'nowrap',
          }}
        >
          Spec Sheet
        </button>
      </div>

      <div className="product-tabs-panel" style={{ padding: '2rem 0' }}>
        <div style={{ padding: '2rem', color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 300, fontStyle: 'italic' }}>
          Spec sheet will be available soon.
        </div>
      </div>
    </div>
  )
}
