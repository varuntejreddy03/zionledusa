'use client'

import TechCanvas from '@/components/effects/TechCanvas'

interface CTARingsCanvasProps {
  className?: string
}

export default function CTARingsCanvas({ className }: CTARingsCanvasProps) {
  return <TechCanvas className={className} variant="rings" />
}
