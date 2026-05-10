'use client'

import React from 'react'
import { 
  TrendingUp, 
  AlertTriangle, 
  PackageCheck,
  ArrowUpRight,
  Plus,
  Minus,
  Loader2,
  History
} from 'lucide-react'
import { StockMovementChart } from '@/components/reports/StockMovementChart'
import { TopSellersBar } from '@/components/reports/TopSellersBar'
import { CriticalAlertCard } from '@/components/reports/CriticalAlertCard'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

export default function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await fetch('/api/reports')
      if (!res.ok) throw new Error('Gagal mengambil data laporan')
      return res.json()
    }
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-brand animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Menganalisis data inventaris...</p>
      </div>
    )
  }

  const stats = data?.stats || {}
  const movements = data?.recentMovements || []

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-brand uppercase mb-1 block">Performance Overview</span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Insights</h2>
      </div>

      {/* Report Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-50 relative overflow-hidden group">
          <div className="absolute top-4 right-4 bg-brand-muted text-brand text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            {stats.stockValueChange || 0}%
          </div>
          <div className="w-10 h-10 bg-brand-muted rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors shadow-sm">
            <TrendingUp className="w-5 h-5 text-brand group-hover:text-white" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Stock Value</p>
          <p className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(stats.totalStockValue || 0)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-50 relative overflow-hidden group">
          <div className="absolute top-4 right-4 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
            {stats.lowStockItems || 0} Alerts
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-500 group-hover:text-white" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Low Stock Items</p>
          <p className="text-2xl font-black text-slate-900 font-mono">{stats.lowStockItems || 0} Items</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-50 relative overflow-hidden group">
          <div className="absolute top-4 right-4 bg-brand-muted text-brand text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
            PRO
          </div>
          <div className="w-10 h-10 bg-brand-muted rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors shadow-sm">
            <PackageCheck className="w-5 h-5 text-brand group-hover:text-white" />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Turnover Rate</p>
          <p className="text-2xl font-black text-slate-900 font-mono">{stats.turnoverRate || '0.0'}x</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts & Lists */}
        <div className="lg:col-span-2 space-y-8">
          {/* Charts will be implemented when real historical data is available */}
          <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Historical Charting Coming Soon</p>
            <p className="text-xs text-slate-400 mt-1">Collecting data to generate insights...</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-50">
            <SectionHeader title="Recent Movement History" actionLabel="Full Audit Log" actionHref="/inventory" />
            <div className="space-y-2 mt-6">
              {movements.length > 0 ? movements.map((m: any) => (
                <div key={m.id} className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                    m.type === 'stock_in' ? 'bg-green-50 text-brand' : 'bg-red-50 text-red-500'
                  )}>
                    {m.type === 'stock_in' ? <Plus className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {m.type === 'stock_in' ? 'Inbound' : 'Outbound'}
                      {m.reason && <span className="text-slate-400 font-normal ml-1">({m.reason.replace(/_/g, ' ')})</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest font-mono">{formatDate(m.timestamp)}</p>
                  </div>
                  <div className={cn(
                    'text-sm font-bold font-mono',
                    m.type === 'stock_in' ? 'text-brand' : 'text-red-500'
                  )}>
                    {m.type === 'stock_in' ? '+' : ''}{m.quantity}
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center flex flex-col items-center">
                  <History className="w-12 h-12 text-slate-100 mb-4" />
                  <p className="text-slate-400">No recent movements recorded.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Alerts */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-brand rounded-3xl p-8 text-white shadow-xl shadow-brand/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Pro Insights</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-6 opacity-90">
                Data insights are still being generated. Keep your inventory updated to see turnover predictions and trend analysis.
              </p>
              <button className="bg-white text-brand px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-muted transition-all active:scale-95">
                Refresh Analysis
              </button>
            </div>
            <PackageCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
