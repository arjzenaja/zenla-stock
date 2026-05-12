'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [categories])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' })
  }

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
    <div className={cn('relative flex items-center', className)}>
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className={cn(
          'absolute left-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:text-brand hover:border-brand transition-all duration-200',
          canScrollLeft ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable tab list */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 py-1 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => onSelect('all')}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0',
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
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0',
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

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className={cn(
          'absolute right-0 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md text-slate-500 hover:text-brand hover:border-brand transition-all duration-200',
          canScrollRight ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
