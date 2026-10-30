import type { Testimonial } from '@/types/product'

export default function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="section">
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">Customer Trust</span>
            <h2>Tested on Commercial Job Sites</h2>
          </div>
        </div>
        <div className="quotes">
          {testimonials.map((item) => (
            <figure key={item.name} className="quote" style={{ margin: 0 }}>
              <span className="quote-stars" aria-label="5 out of 5">
                ★★★★★
              </span>
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <footer>
                <span className="avatar">{item.initials}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </div>
              </footer>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
