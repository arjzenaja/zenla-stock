'use client'

import React from 'react'
import { 
  ClipboardList, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  LogIn, 
  LogOut,
  Loader2
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuickActionCard } from '@/components/dashboard/QuickActionCard'
import { ActivityList } from '@/components/dashboard/ActivityList'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { formatNumber } from '@/lib/utils'
import { useDashboardStats, useRecentActivity } from '@/hooks/useDashboard'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: activity, isLoading: activityLoading } = useRecentActivity()

  const userName = session?.user?.name || 'Store Owner'

  return (
    <div className="space-y-8 pb-10">
      {/* Page Greeting */}
      <div className="animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Hello, {userName}</h2>
        <p className="text-sm text-slate-500 mt-1">Here is what's happening with your inventory today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          label="Total Products"
          value={statsLoading ? '...' : formatNumber(stats?.totalProducts || 0)}
          icon={ClipboardList}
          className="animate-slide-up"
        />
        <StatCard
          label="Low Stock"
          value={statsLoading ? '...' : stats?.lowStockCount || 0}
          icon={AlertTriangle}
          iconColor="text-amber-500"
          badge={stats?.lowStockCount > 0 ? "Action Needed" : undefined}
          className="animate-slide-up [animation-delay:100ms]"
        />
        <StatCard
          label="In Today"
          value={statsLoading ? '...' : `+${stats?.inToday || 0}`}
          icon={TrendingUp}
          iconColor="text-brand"
          valueColor="text-brand"
          className="animate-slide-up [animation-delay:200ms]"
        />
        <StatCard
          label="Out Today"
          value={statsLoading ? '...' : stats?.outToday || 0}
          icon={TrendingDown}
          iconColor="text-orange-500"
          className="animate-slide-up [animation-delay:300ms]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <SectionHeader title="Quick Actions" />
          <div className="space-y-3">
            <QuickActionCard
              title="Add Product"
              subtitle="Register new inventory item"
              icon={Plus}
              href="/inventory/add"
              variant="highlight"
            />
            <QuickActionCard
              title="Stock In"
              subtitle="Increase item quantity"
              icon={LogIn}
              href="/stock/stock-in"
            />
            <QuickActionCard
              title="Stock Out"
              subtitle="Record items leaving warehouse"
              icon={LogOut}
              href="/stock/stock-out"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <SectionHeader 
            title="Recent Activity" 
            actionLabel="View All" 
            actionHref="/inventory" 
          />
          <div className="bg-white rounded-xl shadow-card p-2 md:p-4 border border-slate-50 min-h-[400px] flex flex-col">
            {activityLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand animate-spin mb-2" />
                <p className="text-slate-400 text-sm">Loading activity...</p>
              </div>
            ) : activity?.length > 0 ? (
              <ActivityList activities={activity} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No recent activity</p>
                <p className="text-slate-400 text-xs mt-1">Stock movements will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
