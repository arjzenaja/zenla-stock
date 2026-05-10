import React from 'react'
import { cn } from '@/lib/utils'

interface InfoRowProps {
  label: string
  value: React.ReactNode
  valueBold?: boolean
  className?: string
}

export const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  valueBold = false,
  className,
}) => {
  return (
    <div className={cn('flex justify-between items-center py-2.5 border-b last:border-0', className)}>
      <span className="text-sm text-slate-500">{label}</span>
      <span className={cn(
        'text-sm font-medium text-slate-900',
        valueBold && 'font-bold'
      )}>
        {value}
      </span>
    </div>
  )
}
