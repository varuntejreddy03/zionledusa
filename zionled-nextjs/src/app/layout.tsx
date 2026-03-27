import type { Metadata } from 'next'
import { Exo_2, Rajdhani } from 'next/font/google'

import GlobalEffects from '@/components/effects/GlobalEffects'

import './globals.css'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-head',
  display: 'swap',
  preload: true,
})

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${exo2.variable}`}>
      <body>
        <GlobalEffects />
        <div className="site-root">{children}</div>
      </body>
    </html>
  )
}
