'use client'

import React from 'react'
import { 
  MapPin, 
  Pencil, 
  Bell, 
  Globe, 
  Moon, 
  HelpCircle, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Store
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useSession, signOut } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { useDashboardStats } from '@/hooks/useDashboard'

export default function ProfilePage() {
  const { data: session } = useSession()
  const { data: stats } = useDashboardStats()
  const user = session?.user
  const queryClient = useQueryClient()

  const handleLogout = () => {
    queryClient.clear()
    signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-card p-6 md:p-8 border border-slate-50 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0">
            <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-md rounded-2xl">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-brand-muted text-brand text-3xl font-black">
                {user?.name?.substring(0, 2).toUpperCase() || 'US'}
              </AvatarFallback>
            </Avatar>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand text-white rounded-xl flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user?.name || 'Store Owner'}</h2>
              <Badge className="bg-brand-muted text-brand border-none font-black text-[10px] tracking-widest px-3 py-1 uppercase self-center sm:self-auto">
                {(user as any)?.plan || 'FREE'} PLAN
              </Badge>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 font-medium">
              <Store className="w-4 h-4" />
              <span>{(user as any)?.storeName || 'Zenla Store'}</span>
            </div>
            <p className="text-slate-400 text-sm font-mono tracking-tight">{user?.email}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-50 font-mono">
          <div className="text-center space-y-1">
            <p className="text-xl font-black text-brand tracking-tight">{stats?.totalProducts || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKUs</p>
          </div>
          <div className="text-center space-y-1 border-x border-slate-50">
            <p className="text-xl font-black text-amber-500 tracking-tight">{stats?.lowStockCount || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alerts</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-xl font-black text-brand tracking-tight">100%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2">Account Settings</h3>
        
        <div className="bg-white rounded-3xl shadow-card overflow-hidden border border-slate-50">
          <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 bg-brand-muted rounded-xl flex items-center justify-center text-brand">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors">Notifications</p>
              <p className="text-xs text-slate-400">Alerts, updates, and daily reports</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand group-hover:translate-x-1 transition-all" />
          </button>
          
          <div className="h-px bg-slate-50 mx-5"></div>
          
          <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-500 transition-colors">Language</p>
              <p className="text-xs text-slate-400">English (United States)</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </button>
          
          <div className="h-px bg-slate-50 mx-5"></div>
          
          <div className="w-full flex items-center gap-4 p-5">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <Moon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-900">Dark Mode</p>
              <p className="text-xs text-slate-400">Sync with system settings</p>
            </div>
            <Switch className="data-[state=checked]:bg-brand" />
          </div>
          
          <div className="h-px bg-slate-50 mx-5"></div>
          
          <button className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-slate-900 group-hover:text-amber-500 transition-colors">Help & Support</p>
              <p className="text-xs text-slate-400">FAQs and community guides</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <ConfirmDialog
        trigger={
          <button className="w-full bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center justify-center gap-3 group hover:bg-red-100 transition-all active:scale-[0.99] mt-4 shadow-sm">
            <LogOut className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-black text-red-600 uppercase tracking-widest">Sign Out</span>
          </button>
        }
        title="Sign Out?"
        description="Are you sure you want to log out? You will need to enter your credentials to access your inventory again."
        confirmLabel="Yes, Sign Out"
        variant="destructive"
        onConfirm={handleLogout}
      />

      <div className="text-center space-y-1 py-8">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Version 3.0.0 (Build 942)</p>
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <ShieldCheck className="w-3 h-3" />
          <span className="text-[8px] font-bold uppercase">Enterprise Grade Security Enabled</span>
        </div>
      </div>
    </div>
  )
}
