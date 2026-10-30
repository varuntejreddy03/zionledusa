import Image from 'next/image'
import Link from 'next/link'

export interface PageHeaderBreadcrumb {
  label: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs?: PageHeaderBreadcrumb[]
  eyebrow?: string
  title: string
  intro?: string
  image?: string | null
  imagePriority?: boolean
  imageSizes?: string
}

export default function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  intro,
  image,
  imagePriority = false,
  imageSizes = '260px',
}: PageHeaderProps) {
  return (
    <header className="page-head">
      <div className="shell">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="crumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`} style={{ display: 'contents' }}>
                {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
                {index < breadcrumbs.length - 1 ? <span aria-hidden="true">/</span> : null}
              </span>
            ))}
          </nav>
        ) : null}

        <div className={`page-head-grid ${!image ? 'page-head-grid--no-media' : ''}`}>
          <div>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h1>{title}</h1>
            {intro ? <p>{intro}</p> : null}
          </div>
          {image ? (
            <div className="page-head-media">
              <Image src={image} alt="" fill priority={imagePriority} sizes={imageSizes} />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
