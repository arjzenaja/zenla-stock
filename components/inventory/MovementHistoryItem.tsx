import React from 'react'
import { Plus, Minus, RefreshCw, ClipboardCheck } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface MovementHistoryItemProps {
  movement: any
}

export const MovementHistoryItem: React.FC<MovementHistoryItemProps> = ({ movement }) => {
  const getIcon = () => {
    switch (movement.type) {
      case 'stock_in':
        return { icon: Plus, bg: 'bg-green-50', text: 'text-brand' }
      case 'stock_out':
        return { icon: Minus, bg: 'bg-red-50', text: 'text-red-600' }
      case 'correction':
        return { icon: RefreshCw, bg: 'bg-blue-50', text: 'text-blue-600' }
      case 'audit':
        return { icon: ClipboardCheck, bg: 'bg-amber-50', text: 'text-amber-600' }
      default:
        return { icon: Plus, bg: 'bg-slate-50', text: 'text-slate-600' }
    }
  }

  const { icon: Icon, bg, text } = getIcon()

  return (
    <div className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0 group hover:bg-slate-50/50 px-3 transition-colors rounded-xl">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm', bg, text)}>
        <Icon className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold text-slate-900 capitalize">
            {movement.type.replace(/_/g, ' ')}
            {movement.reason && <span className="text-slate-400 font-normal ml-1">({movement.reason.replace(/_/g, ' ')})</span>}
          </p>
          <span className={cn(
            'text-sm font-bold font-mono',
            movement.quantity > 0 ? 'text-brand' : 'text-red-600'
          )}>
            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="font-medium">{formatDate(movement.timestamp)}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="font-mono">REF: {movement.id.substring(0, 8).toUpperCase()}</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {movement.performedBy || 'System'}
          </p>
        </div>
      </div>
    </div>
  )
}
