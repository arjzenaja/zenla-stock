import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionCardProps {
  title: string
  subtitle: string
  icon: LucideIcon
  href: string
  variant?: 'default' | 'highlight'
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  href,
  variant = 'default',
}) => {
  return (
    <Link href={href} className="block group">
      <div className={cn(
        'rounded-xl p-4 transition-all duration-200 active:scale-[0.98] flex items-center gap-4',
        variant === 'highlight' 
          ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-light' 
          : 'bg-white border border-slate-100 shadow-card hover:shadow-card-md hover:border-brand-border'
      )}>
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
          variant === 'highlight' ? 'bg-white/20' : 'bg-brand-muted text-brand group-hover:bg-brand group-hover:text-white'
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1">
          <p className={cn(
            'font-semibold',
            variant === 'highlight' ? 'text-white' : 'text-slate-900'
          )}>
            {title}
          </p>
          <p className={cn(
            'text-xs mt-0.5',
            variant === 'highlight' ? 'text-white/70' : 'text-slate-500'
          )}>
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  )
}
