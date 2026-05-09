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
        { protocol: 'https', hostname: 'ledsion.com' },
        { protocol: 'https', hostname: 'res.cloudinary.com' },
      ],
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    },
    // Faster page loads
    poweredByHeader: false,
    compress: true,
    reactStrictMode: true,
  }
}

export default nextConfig
