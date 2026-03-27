import { getTickerItems } from '@/lib/data'

interface TickerProps {
  items?: string[]
}

export default function Ticker({ items = getTickerItems() }: TickerProps) {
  const marqueeItems = [...items, ...items]

  return (
    <div className="ticker-strip" aria-label="Featured product categories">
      <div className="ticker-track">
        {marqueeItems.map((item, index) => (
          <span key={`${item}-${index}`} className="ticker-item">
            <span className="ticker-mark" aria-hidden="true">
              ⚡
            </span>
            <span>{item}</span>
            <span className="ticker-separator" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  )
}
