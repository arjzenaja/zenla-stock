import React from 'react'
import { TopSeller } from '@/types/models'
import { Progress } from '@/components/ui/progress'

interface TopSellersBarProps {
  sellers: TopSeller[]
}

export const TopSellersBar: React.FC<TopSellersBarProps> = ({ sellers }) => {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 border border-slate-50">
      <h3 className="font-semibold text-slate-900 mb-6">Top Sellers</h3>
      <div className="space-y-6">
        {sellers.map((seller, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-slate-700">{seller.productName}</span>
              <span className="text-slate-500">{seller.units} units</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand rounded-full transition-all duration-500"
                style={{ width: `${seller.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
