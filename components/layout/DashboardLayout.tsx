'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { PageTransition } from '@/components/shared/PageTransition'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans">
      {/* Desktop/Tablet Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#F0F7F2] relative scroll-smooth">
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  )
}
