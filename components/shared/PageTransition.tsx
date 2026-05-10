'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname()

  return (
    <div key={pathname} className="animate-fade-in">
      {children}
    </div>
  )
}
