'use client'

import React, { useState } from 'react'
import Link from 'next/navigation'
import { Menu, X, Home, Package, BarChart2, User as UserIcon } from 'lucide-react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { AppLogo } from '@/components/shared/AppLogo'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Reports', href: '/reports', icon: BarChart2 },
  { label: 'Profile', href: '/profile', icon: UserIcon },
]

export const MobileSidebar: React.FC = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-slate-500">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] border-none shadow-2xl">
        <div className="flex flex-col h-full bg-white">
          <SheetHeader className="h-16 flex flex-row items-center justify-between px-6 border-b border-slate-100">
            <AppLogo />
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-slate-400">
              <X className="w-5 h-5" />
            </Button>
          </SheetHeader>
          
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    window.location.href = item.href
                    setOpen(false)
                  }}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200',
                    active 
                      ? 'bg-brand text-white font-semibold shadow-md shadow-brand/20' 
                      : 'text-slate-500 hover:bg-slate-50'
                  )}
                >
                  <item.icon className={cn(
                    'w-5 h-5',
                    active ? 'text-white' : 'text-slate-400'
                  )} />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>

          <div className="p-6 mt-auto border-t border-slate-100 bg-slate-50/50">
            <div className="bg-brand-muted/50 rounded-xl p-4 border border-brand-border">
              <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Support</p>
              <p className="text-sm text-slate-600 mb-3">Need help with your inventory?</p>
              <Button size="sm" className="w-full bg-brand hover:bg-brand-light text-white text-xs">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
