import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  badge?: string
  iconColor?: string
  valueColor?: string
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  badge,
  iconColor,
  valueColor,
  className,
}) => {
  return (
    <div className={cn(
      'bg-white rounded-xl shadow-card p-4 md:p-5 border border-slate-50 transition-all hover:shadow-card-md group',
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] md:text-xs font-bold tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        <Icon className={cn('w-5 h-5 transition-colors', iconColor || 'text-slate-300 group-hover:text-brand')} />
      </div>
      
      <div className="flex flex-col gap-2">
        <span className={cn(
          'text-2xl md:text-3xl font-bold text-slate-900 font-mono',
          valueColor
        )}>
          {value}
        </span>
        
        {badge && (
          <div className="flex">
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
