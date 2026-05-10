import React from 'react'
import { StockInForm } from '@/components/forms/StockInForm'
import { ChevronLeft, Clock, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

export default async function StockInPage() {
  const session = await auth()
  let lastStockInLabel = 'No activity'
  let dailyVolume = 0

  if (session?.user?.id) {
    const lastMovement = await prisma.stockMovement.findFirst({
      where: {
        type: 'stock_in',
        product: { userId: session.user.id }
      },
      orderBy: { timestamp: 'desc' }
    })
    
    if (lastMovement) {
      lastStockInLabel = getTimeAgo(lastMovement.timestamp)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    dailyVolume = await prisma.stockMovement.count({
      where: {
        type: 'stock_in',
        product: { userId: session.user.id },
        timestamp: { gte: today }
      }
    })
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock In</h1>
        <p className="text-sm text-slate-500">Update your inventory levels by recording incoming stock items.</p>
      </div>

      <StockInForm />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Stock In</p>
            <p className="text-sm font-bold text-slate-900">{lastStockInLabel}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-50 flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daily Volume</p>
            <p className="text-sm font-bold text-slate-900">{dailyVolume} Transactions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
