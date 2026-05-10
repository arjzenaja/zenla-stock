import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  className,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value)
    if (!isNaN(newValue)) {
      if (newValue >= min && newValue <= max) {
        onChange(newValue)
      }
    }
  }

  return (
    <div className={cn('flex items-center border border-gray-200 rounded-lg overflow-hidden h-12', className)}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-gray-50 border-r border-gray-200 disabled:opacity-40 transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="flex-1 text-center font-semibold text-lg border-none outline-none bg-white w-full no-spinner"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-12 h-full flex items-center justify-center text-brand hover:bg-brand-muted border-l border-gray-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
