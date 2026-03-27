import Link from 'next/link'
import type { CSSProperties } from 'react'

type CategoryBadgeType = 'primary' | 'secondary' | 'pole'

interface CategoryBadgeProps {
  name: string
  type: CategoryBadgeType
  href?: string
  className?: string
}

const BASE_STYLE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '2rem',
  padding: '0.35rem 0.78rem',
  borderRadius: '100px',
  border: '1px solid transparent',
  fontFamily: 'var(--font-head), sans-serif',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  lineHeight: 1,
  textTransform: 'uppercase',
  transition: 'border-color 200ms ease, color 200ms ease, background 200ms ease, box-shadow 200ms ease',
  whiteSpace: 'nowrap',
}

const STYLES: Record<CategoryBadgeType, CSSProperties> = {
  primary: {
    background: 'rgba(13,127,212,0.15)',
    borderColor: 'rgba(13,127,212,0.25)',
    color: 'var(--blue-glow)',
  },
  secondary: {
    background: 'rgba(13,127,212,0.08)',
    borderColor: 'rgba(13,127,212,0.15)',
    color: 'var(--muted)',
  },
  pole: {
    background: 'rgba(240,165,0,0.10)',
    borderColor: 'rgba(240,165,0,0.22)',
    color: 'var(--gold)',
  },
}

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ')
}

export default function CategoryBadge({ name, type, href, className }: CategoryBadgeProps) {
  const style = {
    ...BASE_STYLE,
    ...STYLES[type],
  }

  if (!href) {
    return (
      <span className={className} style={style}>
        {name}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={joinClassNames('category-badge-link', className)}
      style={style}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = 'var(--border-glow)'
        event.currentTarget.style.color = 'var(--off-white)'
        event.currentTarget.style.boxShadow = '0 0 12px rgba(13,127,212,0.18)'
      }}
      onMouseLeave={(event) => {
        const target = event.currentTarget
        const variantStyle = STYLES[type]

        target.style.borderColor = String(variantStyle.borderColor)
        target.style.color = String(variantStyle.color)
        target.style.boxShadow = 'none'
      }}
    >
      {name}
    </Link>
  )
}
