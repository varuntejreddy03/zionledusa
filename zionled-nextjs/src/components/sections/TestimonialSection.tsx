import type { Testimonial } from '@/types/product'

interface TestimonialSectionProps {
  testimonials: Testimonial[]
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  return (
    <section className="testimonials-section">
      <div className="site-shell">
        <div className="section-heading reveal">
          <div className="s-label">Client Feedback</div>
          <h2 className="section-title">
            WHAT CLIENTS <span className="text-accent-blue">REMEMBER</span>
          </h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="testimonial-card reveal">
              <div className="testimonial-rating">5 / 5</div>
              <p className="testimonial-quote">{testimonial.quote}</p>
              <div className="testimonial-person">
                <div className="testimonial-avatar">{testimonial.initials}</div>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
