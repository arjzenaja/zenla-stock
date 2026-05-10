'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Package, 
  BarChart2, 
  User, 
  Tag,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppLogo } from '@/components/shared/AppLogo'
import { useUIStore } from '@/store/useUIStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Inventory', href: '/inventory', icon: Package },
  { label: 'Categories', href: '/categories', icon: Tag },
  { label: 'Reports', href: '/reports', icon: BarChart2 },
  { label: 'Profile', href: '/profile', icon: User },
]

export const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { sidebarOpen } = useUIStore()
  const { data: session } = useSession()
  const user = session?.user

  const isActive = (href: string) => {
    if (href === '/' && pathname !== '/') return false
    return pathname.startsWith(href)
  }

  return (
    <aside 
      className={cn(
        'hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out z-50',
        sidebarOpen ? 'w-[240px]' : 'w-[80px]'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <AppLogo showText={sidebarOpen} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Tooltip key={item.href} disableHoverableContent={sidebarOpen}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                      active 
                        ? 'bg-brand-muted text-brand font-semibold border-l-4 border-brand rounded-l-none -ml-4 pl-4' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 min-w-[20px]',
                      active ? 'text-brand' : 'text-slate-400 group-hover:text-slate-600'
                    )} />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {!sidebarOpen && (
                  <TooltipContent side="right" className="bg-slate-900 text-white border-none">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </nav>

      {/* User Mini Card */}
      <div className="p-4 border-t border-slate-100">
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-xl bg-slate-50',
          !sidebarOpen && 'justify-center bg-transparent p-0'
        )}>
          <Avatar className="w-9 h-9 border border-white shadow-sm">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback className="bg-brand-muted text-brand font-bold text-xs">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
          
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Store Owner'}</p>
              <Badge variant="secondary" className="bg-brand-muted text-brand border-none text-[10px] h-4 px-1.5 font-bold uppercase tracking-wider">
                {(user as any)?.plan || 'FREE'} PLAN
              </Badge>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
