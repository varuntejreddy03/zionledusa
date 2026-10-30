import { NextRequest, NextResponse } from 'next/server'

interface QuotePayload {
  name?: string
  company?: string
  email?: string
  phone?: string
  projectType?: string
  fixtureList?: string
  fileName?: string
  website?: string // Honeypot field
}

export async function POST(request: NextRequest) {
  try {
    const data: QuotePayload = await request.json()

    // 1. Honeypot check: If the hidden 'website' field is filled, silently ignore spam bot
    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: 'Quote submitted successfully' })
    }

    // 2. Validate required fields
    const name = (data.name || '').trim()
    const email = (data.email || '').trim()
    const phone = (data.phone || '').trim()
    const fixtureList = (data.fixtureList || '').trim()
    const projectType = (data.projectType || '').trim()
    const company = (data.company || '').trim()
    const fileName = (data.fileName || '').trim()

    if (!name) {
      return NextResponse.json({ ok: false, error: 'Full name is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ ok: false, error: 'A valid email address is required.' }, { status: 400 })
    }

    if (!phone || phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ ok: false, error: 'A valid phone number is required.' }, { status: 400 })
    }

    if (!fixtureList || fixtureList.length < 5) {
      return NextResponse.json(
        { ok: false, error: 'Please enter details about your fixture list or lighting requirements.' },
        { status: 400 },
      )
    }

    // TODO: Connect email dispatch provider here (e.g., SendGrid, Postmark, AWS SES, or Resend)
    // Example:
    // await sendQuoteEmail({
    //   to: 'contact@zionledusa.com',
    //   subject: `New Commercial Quote Request: ${name} (${company || 'Individual'})`,
    //   details: { name, company, email, phone, projectType, fixtureList, fileName },
    // })

    return NextResponse.json({
      ok: true,
      message: 'Thank you! Your quote request has been received. Our Dallas team will respond within 24 hours.',
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'An unexpected error occurred. Please try again or call us directly.' }, { status: 500 })
  }
}
