'use client'

import React from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  LogOut, 
  User as UserIcon, 
  Settings 
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUIStore } from '@/store/useUIStore'
import { useSession, signOut } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { MobileSidebar } from './MobileSidebar'

export const Header: React.FC = () => {
  const pathname = usePathname()
  const { toggleSidebar } = useUIStore()
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()

  const logout = () => {
    // Clear semua cache React Query sebelum logout
    // supaya data user lama tidak bocor ke akun berikutnya
    queryClient.clear()
    signOut({ callbackUrl: '/login' })
  }

  const getPageTitle = () => {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return 'Dashboard'
    
    // Custom handling for specific routes
    if (segments[0] === 'inventory' && segments.length === 2 && segments[1] !== 'add') {
      return 'Product Details'
    }
    if (segments[0] === 'inventory' && segments.length === 3 && segments[2] === 'edit') {
      return 'Edit Product'
    }

    const lastSegment = segments[segments.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ')
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <MobileSidebar />

        {/* Desktop Sidebar Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="hidden md:flex text-slate-500 hover:text-brand hover:bg-brand-muted"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Page Title / Breadcrumb */}
        <h1 className="text-lg font-bold text-slate-900 md:ml-2">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Actions */}
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-brand hover:bg-brand-muted">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-brand hover:bg-brand-muted relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 h-9 w-9 rounded-full focus-visible:ring-brand">
              <Avatar className="h-9 w-9 border border-slate-100 shadow-sm transition-transform active:scale-95">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback className="bg-brand-muted text-brand font-bold text-xs">
                  {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl p-2 shadow-card-md border-slate-100">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || 'Store Owner'}</p>
                <p className="text-xs text-slate-500 leading-none truncate">{user?.email || 'admin@zenla.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="rounded-lg p-2 focus:bg-brand-muted focus:text-brand cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg p-2 focus:bg-brand-muted focus:text-brand cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem 
              onClick={logout}
              className="rounded-lg p-2 focus:bg-red-50 focus:text-red-600 cursor-pointer text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
