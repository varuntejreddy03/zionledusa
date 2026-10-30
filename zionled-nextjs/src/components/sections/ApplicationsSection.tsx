import Image from 'next/image'
import Link from 'next/link'

import type { ImageTile } from '@/components/sections/HeroSection'
import Icon from '@/components/ui/Icon'

export default function ApplicationsSection({ tiles }: { tiles: ImageTile[] }) {
  return (
    <section id="applications" className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">Shop by application</span>
            <h2>What are you lighting?</h2>
            <p>Start with the space. We&apos;ll point you to the fixtures contractors and facility teams use for it.</p>
          </div>
          <Link href="/quote" className="text-link">
            Not sure? Ask an expert <Icon name="arrow" size={16} />
          </Link>
        </div>

        <div className="app-grid">
          {tiles.map((tile, index) => (
            <Link key={tile.title} href={tile.href} className="app-card">
              <div className="app-media">
                <span className="app-num">{String(index + 1).padStart(2, '0')}</span>
                {tile.image ? <Image src={tile.image} alt={tile.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1180px) 50vw, 300px" /> : null}
              </div>
              <div className="app-body">
                <h3>{tile.title}</h3>
                <p>{tile.text}</p>
                <span className="text-link">
                  See fixtures <Icon name="arrow" size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
