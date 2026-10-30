'use client'

import { useState } from 'react'

import Icon from '@/components/ui/Icon'
import { APPLICATION_OPTIONS } from '@/lib/applicationsData'

export default function QuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'warehouses-distribution',
    fixtureList: '',
    fileName: '',
    website: '', // honeypot
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFormData((prev) => ({ ...prev, fileName: file ? file.name : '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit quote request.')
      }

      setSuccess(data.message || 'Quote request received! Our project desk will contact you within 24 hours.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please call (817) 938-2959 directly.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="quote-success-card">
        <span className="trust-icon" style={{ width: 48, height: 48, margin: '0 auto 16px' }}>
          <Icon name="check" size={24} />
        </span>
        <h2>Quote Request Submitted</h2>
        <p style={{ marginTop: 12, color: 'var(--ink-2)' }}>{success}</p>
        <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--ink-3)' }}>
          Need urgent fixture availability or same-day dispatch? Call our Dallas desk at{' '}
          <a href="tel:+18179382959" style={{ color: 'var(--brand)', fontWeight: 600 }}>
            (817) 938-2959
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setSuccess(null)
            setFormData({
              name: '',
              company: '',
              email: '',
              phone: '',
              projectType: 'warehouses-distribution',
              fixtureList: '',
              fileName: '',
              website: '',
            })
          }}
          className="btn btn--ghost"
          style={{ marginTop: 24 }}
        >
          Submit another request
        </button>
      </div>
    )
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      {error ? (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      ) : null}

      {/* Honeypot field (hidden from real users) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label htmlFor="quote-website-input">Leave this field blank</label>
        <input
          id="quote-website-input"
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-row form-row--2col">
        <div className="form-field">
          <label htmlFor="quote-name">
            Full Name <span className="req">*</span>
          </label>
          <input
            id="quote-name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="form-field">
          <label htmlFor="quote-company">Company / Contractor Name</label>
          <input
            id="quote-company"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Lone Star Electric"
          />
        </div>
      </div>

      <div className="form-row form-row--2col">
        <div className="form-field">
          <label htmlFor="quote-email">
            Email Address <span className="req">*</span>
          </label>
          <input
            id="quote-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>

        <div className="form-field">
          <label htmlFor="quote-phone">
            Phone Number <span className="req">*</span>
          </label>
          <input
            id="quote-phone"
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(817) 555-0199"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="quote-project-type">Project / Facility Type</label>
        <select
          id="quote-project-type"
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
        >
          {APPLICATION_OPTIONS.map((app) => (
            <option key={app.slug} value={app.slug}>
              {app.title}
            </option>
          ))}
          <option value="other">Other / Mixed Commercial</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="quote-fixture-list">
          Fixture Schedule &amp; Project Requirements <span className="req">*</span>
        </label>
        <textarea
          id="quote-fixture-list"
          name="fixtureList"
          rows={5}
          required
          value={formData.fixtureList}
          onChange={handleChange}
          placeholder="List fixture wattages, mounting heights, target foot-candles, or paste your lighting schedule here (e.g. 24x 150W UFO High Bays, 12x 100W Wall Packs)..."
        />
      </div>

      <div className="form-field">
        <label htmlFor="quote-file">Attach Plan, Takeoff, or Spec Sheet (Optional)</label>
        <div className="file-input-wrapper">
          <input
            id="quote-file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.dwg,.csv,.xlsx"
            onChange={handleFileChange}
          />
          {formData.fileName ? (
            <span className="file-selected-text">Selected: {formData.fileName}</span>
          ) : (
            <span className="file-hint">PDF, DWG, Excel or Image (max 25MB)</span>
          )}
        </div>
      </div>

      <div className="form-submit-row">
        <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request for Quote'} {!loading ? <Icon name="arrow" size={16} /> : null}
        </button>
        <span className="form-privacy-note">
          No spam guarantee. Your details are reviewed solely by our Dallas lighting team.
        </span>
      </div>
    </form>
  )
}
