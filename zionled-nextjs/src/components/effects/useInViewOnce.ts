'use client'

import { useEffect, useRef, useState } from 'react'

export function useInViewOnce<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node || isInView) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return
        }

        setIsInView(true)
        observer.disconnect()
      },
      { threshold },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [isInView, threshold])

  return { ref, isInView }
}
