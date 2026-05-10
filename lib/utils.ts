import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { StockStatus } from "@/types/models"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function getStatusClasses(status: StockStatus): string {
  switch (status) {
    case 'safe':
      return 'bg-[#E8F5EC] text-[#1A6B3C]'
    case 'low':
      return 'bg-[#FFF8E6] text-[#B28200]'
    case 'critical':
      return 'bg-[#FFE9E9] text-[#D32F2F]'
    case 'out_of_stock':
      return 'bg-slate-100 text-slate-500'
    default:
      return 'bg-slate-100 text-slate-500'
  }
}

export function computeStockStatus(currentStock: number, reorderPoint: number): StockStatus {
  if (currentStock <= 0) return 'out_of_stock'
  if (currentStock <= reorderPoint) return 'critical'
  if (currentStock <= reorderPoint * 1.5) return 'low'
  return 'safe'
}
