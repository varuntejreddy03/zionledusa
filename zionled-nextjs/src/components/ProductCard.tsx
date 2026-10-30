import Image from 'next/image'
import Link from 'next/link'

import Icon from '@/components/ui/Icon'
import { getProductImageSrc } from '@/lib/catalog'
import type { Product } from '@/types/product'

// Pull the specs buyers scan for (wattage, CCT, voltage) straight out of the product name.
export function getSpecChips(name: string) {
  const kelvins = name.match(/\b\d{4}K\b/gi)
  const cct = kelvins
    ? kelvins.length > 2
      ? `${kelvins[0]}–${kelvins[kelvins.length - 1]}`
      : kelvins.join('/')
    : name.match(/\b\d\s*CCT\b/i)?.[0].replace(/\s+/, ' ')

  return [
    name.match(/\b\d+(?:\s*[/&-]\s*\d+)*\s*W(?:atts?)?\b/i)?.[0].replace(/\s+/g, ''),
    cct,
    name.match(/\b\d{3}\s*[-~–]\s*\d{3}\s*V\b/i)?.[0].replace(/\s+/g, '').replace('~', '–'),
  ].filter((chip): chip is string => Boolean(chip))
}

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const src = getProductImageSrc(product)
  const chips = getSpecChips(product.name)

  return (
    <Link href={`/products/${product.slug}`} className="pcard">
      <div className="pcard-media">
        <span className="pcard-badge">DLC &amp; UL Spec</span>
        {src ? (
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 300px"
            priority={priority}
          />
        ) : null}
      </div>
      <div className="pcard-body">
        <span className="pcard-cat">{product.categories[0]?.name || 'Commercial LED'}</span>
        <h3 className="pcard-title">{product.name}</h3>
        {chips.length ? (
          <div className="chips">
            {chips.map((chip, idx) => (
              <span key={chip} className={`chip ${idx === 0 ? 'chip--highlight' : ''}`}>
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        <div className="pcard-foot">
          <span className="pcard-sku">{product.sku ? `SKU: ${product.sku}` : 'Spec-Grade'}</span>
          <span className="text-link">
            Specs &amp; IES <Icon name="arrow" size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}
