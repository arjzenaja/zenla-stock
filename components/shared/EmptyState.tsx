import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  ctaLabel?: string
  onCta?: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  ctaLabel,
  onCta,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <Icon className="w-12 h-12 text-slate-300" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {ctaLabel && onCta && (
        <Button onClick={onCta} className="bg-brand hover:bg-brand-light">
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}
