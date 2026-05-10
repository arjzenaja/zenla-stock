import React from 'react'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppLogoProps {
  className?: string
  iconClassName?: string
  showText?: boolean
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className,
  iconClassName,
  showText = true,
}) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('bg-brand rounded-lg p-1.5 flex items-center justify-center', iconClassName)}>
        <Package className="w-5 h-5 text-white" />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Zenla<span className="text-brand">Stock</span>
        </span>
      )}
    </div>
  )
}
