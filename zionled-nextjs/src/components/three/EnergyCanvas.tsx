'use client'

import TechCanvas from '@/components/effects/TechCanvas'

interface EnergyCanvasProps {
  className?: string
}

export default function EnergyCanvas({ className }: EnergyCanvasProps) {
  return <TechCanvas className={className} variant="ambient" />
}
