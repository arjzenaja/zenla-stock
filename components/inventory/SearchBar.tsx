'use client'

import React, { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchBarProps {
  placeholder?: string
  onSearch: (value: string) => void
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  className,
}) => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <div className={className}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand transition-colors" />
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 py-5 bg-white border-slate-200 focus-visible:ring-brand focus-visible:border-brand rounded-xl shadow-sm transition-all"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setValue('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
