import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  return {
    distDir: isDev ? '.next-dev' : '.next',
    devIndicators: false,
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'zionledusa.com' },
        { protocol: 'https', hostname: '*.zionledusa.com' },
        { protocol: 'http', hostname: 'zionledusa.com' },
        { protocol: 'https', hostname: 'res.cloudinary.com' },
      ],
      unoptimized: false,
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
  }
}

export default nextConfig
