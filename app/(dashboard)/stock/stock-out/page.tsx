import React from 'react'
import { StockOutForm } from '@/components/forms/StockOutForm'
import { ChevronLeft, History, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export default async function StockOutPage() {
  const session = await auth()
  let lastActionLabel = 'No activity'
  let todayOutItems = 0

  if (session?.user?.id) {
    const lastMovement = await prisma.stockMovement.findFirst({
      where: {
        type: 'stock_out',
        product: { userId: session.user.id }
      },
      orderBy: { timestamp: 'desc' }
    })
    
    if (lastMovement) {
      lastActionLabel = getTimeAgo(lastMovement.timestamp)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const movementsToday = await prisma.stockMovement.aggregate({
      _sum: { quantity: true },
      where: {
        type: 'stock_out',
        product: { userId: session.user.id },
        timestamp: { gte: today }
      }
    })
    
    // stock_out quantity is negative, so we use absolute value
    todayOutItems = Math.abs(movementsToday._sum.quantity || 0)
  }

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/inventory" className="hover:text-brand flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Out</h1>
        <p className="text-sm text-slate-500">Record items leaving the inventory for sales, damage, or internal use.</p>
      </div>

      <StockOutForm />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Action</p>
            <p className="text-sm font-bold text-slate-900">{lastActionLabel}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Out</p>
            <p className="text-sm font-bold text-slate-900">{todayOutItems} Items</p>
          </div>
        </div>
      </div>
    </div>
  )
}
