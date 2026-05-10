import React from 'react'
import { AppLogo } from '@/components/shared/AppLogo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F0F7F2] flex flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md mb-8 flex justify-start">
        <AppLogo />
      </div>
      
      <main className="w-full max-w-md">
        {children}
      </main>
      
      <footer className="mt-8 text-center">
        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
          © 2026 Zenla Stock Management • Security Verified
        </p>
      </footer>
    </div>
  )
}
