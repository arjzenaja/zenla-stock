import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionLabel,
  actionHref,
  className,
}) => {
  return (
    <div className={cn('flex justify-between items-center mb-4', className)}>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {actionLabel && actionHref && (
        <Link 
          href={actionHref}
          className="text-sm text-brand font-medium hover:underline transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
