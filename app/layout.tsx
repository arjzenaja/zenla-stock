import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import './globals.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Zenla Stock | Inventory Harmony',
  description: 'Premium inventory management for modern businesses.',
}

import QueryProvider from '@/components/shared/QueryProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("scroll-smooth", plusJakartaSans.variable, jetbrainsMono.variable)}>
      <body className="font-sans antialiased bg-brand-bg text-slate-900 min-h-screen">
        <SessionProvider>
          <QueryProvider>
            <TooltipProvider>
              <Toaster 
                position="top-right" 
                richColors 
                closeButton 
                toastOptions={{
                  className: 'rounded-xl shadow-card-md border-slate-100',
                }}
              />
              {children}
            </TooltipProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
