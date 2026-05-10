import React from 'react'
import { StockStatus } from '@/types/models'
import { Badge } from '@/components/ui/badge'
import { cn, getStatusClasses, computeStockStatus } from '@/lib/utils'

interface StockStatusBadgeProps {
  status?: StockStatus | null
  currentStock?: number
  reorderPoint?: number
  className?: string
}

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ 
  status,
  currentStock,
  reorderPoint,
  className 
}) => {
  const finalStatus = status || (currentStock !== undefined && reorderPoint !== undefined ? computeStockStatus(currentStock, reorderPoint) : null)

  return (
    <Badge 
      variant="secondary"
      className={cn(
        'text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase border-none',
        finalStatus ? getStatusClasses(finalStatus) : 'bg-slate-100 text-slate-500',
        className
      )}
    >
      {finalStatus ? finalStatus.replace(/_/g, ' ') : ''}
    </Badge>
  )
}
