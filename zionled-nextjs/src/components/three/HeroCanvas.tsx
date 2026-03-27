'use client'

import TechCanvas from '@/components/effects/TechCanvas'

interface HeroCanvasProps {
  className?: string
}

export default function HeroCanvas({ className }: HeroCanvasProps) {
  return <TechCanvas className={className} variant="hero" />
}
