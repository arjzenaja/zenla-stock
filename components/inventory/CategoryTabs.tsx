'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useCategories } from '@/hooks/useProducts'

interface CategoryTabsProps {
  activeCategoryId: string
  onSelect: (id: string) => void
  className?: string
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategoryId,
  onSelect,
  className,
}) => {
  const { data: categories, isLoading } = useCategories()

  if (isLoading) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-20 bg-slate-100 rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar', className)}>
      <button
        onClick={() => onSelect('all')}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border',
          activeCategoryId === 'all'
            ? 'bg-brand text-white border-brand shadow-md shadow-brand/20'
            : 'bg-white border-slate-200 text-slate-600 hover:border-brand hover:text-brand'
        )}
      >
        All
      </button>
      {categories?.map((category: any) => {
        const active = activeCategoryId === category.id
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border',
              active
                ? 'bg-brand text-white border-brand shadow-md shadow-brand/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-brand hover:text-brand'
            )}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
