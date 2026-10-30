import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'

import './globals.css'

const head = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-head',
  display: 'swap',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ZION LED USA - Premium LED Lighting Solutions',
    template: '%s | ZION LED USA',
  },
  description: 'High-performance LED lighting for commercial and industrial applications with fast nationwide shipping.',
  openGraph: {
    siteName: 'ZION LED USA',
    type: 'website',
    locale: 'en_US',
  },
  metadataBase: new URL('https://zionledusa.com'),
  alternates: { canonical: '/' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
